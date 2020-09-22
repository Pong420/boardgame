// https://github.com/ambelovsky/koa-socket-2/issues/16#issuecomment-525778816

declare module 'koa-socket-2' {
  import Application from 'koa';
  import { ServerOptions as HttpsServerOptions } from 'https';
  import { RouterContext } from 'koa-router';
  import { ServerOptions as SocketioServerOptions, Socket } from 'socket.io';

  interface IOptions {
    namespace?: string;
    hidden?: boolean;
    ioOptions?: SocketioServerOptions;
  }

  interface Context extends RouterContext {
    socket: Socket;
  }

  type IEventHandler = (ctx: Context) => any;
  type Middleware = (ctx: Context, next: () => Promise<any>) => any;

  class IO {
    public opts: IOptions;
    public connections: Map<string, any>;
    private _io: Socket;
    private middleware: Middleware[];
    private composed: any;
    private listeners: Map<string, any>;
    private socket: any;

    constructor(opts: undefined | string | IOptions);
    public attach(
      app: Application,
      https?: boolean,
      opts?: HttpsServerOptions
    ): void;
    public attachNamespace(app: Application, id: string): void;
    public use(fn: Middleware): this;
    public on(event: string, handler: IEventHandler): this;
    public off(event: string, handler: IEventHandler): this;
    public broadcast(event: string, data: any): void;
    public to(room: string): any;
    private onConnection(sock: Socket): void;
    private onDisconnect(sock: Socket): void;
    private updateConnections(): void;
  }

  export = IO;
}
