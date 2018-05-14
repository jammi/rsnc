const {readFileSync} = require('fs');

const pathSetup = require('path_setup');

const parseJs = bundle => {
  const jsSrc = bundle.data.toString('utf-8');
  bundle.src = jsSrc;
  return bundle;
};

const processEntries = ({config, bundles}) => {
  Object.entries(bundles).map(([bundleName, bundle]) => {
    if (bundle.isJsFile && !bundle.isBundle) {
      return parseJs(bundle);
    }
    else {
      return bundle;
    }
  });
  return {config, bundles};
};

module.exports = processEntries;
