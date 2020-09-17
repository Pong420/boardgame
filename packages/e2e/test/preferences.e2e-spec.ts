import {
  preferences,
  openPreferenceDialog,
  closePreferenceDialog
} from '../utils/prefernces';

describe('Preference', () => {
  const headingSelector = `//h4[text()="Preferences"]`;

  beforeAll(async () => {
    await expect(page).goto('/');
    await openPreferenceDialog();
  });

  afterAll(async () => {
    await closePreferenceDialog();
  });

  test('preferences dialog opended', async () => {
    const heading = await page.waitForXPath(headingSelector);
    expect(heading).toBeDefined();
  });

  test('polling', async () => {
    const polling = await preferences.polling();
    expect(polling.handler).getChecked(true);
  });

  test('dark mode', async () => {
    const darkMode = await preferences.darkMode();

    const themeIs = async (theme: string) => {
      const el = await page.$('html');
      const attr = await el?.evaluate(el => el.getAttribute('data-theme'));
      return attr === theme;
    };

    await expect(darkMode.handler).getChecked(true);
    await expect(themeIs('dark')).resolves.toBe(true);

    await darkMode.fill(false);

    await expect(darkMode.handler).getChecked(false);
    await expect(themeIs('light')).resolves.toBe(true);
  });

  test('screen width', async () => {
    const screenWidth = await preferences.screenWidth();
    const screenWidthIs = async (theme: string) => {
      const el = await page.$('html');
      const attr = await el?.evaluate(el =>
        el.getAttribute('data-screen-width')
      );
      return attr === theme;
    };

    await expect(screenWidth.handler).getInputValue('limited');
    await expect(screenWidthIs('limited')).resolves.toBe(true);

    await screenWidth.fill('stretch');

    await expect(screenWidth.handler).getInputValue('stretch');
    await expect(screenWidthIs('stretch')).resolves.toBe(true);
  });
});
