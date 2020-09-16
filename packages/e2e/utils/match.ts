import { ElementHandle } from 'puppeteer';

export const openCreateMatchDialog = async () => {
  const [plusBtn] = await page.$x(`//button[.//span[@icon="plus"]]`);
  await plusBtn.click();
  await page.waitForTimeout(300);
};

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

const handleCheckbox = async (el: ElementHandle, value: boolean) => {
  const checked = await el.evaluate(c => (c as HTMLInputElement).checked);
  if (checked !== value) await el.click();
};

export const createMatchForm = ((): FormHandlers => {
  const local: FormHandlers['local'] = async () => {
    const [handler] = await page.$x(`//label[text()="Local"]/input`);
    return { handler, fill: value => handleCheckbox(handler, value) };
  };

  const playerName: FormHandlers['playerName'] = async () => {
    const [handler] = await page.$x(`//div[label[text()="Your Name"]]//button`);
    await handler.click();
    const playerNameInput = await page.waitForXPath(
      `//div[label[text()="Your Name"]]//input`
    );

    return {
      handler,
      fill: async value => {
        await playerNameInput.type(value);
        const [, confirmPlayerName] = await page.$x(
          `//button[.//span[text()="Confirm"]]`
        );
        await confirmPlayerName.click();
      }
    };
  };

  const matchName: FormHandlers['matchName'] = async () => {
    const [handler] = await page.$x(`//div[label[text()="Match Name"]]//input`);
    return {
      handler,
      fill: value => handler.type(value)
    };
  };

  const numPlayers: FormHandlers['numPlayers'] = async () => {
    const [handler] = await page.$x(
      `//div[label[text()="Number of Players"]]//select`
    );
    return {
      handler,
      fill: value => handler.select(String(value))
    };
  };

  const description: FormHandlers['description'] = async () => {
    const [handler] = await page.$x(
      `//div[label[contains(text(), "Description")]]//textarea`
    );
    return {
      handler,
      fill: value => handler.select(value)
    };
  };

  const spectate: FormHandlers['spectate'] = async () => {
    const [handler] = await page.$x(`//label[text()="Spectate"]/input`);
    return { handler, fill: value => handleCheckbox(handler, value) };
  };

  const _private: FormHandlers['private'] = async () => {
    const [handler] = await page.$x(`//label[text()="Private"]/input`);
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
