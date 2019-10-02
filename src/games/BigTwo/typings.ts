export * from '../../typings';

export interface State {
  players: Record<number, Player>;
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

export interface Opponent extends Omit<Player, 'hand'> {
  id: number;
  numOfCards: number;
}
