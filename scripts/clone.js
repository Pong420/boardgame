const fs = require('fs');
const path = require('path');

const name = process.argv
  .slice(2)
  .find(v => !/-/.test(v))
  .replace(/^\w/, function (chr) {
    return chr.toUpperCase();
  });

const gameName = name
  .split(/(?=[A-Z])/)
  .map(str => str.toLocaleLowerCase())
  .join('-');

const dist = path.resolve(__dirname, '../packages/games', gameName);
const template = path.resolve(__dirname, '../packages/template');

const exclude = ['dist', 'node_modules'];

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);

  function handle(previous, target, data) {
    const isFile = /\./.test(data);
    const fullPath = path.resolve(previous, data);
    const targetPath = path.resolve(target, data);

    if (isFile) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      content = content.replace(new RegExp('Prefix_', 'g'), name);
      content = content.replace(new RegExp('game-name', 'g'), gameName);
      content = content.replace(
        new RegExp('Game Name', 'g'),
        name.split(/(?=[A-Z])/).join(' ')
      );
      content = content.replace(
        new RegExp('@boardgame/template', 'g'),
        `@boardgame/${gameName}`
      );

      fs.writeFileSync(
        targetPath.replace(new RegExp('Prefix_', 'g'), name),
        content,
        'utf-8'
      );
    } else {
      fs.mkdirSync(targetPath);
      fs.readdirSync(fullPath).forEach(data => {
        handle(fullPath, targetPath, data);
      });
    }
  }

  fs.readdirSync(template).forEach(data => {
    if (!exclude.includes(data)) {
      handle(template, dist, data);
    }
  });
} else {
  console.log(`${gameName} already exists`);
}

// console.log(componentName);
