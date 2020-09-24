import { Page, HttpMethod } from 'puppeteer';

export type ResponseType =
  | 'get-matches'
  | 'get-match'
  | 'create-match'
  | 'join-match'
  | 'leave-match'
  | 'play-again';

function creator(waitFor: 'request' | 'response') {
  return (page: Page, type: ResponseType, ok = true) => {
    function handler(regex: RegExp, method: HttpMethod) {
      if (waitFor === 'request') {
        return page.waitForRequest(
          req => req.method() === method && regex.test(req.url())
        );
      } else {
        return page.waitForResponse(
          res =>
            res.ok() === ok &&
            res.request().method() === method &&
            regex.test(res.url())
        );
      }
    }

    switch (type) {
      case 'get-matches':
        return handler(/api\/match\/.*(?!\/)/, 'GET');

      case 'get-match':
        return handler(/api\/match\/.*\/.*(?!\/)/, 'GET');

      case 'create-match':
        return handler(/api\/match\/create$/, 'POST');

      case 'join-match':
        return handler(/api\/match\/join$/, 'POST');

      case 'leave-match':
        return handler(/api\/match\/leave$/, 'POST');

      case 'play-again':
        return handler(/api\/match\/playAgain$/, 'POST');

      default:
        throw new Error('incorrect type');
    }
  };
}

export const waitForRequest = creator('request');
export const waitForResponse = creator('response');
