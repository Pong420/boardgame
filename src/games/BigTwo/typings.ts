export * from '../../typings';

export interface State {
  players: Record<string, Player>;
  opponents: Opponent[];
  secret?: Secret;
  previous: {
    hand: string[] | null;
    player: string;
  };
}

export interface Secret {
  deck: string[];
}

export interface Player {
  ready: boolean;
  hand: string[];
}

export interface Opponent extends Player {
  id: number;
  numOfCards: number;
}
