import { Page } from 'puppeteer';
import { createMatch, clickJoinButton, leaveMatch } from '@/utils/match';
import { newPageHelper } from '@/utils/page';

describe('others', () => {
  test('only allow one screen at a time', async () => {
    let count = 0;
    const waitForNavigation = async (page: Page) => {
      try {
        await page.waitForNavigation({
          waitUntil: 'networkidle2',
          timeout: 2000
        });
        count++;
      } catch (error) {
        throw new Error(`waitForNavigation fail at ${count}`);
      }
    };

    await expect(page).goto('/');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await expect(page).isHomePage();

    const newPage = await browser.newPage();
    await expect(newPage).goto('/');
    await Promise.all([
      //
      waitForNavigation(page),
      waitForNavigation(newPage)
    ]);

    await expect(page).isErrorPage();
    await expect(newPage).isHomePage();

    // should not changed
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    await expect(page).isErrorPage();
    await expect(newPage).isHomePage();

    // should changed
    await page.bringToFront();
    await expect(page).goBack();
    await Promise.all([
      //
      waitForNavigation(page),
      waitForNavigation(newPage)
    ]);

    await expect(page).isHomePage();
    await expect(newPage).isErrorPage();
  });

  test('Invitation', async () => {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      expect(page).goto('/lobby/tic-tac-toe')
    ]);
    await createMatch({ playerName: 'e2e', matchName: 'Invitation' });
    const share = await page.waitForXPath(`//button[.//span[@icon="share"]]`);
    await share.focus();
    await share.click();

    await page.waitForTimeout(300);

    const copy = await page.waitForXPath(`//button[.//*[text()="Copy"]]`);
    await copy.focus();
    await copy.click();

    await expect(copy.evaluate(el => el.textContent)).resolves.toBe('Copied');
    await context.overridePermissions(testUrl, ['clipboard-read']);
    const copiedText = await (page.evaluate(
      `(async () => await navigator.clipboard.readText())()`
    ) as Promise<string>);
    const [input] = await page.$x(`//input[@value="${copiedText}"]`);

    expect(input).toBeDefined();

    const [closeBtn] = await page.$x(
      `//h4[text()="Share"]/following-sibling::button`
    );
    await closeBtn.focus();
    await closeBtn.click();
    await page.waitForTimeout(300);

    await newPageHelper('/')(async page => {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.goto(copiedText)
      ]);
      await expect(page).isInvitationPage();

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        clickJoinButton(page, page)
      ]);
      await expect(page).isMatchPage();
    });

    await leaveMatch();
  });
});
