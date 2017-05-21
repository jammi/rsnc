const {readFileSync} = require('fs');

const yaml = require('js-yaml');

const pathSetup = require('path_setup');

const yamlTemplate = readFileSync(
  pathSetup.relativeToRoot(
    'support/lib/build/templates/file_yaml_template.js'
)).toString('utf8');

const parseYaml = bundle => {
  const stringifiedObject = JSON.stringify(
    yaml.safeLoad(
      bundle.data.toString('utf-8')
    )
  );
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
