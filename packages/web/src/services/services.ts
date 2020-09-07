import axios from 'axios';
import {
  Params$GetMatches,
  Params$GetMatch,
  Params$CreateMatch,
  Params$JoinMatch,
  Params$UpdatePlayerMeta,
  Params$LeaveMatch,
  Response$GetMatches,
  Response$GetMatch
} from '../typings';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/'
});

export function getAllGames() {
  return api.get<string[]>('/games');
}

export function getMatches({ name }: Params$GetMatches) {
  return api.get<Response$GetMatches>(`/games/${name}`);
}

export function getMatch({ name, matchID }: Params$GetMatch) {
  return api.get<Response$GetMatch>(`/games/${name}/${matchID}`);
}

export function createMatch({ name, ...params }: Params$CreateMatch) {
  return api.post<{ matchID: string }>(`/games/${name}/create`, params);
}

export function joinMatch({ name, matchID, ...params }: Params$JoinMatch) {
  return api.post<{ playerCredentials: string }>(
    `/games/${name}/${matchID}/join`,
    params
  );
}

export function updatePlayerMeta({
  name,
  matchID,
  ...params
}: Params$UpdatePlayerMeta) {
  // TODO:
  return api.post<unknown>(`/games/${name}/${matchID}/update`, params);
}

export function leaveMatch({ name, matchID, ...params }: Params$LeaveMatch) {
  return api.post(`/games/${name}/${matchID}/leave`, params);
}
