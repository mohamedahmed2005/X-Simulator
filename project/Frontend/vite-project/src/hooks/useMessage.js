import { useState } from 'react';

export const useMessage = () => {
  const [message, setMessage] = useState({ text: '', type: '', show: false });

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type, show: true });
    setTimeout(() => {
      setMessage({ text: '', type: '', show: false });
    }, 3000);
  };

  const hideMessage = () => {
    setMessage({ text: '', type: '', show: false });
  };

  return {
    message,
    showMessage,
    hideMessage
  };
};
