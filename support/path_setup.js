const path = require('path');
module.exports = new (class {
  constructor() {
    const projectRoot = path.dirname(__dirname);
    this.projectRoot = projectRoot;
    process.chdir(projectRoot);
    const origPath = process.env.NODE_PATH ? process.env.NODE_PATH : '';
    process.env.NODE_PATH =
      projectRoot + path.delimiter +
      path.resolve(projectRoot, 'support') + path.delimiter +
      origPath;
    require('module')._initPaths();
  }
  get root() {
    return this.projectRoot;
  }
  relativeToRoot(relPath) {
    return path.resolve(this.root, relPath);
  }
})();
