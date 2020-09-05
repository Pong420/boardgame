import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home';
import { Playground } from './pages/Playground';
import { PATHS } from './constants';

const App = () => (
  <Router>
    <Switch>
      <Route exact path={PATHS.PLAYGROUND} component={Playground} />
      <Route path={PATHS.HOME} component={Home} />
    </Switch>
  </Router>
);

export default App;
