import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as Poker from 'Poker.JS/release/poker.min.js';
import './index.scss';

function render() {
  return ReactDOM.render(<App />, document.getElementById('root'));
}

render();

console.log(Poker);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot) {
  module.hot.accept('./App', render);
}
