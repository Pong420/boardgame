import { Page } from 'puppeteer';
import { createMatch, joinMatch, leaveMatch } from '@/utils/match';
import { newPageHelper } from '@/utils/newPage';
import { waitForSocket } from '@/utils/socket';

type Player = 'O' | '✕';

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

  // prettier-ignore
  function clickHandler(page: Page): (idx: number, defaultPlayer: Player) => Promise<void>;
  // prettier-ignore
  function clickHandler(page: Page, defaultPlayer: Player): (idx: number) => Promise<void>;
  function clickHandler(page: Page, defaultPlayer?: Player) {
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
            if (count < 10) {
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
  }

  const createNewPage = newPageHelper('/lobby/tic-tac-toe');
  const isWinner = async (page: Page, player: Player, win: boolean) => {
    try {
      const textSelector = `[.//*[contains(text(), ${win ? 'win' : 'lose'})]]`;
      page.waitForXPath(`${clientSelector(player)}${textSelector}`);
    } catch (error) {
      throw new Error(`cannot check the winner`);
    }
  };

  const playAgainButton = (page: Page) =>
    page.$x(`//button[.//*[text()="Play again"]]`);

  test('local', async () => {
    await createMatch({ local: true });
    const clickCell = clickHandler(page);

    await clickCell(1, 'O');
    await clickCell(2, '✕');
    await clickCell(4, 'O');
    await clickCell(5, '✕');
    await clickCell(7, 'O');

    await isWinner(page, 'O', true);
    await isWinner(page, '✕', false);

    const buttons = await playAgainButton(page);
    expect(buttons.length).toBe(0);

    await leaveMatch();
    await expect(page).isLobbyPage();
  });

  test(
    'online',
    async () => {
      const matchName = 'e2e-match';
      await createMatch({ playerName: 'p1', matchName });
      const p1 = page;
      const p2 = await createNewPage();

      // wait for p2 goto lobby page
      await p2.waitForNavigation({ waitUntil: 'domcontentloaded' });
      await joinMatch(p2);

      const P1_CLICK = clickHandler(p1, 'O');
      const P2_CLICK = clickHandler(p2, '✕');

      await P1_CLICK(1);
      await P2_CLICK(5);
      await P1_CLICK(2);
      await P2_CLICK(3);
      await P1_CLICK(4);
      await Promise.all([
        Promise.all([
          isWinner(p2, '✕', true),
          waitForSocket(p2, 'FrameReceived')
        ]),
        Promise.all([
          isWinner(p1, 'O', false),
          waitForSocket(p1, 'FrameReceived')
        ]),
        P2_CLICK(7)
      ]);

      await page.waitForTimeout(100);

      // play again
      await Promise.all(
        [p1, p2].map(async page => {
          const [btn] = await playAgainButton(page);
          await Promise.all([
            page.waitForResponse(
              res => res.ok() && /playAgain/.test(res.url())
            ),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            btn.click()
          ]);
          await expect(page).isMatchPage();
          const buttons = await playAgainButton(page);
          expect(buttons).toHaveLength(0);
        })
      );

      await Promise.all([leaveMatch(p1), leaveMatch(p2)]);

      await p2.close();
      await p2.browserContext().close();
    },
    10 * 1000
  );
});
