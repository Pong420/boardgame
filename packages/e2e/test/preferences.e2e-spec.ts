describe('Preference', () => {
  const headingSelector = `//h4[text()="Preferences"]`;
  const dialogSelector = `${headingSelector}/../..`;
  const allRowSelector = `${dialogSelector}//div[contains(@class, "preferences-row")]`;
  const rowSelector = (label: string) =>
    `${allRowSelector}[.//*[text()="${label}"]]`;
  const rowValueSelector = (label: string) => `${rowSelector(label)}//div[2]/*`;

  const openDialog = async () => {
    const button = await page.waitForXPath("//span[@icon='settings']/..");
    await button.click();
    await page.waitForXPath(`//h4[contains(text(), "Preferences")]`, {
      visible: true
    });
  };

  const closeDialog = async () => {
    const close = await page.waitForXPath(
      `${headingSelector}/following-sibling::button`
    );
    await close.click();
    await page.waitForTimeout(300);
  };

  beforeAll(async () => {
    await expect(page).goto('/');
    await openDialog();
  });

  afterAll(async () => {
    await closeDialog();
  });

  test('preferences dialog opended', async () => {
    const heading = await page.waitForXPath(headingSelector);
    expect(heading).toBeDefined();
  });

  test('polling', async () => {
    const polling = await page.waitForXPath(
      `${rowValueSelector('Polling')}/input`
    );
    expect(polling).getChecked(true);
  });

  test('dark mode', async () => {
    const darkMode = await page.waitForXPath(
      `${rowValueSelector('Dark Mode')}/input`
    );
    const trigger = await page.waitForXPath(
      `${rowValueSelector('Dark Mode')}/span`
    );
    const themeIs = async (theme: string) => {
      const el = await page.$('html');
      const attr = await el?.evaluate(el => el.getAttribute('data-theme'));
      return attr === theme;
    };

    expect(darkMode).toBeDefined();
    expect(trigger).toBeDefined();

    await expect(darkMode).getChecked(true);
    await expect(themeIs('dark')).resolves.toBe(true);

    await trigger.click();

    await expect(darkMode).getChecked(false);
    await expect(themeIs('light')).resolves.toBe(true);
  });

  test('screen width', async () => {
    const screenWidth = await page.waitForXPath(
      `${rowValueSelector('Screen Width')}/select`
    );
    const screenWidthIs = async (theme: string) => {
      const el = await page.$('html');
      const attr = await el?.evaluate(el =>
        el.getAttribute('data-screen-width')
      );
      return attr === theme;
    };

    expect(screenWidth).toBeDefined();

    await expect(screenWidth).getInputValue('limited');
    await expect(screenWidthIs('limited')).resolves.toBe(true);

    await screenWidth.select('stretch');

    await expect(screenWidth).getInputValue('stretch');
    await expect(screenWidthIs('stretch')).resolves.toBe(true);
  });
});
