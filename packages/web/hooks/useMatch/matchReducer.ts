import { MessageType, Schema$Message, WsPlayer } from '@/typings';

export interface UseMatchState {
  started: boolean;
  list: string[];
  unread: string[];
  group: string[][];
  byIds: Record<string, Schema$Message>;
  players: (WsPlayer | null)[];
}

interface Create {
  type: 'Create';
  payload: Schema$Message | Schema$Message[];
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
  payload: (WsPlayer | null)[];
}

interface ReadMessage {
  type: 'ReadMessage';
  payload: string;
}

interface Ready {
  type: 'Ready';
  payload: string;
}

export type UseMatchActions =
  | Create
  | Update
  | Reset
  | UpdatePlayer
  | ReadMessage
  | Ready;

export const initialState: UseMatchState = {
  started: false,
  list: [],
  unread: [],
  group: [],
  players: [],
  byIds: {}
};

function isMatchStarted(players: UpdatePlayer['payload'], playerID?: string) {
  return players.reduce(
    (state, p) => {
      const player =
        p && (p.playerID === playerID ? { ...p, ready: !p.ready } : p);
      return {
        ...state,
        players: [...state.players, player],
        started: state.started && !!player?.ready
      };
    },
    { players: [], started: true } as Pick<UseMatchState, 'players' | 'started'>
  );
}

export function matchReducer(
  state = initialState,
  action: UseMatchActions
): UseMatchState {
  switch (action.type) {
    case 'Create':
      return (() => {
        if (Array.isArray(action.payload)) {
          return action.payload.reduce(
            (state, payload) =>
              matchReducer(state, { type: 'Create', payload }),
            state
          );
        }

        const { id } = action.payload;

        // for development fast refresh
        if (state.list.includes(id)) {
          console.warn('duplicate id', action.payload.content);
          return state;
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
      return {
        ...state,
        ...isMatchStarted(action.payload)
      };

    case 'Ready':
      return {
        ...state,
        ...isMatchStarted(state.players, action.payload)
      };

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
