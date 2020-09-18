describe('others', () => {
  test('only allow one screen at a time', async () => {
    await expect(page).goto('/');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await expect(page).isHomePage();

    const newPage = await browser.newPage();
    await expect(newPage).goto('/');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      newPage.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    await expect(page).isErrorPage();
    await expect(newPage).isHomePage();

    // should not changed
    await page.reload({ waitUntil: 'networkidle0' });
    await expect(page).isErrorPage();
    await expect(newPage).isHomePage();

    // should changed
    await page.bringToFront();
    await expect(page).goBack();
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      newPage.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    await expect(page).isHomePage();
    await expect(newPage).isErrorPage();
  });
});
