## Create-react-app Typescript Stater

React starter with customized [react scripts](https://github.com/Pong420/create-react-app)

```bash
git clone --depth=1 https://github.com/Pong420/create-react-app-ts-starter.git
```

```bash
yarn install
```

## Features

- Scss support and configured with some useful mixins. Variables and mixins in `src/scss` can be use directly without `@import`
- Prettier
- Pre-commit checking
- Hot reload configured
- Helper scripts

  - Create a new component

  ```bash
  // create component with index, scss, component in a folder
  yarn component ComponentName

  // create single component with `.tsx` only
  yarn component -s ComponentName
  ```

  - Install dependencies with type

  ```bash
  // equivalent to `yarn add lodash` and `yarn add --dev @types/loadash`
  yarn get lodash
  ```

  - Redux

  ```bash
  // install `redux`, `react-redux`, `rxjs` and `redux-observable`
  // And create required script
  yarn redux init

  // Quickly create action, epic, reducer file
  yarn redux name
  ```
