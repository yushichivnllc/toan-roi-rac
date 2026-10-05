import { useEffect, useState } from 'react';

/** Thông báo ngắn kiểu nhãn in: nền mực, chữ giấy, viền tròn. */
export function ToastHost() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer = 0;
    const onToast = (event) => {
      setMessage(event.detail?.message || '');
      setVisible(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setVisible(false), 2600);
    };
    window.addEventListener('roi-rac:toast', onToast);
    return () => {
      window.removeEventListener('roi-rac:toast', onToast);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`rr-toast${visible ? ' is-visible' : ''}`} role="status" aria-live="polite">
      <span aria-hidden="true">✓</span> {message}
    </div>
  );
}
