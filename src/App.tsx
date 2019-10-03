import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './components/Home';
import { Room } from './components/Room';
import { PATHS } from './constants';

const BigTwoClient = lazy(() => import('./components/BigTwoClient'));
const BigTwoLocalClient = lazy(() => import('./components/BigTwoLocalClient'));

const App = () => (
  <Router>
    <Suspense fallback={null}>
      <Switch>
        <Route exact path={PATHS.HOME} component={Home} />
        <Route exact path={PATHS.BIG_TWO} component={BigTwoClient} />
        <Route exact path={PATHS.BIG_TWO_LOCAL} component={BigTwoLocalClient} />
        <Route exact path={PATHS.ROOM} component={Room} />
      </Switch>
    </Suspense>
  </Router>
);

export default App;
