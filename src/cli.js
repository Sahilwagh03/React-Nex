#!/usr/bin/env node
const { program } = require('commander');
const registerComponent = require('./index').registerComponent;


const MappingComponentWithCommand = (component) => {
  if (component === "Input-Otp") {
    return { componentName: "InputOtpBox", folderName: "Input OTP" };
  } else {
    return { componentName: component, folderName: component };
  }
};

program
  .command('add <components...>')
  .action(async (components) => {
    const ora = (await import('ora')).default;
    const spinner = ora();
    try {
      for (const component of components) {
        const { componentName, folderName } = MappingComponentWithCommand(component);

        // Start loading spinner
        spinner.start(`Checking component: ${componentName}...`);

        const { exists } = await registerComponent(componentName, folderName);

        if (exists) {
          // Stop spinner with "already added" message
          spinner.info(`Component "${componentName}" is already added. Skipping...`);
        } else {
          // Stop spinner with success message
          spinner.succeed(`Successfully added: ${componentName}`);
        }
      }
    } catch (error) {
      // Stop spinner with failure
      spinner.fail(`Error adding components: ${error.message}`);
      console.error(`Error installing components: ${error.message}`);
    }
  });

program.parse(process.argv);

