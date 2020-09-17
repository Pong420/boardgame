import { createMatch, leaveMatch } from '@/utils/match';

describe('Match', () => {
  beforeAll(async () => {
    await expect(page).goto('/');
    const link = await page.waitForXPath(`//a[.//div[text()="Tic-Tac-Toe"]]`);
    await link.click();
    await page.waitForNavigation();
  });

  test('should redirect to match page', async () => {
    await createMatch({ playerName: 'e2e', matchName: 'e2e-test' });

    await page.reload();
    await page.waitForNavigation();
    await page.waitForNavigation();
    await expect(page).isMatch();

    await expect(page).goto('/');
    await page.waitForNavigation();
    await page.waitForNavigation();
    await expect(page).isMatch();

    await leaveMatch();
  });

  // test require `exitOnPageError: false` in ``
  test('leave match when history back', async () => {
    await createMatch({ playerName: 'e2e', matchName: 'e2e-test' });

    // Since `page.goBack()` casue jest did not exits,
    // use evaluate `window.history.back` instead
    await page.evaluate(() => window.history.back());
    await expect(page).isMatch();
    await page.waitForResponse(res => res.ok() && /leave/.test(res.url()));
    await expect(page).isLobby();
  });
});
