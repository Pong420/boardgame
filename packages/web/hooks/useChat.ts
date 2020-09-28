import React, { useEffect, useReducer, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { MessageType, Schema$Message, WS$Player } from '@/typings';

interface State {
  list: string[];
  unread: string[];
  group: string[][];
  byIds: Record<string, Schema$Message>;
  players: (WS$Player | null)[];
}

interface Create {
  type: 'Create';
  payload: Schema$Message;
}

interface Update {
  type: 'Update';
  payload: Schema$Message;
}

interface Reset {
  type: 'Reset';
}

interface UpdatePlayer {
  type: 'UpdatePlayer';
  payload: State['players'];
}

interface ReadMessage {
  type: 'ReadMessage';
  payload: string;
}

type Actions = Create | Update | Reset | UpdatePlayer | ReadMessage;

const initialState: State = {
  list: [],
  unread: [],
  group: [],
  byIds: {},
  players: []
};

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<
  React.Dispatch<Actions> | undefined
>(undefined);

function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case 'Create':
      return (() => {
        const { id } = action.payload;

        // for development fast refresh
        if (state.list.includes(id)) {
          console.warn('duplicate id', action.payload.content);
          return reducer(state, { ...action, type: 'Update' });
        }

        let { group } = state;
        const last = group.slice(-1)[0] || [];
        const msg = state.byIds[last[0]];

        if (
          msg &&
          msg.type === MessageType.CHAT &&
          action.payload.type === MessageType.CHAT &&
          msg.playerID === action.payload.playerID &&
          msg.playerName === action.payload.playerName
        ) {
          group = [...group.slice(0, group.length - 1), [...last, id]];
        } else {
          group = [...group, [id]];
        }

        return {
          ...state,
          group,
          list: [...state.list, id],
          unread: [...state.unread, id],
          byIds: {
            ...state.byIds,
            [id]: action.payload
          }
        };
      })();

    case 'Update':
      return (() => {
        const { id } = action.payload;
        return {
          ...state,
          byIds: {
            ...state.byIds,
            [id]: { ...state.byIds[id], ...action.payload }
          }
        };
      })();

    case 'UpdatePlayer':
      return (() => {
        return {
          ...state,
          players: action.payload
        };
      })();

    case 'ReadMessage':
      return (() => {
        const idx = state.unread.indexOf(action.payload);
        if (idx >= 0) {
          return {
            ...state,
            unread: [
              ...state.unread.slice(0, idx),
              ...state.unread.slice(idx + 1)
            ]
          };
        }
        return state;
      })();

    case 'Reset':
      return initialState;

    default:
      throw new Error(`invalid action type`);
  }
}

export function useChatState() {
  const context = React.useContext(StateContext);
  if (context === undefined) {
    throw new Error('useChatState must be used within a ChatProvider');
  }
  return context;
}

export function useChatDispatch() {
  const context = React.useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useChatDispatch must be used within a ChatProvider');
  }
  return context;
}

export function useChat() {
  return [useChatState(), useChatDispatch()] as const;
}

const subject = new BehaviorSubject(initialState);

export function useChatMessage(id: string) {
  const [msg, setMsg] = useState<Schema$Message>();
  const [unread, setUnread] = useState<boolean>(false);

  useEffect(() => {
    const subscription = subject.subscribe(state => {
      const newMsg = state.byIds[id];
      setMsg(msg => (msg?.status === newMsg?.status ? msg : newMsg));
      setUnread(state.unread.includes(id));
    });
    return () => subscription.unsubscribe();
  }, [id]);

  return [msg, unread] as const;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    subject.next(state);
  }, [state]);

  return React.createElement(
    StateContext.Provider,
    { value: state },
    React.createElement(DispatchContext.Provider, { value: dispatch }, children)
  );
}
