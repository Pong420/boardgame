const initialValue = () => ({
  ready: false,
  cards: []
});

export default function createPlayers(num) {
  const players = {};
  for (let i = 0; i < num; i++) {
    players[i] = initialValue();
  }

  return players;
}
