'use strict';

(function() {
  var exports = {}, module = {exports}, __modules = {};
  function __unableToRequireError(_src) {
    var _err = 'Unable to require bundle: ';
    console.error(_err, _src);
    throw new Error(_err + _src.toString());
  }
  function __findMatchingModule(__bundleName) {
    var _match = Object.entries(__modules).find(function([name, mod]) {
      return name.match(__bundleName);
    });
    return _match ? _match[1] : __unableToRequireError(__bundleName);
  }
  function __exports(__bundleName, __fn) {
    __fn();
    __modules[__bundleName] =
      typeof module.exports !== 'undefined' ?
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
  if (window && !window.require) {
    window.require = require;
  }
$$BUNDLES$$
})();
