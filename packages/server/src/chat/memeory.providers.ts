import { Provider } from '@nestjs/common';
import { Connected, Rooms } from '@/typings';

export enum MemeoryStorage {
  Rooms = 'Rooms',
  Connected = 'Connected'
}

const rooms: Rooms = new Map();
const connected: Connected = new Map();

export const memeoryStorageProviders: Provider[] = [
  {
    provide: MemeoryStorage.Rooms,
    useValue: rooms
  },
  {
    provide: MemeoryStorage.Connected,
    useValue: connected
  }
];
