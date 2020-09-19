import { ElementHandle } from 'puppeteer';
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
  const plusBtn = await page.waitFor(`//button[.//span[@icon="plus"]]`);
  await plusBtn.click();
  await page.waitForXPath(
    `//h4[contains(text(), "Create")][contains(text(), "Match")]`,
    { visible: true }
  );
  await page.waitForTimeout(300);
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
      page.waitForXPath(`//div[label[text()="Your Name"]]//input`, {
        visible: true
      }),
      element.click()
    ]);

    return {
      element,
      setTo: async value => {
        await fillText(playerNameInput, value);
        const [, confirmPlayerName] = await page.$x(
          `//button[.//span[text()="Confirm"]]`
        );
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
    page.waitForNavigation({ waitUntil: ['networkidle0', 'domcontentloaded'] }),
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
  await expect(_page).isMatchPage();
  const goback = await _page.waitForXPath(
    `//button[.//span[@icon="arrow-left"]]`
  );
  await goback.click();
  await _page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  await expect(_page).isLobbyPage();
};

export const getMatches = async (
  _page = page,
  by?: { matchName?: string; description?: string }
) => {
  await expect(_page).isLobbyPage();

  const selectors = [`//div[contains(@class, "bp3-card")]`];

  if (by?.matchName) {
    selectors.push(`[.//div[text()="${by.matchName}"]]`);
  }
  if (by?.description) {
    selectors.push(`[.//div[text()="${by.description}"]]`);
  }

  return await _page.$x(selectors.join(''));
};
