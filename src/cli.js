#!/usr/bin/env node
const { program } = require('commander');
const registerComponent = require('./index').registerComponent;


const MappingComponentWithCammand =(component)=>{
  if(component=="Input-Otp"){
    return {componentName:"InputOtpBox" , folderName:"Input OTP"}
  }
  else{
    return component
  }
}
program
  .command('add <component>')
  .action(async (component) => {
    try {
      const componentDetails = MappingComponentWithCammand(component)
      const componentName = componentDetails.componentName || component
      const folderName = componentDetails.folderName
      await registerComponent(componentName,folderName);
    } catch (error) {
      console.error(`Error installing component "${component}": ${error.message}`);
    }
  });

program.parse(process.argv);