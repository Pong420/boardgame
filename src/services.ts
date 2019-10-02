import axios from 'axios';
import {
  Params$CreateRoom,
  Params$JoinRoom,
  Params$LeaveRoom,
  Params$GetAllRoom,
  Params$GetRoom,
  Response$GetAllRoom
} from './typings';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/'
});

export function createRoom({ name, ...params }: Params$CreateRoom) {
  return api.post(`/games/${name}/create`, params);
}

export function joinRoom({ name, roomID, ...params }: Params$JoinRoom) {
  return api.post(`/games/${name}/${roomID}/join`, params);
}

export function leveRoom({ name, roomID, ...params }: Params$LeaveRoom) {
  return api.post(`/games/${name}/${roomID}/leave`, params);
}

export function getAllGames() {
  return api.get<string[]>('/games');
}

export function getAllRoom({ name }: Params$GetAllRoom) {
  return api.get<Response$GetAllRoom>(`/games/${name}`);
}

export function getRoom({ name, roomID }: Params$GetRoom) {
  return api.get(`/games/${name}/${roomID}`);
}
