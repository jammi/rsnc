const fs = require('fs');
const path = require('path');

const pathSetup = require('path_setup');
const {dirExists, fileExists} = require('lib/util/fileutil');

module.exports = new (class {
  constructor() {
    this.buildConfigFiles = [
      pathSetup.relativeToRoot(
        'conf/client_pkg.yaml')
    ];
    const args = process.argv.slice(1);
    args.forEach(arg => {
      if (
        arg.endsWith('client_pkg.yaml') ||
        arg.endsWith('client_pkgs.yaml')
      ) {
        const filePath = pathSetup
          .relativeToShell(arg);
        if (fileExists(filePath)) {
          this.buildConfigFiles.push(filePath);
        }
      }
    });
    this.buildTargetDirectory = (() => {
      const testDir = pathSetup.relativeToShell(
        args.slice(-1)[0]
      );
      if (dirExists(testDir)) {
        return testDir;
      }
      else {
        return pathSetup
          .relativeToRoot('support/built');
      }
    })();
  }
})();
