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

If your are fist-time to clone the repo, you may run before development

```
yarn db build
```

### Database

By default, data are store at `packages/web/dist/match-storage`. To connect to a database (mongodb) create a file named `.env.local` into `packages/web` and set your `mongodb` url

```
MONGODB_URI = mongodb://localhost:27017/boardgame
```

### Testing

After `yarn dev`, you must run `yarn build` before testing

```
yarn e2e test
```

or test specific file

```
yarn e2e test packages/e2e/test/xxxx.e2e-spec.ts
```

disable headless mode

```
HEADLESS=false yarn e2e test
```

### Contribution

1. Clone a template into `packages/web/src/games`

```
node scripts/clone.js NewGameName
```

2. Open `packages/web/games/index.ts` and `packages/web/server/bgio-server.ts`. Import the new game correctly

3. Start development :P

### TODO

[ ] Room
[ ] Tic-Tac-Toe AI
[ ] Display player name
[ ] Player leave notice
