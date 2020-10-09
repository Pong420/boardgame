import { Page } from 'puppeteer';
import { nanoid } from 'nanoid';
import { createMatch, joinMatch, leaveMatch } from '@/utils/match';
import { newPageHelper } from '@/utils/newPage';
import { waitForSocket } from '@/utils/socket';

describe('Chat', () => {
  const createNewPage = newPageHelper('/lobby/tic-tac-toe');

  const P1Name = 'P1';
  const P2Name = 'P2';
  const matchName = 'chat-test';

  let P1: Page;
  let P2: Page;

  const waitForSocketReady = async (page: Page) => {
    await waitForSocket(page, 'Created');
    await waitForSocket(page, 'FrameReceived');
    // wait for other messages
    await page.waitForTimeout(300);
  };

  beforeEach(async () => {
    P1 = page;
    await expect(P1).goto('/');
    const link = await P1.waitForXPath(`//a[.//div[text()="Tic-Tac-Toe"]]`);
    await Promise.all([
      P1.waitForNavigation({ waitUntil: 'networkidle0' }),
      link.click()
    ]);
    await createMatch({ playerName: P1Name, matchName });
    await waitForSocketReady(P1);

    P2 = await createNewPage();
    await P2.waitForNavigation({ waitUntil: 'networkidle0' });
    await joinMatch(P2, { matchName, playerName: P2Name });
    await Promise.all([
      waitForSocketReady(P2),
      waitForSocket(P1, 'FrameReceived') // P2 join message
    ]);
  });

  afterEach(async () => {
    await leaveMatch(P1);
    await jestPuppeteer.resetPage();
    await P2.close();
    await P2.browserContext().close();
  });

  const hasMessage = async (content: string, pages = [P1, P2]) => {
    const results = await Promise.all(
      pages.map(page =>
        page.$x(`//div[text()="${content}"]`).then(els => !!els.length)
      )
    );
    return results.every(Boolean);
  };

  const sendMessage = async (sender: Page, receiver: Page) => {
    const buttonSelector = '//button[./span[text()="Send"]]';
    const button = await sender.waitForXPath(buttonSelector);
    const input = await sender.waitForXPath(`${buttonSelector}/..//input`);
    const content = nanoid();
    await input.type(content);
    await Promise.all<unknown>([
      button.click(),
      waitForSocket(sender, 'FrameSent'),
      waitForSocket(sender, 'FrameReceived'),
      receiver ? waitForSocket(receiver, 'FrameReceived') : Promise.resolve()
    ]);

    await receiver.waitForTimeout(200);
    return content;
  };

  const clickReady = async (page: Page) => {
    const [ready] = await page.$x('//button[./span[text()="I am ready"]]');
    await ready.click();
  };

  const getChatHeader = (page: Page) =>
    page.$x(`//div[contains(text(), "Chat")]/..`);

  const toggleChat = async (page: Page) => {
    const [header] = await getChatHeader(page);
    await header.click();
    await page.waitForTimeout(300); // transition
  };

  const getUnreadMessage = async (page: Page) => {
    const [el] = await page.$x(`//div[contains(text(), "Chat")]//div`);
    return el && el.evaluate(node => Number(node.textContent || 0));
  };

  test('general', async () => {
    await expect(hasMessage(`${P1Name} join the match`)).resolves.toBe(true);
    await expect(hasMessage(`${P2Name} join the match`)).resolves.toBe(true);
    await expect(
      sendMessage(P1, P2).then(content => hasMessage(content))
    ).resolves.toBe(true);
    await expect(
      sendMessage(P2, P1).then(content => hasMessage(content))
    ).resolves.toBe(true);

    // test ready
    await Promise.all([clickReady(P1), waitForSocket(P2, 'FrameReceived')]);
    await expect(
      P2.$x(`//*[contains(text(), 'Other players are ready')]`)
    ).resolves.toHaveLength(1);

    await Promise.all([clickReady(P2), waitForSocket(P1, 'FrameReceived')]);

    await P1.waitForTimeout(300);

    await expect(
      Promise.all([P1.$(`.bgio-client`), P2.$(`.bgio-client`)]).then(els =>
        els.every(el => !!el)
      )
    ).resolves.toBe(true);

    // test un read message
    await toggleChat(P1);
    await sendMessage(P1, P2);
    await sendMessage(P1, P2);

    await P2.waitFor(300);
    await expect(getUnreadMessage(P2)).resolves.toBe(2);
    await toggleChat(P2);
    await P2.waitFor(500);
    await expect(getUnreadMessage(P2)).resolves.toBe(undefined);
  });

  test.skip(
    'reconnect',
    async () => {
      const url = P1.url();
      await jestPuppeteer.resetPage();

      P1 = page;

      await P1.waitForTimeout(5500);
      await P1.goto(url);

      await Promise.all([
        P1.waitForNavigation({ waitUntil: 'networkidle0' }),
        waitForSocketReady(P1),
        P2.waitForTimeout(500)
      ]);

      await expect(hasMessage(`${P1Name} disconnected`)).resolves.toBe(true);
      await expect(hasMessage(`${P1Name} reconnected`)).resolves.toBe(true);
    },
    20 * 1000
  );

  test.skip(
    'disconnect',
    async () => {
      await jestPuppeteer.resetPage();

      await P1.waitForTimeout(5500);
      await waitForSocket(P2, 'FrameReceived');
      await expect(hasMessage(`${P1Name} disconnected`, [P2])).resolves.toBe(
        true
      );

      await P1.waitForTimeout(5500);
      await waitForSocket(P2, 'FrameReceived');
      await expect(hasMessage(`${P1Name} leave the match`, [P2])).resolves.toBe(
        true
      );
    },
    20 * 1000
  );
});
