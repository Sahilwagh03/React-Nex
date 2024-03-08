#!/usr/bin/env node
const { program } = require('commander');
const registerComponent = require('./index').registerComponent;

program
  .command('add <component>')
  .action(async (component) => {
    try {
      await registerComponent(component);
    } catch (error) {
      console.error(`Error installing component "${component}": ${error.message}`);
    }
  });

program.parse(process.argv);