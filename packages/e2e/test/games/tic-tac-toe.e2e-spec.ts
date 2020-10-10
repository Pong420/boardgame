import { Page } from 'puppeteer';
import { createMatch, joinMatch, leaveMatch } from '@/utils/match';
import { newPageHelper } from '@/utils/newPage';
import { waitForSocket } from '@/utils/socket';

type Player = 'O' | '✕';

interface Options {
  player?: Player;
  retry?: boolean;
}

// prettier-ignore
interface ClickHandler {
  (page: Page, options: Options & { player: Player }): (idx: number) => Promise<void>;
  (page: Page, options?: Options): (idx: number, player: Player) => Promise<void>;
}

describe('Tic-Tac-Toe', () => {
  beforeAll(async () => {
    await expect(page).goto('/');
    const link = await page.waitForXPath(`//a[.//div[text()="Tic-Tac-Toe"]]`);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      link.click()
    ]);
  });

  const clientSelector = (player: Player) =>
    `//div[@class="bgio-client"][.//div[contains(text(), '${player}')]]`;

  const clickHandler: ClickHandler = (
    page: Page,
    { player: defaultPlayer, retry = true }: Options = {}
  ) => {
    return async function clickCell(idx: number, player = defaultPlayer) {
      if (player) {
        expect(idx).toBeGreaterThan(0);
        expect(idx).toBeLessThan(10);

        await page.bringToFront();

        let count = 0;

        const waitForMyTurn = async (player: Player): Promise<void> => {
          try {
            await page.waitForXPath(
              `${clientSelector(player)}//*[text()="Your turn"]`,
              { timeout: 1000 }
            );
          } catch (error) {
            if (retry && count < 10) {
              await Promise.all([page.reload({ waitUntil: 'networkidle2' })]);
              await waitForMyTurn(player);
              // eslint-disable-next-line
              console.log(`player ${player} retry ${count++}`);
            } else {
              throw new Error(`Waiting for ${player} click ${idx} cell`);
            }
          }
        };

        await waitForMyTurn(player);

        const cells = await page.$x(`${clientSelector(player)}//td`);
        const cell = cells[idx - 1];

        expect(cells.length).toBe(9);
        expect(cell).toBeDefined();

        await page.waitForTimeout(300); // wait for ui update ?
        await cell.click();

        try {
          await expect(
            cell.evaluate(el => el.textContent?.trim())
          ).resolves.toBe(player);
        } catch (error) {
          throw new Error(`Player ${player} not click the cell ${idx}`);
        }
      } else {
        throw new Error(`player is not defined`);
      }
    };
  };

  const createNewPage = newPageHelper('/lobby/tic-tac-toe');
  const isWinner = async (page: Page, player: Player, win: boolean) => {
    try {
      const textSelector = `[.//*[contains(text(), ${win ? 'win' : 'lose'})]]`;
      page.waitForXPath(`${clientSelector(player)}${textSelector}`);
    } catch (error) {
      throw new Error(`cannot check the winner`);
    }
  };

  const gePlayAgainButton = (page: Page) =>
    page.$x(`//button[*[contains(@class, 'icon-play')]]`);

  const clickReady = async (page: Page) => {
    const [ready] = await page.$x('//button[./span[text()="I am ready"]]');
    await ready.click();
  };

  test('local', async () => {
    await createMatch({ local: true });
    const clickCell = clickHandler(page, { retry: false });

    await clickCell(1, 'O');
    await clickCell(2, '✕');
    await clickCell(4, 'O');
    await clickCell(5, '✕');
    await clickCell(7, 'O');

    await isWinner(page, 'O', true);
    await isWinner(page, '✕', false);

    await leaveMatch();
    await expect(page).isLobbyPage();
  });

  test(
    'online',
    async () => {
      const matchName = 'e2e-match';
      await createMatch({ playerName: 'P1', matchName });
      const P1 = page;
      const P2 = await createNewPage();

      // wait for P2 goto lobby page
      await P2.waitForNavigation({ waitUntil: 'domcontentloaded' });
      await joinMatch(P2);

      // player ready
      await clickReady(P1);
      await P2.waitForTimeout(300);
      await clickReady(P2);
      await P1.waitForSelector('.bgio-client');
      await P2.waitForSelector('.bgio-client');

      const P1_CLICK = clickHandler(P1, { player: 'O' });
      const P2_CLICK = clickHandler(P2, { player: '✕' });

      await P1_CLICK(1);
      await P2_CLICK(5);
      await P1_CLICK(2);
      await P2_CLICK(3);
      await P1_CLICK(4);
      await Promise.all([
        Promise.all([
          isWinner(P2, '✕', true),
          waitForSocket(P2, 'FrameReceived')
        ]),
        Promise.all([
          isWinner(P1, 'O', false),
          waitForSocket(P1, 'FrameReceived')
        ]),
        P2_CLICK(7)
      ]);

      // play again
      // TODO: check users are at in same room
      await Promise.all(
        [P1, P2].map(async page => {
          await page.waitForTimeout(500);
          const [btn] = await gePlayAgainButton(page);
          await Promise.all([
            expect(page).waitForResponse('play-again'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            btn.click()
          ]);
          await expect(page).isMatchPage();
          const buttons = await gePlayAgainButton(page);
          expect(buttons).toHaveLength(0);
        })
      );

      await Promise.all([leaveMatch(P1), leaveMatch(P2)]);

      await P2.close();
      await P2.browserContext().close();
    },
    100000 * 1000
  );
});
