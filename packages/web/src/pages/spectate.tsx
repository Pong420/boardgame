import React from 'react';
import { Router, Redirect, RouteComponentProps } from '@reach/router';
import { Match } from '@/components/Match';
import { useGameMeta } from '@/store/gameMeta';

interface MatchParams {
  name: string;
  matchID: string;
  playerID?: string;
}

const isNumberString = (payload?: string) => payload && !isNaN(Number(payload));

function SpectateContent(props: RouteComponentProps<MatchParams>) {
  const { name, matchID, playerID } = props as RouteComponentProps &
    MatchParams;
  const meta = useGameMeta(name);

  if (meta && meta.spectate === 'secret' ? isNumberString(playerID) : true) {
    return <Match name={name} matchID={matchID} playerID={playerID} />;
  }

  return <Redirect from="/" to="/" noThrow />;
}

const RouterComponent: React.FC = ({ children }) => <>{children}</>;

export default function () {
  return (
    <Router basepath="/spectate" primary={false} component={RouterComponent}>
      <SpectateContent path="/:name/:matchID/" />
      <SpectateContent path="/:name/:matchID/:playerID" />
      <Redirect from="/" to="/" noThrow />
    </Router>
  );
}
