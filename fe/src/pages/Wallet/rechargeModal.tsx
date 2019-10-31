import React from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import classNames from 'classnames';
import Loading from 'components/Loading';
import Button from 'components/Button';
import { useStore } from 'store';
import Api from './api';

export default (props: any) => {
  const { userStore, socketStore } = useStore();
  const { isLogin } = userStore;
  const { open, onClose, currency } = props;
  const [step, setStep] = React.useState(1);
  const [amount, setAmount] = React.useState('');
  const [memo, setMemo] = React.useState('');
  const [paymentUrl, setPaymentUrl] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [iframeLoading, setIframeLoading] = React.useState(false);

  console.log(` ------------- submitting ---------------`, submitting);

  React.useEffect(() => {
    const rechargeCallback = () => {
      setStep(1);
      setAmount('');
      setMemo('');
      onClose(true);
    };
    if (isLogin) {
      socketStore.on('recharge', rechargeCallback);
    }
    return () => {
      socketStore.off('recharge', rechargeCallback);
    };
  }, [isLogin, socketStore, onClose]);

  const onCloseModal = () => {
    setStep(1);
    setAmount('');
    setMemo('');
    onClose();
  };

  const recharge = async (currency: string, amount: string, memo: string = '') => {
    setSubmitting(true);
    try {
      const { paymentUrl } = await Api.recharge({
        currency,
        amount,
        memo,
      });
      setPaymentUrl(paymentUrl);
      setIframeLoading(true);
      setStep(2);
    } catch (err) {
      console.log(` ------------- err ---------------`, err);
    }
    setSubmitting(false);
  };

  const step1 = () => {
    return (
      <div>
        <div className="text-lg">Mixin 扫码充值</div>
        <div className="mt-2 text-gray-800">
          <TextField
            value={amount}
            placeholder="数量"
            onChange={(event: any) => setAmount(event.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
            }}
          />
          <div className="-mt-2" />
          <TextField
            value={memo}
            placeholder="备注（可选）"
            onChange={(event: any) => setMemo(event.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
          />
        </div>
        <div className="mt-5" onClick={() => recharge(currency, amount, memo)}>
          <Button>继续</Button>
        </div>
      </div>
    );
  };

  const step2 = () => {
    return (
      <div>
        <div className="text-lg">Mixin 扫码充值</div>
        <div className="w-64 h-64 relative overflow-hidden">
          {paymentUrl && (
            <div
              className={classNames(
                {
                  hidden: iframeLoading,
                },
                'w-64 h-64',
              )}
            >
              <iframe
                onLoad={() => {
                  console.log(` ------------- onLoad ---------------`);
                  setTimeout(() => {
                    setIframeLoading(false);
                  }, 2000);
                }}
                className="mixin-payment-iframe"
                title="Mixin 扫码充值"
                src={paymentUrl}
              ></iframe>
            </div>
          )}
          {iframeLoading && (
            <div className="mt-24 pt-4">
              <Loading />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal open={open} onClose={onCloseModal} className="flex justify-center items-center">
      <div className="p-8 bg-white rounded text-center">
        {step === 1 && step1()}
        {step === 2 && step2()}
      </div>
    </Modal>
  );
};