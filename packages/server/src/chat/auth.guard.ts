import { WsException } from '@nestjs/websockets';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { IdentifyDto } from './dto';
import { Rooms } from './types';

export class AuthGuard implements CanActivate {
  constructor(private readonly rooms: Rooms) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToWs().getData() || {};
    const dto = plainToClass(IdentifyDto, data);
    const errors = await validate(dto);

    if (errors.length) {
      throw new WsException(errors);
    }

    const { matchID, playerID, credentials } = dto;

    if (this.rooms.has(matchID)) {
      const { players } = this.rooms.get(matchID);
      const player = players[Number(playerID)];
      if (player && player.credentials === credentials) {
        return true;
      }
      throw new WsException('Invalid credentials');
    }
    throw new WsException('Invalid matchID');
  }
}
