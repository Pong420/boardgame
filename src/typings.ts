export interface Handler {
  players: any[];
  otherPlayers: OtherPlayer[];
  secret?: Secret;
}

export interface Secret {
  deck: string[];
}

export interface Context {
  numPlayers: number;
  random: {
    Shuffle<T>(array: T[]): T[];
  };
}

export interface Player {
  cards: string[];
}

export interface OtherPlayer {
  id: number;
  cards: number;
}
