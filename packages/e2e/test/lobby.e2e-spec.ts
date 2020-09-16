import { openCreateMatchDialog, createMatchForm } from '@/utils/match';

describe('Lobby', () => {
  beforeAll(async () => {
    await expect(page).goto('/');
    const [link] = await page.$x(`//a[.//div[text()="Tic-Tac-Toe"]]`);
    await link.click();
    await page.waitForNavigation();
  });

  test('goto lobby', async () => {
    await page.waitForResponse(res => /games/.test(res.url()));
    const [noMatches] = await page.$x(`//div[text()="No Matches Found"]`);

    expect(noMatches).toBeDefined();
    await expect(page).isLobby();
  });

  test('create local match', async () => {
    await openCreateMatchDialog();

    const local = await createMatchForm.local();

    await expect(local.handler).getChecked(false);

    await local.fill(true);
    await expect(local.handler).getChecked(true);

    await createMatchForm.confirm();
    await page.waitForNavigation();
    await expect(page).isMatch();

    await expect(page).goBack();
    await page.waitForNavigation();
    await expect(page).isLobby();
  });

  test('create match', async () => {
    await openCreateMatchDialog();

    const playerName = await createMatchForm.playerName();
    await playerName.fill('e2e-test');

    const matchName = await createMatchForm.matchName();
    await matchName.fill('e2e match');

    await createMatchForm.confirm();
    await page.waitForResponse(
      res => res.ok() && /games.*\/create/.test(res.url())
    );
    await page.waitForNavigation();
    await expect(page).isMatch();

    await expect(page).goBack();
    await page.waitForNavigation();
    await expect(page).isLobby();
  });

  test('create match', async () => {
    await openCreateMatchDialog();

    const playerName = await createMatchForm.playerName();
    await playerName.fill('e2e-test');

    const matchName = await createMatchForm.matchName();
    await matchName.fill('e2e match');

    await createMatchForm.confirm();
    await page.waitForResponse(
      res => res.ok() && /games.*\/create/.test(res.url())
    );
    await page.waitForNavigation();
    await expect(page).isMatch();

    // redirect to match auto

    await expect(page).goBack();
    await page.waitForNavigation();
    await expect(page).isLobby();
  });
});
