import React, { useEffect, useState } from 'react';
import styles from './Chat.module.scss';

interface Props {
  count: number;
}

export function UnreadCount({ count }: Props) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setValue(Math.min(99, count)), 250);
    return () => clearTimeout(timeout);
  }, [count]);

  return value ? <div className={styles['unread']}>{value}</div> : null;
}
