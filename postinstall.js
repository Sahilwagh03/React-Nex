const childProcess = require('child_process');

function installDependencies() {
  const dependencies = ['classnames', 'react-icons' , 'dayjs'];
  dependencies.forEach(dep => {
    try {
      require.resolve(dep);
    } catch (err) {
      console.log(`Installing ${dep}...`);
      childProcess.execSync(`npm install ${dep}`);
    }
  });
}

installDependencies();
