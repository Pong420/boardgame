import { StorageAPI } from 'boardgame.io';
import mongoose, { Schema, Document } from 'mongoose';

export type IPlayers = StorageAPI.CreateGameOpts['metadata']['players'];
export type IPlayerMetadata = IPlayers[number];
export type IMetadata = StorageAPI.CreateGameOpts['metadata'];

export interface Metadata extends IMetadata, Document {
  matchID: string;
}

const MetadataSchema = new Schema<Metadata>(
  {
    matchID: { type: String, required: true, unique: true },
    gameName: { type: String, required: true },
    players: { type: Schema.Types.Mixed, required: true },
    setupData: { type: Schema.Types.Mixed },
    gameover: { type: Schema.Types.Mixed },
    nextMatchID: { type: String },
    unlisted: { type: Boolean },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  },
  {
    toJSON: {
      versionKey: false,
      transform: (_, { _id, ...rest }) => rest
    }
  }
);

export const MetadataModel = mongoose.model<Metadata>(
  'Metadata',
  MetadataSchema
);
