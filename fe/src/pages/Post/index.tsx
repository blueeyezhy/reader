import React from 'react';
import { observer } from 'mobx-react-lite';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Viewer from 'react-viewer';
import marked from 'marked';
import WaitingForFeed from 'components/WaitingForFeed';
import BackButton from 'components/BackButton';
import Button from 'components/Button';
import Loading from 'components/Loading';
import Fade from '@material-ui/core/Fade';
import RewardSummary from './rewardSummary';
import RewardModal from './rewardModal';
import Comment from './comment';
import { useStore } from 'store';
import { ago, isMobile, sleep } from 'utils';
import Api from './api';

import 'react-viewer/dist/index.css';

export default observer((props: any) => {
  const { feedStore, userStore, modalStore } = useStore();
  const { isLogin } = userStore;
  const { currentPost: post } = feedStore;
  const [showImage, setShowImage] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState('');
  const [openRewardModal, setOpenRewardModal] = React.useState(false);
  const [isFetchingReward, setIsFetchingReward] = React.useState(false);
  const [rewardSummary, setRewardSummary] = React.useState({ amountMap: {}, users: [] });
  const noReward = rewardSummary.users.length === 0;

  React.useEffect(() => {
    const { postId } = props.match.params;
    feedStore.setPostId(decodeURIComponent(postId));
  }, [props, feedStore]);

  React.useEffect(() => {
    if (post) {
      const { title } = post;
      document.title = `${title} - 飞贴`;
    }
  });

  React.useEffect(() => {
    (async () => {
      if (post) {
        setIsFetchingReward(true);
        try {
          const rewardSummary = await Api.getRewardSummary(post.id);
          setRewardSummary(rewardSummary);
        } catch (err) {}
        setIsFetchingReward(false);
      }
    })();
  }, [post]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    const bindClickEvent = (e: any) => {
      if (e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');
        window.open(href);
        e.preventDefault();
      } else if (e.target.tagName === 'IMG') {
        setImgSrc(e.target.src);
        setShowImage(true);
      }
    };

    setTimeout(() => {
      const markdownBody = document.querySelector('.markdown-body');
      if (markdownBody) {
        markdownBody.addEventListener('click', bindClickEvent);
      }
    }, 2000);

    return () => {
      const markdownBody = document.querySelector('.markdown-body');
      if (markdownBody) {
        markdownBody.addEventListener('click', bindClickEvent);
      }
    };
  }, []);

  const onCloseRewardModal = async (isSuccess: boolean) => {
    setOpenRewardModal(false);
    if (isSuccess) {
      await sleep(300);
      const rewardSummary = await Api.getRewardSummary(post.id);
      setRewardSummary(rewardSummary);
    }
  };

  if (!feedStore.isFetched) {
    return null;
  }

  const backToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (e) {
      window.scroll(0, 0);
    }
  };

  const reward = () => {
    if (!isLogin) {
      modalStore.openLogin();
      return;
    }
    setOpenRewardModal(true);
  };

  if (!post) {
    return <WaitingForFeed />;
  }

  const RewardView = () => {
    if (isFetchingReward) {
      return (
        <div className="py-24">
          <Loading />
        </div>
      );
    }
    return (
      <div>
        <div className="text-center pb-8">
          <Button onClick={reward}>赞赏</Button>
          {noReward && <div className="mt-5 text-gray-600">还没有人赞赏，来支持一下作者吧！</div>}
        </div>
        <RewardSummary summary={rewardSummary} />
      </div>
    );
  };

  const CommentView = () => {
    if (isFetchingReward) {
      return null;
    }
    return (
      <div className="mt-16 pb-10">
        <Comment fileRId={post.id} />
      </div>
    );
  };

  return (
    <Fade in={true} timeout={500}>
      <div className="w-7/12 m-auto post po-fade-in relative">
        {!isMobile && <BackButton />}
        <h2 className={`text-${isMobile ? 'lg' : 'xl'} text-gray-700 font-bold pt-0`}>
          {post.title}
        </h2>
        <div className={`mt-1 text-gray-500 ${isMobile ? ' text-sm' : ''}`}>
          {post.author} | {ago(post.pubDate)}
        </div>
        <div
          className={`mt-6 text-base text-gray-700 markdown-body pb-6`}
          dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }}
        />
        {!isMobile && post.content.length > 1500 && (
          <div
            className="back-top-btn flex items-center text-gray-600 cursor-pointer text-lg"
            onClick={backToTop}
          >
            <ArrowUpward />
          </div>
        )}
        {RewardView()}
        {CommentView()}
        <RewardModal open={openRewardModal} onClose={onCloseRewardModal} />
        <Viewer
          onMaskClick={() => setShowImage(false)}
          noNavbar={true}
          noToolbar={true}
          visible={showImage}
          onClose={() => setShowImage(false)}
          images={[{ src: imgSrc }]}
        />
      </div>
    </Fade>
  );
});
