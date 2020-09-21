import { ElementHandle, Page } from 'puppeteer';
import { handleCheckbox, fillText } from './input';

interface FormOptions {
  local?: boolean;
  playerName?: string;
  matchName?: string;
  numPlayers?: number;
  description?: string;
  spectate?: boolean;
  private?: boolean;
}

type Keys = keyof FormOptions;

interface Helper<T> {
  element: ElementHandle;
  setTo: (value: T) => Promise<unknown>;
}

type Helpers = {
  [X in Keys]: () => Promise<Helper<NonNullable<FormOptions[X]>>>;
} & {
  confirm: () => Promise<void>;
};

export const openCreateMatchDialog = async () => {
  const plusBtn = await page.waitForXPath(`//button[.//span[@icon="plus"]]`);
  await plusBtn.focus();
  await plusBtn.click();
  await page.waitForTimeout(500);
};

export const createMatchForm = ((): Helpers => {
  const local: Helpers['local'] = async () => {
    const element = await page.waitForXPath(`//label[text()="Local"]/input`);
    return { element, setTo: value => handleCheckbox(element, value) };
  };

  const playerName: Helpers['playerName'] = async () => {
    const element = await page.waitForXPath(
      `//div[label[text()="Your Name"]]//button`
    );
    const [playerNameInput] = await Promise.all([
      page.waitForXPath(`//div[label[text()="Your Name"]]//input`, {}),
      element.click()
    ]);

    return {
      element,
      setTo: async value => {
        await fillText(playerNameInput, value);
        const [, confirmPlayerName] = await page.$x(
          `//button[.//span[text()="Confirm"]]`
        );
        await confirmPlayerName.focus();
        await confirmPlayerName.click();
        await page.waitForTimeout(300);
      }
    };
  };

  const matchName: Helpers['matchName'] = async () => {
    const element = await page.waitForXPath(
      `//div[label[text()="Match Name"]]//input`
    );
    return {
      element,
      setTo: value => fillText(element, value)
    };
  };

  const numPlayers: Helpers['numPlayers'] = async () => {
    const element = await page.waitForXPath(
      `//div[label[text()="Number of Players"]]//select`
    );
    return {
      element,
      setTo: value => element.select(String(value))
    };
  };

  const description: Helpers['description'] = async () => {
    const element = await page.waitForXPath(
      `//div[label[contains(text(), "Description")]]//textarea`
    );
    return {
      element,
      setTo: value => element.type(value, { delay: 50 })
    };
  };

  const spectate: Helpers['spectate'] = async () => {
    const element = await page.waitForXPath(`//label[text()="Spectate"]/input`);
    return { element, setTo: value => handleCheckbox(element, value) };
  };

  const _private: Helpers['private'] = async () => {
    const element = await page.waitForXPath(`//label[text()="Private"]/input`);
    return { element, setTo: value => handleCheckbox(element, value) };
  };

  const confirm: Helpers['confirm'] = async () => {
    const [confirm] = await page.$x(`//button[.//span[text()="Confirm"]]`);
    await confirm.focus();
    await confirm.click();
  };

  return {
    local,
    playerName,
    matchName,
    numPlayers,
    description,
    spectate,
    private: _private,
    confirm
  };
})();

export const createMatch = async (options: FormOptions) => {
  await expect(page).isLobbyPage();

  await openCreateMatchDialog();

  const entries = Object.entries(options);

  for (const [key, value] of entries) {
    const item: Helper<any> = await createMatchForm[key as keyof FormOptions]();
    await item.setTo(value);
  }

  await Promise.all([
    page.waitForNavigation(),
    (options.local
      ? Promise.resolve()
      : page.waitForResponse(
          res => res.ok() && /games.*\/create/.test(res.url())
        )) as Promise<void>,
    createMatchForm.confirm()
  ]);

  await expect(page).isMatchPage();
};

export const leaveMatch = async (_page = page) => {
  await _page.bringToFront();
  await expect(_page).isMatchPage();
  await expect(_page).goBack();
  await _page.waitForNavigation({
    waitUntil: 'networkidle0'
  });
  await expect(_page).isLobbyPage();
};

interface By {
  matchName?: string;
  description?: string;
}

export const getMatches = async (page: Page, by?: By) => {
  await expect(page).isLobbyPage();

  const selectors = [`//div[contains(@class, "bp3-card")]`];

  if (by?.matchName) {
    selectors.push(`[.//div[text()="${by.matchName}"]]`);
  }
  if (by?.description) {
    selectors.push(`[.//div[text()="${by.description}"]]`);
  }

  return await page.$x(selectors.join(''));
};

export async function clickJoinButton<T extends { $x: Page['$x'] }>(
  page: Page,
  handle: T
) {
  const [button] = await handle.$x('//button[.//span[text()="Join"]]');

  expect(button).toBeDefined();

  await button.focus();
  await button.click();
  await page.waitForTimeout(1000);

  await Promise.all([
    (async () => {
      const [input] = await page.$x(`//div[label[text()="Your Name"]]//input`);
      expect(input).toBeDefined();
      await input.focus();
      await input.type('e2e-p-2');

      const [confirm] = await page.$x(`//button[.//span[text()="Confirm"]]`);
      expect(confirm).toBeDefined();
      await confirm.focus();
      await confirm.click();
    })(),
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.waitForResponse(res => res.ok() && /games.*\/join/.test(res.url()))
  ]);
}

async function waitForMatch(page: Page, by?: By): Promise<ElementHandle[]> {
  const matches = await getMatches(page, by);
  if (matches.length) {
    return matches;
  }
  await page.waitForResponse(
    res =>
      res.ok() && res.request().method() === 'GET' && /games/.test(res.url())
  );
  return waitForMatch(page, by);
}

export const joinMatch = async (page: Page, by?: By) => {
  await expect(page).isLobbyPage();

  const [match] = await waitForMatch(page, by);

  expect(match).toBeDefined();

  await clickJoinButton(page, match);

  await expect(page).isMatchPage();

  return page;
};
