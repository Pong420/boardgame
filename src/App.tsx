import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './components/Home';
import { Room } from './components/Room';
import { Local } from './components/Local';
import { PATHS } from './constants';

const App = () => (
  <Router>
    <Switch>
      <Route exact path={PATHS.HOME} component={Home} />
      <Route exact path={PATHS.ROOM} component={Room} />
      <Route exact path={PATHS.LOCAL} component={Local} />
    </Switch>
  </Router>
);

export default App;
