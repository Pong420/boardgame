const { exec } = require('child_process');
const [, , type] = process.argv;

const execPromise = command => {
  return new Promise((resolve, reject) => {
    const cmd = exec(command, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });

    cmd.stdout.on('data', data => {
      console.log(data.trim());
    });
  });
};

const command = (() => {
  switch (type) {
    case 'svg':
      return ['yarn add --dev gatsby-plugin-react-svg'];
    case 'image':
      return [
        'yarn add gatsby-image',
        'yarn add --dev gatsby-source-filesystem',
        'yarn add --dev gatsby-plugin-sharp',
        'yarn add --dev gatsby-transformer-sharp'
      ];
    case 'markdown':
      return [
        'yarn add --dev gatsby-source-filesystem',
        'yarn add --dev gatsby-transformer-remark',
        'yarn add --dev gatsby-remark-relative-images',
        'yarn add --dev gatsby-remark-images'
      ];
    default:
      return [];
  }
})();

const promises = command.map(cmd => execPromise(cmd));

Promise.all(promises).then(() => {
  process.exit(0);
});
