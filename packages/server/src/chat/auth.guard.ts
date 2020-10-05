import { WsException } from '@nestjs/websockets';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Rooms } from '@/typings';
import { IdentifyDto } from './dto';
import { MemeoryStorage } from './memeory.providers';

export async function authenticate(
  rooms: Rooms,
  payload: unknown
): Promise<IdentifyDto> {
  const identify = plainToClass(
    IdentifyDto,
    payload && typeof payload === 'object' ? payload : {}
  );

  const errors = await validate(identify);

  if (errors.length) {
    throw new WsException(errors);
  }

  const { matchID, playerID, credentials } = identify;

  if (rooms.has(matchID)) {
    const { players } = rooms.get(matchID);
    const player = players[Number(playerID)];
    if (player && player.credentials === credentials && !player.leave) {
      return identify;
    }
    throw new WsException('Invalid credentials');
  }
  throw new WsException('Invalid matchID');
}

export class AuthGuard implements CanActivate {
  constructor(@Inject(MemeoryStorage.Rooms) private readonly rooms: Rooms) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToWs().getData();
    const identify = await authenticate(this.rooms, data);
    return !!identify;
  }
}
