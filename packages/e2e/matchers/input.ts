import { ElementHandle } from 'puppeteer';

function handler<T extends keyof HTMLInputElement>(key: T) {
  return async function returnFunction(
    this: jest.MatcherContext,
    handle: ElementHandle<Element>,
    expected: HTMLInputElement[T]
  ) {
    return handle
      .evaluate((el, key: T) => (el as HTMLInputElement)[key], key)
      .then(received =>
        received === expected
          ? {
              message: () => `success`,
              pass: true
            }
          : {
              message: () =>
                `Expected: not ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(received)}`,
              pass: false
            }
      )
      .catch(error => ({
        message: () => error,
        pass: false
      }));
  };
}

export const isChecked = handler('checked');
export const isValue = handler('value');

expect.extend({
  isChecked,
  isValue
});
