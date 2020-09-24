import axios from 'axios';
import {
  Param$GetMatches,
  Param$GetMatch,
  Param$CreateMatch,
  Param$JoinMatch,
  Param$LeaveMatch,
  Param$PlayAgain,
  Response$GetMatches,
  Response$GetMatch,
  Response$JoinMatch,
  Response$PlayAgain
} from '@/typings';

const api = axios.create({
  baseURL: '/api'
});

export function getMatches(params: Param$GetMatches) {
  return api.get<Response$GetMatches>(`/match/${params.name}`, { params });
}

export function getMatch({ name, matchID }: Param$GetMatch) {
  return api.get<Response$GetMatch>(`/match/${name}/${matchID}`);
}

export function createMatch(payload: Param$CreateMatch) {
  return api.post<Response$GetMatch>(`/match/create`, payload);
}

export function joinMatch(payload: Param$JoinMatch) {
  return api.post<Response$JoinMatch>(`/match/join`, payload);
}

export function leaveMatch(payload: Param$LeaveMatch) {
  return api.post(`/match/leave`, payload);
}

export function playAgain(params: Param$PlayAgain) {
  return api.post<Response$PlayAgain>(`/match/playAgain`, params);
}
