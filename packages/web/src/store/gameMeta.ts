import React, { ProviderProps, useMemo } from 'react';
import { GameMeta } from '@/typings';
import { useStaticQuery, graphql } from 'gatsby';

interface State {
  data: GameMeta[];
  byName: Record<string, GameMeta>;
}

interface QueryResult {
  allGameMeta: {
    nodes: GameMeta[];
  };
}

const Context = React.createContext({} as State);

export function useGameMeta(): GameMeta[];
export function useGameMeta(name: string): GameMeta | undefined;
export function useGameMeta(name?: string): GameMeta | GameMeta[] | undefined {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error('useGameMeta must be used within a GameMetaProvider');
  }
  return name ? context.byName[name] : context.data;
}

export const GameMetaProvider: React.FC = ({ children }) => {
  const data = useStaticQuery<QueryResult>(query);
  const value = useMemo<State>(() => {
    const meta = data?.allGameMeta.nodes || [];
    return {
      data: meta,
      byName: meta.reduce(
        (result, meta) => ({ ...result, [meta.name]: meta }),
        {}
      )
    };
  }, [data]);

  return React.createElement<ProviderProps<State>>(
    Context.Provider,
    { value },
    children
  );
};

const query = graphql`
  query {
    allGameMeta {
      nodes {
        version
        name
        gameName
        icon
        author
        numPlayers
        description
        spectate
      }
    }
  }
`;
