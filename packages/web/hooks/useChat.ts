import React, { useEffect, useReducer, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { MessageType, Schema$Message, WSResponse$Player } from '@/typings';

interface Message extends Schema$Message {
  playerName: string;
}

interface State {
  list: string[];
  group: string[][];
  byIds: Record<string, Message>;
  players: Record<string, WSResponse$Player>;
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
  payload: WSResponse$Player;
}

type Actions = Create | Update | Reset | UpdatePlayer;

const initialState: State = { list: [], group: [], byIds: {}, players: {} };

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<
  React.Dispatch<Actions> | undefined
>(undefined);

function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case 'Create':
      return (() => {
        const { id, type, playerID } = action.payload;
        if (state.list.includes(id)) {
          return reducer(state, { ...action, type: 'Update' });
        }

        let { group } = state;
        const last = group.slice(-1)[0] || [];
        const msg = state.byIds[last[0]];

        if (
          msg &&
          msg.type === type &&
          msg.type === MessageType.CHAT &&
          msg.playerID === playerID
        ) {
          group = [...group.slice(0, group.length - 1), [...last, id]];
        } else {
          group = [...group, [id]];
        }

        return {
          ...state,
          group,
          list: [...state.list, id],
          byIds: {
            ...state.byIds,
            [id]: {
              ...action.payload,
              playerName: state.players[action.payload.playerID]?.playerName
            }
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
          players: {
            ...state.players,
            [action.payload.playerID]: action.payload
          }
        };
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
  const [msg, setMsg] = useState<Message>();

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
