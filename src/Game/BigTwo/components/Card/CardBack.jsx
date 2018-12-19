import React, { useState, useEffect } from 'react';
import Card, { CARD_HEIGHT } from './';
import pokerProducer from '../../game/helper/pokerProducer.js';

// https://tairraos.github.io/Poker.JS/demo/sprite.html
const FOREGROUND_COLOR = '#b55';
const BACKGROUND_COLOR = '#a22';
const CARD_BACK_IMAGE = {
  90: getCardBack(90),
  180: getCardBack(180),
  270: getCardBack(270)
};

export default function CardBack(props) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    CARD_BACK_IMAGE[props.degree].then(src => {
      setSrc(src);
    });
  }, []);

  return <Card className="card-back" src={src} {...props} />;
}

function getCardBack(degree) {
  const img = pokerProducer.getBackImage(CARD_HEIGHT, FOREGROUND_COLOR, BACKGROUND_COLOR);
  const canvas = pokerProducer.getBackCanvas(CARD_HEIGHT, FOREGROUND_COLOR, BACKGROUND_COLOR);
  const ctx = canvas.getContext('2d');

  if (degree !== 180) {
    const { width, height } = canvas;
    canvas.width = height;
    canvas.height = width;
  }

  return new Promise(resolve => {
    img.onload = () => {
      // https://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degree * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      resolve(canvas.toDataURL());
    };
  });
}
