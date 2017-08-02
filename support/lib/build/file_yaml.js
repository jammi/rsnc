const {readFileSync} = require('fs');

const yaml = require('js-yaml');

const pathSetup = require('path_setup');

const yamlTemplate = readFileSync(
  pathSetup.relativeToRoot(
    'support/lib/build/templates/file_yaml_template.js'
)).toString('utf8');

const readYAMLFile = bundle => {
  try {
    return yaml.safeLoad(
      bundle.data.toString('utf-8')
    );
  }
  catch (e) {
    console.error(`Error <${e.name}:${e.reason}> in YAML file "${bundle.path}":\n ${e.message}\n`);
    return {};
  }
};

const parseYaml = bundle => {
  const stringifiedObject = JSON.stringify(readYAMLFile(bundle));
  bundle.src = yamlTemplate
    .replace('$$OBJECT$$', stringifiedObject);
  return bundle;
};

const processEntries = ({config, bundles}) => {
  Object.entries(bundles).map(([bundleName, bundle]) => {
    if (bundle.isYamlFile) {
      return parseYaml(bundle);
    }
    else {
      return bundle;
    }
  });
  return {config, bundles};
};

module.exports = processEntries;
