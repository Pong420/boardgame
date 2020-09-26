import React, { useEffect, useReducer, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Schema$Message } from '@/typings';

interface State {
  group: string[][];
  byIds: Record<string, Schema$Message>;
}

interface Create {
  type: 'Create';
  payload: Schema$Message;
}

interface Update {
  type: 'Update';
  payload: Schema$Message;
}

type Actions = Create | Update;

const initialState: State = { group: [], byIds: {} };

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<
  React.Dispatch<Actions> | undefined
>(undefined);

function reducer(state = initialState, action: Actions) {
  switch (action.type) {
    case 'Create':
      let { group } = state;
      const last = group.slice(-1)[0] || [];
      const msg = state.byIds[last[0]];

      if (
        msg &&
        msg.type === action.payload.type &&
        msg.playerID === action.payload.playerID
      ) {
        group = [
          ...group.slice(0, group.length - 1),
          [...last, action.payload.id]
        ];
      } else {
        group = [...group, [action.payload.id]];
      }

      return {
        ...state,
        group,
        byIds: { ...state.byIds, [action.payload.id]: action.payload }
      };

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

  useEffect(() => {
    const subscription = subject.subscribe(state => {
      const newMsg = state.byIds[id];
      setMsg(msg => (msg?.status === newMsg?.status ? msg : newMsg));
    });
    return () => subscription.unsubscribe();
  }, [id]);

  return msg;
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
