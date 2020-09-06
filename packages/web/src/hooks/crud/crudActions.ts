/* eslint-disable @typescript-eslint/ban-types */

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
export type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

export type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export type Key<I> = AllowedNames<I, string>;

export interface AnyAction {
  type: string;
  [extraProps: string]: any;
}

export interface ActionCreators {
  [k: string]: (...args: any[]) => AnyAction;
}

export interface List<I> {
  type: 'LIST';
  payload: I[];
}

export interface Create<I> {
  type: 'CREATE';
  payload: I;
}

export type OnUpdate<I, K extends Key<I>> = (
  payload: Partial<I> & { [T in K]: string }
) => void;

export interface Update<I, K extends Key<I>> {
  type: 'UPDATE';
  payload: Partial<I> & { [T in K]: string };
}

export interface Delete<I, K extends Key<I>> {
  type: 'DELETE';
  payload: { [T in K]: string };
}

export type PaginatePayload<I> =
  | I[]
  | {
      data: I[];
      total: number;
      pageNo: number;
      pageSize?: number;
    };

export interface Paginate<I> {
  type: 'PAGINATE';
  payload: PaginatePayload<I>;
}

export interface Params {
  type: 'PARAMS';
  payload: any;
}

export interface Reset {
  type: 'RESET';
}

export type CRUDActions<I, K extends Key<I>> =
  | List<I>
  | Create<I>
  | Update<I, K>
  | Delete<I, K>
  | Paginate<I>
  | Params
  | Reset;

export type ExtractAction<
  T1 extends AnyAction,
  T2 extends T1['type']
> = T1 extends { type: T2 } ? T1 : never;

export type ActionCreator<
  T1 extends { type: string; payload?: unknown }
> = ExtractAction<T1, T1['type']> extends { payload: any }
  ? (payload: ExtractAction<T1, T1['type']>['payload']) => T1
  : (payload?: ExtractAction<T1, T1['type']>['payload']) => T1;

export type CRUDActionCreators<I, K extends Key<I>> = {
  list: ActionCreator<List<I>>;
  create: ActionCreator<Create<I>>;
  update: ActionCreator<Update<I, K>>;
  delete: ActionCreator<Delete<I, K>>;
  paginate: ActionCreator<Paginate<I>>;
  params: ActionCreator<Params>;
  reset: ActionCreator<Reset>;
};

export function createCRUDActionsCreators<
  I,
  K extends Key<I>
>(): CRUDActionCreators<I, K> {
  return {
    list: payload => ({ type: 'LIST', payload }),
    create: payload => ({ type: 'CREATE', payload }),
    update: payload => ({ type: 'UPDATE', payload }),
    delete: payload => ({ type: 'DELETE', payload }),
    paginate: payload => ({ type: 'PAGINATE', payload }),
    params: payload => ({ type: 'PARAMS', payload }),
    reset: () => ({ type: 'RESET' })
  };
}
