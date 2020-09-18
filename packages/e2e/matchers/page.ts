import { Page } from 'puppeteer';

const handler = (url: RegExp, title: RegExp) => {
  return async (page: Page): Promise<jest.CustomMatcherResult> => {
    try {
      await expect(page.url()).toMatch(url);
      await expect(page.title()).resolves.toMatch(title);
      return {
        message: () => `success`,
        pass: true
      };
    } catch (error) {
      return {
        message: () => error,
        pass: false
      };
    }
  };
};

export const isLobby = handler(/lobby/, /Lobby/);
export const isMatch = handler(/match/, /Match/);

expect.extend({ isLobby, isMatch });
