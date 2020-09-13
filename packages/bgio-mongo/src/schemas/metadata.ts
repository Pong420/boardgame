import {
  prop,
  getModelForClass,
  modelOptions,
  Severity
} from '@typegoose/typegoose';
import { StorageAPI } from 'boardgame.io';
import { Schema } from 'mongoose';

export type IPlayers = StorageAPI.CreateGameOpts['metadata']['players'];
export type IPlayerMetadata = IPlayers[number];
export type IMetadata = StorageAPI.CreateGameOpts['metadata'];

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Metadata<SetupData = any> implements IMetadata {
  @prop({ type: String, required: true, unique: true })
  matchID: string;

  @prop({ type: String, required: true })
  gameName: string;

  @prop({ type: Schema.Types.Mixed, required: true })
  players: IPlayers;

  @prop({ type: Schema.Types.Mixed })
  setupData?: SetupData;

  @prop({ type: Schema.Types.Mixed })
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
