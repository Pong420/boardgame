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
    await expect(polling.element).isChecked(true);
  });

  test('dark mode', async () => {
    const darkMode = await preferences.darkMode();

    const themeIs = async (theme: string) => {
      const el = await page.$('html');
      const attr = await el?.evaluate(el => el.getAttribute('data-theme'));
      return attr === theme;
    };

    await expect(darkMode.element).isChecked(true);
    await expect(themeIs('dark')).resolves.toBe(true);

    await darkMode.setTo(false);

    await expect(darkMode.element).isChecked(false);
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

    await expect(screenWidth.element).isValue('limited');
    await expect(screenWidthIs('limited')).resolves.toBe(true);

    await screenWidth.setTo('stretch');

    await expect(screenWidth.element).isValue('stretch');
    await expect(screenWidthIs('stretch')).resolves.toBe(true);
  });
});
