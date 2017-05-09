'use strict';

(function() {
  let exports = {};
  let module = {exports};
  const __modules = window.__modules;
  const process = __modules.__process;
  const require = __modules.__require;
  const console = __modules.__console;
  const __exports = function(__bundleName, __fn) {
    __fn();
    __modules.__exports(module, __bundleName);
    exports = {}; module = {exports};
  };
$$BUNDLES$$;
})();
