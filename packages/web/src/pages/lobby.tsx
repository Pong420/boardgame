import React from 'react';
import { graphql } from 'gatsby';
import { RouteComponentProps, GameMeta } from '@/typings';
import { Lobby } from '@/components/Lobby';
import { MatchesProvider } from '@/components/Lobby/MatchesProvider';

interface Context {
  gameMeta: GameMeta;
}

export default function (props: RouteComponentProps<Context>) {
  return (
    <MatchesProvider>
      <Lobby meta={props.data.gameMeta} />;
    </MatchesProvider>
  );
}

export const query = graphql`
  query($name: String) {
    gameMeta(name: { eq: $name }) {
      author
      description
      gameName
      icon
      name
      numOfPlayers
      version
    }
  }
`;
