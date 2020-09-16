describe('Preference', () => {
  const headingSelector = `//h4[text()="Preferences"]`;
  const dialogSelector = `${headingSelector}/../..`;
  const allRowSelector = `${dialogSelector}//div[contains(@class, "preferences-row")]`;
  const rowSelector = (label: string) =>
    `${allRowSelector}[.//*[text()="${label}"]]`;
  const rowValueSelector = (label: string) => `${rowSelector(label)}//div[2]/*`;

  const openDialog = async () => {
    const [button] = await page.$x("//span[@icon='settings']/..");
    await button.click();
    await page.waitForTimeout(300);
  };

  const closeDialog = async () => {
    const [close] = await page.$x(
      `${headingSelector}/following-sibling::button`
    );
    await close.click();
    await page.waitForTimeout(300);
  };

  beforeAll(async () => {
    await expect(page).goto('/');
    await openDialog();
  });

  test('preferences dialog opended', async () => {
    const [heading] = await page.$x(headingSelector);
    expect(heading).toBeDefined();
  });

  test('polling', async () => {
    const [polling] = await page.$x(`${rowValueSelector('Polling')}/input`);
    expect(polling).getChecked(true);
  });

  test('dark mode', async () => {
    const [darkMode] = await page.$x(`${rowValueSelector('Dark Mode')}/input`);
    const [trigger] = await page.$x(`${rowValueSelector('Dark Mode')}/span`);
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
    const [screenWidth] = await page.$x(
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

  test('preferences dialog closed', async () => {
    await closeDialog();
    const [heading] = await page.$x(headingSelector);
    expect(close).toBeDefined();
    expect(heading).toBeUndefined();
  });
});
