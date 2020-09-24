import { Page } from 'puppeteer';
import {
  waitForResponse as resHelper,
  waitForRequest as reqHelper,
  ResponseType
} from '@/utils/waitForReqRes';

export async function waitForResponse(
  this: jest.MatcherContext,
  page: Page,
  type: ResponseType,
  ok = true
): Promise<jest.CustomMatcherResult> {
  try {
    await resHelper(page, type, ok);
    return {
      message: () => `success`,
      pass: true
    };
  } catch (error) {
    return {
      message: () => error,
      pass: false
    };
  }
}
export async function waitForRequest(
  this: jest.MatcherContext,
  page: Page,
  type: ResponseType,
  ok = true
): Promise<jest.CustomMatcherResult> {
  try {
    await reqHelper(page, type, ok);
    return {
      message: () => `success`,
      pass: true
    };
  } catch (error) {
    return {
      message: () => error,
      pass: false
    };
  }
}

expect.extend({
  waitForResponse,
  waitForRequest
});
