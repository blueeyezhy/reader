import { stopBodyScroll, isWeChat, getLoginUrl, isMobile } from 'utils';
import Api from 'api';

export function createModalStore() {
  return {
    showPageLoading: false,
    login: {
      open: false,
      data: {},
    },
    wallet: {
      open: false,
      data: {},
    },
    notification: {
      open: false,
      data: {},
    },
    pubUrls: {
      open: false,
      data: {},
    },

    showPubUrls(data: any = {}) {
        this.pubUrls.open = true;
        this.pubUrls.data = data;
        stopBodyScroll(true);
    },
    closePubUrls() {
        this.pubUrls.open = false;
        this.pubUrls.data = {};
        stopBodyScroll(false);
    },
    
    openLogin(data: any = {}) {
      if (isMobile) {
        this.showPageLoading = true;
      }
      if (isMobile && !isWeChat) {
        window.location.href = getLoginUrl();
        return;
      }
      this.login.open = true;
      this.login.data = data;
      stopBodyScroll(true);
      if (isWeChat) {
        Api.setAutoLoginUrl(getLoginUrl());
      }
    },
    closeLogin() {
      this.login.open = false;
      this.login.data = {};
      stopBodyScroll(false);
    },
    openWallet(data: any = {}) {
      this.wallet.open = true;
      this.wallet.data = data;
      stopBodyScroll(true);
    },
    closeWallet() {
      this.wallet.open = false;
      this.wallet.data = {};
      stopBodyScroll(false);
    },
    openNotification(data: any = {}) {
      this.notification.open = true;
      this.notification.data = data;
      stopBodyScroll(true);
    },
    closeNotification() {
      this.notification.open = false;
      this.notification.data = {};
      stopBodyScroll(false);
    },
  };
}
