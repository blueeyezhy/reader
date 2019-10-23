import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import Api from '../../api';
import Loading from '../../components/Loading';
import { getXmlUrl } from '../../utils';

export default observer((props: any) => {
  const { feedStore } = useStore();

  React.useEffect(() => {
    (async () => {
      if (feedStore.isFetched) {
        return;
      }
      const rssUrl = `${getXmlUrl()}`;
      feedStore.setRssUrl(rssUrl);
      try {
        const decodedRssUrl = decodeURIComponent(rssUrl);
        const feed = await Api.fetchFeed(decodedRssUrl);
        feedStore.setFeed(feed);
      } catch (err) {
        console.log(err);
        alert('请先登陆');
        feedStore.setFeed({
          items: [],
        });
      }
    })();
  }, [feedStore, props]);

  if (!feedStore.isFetched) {
    return <Loading isPage={true} />;
  }

  return null;
});
