import Home from './Home';
import BigTwoLocal from './Game/BigTwo';
import BigTwoAuth from './Game/BigTwo/authenticated';

const routes = [
  {
    exact: true,
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'Big Two Local',
    path: '/local/big-two/:numPlayers?',
    component: BigTwoLocal
  },
  {
    name: 'Big Two Auth',
    path: '/big-two/:gameID/:playerID?/:credentials?',
    component: BigTwoAuth
  }
];

export default routes;
