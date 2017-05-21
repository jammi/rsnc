const {readFileSync} = require('fs');

const pathSetup = require('path_setup');

const textTemplate = readFileSync(
  pathSetup.relativeToRoot(
    'support/lib/build/templates/file_js_template.js'
)).toString('utf8');

const parseText = bundle => {
  const jsSrc = bundle.data.toString('utf-8');
  bundle.src = textTemplate
    .replace('$$JS_SRC$$', jsSrc);
  return bundle;
};

const processEntries = ({config, bundles}) => {
  Object.entries(bundles).map(([bundleName, bundle]) => {
    if (bundle.isJsonFile) {
      return parseText(bundle);
    }
    else {
      return bundle;
    }
  });
  return {config, bundles};
};

module.exports = processEntries;
