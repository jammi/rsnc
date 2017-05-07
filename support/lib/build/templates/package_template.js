'use strict';

(function() {
  window.__modules = window.__modules ? window.__modules : {};
  var exports = {}, module = {exports},
  __modules = window.__modules,
  __unableToRequireError, __findMatchingModule, __exports;

  if (!__modules.__unableToRequireError) {
    __modules.__unableToRequireError = function(_src) {
      var _err = 'Unable to require bundle: ';
      console.error(_err, _src, '; called from ', __modules.__lastBundleName);
      throw new Error(_err + _src.toString());
    };
  }
  __unableToRequireError = __modules.__unableToRequireError;
  if (!__modules.__findMatchingModule) {
    __modules.__findMatchingModule = function(__bundleName) {
      var _match = Object.entries(__modules).filter(function([name, mod]) {
        return name.match(__bundleName);
      }).sort((a, b) => {
        return a.length > b.length ? -1 : 1;
      });
      return _match && _match[0] ? _match[0][1] : __unableToRequireError(__bundleName);
    };
  }
  __findMatchingModule = __modules.__findMatchingModule;
  function __exports(__bundleName, __fn) {
    __modules.__lastBundleName = __bundleName;
    __fn();
    __modules[__bundleName] =
      module && typeof module.exports !== 'undefined' ?
        module.exports :
        null;
    exports = {}; module = {exports};
  }
  function require(_src) {
    return (
      typeof __modules[_src] !== 'undefined' ?
        __modules[_src] :
        __findMatchingModule(_src)
    );
  }
  if (!window.require) {
    window.require = require;
  }
$$BUNDLES$$
})();
