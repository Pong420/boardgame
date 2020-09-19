import React from 'react';
import styles from './Match.module.scss';

interface Props {
  text: string;
}

export function CenterText({ text }: Props) {
  return <div className={styles['center-text']}>{text}</div>;
}

export const Loading = () => <CenterText text="Loading..." />;
export const Disconnected = () => <CenterText text="Connecting..." />;
