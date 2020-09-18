import { createMatch, leaveMatch } from '@/utils/match';

describe('Match', () => {
  beforeAll(async () => {
    await expect(page).goto('/');
    const link = await page.waitForXPath(`//a[.//div[text()="Tic-Tac-Toe"]]`);
    await link.click();
    await page.waitForNavigation();
  });

  test('leave match', async () => {
    await createMatch({ playerName: 'e2e', matchName: 'e2e-test' });
    await leaveMatch();
  });

  test('should redirect to match page', async () => {
    await createMatch({ playerName: 'e2e', matchName: 'e2e-test' });

    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    await expect(page).isMatchyPage();

    await expect(page).goto('/');
    await page.waitForNavigation();
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await expect(page).isMatchyPage();

    await leaveMatch();
  });

  // test require `exitOnPageError: false` in `packages/e2e/jest-puppeteer.config.js`
  test('leave match when history back', async () => {
    await createMatch({ playerName: 'e2e', matchName: 'e2e-test' });

    await page.evaluate(() => {
      window.history.back();
    });
    await expect(page).isMatchyPage();
    await page.waitForResponse(res => res.ok() && /leave/.test(res.url()));
    await expect(page).isLobbyPage();
  });
});
