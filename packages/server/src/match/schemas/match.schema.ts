import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema$Match, Player, SetupData } from '@/typings';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, { _id, ...raw }) => new Match(raw)
  }
})
export class Match implements Omit<Schema$Match, 'avatar'> {
  id: string;

  @Prop({ type: String, required: true })
  gameName: string;

  @Prop({ type: String, required: true })
  matchID: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  players: Player[];

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  setupData: SetupData;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  gameover: unknown;

  @Prop({ type: String })
  nextMatchID?: string;

  @Prop({ type: Boolean })
  unlisted: boolean;

  createdAt: number;

  updatedAt: number;

  constructor(payload: Partial<Match>) {
    Object.assign(this, payload);
  }

  toJSON(): Match {
    return new Match(this);
  }
}

export const MatchSchema = SchemaFactory.createForClass(Match);
