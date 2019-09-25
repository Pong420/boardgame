import React, { useState, useEffect, ImgHTMLAttributes } from 'react';
import { CARD_WIDTH, CARD_HEIGHT } from '../Card';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  degree?: number;
}

export const FRONT_COLOR = '#b55';
export const BACK_COLOR = '#a22';

const CACHE: Record<number, string> = {};

export const CardBack = React.memo(({ degree = 0 }: Props) => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    getCardBack(degree).then(setSrc);
  }, [degree]);

  return <img draggable={false} style={{ width: CARD_WIDTH }} src={src} alt="" />;
});

function getCardBack(degree: number) {
  if (CACHE[degree]) {
    return Promise.resolve(CACHE[degree]);
  }

  const img = window.Poker.getBackImage(CARD_HEIGHT, FRONT_COLOR, BACK_COLOR);
  const canvas = window.Poker.getBackCanvas(CARD_HEIGHT, FRONT_COLOR, BACK_COLOR);
  const ctx = canvas.getContext('2d')!;

  if (degree % 180 !== 0) {
    const { width, height } = canvas;
    canvas.width = height;
    canvas.height = width;
  }

  return new Promise<string>(resolve => {
    img.onload = () => {
      // https://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degree * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const src = canvas.toDataURL();

      CACHE[degree] = src;

      resolve(src);
    };
  });
}
