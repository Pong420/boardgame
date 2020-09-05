## Boardgame

A project building boardgame with React and [boardgame.io](https://boardgame.io/)

:warning: :warning: :warning:
This is `v3` branch and working in progress.

<img src="./preview.png">

### Development

1. Create a file named `.env.local` in to `packages/server` and set your `postgres` url

```
DATABASE_URL = postgres://postgres:12345678@localhost:5432/boardgame
```

2. Generate `d.ts` for games. You may run if required. Or you are the first time to start the development.

```
yarn build:games
```

3. Start develop

```
yarn dev
```

### Contribution

1. Create a game template into `packages/games`

```
node scripts/clone.js GameName
```
