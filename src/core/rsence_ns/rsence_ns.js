const LOAD = require('core/load');
const HThemeManager = require('foundation/thememanager');
const COMM = require('comm');
const HLocale = require('foundation/locale');

// CSS for preventing text selection
const unselectableCSS = `
.textunselectable {
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: -moz-none;
   -ms-user-select: none;
   -o-user-select: none;
   user-select: none;
}
.textselectable {
   -webkit-user-select: text;
   -khtml-user-select: text;
   -moz-user-select: text;
   -ms-user-select: text;
   -o-user-select: text;
   user-select: text;
}
`;

// Adds text selection prevention class
const loadUnselectable = () => {
  HThemeManager.useCSS(unselectableCSS);
};
LOAD(loadUnselectable);

// Call this method from the index page for
// client-only features
const clientConf = clientPrefix => {
  HThemeManager.setThemePath(`${clientPrefix}/themes`);
  loadUnselectable();
};

// Call this method from the index page to
// setup the environment variables and to
// start synchronizing immediately afterwards.
const serverConf = (clientPrefix, helloUrl) => {
  COMM.ClientPrefix = clientPrefix;
  COMM.Transporter.HelloUrl = helloUrl;
  clientConf(clientPrefix);
  COMM.AutoSyncStarter.start();
};

// Storage for guiTrees, contains
// JSONRenderer instances by plugin name.
const guiTrees = {};

const killGuiTree = guiName => {
  const guiTree = guiTrees[guiName];
  if (guiTree) {
    guiTree.die();
    delete guiTrees[guiName];
  }
};

// Passthrough hook for setting locale data
const setLocaleData = localeData => {
  HLocale.setData(localeData);
};

// Global RSence references and some global utility functions
const RSence = {
  loadUnselectable,
  clientConf, serverConf,
  guiTrees, killGuiTree,
  setLocaleData
};

// Make them global to use from raw server-side or HTML-side calls to set things up
// TODO: Deprecate this at some point:
window.RSence = RSence;

module.exports = RSence;
