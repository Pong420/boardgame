const points = ['3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A', '2'];
const suit = ['s', 'h', 'c', 'd'];

const poker = Array.prototype.concat.apply(
  [],
  suit.map(suit => {
    return points.map(points => points + suit);
  })
);

export { points, suit };

export default poker;
