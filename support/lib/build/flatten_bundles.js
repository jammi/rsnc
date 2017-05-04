const pathSetup = require('path_setup');

const flattenSource = source => {
  const items = {};
  const appendFileItem = fileItem => {
    items[fileItem.bundleName] = fileItem;
  };
  const parseNodeItem = nodeItem => {
    if (nodeItem.isFile) {
      appendFileItem(nodeItem);
    }
    if (nodeItem.isDirectory &&
      nodeItem.children &&
      nodeItem.children.length > 0
    ) {
      return Promise.all(
        nodeItem.children.map(parseNodeItem)
      );
    }
    else if (!nodeItem.isDirectory && !nodeItem.isFile) {
      console.warn('invalid nodeItem:', nodeItem);
      return Promise.reject();
    }
    else {
      return Promise.resolve();
    }
  };
  return Promise.all(
    source.map(parseNodeItem)
  ).then(() => {
    return items;
  });
};

const flattenBundles = ({config, bundles: sources}) => {
  return Promise.all(
    sources.map(source => {
      return flattenSource(source);
    })
  ).then(bundles => {
    return {config, bundles: bundles.reduce((obj, curr) => {
      Object.entries(curr).forEach((key, value) => {
        obj[key] = value;
      });
    })};
  });
};

module.exports = flattenBundles;
