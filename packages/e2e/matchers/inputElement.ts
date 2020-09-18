import { ElementHandle } from 'puppeteer';

const handler = <T extends keyof HTMLInputElement>(key: T) => (
  handle: ElementHandle<Element>,
  expectation: HTMLInputElement[T]
) =>
  handle
    .evaluate((el, key: T) => (el as HTMLInputElement)[key], key)
    .then(value =>
      value === expectation
        ? {
            message: () => `success`,
            pass: true
          }
        : {
            message: () => `expect ${expectation} receive ${value}`,
            pass: false
          }
    )
    .catch(error => ({
      message: () => error,
      pass: false
    }));

export const getChecked = handler('checked');
export const getInputValue = handler('value');

expect.extend({
  getChecked,
  getInputValue
});
