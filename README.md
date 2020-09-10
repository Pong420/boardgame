## Boardgame

A project building boardgame with React and [boardgame.io](https://boardgame.io/)

<div>
  <img width="49.5%" src="./screenshot/light.png">
  <img width="49.5%" src="./screenshot/dark.png">
</div>

<br />

### Development

```
yarn dev
```

### Database

By default, data are store at `packages/server/dist/match-storage`. To connect to a database (postgres) create a file named `.env.local` into `packages/server` and set your `postgres` url

```
DATABASE_URL = postgres://postgres:12345678@localhost:5432/boardgame
```

### Contribution

1. Clone a template into `packages/web/src/games`

```
node scripts/clone.js GameName
```

2. Edit `packages/web/src/games/index.ts` and `packages/server/src/index.ts` import the new game correctly

3. Then start development :P
