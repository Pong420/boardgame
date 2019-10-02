import axios from 'axios';
import {
  Params$CreateRoom,
  Params$JoinRoom,
  Params$LeaveRoom,
  Params$GetAllRoom,
  Params$GetRoom
} from './typings';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/'
});

export function createRoom({ name }: Params$CreateRoom) {
  return api.post(`/games/${name}/create`, {});
}

export function joinRoom({ name, roomID }: Params$JoinRoom) {
  return api.post(`/games/${name}/${roomID}/join`, {});
}

export function leveRoom({ name, roomID }: Params$LeaveRoom) {
  return api.post(`/games/${name}/${roomID}/leave`, {});
}

export function getAllGames() {
  return api.get<string[]>('/games');
}

export function getAllRoom({ name }: Params$GetAllRoom) {
  return api.get(`/games/${name}`);
}

export function getRoom({ name, roomID }: Params$GetRoom) {
  return api.get(`/games/${name}/${roomID}`);
}
