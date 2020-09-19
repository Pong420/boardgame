## bigo-mongo

Mongo adapter for [boardgame.io Storage](https://boardgame.io/documentation/#/storage?id=storage);

### Usage

```typescript
import { Server } from "boardgame.io/server";
import { MongoStorre } from "bgio-mongo";

const db = new MongoStorre({
  url: 'mongodb://...'
});

const server = Server({
  db,
  games: [...],
});
```

### preCreateGame

Custom options. Validate before create game

```typescript
const db = new MongoStore({
  // ...
  // you must throw an error if invalid
  preCreateGame: async ({ metadata }) => {
    const data: Partial<SetupData> | undefined = metadata.setupData;
    const validation = () => {
      if (!data) return 'SetupData is not defined';
      if (!data.matchName) return 'Missting Match Name';
    };
    const error = validation();
    if (error) throw new Error(error);
  }
});
```

### Override the default API

The [official approach](https://github.com/boardgameio/boardgame.io/blob/0062e5508f0e8f86c9bf9f60bd4da0c641b7e184/src/server/api.ts#L197-L200) of `GET /games/:gameName` is not efficiency. And there is a approach to override it

See [overrideGetMatches.ts](packages\web\server\overrideGetMatches.ts)

```typescript
import { LobbyAPI } from 'boardgame.io';
import { MetadataModel, getListGamesOptsQuery } from 'bgio-mongo';

// router is server.router
export function overrideGetMatches(router: Router) {
  const targetPath = '/games/:name';

  router.stack = router.stack.filter(stack => stack.path !== targetPath);

  router.get(targetPath, async ctx => {
    // ... logic of offical api

    const sort: keyof LobbyAPI.Match = 'createdAt';
    const _matches = await MetadataModel.find({
      unlisted: false,
      ...getListGamesOptsQuery({
        gameName,
        where: { isGameover, updatedAfter, updatedBefore }
      })
    }).sort({ [sort]: 1 });

    const body: LobbyAPI.MatchList = {
      matches: _matches.map<LobbyAPI.Match>(metadata => {
        metadata = metadata.toJSON();
        return {
          ...metadata,
          players: Object.values(metadata.players).map(player => {
            // strip away credentials
            const { credentials, ...strippedInfo } = player;
            return strippedInfo;
          })
        };
      })
    };
    ctx.body = body;
  });
}
```
