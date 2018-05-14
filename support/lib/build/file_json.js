const {readFileSync} = require('fs');

const pathSetup = require('path_setup');

const jsonTemplate = readFileSync(
  pathSetup.relativeToRoot(
    'support/lib/build/templates/file_json_template.js'
)).toString('utf8');

const parseJSON = bundle => {
  const stringifiedObject = JSON.stringify(
    JSON.parse(
      bundle.data.toString('utf-8')
    )
  );
  bundle.src = jsonTemplate
    .replace('$$OBJECT$$', stringifiedObject);
  return bundle;
};

const processEntries = ({config, bundles}) => {
  Object.entries(bundles).map(([bundleName, bundle]) => {
    if (bundle.isJsonFile) {
      return parseJSON(bundle);
    }
    else {
      return bundle;
    }
  });
  return {config, bundles};
};

module.exports = processEntries;
