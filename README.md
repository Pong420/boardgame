## Boardgame

A project building boardgame with React and [boardgame.io](https://boardgame.io/)

<img src="./preview.png">

### Development

1. Generate `d.ts` for games. You may run if required. Or you are the first time to start the development.

```
yarn build:games
```

2. Start develop

```
yarn dev
```

### Database

By default, data are store at `packages/server/match-storage`. To connect to a database(postgres) create a file named `.env.local` into `packages/server` and set your `postgres` url

```
DATABASE_URL = postgres://postgres:12345678@localhost:5432/boardgame
```

### Contribution

1. Create a game template into `packages/games`

```
node scripts/clone.js GameName
```

2. Start develop :P
