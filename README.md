This is a project building boardgame with React and <a href="https://boardgame.io/" target="_blank">boardgame.io</a>

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Pong420/Boardgame/master)

## Available game list

- [Big Two](./src/games/BigTwo)

## Development

port `3000`, `8080` is required by default, you can change these port by edit `.env.development` file

```
PORT = 3000
REACT_APP_SERVER_PORT = 8080
```

Add mongodb config in new `.env` or `.env.local` file

```
MONGODB_URI = mongodb://...
```

start development

```
yarn dev
```

## License

[MIT](LICENSE)
