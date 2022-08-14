const util = require('util');
const exec = util.promisify(require('child_process').exec);

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
  await execWithConsole('rm -rf dist');
  await execWithConsole('mkdir dist');
  await execWithConsole('cp src/options.html src/popup.html src/options.css src/manifest.json dist');
  await execWithConsole('npx tsc');
};

main();

