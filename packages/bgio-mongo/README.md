## bigo-mongo

Mongo adapter for [Boardgame.io Storage](https://boardgame.io/documentation/#/storage?id=storage);

```typescript
import { Server } from "boardgame.io/server";
import { MongoStorre } from "bgio-mongo";

const db = new MongoStorre({
  url: 'mongodb+srv://...'
  dbName: 'boardgame' // default 'boardgame'
});

const server = Server({
  db,
  games: [...],
});
```

### preCreateGame

```typescript
const db = new MongoStore({
  // ...
  // validation, you must throw an error if invalid
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
