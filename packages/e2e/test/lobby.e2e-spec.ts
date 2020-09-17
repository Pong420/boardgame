import {
  openCreateMatchDialog,
  createMatchForm,
  createMatch,
  leaveMatch
} from '@/utils/match';

describe('Lobby', () => {
  const waitForGameList = () =>
    page.waitForResponse(
      res => res.ok() && /games\/tic-tac-toe/.test(res.url())
    );

  beforeEach(async () => {
    await expect(page).goto('/');
    const link = await page.waitForXPath(`//a[.//div[text()="Tic-Tac-Toe"]]`);
    await link.click();
    await page.waitForNavigation();
  });

  test('goto lobby', async () => {
    await waitForGameList();
    const [noMatches] = await page.$x(`//div[text()="No Matches Found"]`);

    expect(noMatches).toBeDefined();
    await expect(page).isLobby();
  });

  test('polling', async () => {
    await waitForGameList();
    await page.waitForTimeout(4500);
    await waitForGameList();

    // polling works

    // await openCreateMatchDialog();
    // const local = await createMatchForm.local();
    // await expect(local.handler).getChecked(false);
    // await local.fill(true);
    // await expect(local.handler).getChecked(true);
    // await createMatchForm.confirm();
    // await page.waitForNavigation();
    // await expect(page).isMatch();
    // await leaveMatch();
    // await expect(page).isLobby();
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

    await leaveMatch();
    await expect(page).isLobby();
  });

  test('create match', async () => {
    await createMatch({ playerName: 'e2e', matchName: 'e2e-test' });

    await leaveMatch();
    await expect(page).isLobby();
  });

  test('create match', async () => {
    await createMatch({ playerName: 'e2e', matchName: 'e2e-test' });

    await leaveMatch();
    await expect(page).isLobby();
  });
});
