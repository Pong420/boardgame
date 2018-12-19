## Boardgame

This is a project building boardgame with React and <a href="https://boardgame.io/" target="_blank">boardgame.io</a>

## Available game list

- [Big Two](./src/Game/BigTwo)

## Develop

I will suggested to take a look [boardgame.io documentation](https://boardgame.io/#/) before development

```
yarn install

# make sure port 3000, 8080 and 8081 are free
yarn dev

# http://localhost:3000 should be open automatically
```

## Enviroment Variables

- For [boardgame.io Server API](https://boardgame.io/#/api/Server)

```
REACT_APP_REMOTE_SERVER=http://localhost
REACT_APP_REMOTE_SERVER_PORT=8080
```

- For mongodb

```
MONGODB_URI=mongodb://...
```

## License

[Apache License 2.0](LICENSE)
