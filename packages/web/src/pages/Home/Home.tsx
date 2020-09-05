import React from 'react';
import {
  RouteComponentProps,
  Switch,
  Route,
  generatePath,
  Redirect
} from 'react-router-dom';
import { useRxAsync } from 'use-rx-hooks';
import { Matches } from '../Matches';
import { GameList } from './GameList';
import { Intro } from './Intro';
import { getAllGames } from '../../services';
import { PATHS } from '../../constants';

interface MatchParams {
  name?: string;
}

const homePath = generatePath(PATHS.HOME, {}) || '/';

export function Home({ history }: RouteComponentProps<MatchParams>) {
  const [{ data }] = useRxAsync(getAllGames);
  const games = data?.data || [];

  return (
    <div className="home">
      <GameList games={games} />
      <Switch>
        <Route exact path={homePath} component={Intro} />
        <Route
          path={PATHS.HOME}
          render={(props: RouteComponentProps<MatchParams>) => {
            const name = props.match.params.name;
            if (games.length && name) {
              return games.includes(name) ? (
                <Matches {...props} />
              ) : (
                <Redirect to={homePath} />
              );
            }
          }}
        />
      </Switch>
    </div>
  );
}
