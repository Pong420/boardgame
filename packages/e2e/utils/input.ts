import { ElementHandle } from 'puppeteer';

export const handleCheckbox = async (el: ElementHandle, value: boolean) => {
  const checked = await el.evaluate(c => (c as HTMLInputElement).checked);
  if (checked !== value) await el.click();
};

export const handleSwitch = async (el: ElementHandle, value: boolean) => {
  const checked = await el.evaluate(c => (c as HTMLInputElement).checked);
  if (checked !== value) await el.evaluate(el => el.parentElement?.click());
};

export const fillText = async (
  el: ElementHandle,
  value: string,
  clear = true
) => {
  if (clear) {
    await el.focus();
    await el.evaluate(el =>
      (el as HTMLInputElement).setSelectionRange(0, 999999999)
    );
  }
  await el.type(value, { delay: 50 });
};
