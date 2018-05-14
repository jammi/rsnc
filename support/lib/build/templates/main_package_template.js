'use strict';

(__origConsole => {
  const process = new (class {
    get env() {
      return $$PROCESS_ENV$$;
    }
  })();
  let exports = {};
  let module = {exports};
  let __lastBundleName;
  const isProductionBuild = () => {
    return process.env.BUILD_TYPE === 'production';
  };
  const __fakeConsole = {
    get: (obj, prop) => {
      if (prop === 'warn') {
        return () => {}; // dummy fn
      }
      else {
        return (...args) => {
          __origConsole[prop](...args);
        };
      }
    }
  };
  const console = isProductionBuild() ?
     new Proxy({}, __fakeConsole) : __origConsole;
  const __repository = {};
  const __unableToRequireError = _src => {
    const _err = 'Unable to require bundle: ';
    console.error(_err, _src, '; called from ', __lastBundleName);
    throw new Error(_err + _src.toString());
  };
  const __findMatchingModule = __bundleName => {
    const _match = Object
      .entries(__repository)
      .filter(([name, mod]) => {
        return name.match(__bundleName);
      }).sort((a, b) => {
        return a.length > b.length ? -1 : 1;
      });
    return _match && _match[0] ?
      _match[0][1] :
      __unableToRequireError(__bundleName);
  };
  const __modules = window.__modules = {
    __console: console,
    __process: process,
    __exports: (_module, _bundleName) => {
      __lastBundleName = _bundleName;
      __repository[_bundleName] =
        _module && typeof _module.exports !== 'undefined' ?
          _module.exports : null;
    },
    __require: (_src) => {
      return typeof __repository[_src] !== 'undefined' ?
        __repository[_src] :
        __findMatchingModule(_src);
    }
  };
  const require = window.require = __modules.__require;
  const __exports = (__bundleName, __fn) => {
    __fn();
    __modules.__exports(module, __bundleName);
    exports = {}; module = {exports};
  };
$$BUNDLES$$;
})(console);
