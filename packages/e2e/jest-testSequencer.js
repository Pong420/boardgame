// @ts-check
const Sequencer = require('@jest/test-sequencer').default;

const order = [
  'lobby.e2e-spec',
  'match.e2e-spec',
  'chat.e2e-spec',
  'games/',
  'preferences.e2e-spec',
  'others.e2e-spec'
];

/**
 * @param {number} a
 * @param {number} b
 */
function compare(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

/**
 * @param {string} path
 */
const getOrder = path => order.findIndex(o => path.indexOf(o) !== -1);

class CustomSequencer extends Sequencer {
  /**
   * @param {import('jest-runner').Test[]} tests
   */
  sort(tests) {
    return Array.from(tests).sort((testA, testB) =>
      compare(getOrder(testA.path), getOrder(testB.path))
    );
  }
}

module.exports = CustomSequencer;
