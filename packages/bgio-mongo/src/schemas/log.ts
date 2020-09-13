import { LogEntry, ActionShape } from 'boardgame.io';
import { prop } from '@typegoose/typegoose';

export class Log implements LogEntry {
  @prop()
  action: ActionShape.MakeMove | ActionShape.GameEvent;

  @prop()
  _stateID: number;

  @prop({ type: Number })
  turn: number;

  @prop({ type: String })
  phase: string;

  @prop({ type: Boolean })
  redact?: boolean;

  @prop({ type: Boolean })
  automatic?: boolean;
}
