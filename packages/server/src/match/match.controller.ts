import {
  Controller,
  Post,
  Body,
  Inject,
  NotFoundException,
  Get,
  Param,
  Query,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { Player, Response$GetMatches } from '@/typings';
import { Game, Server } from 'boardgame.io';
import { InitializeGame } from 'boardgame.io/internal';
import { nanoid } from 'nanoid';
import {
  CreateMatchDto,
  JoinMatchDto,
  LeaveMatchDto,
  PlayAgainDto,
  GetMatchesDto
} from './dto';
import {
  SetupData,
  Response$GetMatch,
  Response$CreateMatch,
  Response$JoinMatch,
  Response$PlayAgain
} from '@/typings';
import { MatchService } from './match.service';

@Controller('/api/match')
export class MatchController {
  gameMap: Record<string, Game>;

  constructor(
    private readonly matchService: MatchService,
    @Inject('GAMES') private games: Game[]
  ) {
    this.gameMap = this.games.reduce(
      (result, game) => ({ ...result, [game.name]: game }),
      {} as Record<string, Game>
    );
  }

  /**
   * Create a metadata object without secret credentials to return to the client.
   *
   * @param {string} matchID - The identifier of the match the metadata belongs to.
   * @param {object} metadata - The match metadata object to strip credentials from.
   * @return - A metadata object without player credentials.
   */
  createClientMatchData = (
    matchID: string,
    metadata: Server.MatchData
  ): Response$GetMatch => {
    if (metadata.setupData) {
      return {
        ...metadata,
        matchID,
        unlisted: !!metadata.unlisted,
        setupData: metadata.setupData as SetupData,
        players: Object.values(metadata.players).map(player => {
          // strip away credentials
          const { credentials, ...strippedInfo } = player;
          return strippedInfo;
        })
      };
    }
    throw new Error('setupData is not defined');
  };

  @Get('/:name')
  async getMatches(@Query() dto: GetMatchesDto): Promise<Response$GetMatches> {
    const metadata = await this.matchService.getMatches(dto);
    return {
      matches: metadata.map(meta =>
        this.createClientMatchData(meta.matchID, meta.toJSON())
      )
    };
  }

  @Get('/:name/:matchID')
  async getMatch(
    @Param('matchID') matchID: string
  ): Promise<Response$GetMatch> {
    const { metadata } = await this.matchService.fetch(matchID, {
      metadata: true
    });

    if (metadata) {
      return this.createClientMatchData(matchID, metadata);
    }

    throw new NotFoundException('Match not found');
  }

  @Post('create')
  async createMatch(
    @Body() dto: CreateMatchDto
  ): Promise<Response$CreateMatch> {
    const game = this.gameMap[dto.name];

    if (game) {
      const { numPlayers, setupData, unlisted } = dto;
      const players = Array.from<null>({ length: numPlayers }).reduce(
        (players, _, idx) => ({ ...players, [idx]: { id: idx } }),
        {} as Record<number, Player>
      );
      const metadata: Server.MatchData = {
        players,
        gameName: game.name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        unlisted: !!unlisted,
        setupData: {
          ...setupData,
          canceled: false
        }
      };

      const matchID = nanoid();
      const initialState = InitializeGame({ game, numPlayers, setupData });

      await this.matchService.createGame(matchID, { metadata, initialState });

      return { matchID };
    }

    throw new NotFoundException('Game not found');
  }

  @Post('join')
  async joinMatch(@Body() dto: JoinMatchDto): Promise<Response$JoinMatch> {
    const { matchID, playerID, playerName } = dto;
    const match = await this.matchService.fetch(dto.matchID, {
      metadata: true
    });

    if (match) {
      const metadata = { ...match.metadata };
      const player = metadata.players[Number(playerID)];

      if (player && player.credentials) {
        throw new BadRequestException('Invalid PlayerID');
      }

      const playerCredentials = nanoid();
      player.name = playerName;
      player.credentials = playerCredentials;

      await this.matchService.setMetadata(matchID, metadata);

      return { playerCredentials };
    }

    throw new NotFoundException('Match not found');
  }

  @Post('leave')
  async leaveMatch(@Body() dto: LeaveMatchDto): Promise<void> {
    await this.matchService.leaveMatch(dto);
  }

  @Post('playAgain')
  async playAgain(@Body() dto: PlayAgainDto): Promise<Response$PlayAgain> {
    const { matchID, playerID, credentials, name } = dto;
    const { metadata } = await this.matchService.fetch(matchID, {
      metadata: true
    });

    if (credentials !== metadata.players[playerID].credentials) {
      throw new ForbiddenException('Invalid credentials ' + credentials);
    }

    if (metadata.nextMatchID) {
      return { nextMatchID: metadata.nextMatchID };
    }

    const numPlayers = Object.keys(metadata.players).length;

    const unlisted = !!metadata.unlisted;

    const { matchID: nextMatchID } = await this.createMatch({
      name,
      numPlayers,
      unlisted: true,
      setupData: metadata.setupData as SetupData
    });

    metadata.nextMatchID = nextMatchID;

    await this.matchService.setMetadata(matchID, metadata);

    if (!unlisted) {
      this.matchService.publicMatch$.next(nextMatchID);
    }

    return { nextMatchID };
  }
}
