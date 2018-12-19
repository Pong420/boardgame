import React from 'react';

export default function Card(props) {
  const style = props.src
    ? {
        backgroundImage: `url(${props.src})`
      }
    : {};

  return <div className={`card ${props.className}`} style={style} onClick={props.onClick} data-degree={props.degree} />;
}
