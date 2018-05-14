const {readFileSync} = require('fs');

const pathSetup = require('path_setup');

const markdownTemplate = readFileSync(
  pathSetup.relativeToRoot(
    'support/lib/build/templates/file_markdown_template.js'
)).toString('utf8');

const parseMarkdown = bundle => {
  const stringifiedText = JSON.stringify(
    bundle.data.toString('utf-8')
  );
  bundle.src = markdownTemplate
    .replace('$$STRING$$', stringifiedText);
  return bundle;
};

const processEntries = ({config, bundles}) => {
  Object.entries(bundles).map(([bundleName, bundle]) => {
    if (bundle.isJsonFile) {
      return parseMarkdown(bundle);
    }
    else {
      return bundle;
    }
  });
  return {config, bundles};
};

module.exports = processEntries;
