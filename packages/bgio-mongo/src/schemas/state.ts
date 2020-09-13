import { State as IState, Ctx } from 'boardgame.io';
import { prop, getModelForClass } from '@typegoose/typegoose';
import { Log } from './log';

export class State<G extends any = any, CtxWithPlugins extends Ctx = Ctx> {
  @prop({ type: String, required: true })
  matchID: string;

  @prop()
  G: G;

  @prop()
  ctx: Ctx | CtxWithPlugins;

  @prop({ type: () => [Log] })
  deltalog?: Log[];

  @prop()
  plugins: {
    [pluginName: string]: any;
  };

  @prop()
  _undo: IState['_undo'];

  @prop()
  _redo: IState['_undo'];

  @prop({ type: Number })
  _stateID: number;
}

export const StateModel = getModelForClass(State);
export const InitialStateModel = getModelForClass(State);
