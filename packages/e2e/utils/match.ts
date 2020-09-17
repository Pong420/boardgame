import { ElementHandle } from 'puppeteer';

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
  handler: ElementHandle;
  fill: (value: T) => Promise<unknown>;
}

type FormHandlers = {
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
};

const handleCheckbox = async (el: ElementHandle, value: boolean) => {
  const checked = await el.evaluate(c => (c as HTMLInputElement).checked);
  if (checked !== value) await el.click();
};

const fillText = async (el: ElementHandle, value: string, clear = true) => {
  if (clear) {
    await el.focus();
    await el.evaluate(el =>
      (el as HTMLInputElement).setSelectionRange(0, 999999999)
    );
  }
  await el.type(value, { delay: 50 });
};

export const createMatchForm = ((): FormHandlers => {
  const local: FormHandlers['local'] = async () => {
    const handler = await page.waitForXPath(`//label[text()="Local"]/input`);
    return { handler, fill: value => handleCheckbox(handler, value) };
  };

  const playerName: FormHandlers['playerName'] = async () => {
    const handler = await page.waitForXPath(
      `//div[label[text()="Your Name"]]//button`
    );
    const [playerNameInput] = await Promise.all([
      page.waitForXPath(`//div[label[text()="Your Name"]]//input`, {
        visible: true
      }),
      handler.click()
    ]);

    return {
      handler,
      fill: async value => {
        await fillText(playerNameInput, value);
        const [, confirmPlayerName] = await page.$x(
          `//button[.//span[text()="Confirm"]]`
        );
        await confirmPlayerName.click();
        await page.waitForTimeout(300);
      }
    };
  };

  const matchName: FormHandlers['matchName'] = async () => {
    const handler = await page.waitForXPath(
      `//div[label[text()="Match Name"]]//input`
    );
    return {
      handler,
      fill: value => fillText(handler, value)
    };
  };

  const numPlayers: FormHandlers['numPlayers'] = async () => {
    const handler = await page.waitForXPath(
      `//div[label[text()="Number of Players"]]//select`
    );
    return {
      handler,
      fill: value => handler.select(String(value))
    };
  };

  const description: FormHandlers['description'] = async () => {
    const handler = await page.waitForXPath(
      `//div[label[contains(text(), "Description")]]//textarea`
    );
    return {
      handler,
      fill: value => handler.type(value, { delay: 50 })
    };
  };

  const spectate: FormHandlers['spectate'] = async () => {
    const handler = await page.waitForXPath(`//label[text()="Spectate"]/input`);
    return { handler, fill: value => handleCheckbox(handler, value) };
  };

  const _private: FormHandlers['private'] = async () => {
    const handler = await page.waitForXPath(`//label[text()="Private"]/input`);
    return { handler, fill: value => handleCheckbox(handler, value) };
  };

  const confirm: FormHandlers['confirm'] = async () => {
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
  await expect(page).isLobby();

  await openCreateMatchDialog();

  for (const [key, value] of Object.entries(options)) {
    if (typeof value !== 'undefined') {
      const item: Helper<any> = await createMatchForm[
        key as keyof FormOptions
      ]();
      await item.fill(value);
    }
  }

  await createMatchForm.confirm();
  await page.waitForResponse(
    res => res.ok() && /games.*\/create/.test(res.url())
  );
  await page.waitForNavigation();
  await expect(page).isMatch();
};

export const leaveMatch = async () => {
  await expect(page).isMatch();
  await Promise.all([
    //
    page.waitForNavigation(),
    expect(page).goBack()
  ]);
};

export const getMatches = async (
  _page = page,
  by?: { matchName?: string; description?: string }
) => {
  await expect(_page).isLobby();

  const selectors = [`//div[contains(@class, "bp3-card")]`];

  if (by?.matchName) {
    selectors.push(`[.//div[text()="${by.matchName}"]]`);
  }
  if (by?.description) {
    selectors.push(`[.//div[text()="${by.description}"]]`);
  }

  return await _page.$x(selectors.join(''));
};
