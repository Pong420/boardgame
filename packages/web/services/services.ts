import axios from 'axios';
import {
  Params$GetMatches,
  Params$GetMatch,
  Params$CreateMatch,
  Params$JoinMatch,
  Params$UpdatePlayerMeta,
  Params$LeaveMatch,
  Params$PlayAgain,
  Response$GetMatches,
  Response$GetMatch
} from '../typings';

const api = axios.create({
  baseURL: '/'
});

export function getAllGames() {
  return api.get<string[]>('/games');
}

export function getMatches({ name, ...params }: Params$GetMatches) {
  return api.get<Response$GetMatches>(`/games/${name}`, { params });
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
  return api.post<unknown>(`/games/${name}/${matchID}/update`, params);
}

export function leaveMatch({ name, matchID, ...params }: Params$LeaveMatch) {
  return api.post(`/games/${name}/${matchID}/leave`, params);
}

export function playAgain({ name, matchID, ...params }: Params$PlayAgain) {
  return api.post<{ nextMatchID: string }>(
    `/games/${name}/${matchID}/playAgain`,
    params
  );
}
