import { State } from 'boardgame.io';
import mongoose, { Schema, Document } from 'mongoose';

const StateSchema = new Schema(
  {
    matchID: { type: String, required: true, unique: true },
    G: { type: Schema.Types.Mixed, required: true },
    ctx: { type: Schema.Types.Mixed, required: true },
    deltalog: { type: Schema.Types.Mixed },
    plugins: { type: Schema.Types.Mixed },
    _undo: { type: Schema.Types.Mixed },
    _redo: { type: Schema.Types.Mixed },
    _stateID: { type: Schema.Types.Mixed }
  },
  {
    toJSON: {
      versionKey: false,
      transform: (_, { _id, ...rest }) => rest
    }
  }
);

export const StateModel = mongoose.model<State & Document>(
  'State',
  StateSchema
);

export const InitialStateModel = mongoose.model<State & Document>(
  'InitialState',
  StateSchema
);
