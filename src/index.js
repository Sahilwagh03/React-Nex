const fs = require('fs');
const axios = require('axios');

async function registerComponent(name) {
  const componentPath = `src/components-react-nex/${name}/${name}.jsx`;
  const utilsPath = `src/components-react-nex/${name}/alertUtils.js`

  // Fetch component code from URL if not found locally
  if (!fs.existsSync(componentPath)) {
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
      if (!fs.existsSync(`src/components-react-nex/${name}/`)) {
        fs.mkdirSync(`src/components-react-nex/${name}/`, { recursive: true });
      }

      // Store code locally
      fs.writeFileSync(componentPath, code);

      if(componentInfo.utilsFiles){
        const response = await axios.get(componentInfo.utilsFiles, { responseType: 'text' });
        if (!response.data) {
          throw new Error(`Failed to fetch component ${name}: No data received`);
        }
        const utilsData = response.data;  
        // Store code locally
        fs.writeFileSync(utilsPath, utilsData);
      }

    } catch (error) {
      console.error(`Error fetching component ${name}: ${error.message}`);
      throw error;
    }
  }

  // Load component from local file
  try {
   //
  } catch (error) {
    console.error(`Error loading local component ${name}: ${error.message}`);
    throw error;
  }
}

module.exports = { 
  registerComponent 
};
