import mongoose, { ConnectionOptions, MongooseFilterQuery } from 'mongoose';
import { Async } from 'boardgame.io/internal';
import { LogEntry, Server, State, StorageAPI } from 'boardgame.io';
import { InitialStateModel, StateModel } from './schemas/state';
import { Metadata, MetadataModel } from './schemas/metadata';

export interface MongoStoreOptions extends ConnectionOptions {
  url: string;
  preCreateGame?: PreCreateGame;
}

export type PreCreateGame = (opts: StorageAPI.CreateGameOpts) => Promise<void>;

export function getListGamesOptsQuery(
  opts?: StorageAPI.ListGamesOpts
): MongooseFilterQuery<Metadata> {
  const { isGameover, updatedAfter, updatedBefore } = opts?.where || {};
  return {
    ...(opts?.gameName ? { gameName: opts.gameName } : {}),
    ...(typeof isGameover === 'boolean'
      ? isGameover
        ? { gameover: { $ne: null } }
        : { gameover: null }
      : {}),
    ...(typeof updatedAfter === 'number'
      ? { updatedAt: { $gt: updatedAfter } }
      : {}),
    ...(typeof updatedBefore === 'number'
      ? { updatedAt: { $lt: updatedBefore } }
      : {})
  };
}

export class MongoStore extends Async {
  constructor(private readonly options: MongoStoreOptions) {
    super();
  }

  connection: typeof mongoose;

  async connect(): Promise<void> {
    const { url, ...options } = this.options;
    // sync sequelize models with database schema
    this.connection = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...options
    });
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      this.connection.disconnect();
    }
  }

  async createGame(
    matchID: string,
    opts: StorageAPI.CreateGameOpts
  ): Promise<void> {
    await (this.options.preCreateGame
      ? this.options.preCreateGame(opts)
      : Promise.resolve());

    const statePayload = { matchID, ...opts.initialState };
    const initialState = new InitialStateModel(statePayload);
    const state = new StateModel(statePayload);
    const metadata = new MetadataModel({ matchID, ...opts.metadata });

    await Promise.all([
      //
      initialState.save(),
      state.save(),
      metadata.save()
    ]);
  }

  /**
   * Update the game state.
   *
   * If passed a deltalog array, setState should append its contents to the
   * existing log for this game.
   */
  async setState(
    matchID: string,
    state: State,
    deltalog?: LogEntry[]
  ): Promise<void> {
    const $push = deltalog?.length
      ? { $push: { deltalog: { $each: deltalog } } }
      : {};

    await StateModel.updateOne(
      { matchID },
      { ...state, matchID, ...$push },
      { upsert: true }
    );
  }

  /**
   * Update the game metadata.
   */
  async setMetadata(
    matchID: string,
    metadata: Server.MatchData
  ): Promise<void> {
    await MetadataModel.updateOne({ matchID }, metadata);
  }

  /**
   * Fetch the game state.
   */
  async fetch<O extends StorageAPI.FetchOpts>(
    matchID: string,
    opts: O
  ): Promise<StorageAPI.FetchResult<O>> {
    const result = {} as StorageAPI.FetchFields;

    const [state, metadata, initialState] = await Promise.all([
      opts.state || opts.log ? StateModel.findOne({ matchID }) : undefined,
      opts.metadata ? MetadataModel.findOne({ matchID }) : undefined,
      opts.initialState ? InitialStateModel.findOne({ matchID }) : undefined
    ]);

    result.state = opts.state ? state?.toJSON() : undefined;
    result.metadata = metadata?.toJSON();
    result.initialState = initialState?.toJSON();
    result.log = opts.log ? state?.toJSON().deltalog : undefined;

    return result as StorageAPI.FetchResult<O>;
  }

  /**
   * Remove the game state.
   */
  async wipe(matchID: string): Promise<void> {
    await Promise.all([
      StateModel.deleteOne({ matchID }),
      MetadataModel.deleteOne({ matchID }),
      InitialStateModel.deleteOne({ matchID })
    ]);
  }

  /**
   * Return all games.
   */
  async listGames(opts?: StorageAPI.ListGamesOpts): Promise<string[]> {
    const result = await MetadataModel.find(getListGamesOptsQuery(opts));
    return result.map(m => m.matchID);
  }
}
