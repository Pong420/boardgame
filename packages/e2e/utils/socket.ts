import { Page, CDPSession } from 'puppeteer';

// https://stackoverflow.com/a/54110660/9633867
// https://chromedevtools.github.io/devtools-protocol/tot/Network#event-webSocketClosed

export type WaitForSocketEvent =
  | 'Created'
  | 'Close'
  | 'FrameSent'
  | 'FrameReceived'
  | 'FrameError';

interface Frame {
  opcode: number;
  mask: boolean;
  payloadData: string;
}

interface Created {
  requestId: string;
  url: string;
}

interface Closed {
  requestId: string;
  timestamp: number;
}

interface Message {
  requestId: string;
  timestamp: number;
  response: Frame;
}

interface Error {
  requestId: string;
  timestamp: number;
  errorMessage: string;
}

export function waitForSocket(page: Page, event: 'Created'): Promise<Created>;
export function waitForSocket(page: Page, event: 'Close'): Promise<Closed>;
export function waitForSocket(page: Page, event: 'FrameSent'): Promise<Message>;
// prettier-ignore
export function waitForSocket(page: Page, event: 'FrameReceived'): Promise<Message>;
export function waitForSocket(page: Page, event: 'FrameError'): Promise<Error>;

export function waitForSocket(page: Page, suffix: WaitForSocketEvent) {
  let timeout: NodeJS.Timeout;
  const event = `Network.webSocket${suffix}`;

  return new Promise((resolve, reject) => {
    const client: CDPSession = (page as any)._client;

    const handler = (args: any) => {
      client.off(event, handler);
      clearTimeout(timeout);
      resolve(args);
    };

    client.on(event, handler);

    timeout = setTimeout(() => {
      client.off(event, handler);
      reject(new Error('waitForSocket timeout'));
    }, 1 * 60 * 1000);
  });
}
