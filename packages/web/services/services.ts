import axios from 'axios';
import {
  Param$GetMatches,
  Param$GetMatch,
  Param$CreateMatch,
  Param$JoinMatch,
  Param$UpdatePlayerMeta,
  Param$LeaveMatch,
  Param$PlayAgain,
  Response$GetMatches,
  Response$GetMatch
} from '../typings';

const api = axios.create({
  baseURL: '/'
});

export function getAllGames() {
  return api.get<string[]>('/games');
}

export function getMatches({ name, ...params }: Param$GetMatches) {
  return api.get<Response$GetMatches>(`/games/${name}`, { params });
}

export function getMatch({ name, matchID }: Param$GetMatch) {
  return api.get<Response$GetMatch>(`/games/${name}/${matchID}`);
}

export function createMatch({ name, ...params }: Param$CreateMatch) {
  return api.post<{ matchID: string }>(`/games/${name}/create`, params);
}

export function joinMatch({ name, matchID, ...params }: Param$JoinMatch) {
  return api.post<{ playerCredentials: string }>(
    `/games/${name}/${matchID}/join`,
    params
  );
}

export function updatePlayerMeta({
  name,
  matchID,
  ...params
}: Param$UpdatePlayerMeta) {
  return api.post<unknown>(`/games/${name}/${matchID}/update`, params);
}

export function leaveMatch({ name, matchID, ...params }: Param$LeaveMatch) {
  return api.post(`/games/${name}/${matchID}/leave`, params);
}

export function playAgain({ name, matchID, ...params }: Param$PlayAgain) {
  return api.post<{ nextMatchID: string }>(
    `/games/${name}/${matchID}/playAgain`,
    params
  );
}
