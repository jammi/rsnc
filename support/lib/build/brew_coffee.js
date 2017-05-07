const COFFEE_VERSION = 2;

const coffee = (() => {
  if (COFFEE_VERSION === 2) {
    return require('coffeescript');
  }
  else {
    return require('coffee-script');
  }

})();

const brewCoffee = entry => {
  entry.coffeeSrc = entry.src.toString('utf8');
  const compiled = coffee.compile(
    entry.coffeeSrc, {
      bare: true,
      sourceMap: true,
      filename: entry.path
    });
  entry.src = compiled.js;
  entry.sourceMap = compiled.sourceMap;
  entry.v3SourcMap = compiled.v3SourcMap;
  return entry;
};

const processEntries = ({config, bundles}) => {
  Object.entries(bundles).map(([bundleName, bundle]) => {
    if (bundle.isCoffeeFile) {
      return brewCoffee(bundle);
    }
    else {
      return bundle;
    }
  });
  return {config, bundles};
};

module.exports = processEntries;
