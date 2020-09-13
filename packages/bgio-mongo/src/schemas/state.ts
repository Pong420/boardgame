import { State as IState, Ctx, LogEntry } from 'boardgame.io';
import {
  prop,
  getModelForClass,
  modelOptions,
  Severity
} from '@typegoose/typegoose';
import { Schema } from 'mongoose';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class State<G extends any = any, CtxWithPlugins extends Ctx = Ctx> {
  @prop({ type: String, required: true })
  matchID: string;

  @prop({ type: Schema.Types.Mixed })
  G: G;

  @prop({ type: Schema.Types.Mixed })
  ctx: Ctx | CtxWithPlugins;

  @prop({ type: Schema.Types.Mixed })
  deltalog?: LogEntry[];

  @prop({ type: Schema.Types.Mixed })
  plugins: {
    [pluginName: string]: any;
  };

  @prop({ type: Schema.Types.Mixed })
  _undo: IState['_undo'];

  @prop({ type: Schema.Types.Mixed })
  _redo: IState['_undo'];

  @prop({ type: Number })
  _stateID: number;
}

export const StateModel = getModelForClass(State);
export const InitialStateModel = getModelForClass(State);
