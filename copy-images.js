const util = require('util');
const exec = util.promisify(require('child_process').exec);

const [,,env = 'development'] = process.argv;

const execWithConsole = async (command, removeNewLine) => {
  console.log(command);
  let {stdout, stderr} = await exec(command);

  if (removeNewLine) {
    stdout = stdout.replace(/(\r\n|\n|\r)/gm, '');
    stderr = stderr.replace(/(\r\n|\n|\r)/gm, '');
  }

  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
  return stdout || stderr;
};

const main = async () => {
  await execWithConsole('pwd', true);
  await execWithConsole('cp src/icon128.png src/icon48.png src/icon16.png dist');
};

main();

