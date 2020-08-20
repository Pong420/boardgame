This is a project building boardgame with React and <a href="https://boardgame.io/" target="_blank">boardgame.io</a>

## Available game list

- [Big Two](./src/games/BigTwo)

## Development

port `3000`, `8080` is required by default, you can change these port by edit `.env.development` file

```
PORT = 3000
REACT_APP_SERVER_PORT = 8080
```

Add mongodb configuration in new `.env` or `.env.local` file

```
MONGODB_URI = mongodb://...
DB_NAME = db_name
```

start development

```
yarn dev
```

## License

[MIT](LICENSE)
