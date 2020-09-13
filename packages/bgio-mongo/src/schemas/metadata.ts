import { prop, getModelForClass } from '@typegoose/typegoose';
import { StorageAPI } from 'boardgame.io';

export type IPlayers = StorageAPI.CreateGameOpts['metadata']['players'];
export type IPlayerMetadata = IPlayers[number];
export type IMetadata = StorageAPI.CreateGameOpts['metadata'];

export class Metadata<SetupData = any> implements IMetadata {
  @prop({ type: String, required: true, unique: true })
  matchID: string;

  @prop({ type: String, required: true })
  gameName: string;

  @prop({ required: true })
  players: IPlayers;

  @prop()
  setupData?: SetupData;

  @prop()
  gameover?: unknown;

  @prop({ type: String })
  nextMatchID?: string;

  @prop({ type: Boolean })
  unlisted?: boolean;

  @prop({ type: Number })
  createdAt: number;

  @prop({ type: Number })
  updatedAt: number;
}

export const MetadataModel = getModelForClass(Metadata);
