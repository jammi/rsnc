const {readFileSync} = require('fs');

const pathSetup = require('path_setup');

const textTemplate = readFileSync(
  pathSetup.relativeToRoot(
    'support/lib/build/templates/file_text_template.js'
)).toString('utf8');

const parseText = bundle => {
  const stringifiedText = JSON.stringify(
    bundle.data.toString('utf-8')
  );
  bundle.src = textTemplate
    .replace('$$STRING$$', stringifiedText);
  return bundle;
};

const processEntries = ({config, bundles}) => {
  Object.entries(bundles).map(([bundleName, bundle]) => {
    if (bundle.isTextFile) {
      return parseText(bundle);
    }
    else {
      return bundle;
    }
  });
  return {config, bundles};
};

module.exports = processEntries;
