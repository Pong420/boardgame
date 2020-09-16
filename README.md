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

By default, data are store at `packages/web/dist/match-storage`. To connect to a database (mongodb) create a file named `.env.local` into `packages/web` and set your `mongodb` url

```
MONGODB_URI = mongodb+srv://...
```

if your are fist-time to clone the repo, you may also run

```
yarn db build
```
