const path = require('path');
module.exports = new (class {
  constructor() {
    this.shellRoot = process.cwd();
    const selfRoot = path.dirname(__dirname);
    this.selfRoot = selfRoot;
    process.chdir(selfRoot);
    const origPath = process.env.NODE_PATH ? process.env.NODE_PATH : '';
    process.env.NODE_PATH =
      selfRoot + path.delimiter +
      path.resolve(selfRoot, 'support') + path.delimiter +
      origPath;
    require('module')._initPaths();
  }
  get root() {
    return this.selfRoot;
  }
  get shell() {
    return this.shellRoot;
  }
  relativeToRoot(relPath) {
    return path.resolve(this.root, relPath);
  }
  relativeToShell(relPath) {
    return path.resolve(this.shellRoot, relPath);
  }
})();
