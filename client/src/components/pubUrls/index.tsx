import React from 'react';
import { observer } from 'mobx-react-lite';
import DrawerModal from 'components/DrawerModal';
import Modal from 'components/Modal';
import { isMobile } from 'utils';
import { useStore } from 'store';

export default observer(() => {
  const { modalStore , settingsStore } = useStore();
  const { settings } = settingsStore;
  var pc_listUrls:string[]; 
  if (settings['pub.site.url']) {
        pc_listUrls = settings['pub.site.url'].map( (pc_pub_url: string) =>
        <li><a href={pc_pub_url[1]}>{pc_pub_url[0]}: {pc_pub_url[1]}</a></li>
    );
  }

  
  const renderMain = () => {
    return (
      <div>
        <div className="p-8 bg-white md:rounded text-left main">
          <div className="text-lg font-bold text-gray-700 leading-none">写作站点链接</div>
          <div className="mt-4 text-gray-700">
              {pc_listUrls}
          </div>
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <DrawerModal open={modalStore.pubUrls.open} onClose={modalStore.closePubUrls}>
        {renderMain()}
      </DrawerModal>
    );
  }

  return (
    <Modal open={modalStore.pubUrls.open} onClose={modalStore.closePubUrls}>
      {renderMain()}
    </Modal>
  );
});




