import React, { useEffect, useState } from 'react';
import styles from './Chat.module.scss';

interface Props {
  count: number;
}

export function UnreadCount({ count }: Props) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    // value of timeout should be greater then the delay in chat bubble
    const timeout = setTimeout(() => setValue(Math.min(99, count)), 350);
    return () => clearTimeout(timeout);
  }, [count]);

  return value ? <div className={styles['unread']}>{value}</div> : null;
}
