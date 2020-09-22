import { Page } from 'puppeteer';

const handler = (url: RegExp, title: RegExp) => {
  return async function callback(
    this: jest.MatcherContext,
    page: Page
  ): Promise<jest.CustomMatcherResult> {
    try {
      expect(page.url()).toMatch(url);
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

export const isHomePage = handler(/.*/, /Home/);
export const isLobbyPage = handler(/lobby/, /Lobby/);
export const isMatchPage = handler(/match/, /Match/);
export const isSpectatePage = handler(/spectate/, /Spectate/);
export const isErrorPage = handler(/error/, /Error/);
export const isInvitationPage = handler(/invitation/, /Invitation/);

expect.extend({
  isHomePage,
  isLobbyPage,
  isMatchPage,
  isSpectatePage,
  isErrorPage,
  isInvitationPage
});
