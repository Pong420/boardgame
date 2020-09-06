import React from 'react';
import { graphql } from 'gatsby';
import { RouteComponentProps, GameMeta } from '@/typings';
import { Lobby } from '@/components/Lobby';

interface Context {
  gameMeta: GameMeta;
}

export default function (props: RouteComponentProps<Context>) {
  return <Lobby meta={props.data.gameMeta} />;
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
