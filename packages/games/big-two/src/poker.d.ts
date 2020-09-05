declare module 'pokersolver' {
  interface Resolved {
    cards: string[];
    isPossible?: boolean;
    toArray: (flag?: boolean) => string[];
  }

  interface Hand {
    winners: (resolved: Resolved[]) => Resolved[];
    solve: (hand: string[] | null, type: 'bigtwo') => Resolved;
  }

  export const Hand: Hand;
}

declare module 'pokerjs/release/poker.min.js';

declare interface Window {
  Poker: {
    getCardData(height: number, suit: string, point: string): string;
    getBackImage(
      height: number,
      frontColor: string,
      backColor: string
    ): HTMLImageElement;
    getBackCanvas(
      height: number,
      frontColor: string,
      backColor: string
    ): HTMLCanvasElement;
  };
}
