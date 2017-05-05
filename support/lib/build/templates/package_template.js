'use strict';

(function() {
  window.__modules = window.__modules ? window.__modules : {};
  var exports = {}, module = {exports},
  __modules = window.__modules;
  function __unableToRequireError(_src) {
    var _err = 'Unable to require bundle: ';
    console.error(_err, _src);
    throw new Error(_err + _src.toString());
  }
  function __findMatchingModule(__bundleName) {
    var _match = Object.entries(__modules).filter(function([name, mod]) {
      return name.match(__bundleName);
    }).sort((a, b) => {
      return a.length > b.length ? -1 : 1;
    });
    return _match && _match[0] ? _match[0][1] : __unableToRequireError(__bundleName);
  }
  function __exports(__bundleName, __fn) {
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
