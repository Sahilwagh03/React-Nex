const fs = require('fs');
const axios = require('axios');

async function registerComponent(name, folderName) {
  // Determine base folder (src or app)
  const baseFolder = fs.existsSync('app') ? 'app' : 'src';

  const folderNames = folderName || name;
  const componentPath = `${baseFolder}/components-react-nex/${folderNames}/${name}.jsx`;
  const utilsPath = `${baseFolder}/components-react-nex/${folderNames}/utils.js`;

  // Check if the component already exists
  if (fs.existsSync(componentPath)) {
    // Return a flag indicating the component already exists
    return { exists: true, name };
  }

  const componentDefinition = require('../component-registry.json');
  const componentInfo = componentDefinition[name];

  if (!componentInfo || !componentInfo.url) {
    throw new Error(`Component "${name}" not found in registry`);
  }

  try {
    const response = await axios.get(componentInfo.url, { responseType: 'text' });
    if (!response.data) {
      throw new Error(`Failed to fetch component ${name}: No data received`);
    }

    const code = response.data;

    // Create components folder if it doesn't exist
    if (!fs.existsSync(`${baseFolder}/components-react-nex/${folderNames}/`)) {
      fs.mkdirSync(`${baseFolder}/components-react-nex/${folderNames}/`, { recursive: true });
    }

    // Store code locally
    fs.writeFileSync(componentPath, code);

    // Download dependencies if specified
    if (componentInfo.dependencies && componentInfo.dependencies.length > 0) {
      for (let dependencyName of componentInfo.dependencies) {
        const dependencyInfo = componentDefinition[dependencyName];
        if (!dependencyInfo || !dependencyInfo.url) {
          throw new Error(`Dependency "${dependencyName}" not found in registry`);
        }

        const dependencyPath = `${baseFolder}/components-react-nex/${folderNames}/${dependencyName}.jsx`;
        const dependencyResponse = await axios.get(dependencyInfo.url, { responseType: 'text' });
        if (!dependencyResponse.data) {
          throw new Error(`Failed to fetch dependency ${dependencyName}: No data received`);
        }

        const dependencyCode = dependencyResponse.data;

        // Store dependency code locally
        fs.writeFileSync(dependencyPath, dependencyCode);
      }
    }

    // Download and store utils file if specified
    if (componentInfo.utilsFiles) {
      const utilsResponse = await axios.get(componentInfo.utilsFiles, { responseType: 'text' });
      if (!utilsResponse.data) {
        throw new Error(`Failed to fetch utils for component ${name}: No data received`);
      }
      const utilsData = utilsResponse.data;
      // Store utils code locally
      fs.writeFileSync(utilsPath, utilsData);
    }
  } catch (error) {
    console.error(`Error fetching component ${name}: ${error.message}`);
    throw error;
  }

  // Return a flag indicating the component was added
  return { exists: false, name };
}

module.exports = {
  registerComponent
};
