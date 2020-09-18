import {
  openCreateMatchDialog,
  createMatchForm,
  createMatch,
  leaveMatch,
  getMatches
} from '@/utils/match';
import {
  closePreferenceDialog,
  openPreferenceDialog,
  preferences
} from '@/utils/prefernces';
import { Page } from 'puppeteer';

describe('Lobby', () => {
  const isGetMatchesUrl = (url: string) => /games\/tic-tac-toe/.test(url);

  const waitForGameList = (_page = page) =>
    _page.waitForResponse(res => res.ok() && isGetMatchesUrl(res.url()));

  type Callback = (page: Page) => Promise<void>;

  async function newLobbyPage(): Promise<Page>;
  async function newLobbyPage(cb: Callback): Promise<undefined>;
  async function newLobbyPage(cb?: Callback): Promise<Page | undefined> {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await expect(page).goto('/lobby/tic-tac-toe');

    if (cb) {
      await cb(page);
      await page.close();
      await page.browserContext().close();
    } else {
      return page;
    }
  }

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

  // skip by default, since it needs too much time
  test.skip(
    'polling',
    async () => {
      // test polling works
      await waitForGameList();
      await waitForGameList();

      // test toggle polling  correctly
      await openPreferenceDialog();
      const polling = await preferences.polling();
      await polling.fill(false);
      await expect(polling.handler).getChecked(false);

      const hasResponse = await Promise.race([
        page.waitForTimeout(5000).then(() => false),
        waitForGameList().then(() => true)
      ]);
      expect(hasResponse).toBe(false);

      await polling.fill(true);
      await expect(polling.handler).getChecked(true);
      await waitForGameList();
      await closePreferenceDialog();

      // test timer reset after refresh
      const refreshBtn = await page.waitForXPath(
        `//button[.//span[@icon="refresh"]]`
      );

      await refreshBtn.click();
      const immediately = await Promise.race([
        page.waitForTimeout(500).then(() => false),
        page.waitForRequest(res => isGetMatchesUrl(res.url())).then(() => true)
      ]);

      expect(immediately).toBe(true);

      const start = await waitForGameList().then(() => +new Date());
      const end = await waitForGameList().then(() => +new Date());
      const delta = end - start;

      expect(delta >= 5 * 1000).toBe(true);
      expect(delta <= 6 * 1000).toBe(true);
    },
    60 * 1000
  );

  test(
    'create local match',
    async () => {
      await openCreateMatchDialog();

      const local = await createMatchForm.local();

      await expect(local.handler).getChecked(false);

      await local.fill(true);
      await expect(local.handler).getChecked(true);

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        createMatchForm.confirm()
      ]);

      await expect(page).isMatch();

      await leaveMatch();
    },
    7 * 1000
  );

  test('create match', async () => {
    const matchName = 'e2e-match';
    const description = 'e2e-test-description';
    await createMatch({ playerName: 'e2e', matchName, description });

    await newLobbyPage(async page => {
      await waitForGameList(page);
      const allMatches = await getMatches(page);
      const matches = await getMatches(page, { matchName, description });
      expect(allMatches.length).toBe(1);
      expect(matches.length).toBe(1);
    });

    await leaveMatch();
  });

  test('create private match', async () => {
    const matchName = 'e2e-match';
    const description = 'e2e-test-description';

    await createMatch({
      playerName: 'e2e',
      private: true,
      matchName,
      description
    });

    await newLobbyPage(async page => {
      await waitForGameList(page);
      const allMatches = await getMatches(page);
      const matches = await getMatches(page, { matchName, description });
      expect(allMatches.length).toBe(0);
      expect(matches.length).toBe(0);
    });

    await leaveMatch();
  });

  test(
    'join match and spectate',
    async () => {
      const matchName = 'e2e-match';
      const description = 'e2e-test-description';
      await createMatch({ playerName: 'e2e', matchName, description });

      const joinPage = await (async () => {
        const page = await newLobbyPage();
        await waitForGameList(page);
        const [match] = await getMatches(page, { matchName, description });
        const [button] = await match.$x('//button[.//span[text()="Join"]]');
        await button.click();
        await page.waitFor(300);
        const input = await page.waitForXPath(
          `//div[label[text()="Your Name"]]//input`
        );
        await input.type('e2e-p-2');
        const [confirm] = await page.$x(`//button[.//span[text()="Confirm"]]`);
        await confirm.click();
        await page.waitForResponse(
          res => res.ok() && /games.*\/join/.test(res.url())
        );
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await expect(page).isMatch();
        return page;
      })();

      const spectatePage = await (async () => {
        const page = await newLobbyPage();
        await waitForGameList(page);
        const [match] = await getMatches(page, { matchName, description });
        const [button] = await match.$x('//button[.//span[text()="Spectate"]]');
        await button.click();
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await expect(page).isSpectatePage();
        return page;
      })();

      await Promise.all([leaveMatch(), leaveMatch(joinPage)]);

      await expect(spectatePage).goBack();
      await spectatePage.waitForNavigation({ waitUntil: 'domcontentloaded' });
      await expect(spectatePage).isLobby();

      await joinPage.close();
      await joinPage.browserContext().close();
      await spectatePage.close();
      await spectatePage.browserContext().close();
    },
    20 * 1000
  );
});
