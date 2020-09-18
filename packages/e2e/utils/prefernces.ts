import { ElementHandle } from 'puppeteer';

const headingSelector = `//h4[text()="Preferences"]`;
const dialogSelector = `${headingSelector}/../..`;
const allRowSelector = `${dialogSelector}//div[contains(@class, "preferences-row")]`;
const rowSelector = (label: string) =>
  `${allRowSelector}[.//*[text()="${label}"]]`;
const rowValueSelector = (label: string) => `${rowSelector(label)}//div[2]/*`;

export const openPreferenceDialog = async () => {
  const button = await page.waitForXPath("//span[@icon='settings']/..");
  await button.click();
  await page.waitForXPath(headingSelector, {
    visible: true
  });
};

export const closePreferenceDialog = async () => {
  const close = await page.waitForXPath(
    `${headingSelector}/following-sibling::button`
  );
  await close.click();
  await page.waitForTimeout(300);
};

interface PreferencesOptions {
  polling?: boolean;
  darkMode?: boolean;
  screenWidth?: 'limited' | 'stretch';
}

type Keys = keyof PreferencesOptions;

interface Helper<T> {
  handler: ElementHandle;
  fill: (value: T) => Promise<unknown>;
}

type Helpers = {
  [X in Keys]: () => Promise<Helper<NonNullable<PreferencesOptions[X]>>>;
};

const handleSwitch = async (el: ElementHandle, value: boolean) => {
  const checked = await el.evaluate(c => (c as HTMLInputElement).checked);
  if (checked !== value) await el.evaluate(el => el.parentElement?.click());
};

export const preferences = ((): Helpers => {
  const polling: Helpers['polling'] = async () => {
    const handler = await page.waitForXPath(
      `${rowValueSelector('Polling')}/input`
    );
    return { handler, fill: value => handleSwitch(handler, value) };
  };
  const darkMode: Helpers['darkMode'] = async () => {
    const handler = await page.waitForXPath(
      `${rowValueSelector('Dark Mode')}/input`
    );
    return { handler, fill: value => handleSwitch(handler, value) };
  };

  const screenWidth: Helpers['screenWidth'] = async () => {
    const handler = await page.waitForXPath(
      `${rowValueSelector('Screen Width')}/select`
    );
    return {
      handler,
      fill: value => handler.select(String(value))
    };
  };

  return { polling, darkMode, screenWidth };
})();
