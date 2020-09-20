import { ElementHandle } from 'puppeteer';
import { handleSwitch } from './input';

const headingSelector = `//h4[text()="Preferences"]`;
const dialogSelector = `${headingSelector}/../..`;
const allRowSelector = `${dialogSelector}//div[contains(@class, "preferences-row")]`;
const rowSelector = (label: string) =>
  `${allRowSelector}[.//*[text()="${label}"]]`;
const rowValueSelector = (label: string) => `${rowSelector(label)}//div[2]/*`;

export const openPreferenceDialog = async () => {
  const button = await page.waitForXPath("//span[@icon='settings']/..");
  await button.focus();
  await button.click();
  await page.waitForXPath(headingSelector, {
    visible: true
  });
};

export const closePreferenceDialog = async () => {
  const close = await page.waitForXPath(
    `${headingSelector}/following-sibling::button`
  );
  await close.focus();
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
  element: ElementHandle;
  setTo: (value: T) => Promise<unknown>;
}

type Helpers = {
  [X in Keys]: () => Promise<Helper<NonNullable<PreferencesOptions[X]>>>;
};

export const preferences = ((): Helpers => {
  const polling: Helpers['polling'] = async () => {
    const element = await page.waitForXPath(
      `${rowValueSelector('Polling')}/input`
    );
    return { element, setTo: value => handleSwitch(element, value) };
  };
  const darkMode: Helpers['darkMode'] = async () => {
    const element = await page.waitForXPath(
      `${rowValueSelector('Dark Mode')}/input`
    );
    return { element, setTo: value => handleSwitch(element, value) };
  };

  const screenWidth: Helpers['screenWidth'] = async () => {
    const element = await page.waitForXPath(
      `${rowValueSelector('Screen Width')}/select`
    );
    return {
      element,
      setTo: value => element.select(String(value))
    };
  };

  return { polling, darkMode, screenWidth };
})();
