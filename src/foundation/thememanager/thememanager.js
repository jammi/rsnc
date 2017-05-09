const UtilMethods = require('util/util_methods');
const {BROWSER_TYPE, ELEM} = require('core/elem');

class HThemeManager extends UtilMethods {
  constructor() {
    super();
    // temporary solution until new theme is crafted:
    this.allInOneCSS = true;
    this.currentTheme = 'default';
    this.currentThemePath = './';
    this.themePaths = {};
    this.themes = [];
    // CSS Templates and CSS Template methods per theme name
    this.themeCSSTemplates = {};
    // HTML Templates and HTML Template methods per theme name
    this.themeHTMLTemplates = {};
    // Simple reference counting by theme name and component name, when 0, clear the style sheet
    this.cssCountUsedBy = {};
    this.cssByThemeAndComponentName = {};
  }

  // Set the graphics loading path of the the themeName
  setThemePath(_clientPrefix) {
    this.currentThemePath = _clientPrefix;
    this.themes.forEach(_themeName => {
      this.setupThemePath(_themeName);
    });
  }

  setupAllInOneCSS(_themeName) {
    Object
      .entries(this.themeCSSTemplates[_themeName])
      .forEach(([_componentName]) => {
        const _cssText = this.buildCSSTemplate(
          this, _themeName, _componentName
        );
        const _style = this.useCSS(_cssText);
      });
  }

  setupThemePath(_themeName) {
    if (this.currentThemePath && !this.themePaths[_themeName]) {
      const _clientThemePath = [
        this.currentThemePath, _themeName
      ].join('/') + '/gfx/';
      this.themePaths[_themeName] = _clientThemePath;
      if (this.allInOneCSS) {
        this.setupAllInOneCSS(_themeName);
      }
    }
  }

  // Sets the css template data per theme, all at once
  setThemeCSSTemplates(_themeName, _themeCSS) {
    this.themeCSSTemplates[_themeName] = _themeCSS;
  }

  // Sets the css template data per theme, all at once
  setThemeHTMLTemplates(_themeName, _themeHTML) {
    this.themeHTMLTemplates[_themeName] = _themeHTML;
  }

  // Set the theme data, this is called by the serverside client_pkg suite
  installThemeData(_themeName, _themeCSS, _themeHTML) {
    if (!this.themes.includes(_themeName)) {
      this.themes.push(_themeName);
    }
    this.setThemeCSSTemplates(_themeName, _themeCSS);
    this.setThemeHTMLTemplates(_themeName, _themeHTML);
    this.setupThemePath(_themeName);
  }

  incrementCSSUseCount(_themeName, _componentName) {
    if (!this.cssCountUsedBy[_themeName]) {
      this.cssCountUsedBy[_themeName] = {};
    }
    const _themeCollection = this.cssCountUsedBy[_themeName];
    if (_themeCollection[_componentName]) {
      _themeCollection[_componentName] += 1;
    }
    else {
      _themeCollection[_componentName] = 1;
    }
  }

  decrementCSSUseCount(_themeName, _componentName) {
    if (!this.cssCountUsedBy[_themeName]) {
      console.warn(
        `HThemeManager#decrementCSSUseCount warning; the theme '${_themeName
        }' wasn't initialized (called with componentName: '${_componentName}')`);
    }
    else {
      const _themeCollection = this.cssCountUsedby[_themeName];
      if (!_themeCollection[_componentName]) {
        console.log(`HThemeManager#decrementCSSUseCount warning; the componentName '${_componentName
        }' wasn't initialized (called with themeName: '${_themeName}')`);
      }
      else if (_themeCollection[_componentName] === 1) {
        // The last reference; delete
        const _style = this.cssByThemeAndComponentName[_themeName][_componentName];
        _style.parentNode.removeChild(_style);
        delete _themeCollection[_componentName];
      }
      else {
        // not last, decrement usage count:
        _themeCollection[_componentName] -= 1;
      }
    }
  }

  _buildThemePath(_fileName, _themeName) {
    while (_fileName[0] === '/') {
      _fileName = _fileName.substring(1);
    }
    return this.themePaths[_themeName] + _fileName;
  }

  buildHTMLTemplate(_view, _themeName, _componentName) {
    if (this.isntFunction(this.themeHTMLTemplates[_themeName])) {
      console.warn(`HThemeManager#buildHTMLTemplate warning: Theme '${_themeName}' is not installed`);
      return '';
    }
    else {
      const themeFn = this.themeHTMLTemplates[_themeName](_componentName);
      if (this.isntFunction(themeFn)) {
        console.warn(`HThemeManager#buildHTMLTemplate warning: Theme '${_themeName
        }' does not have component '${_componentName}' installed`);
        return '';
      }
      else {
        const tmplHTML = themeFn.call(_view);
        return tmplHTML;
      }
    }
  }

  gradientStyle(..._colors) {
    const [_key, _value] = ELEM._linearGradientStyle({
      start: _colors.shift(),
      end: _colors.pop(),
      steps: _colors
    });
    const _style = {};
    _style[_key] = _value;
    return _style;
  }

  gradientCSS(..._colors) {
    const _gradient = ELEM._linearGradientCSS({
      start: _colors.shift(),
      end: _colors.pop(),
      steps: _colors
    });
    return _gradient;
  }

  buildCSSTemplate(_context, _themeName, _componentName) {
    if (!this.themeCSSTemplates[_themeName]) {
      console.warn(`HThemeManager#buildCSSTemplate warning: Theme '${_themeName}' is not installed`);
      return '';
    }
    else if (!this.themeCSSTemplates[_themeName][_componentName]) {
      console.warn(`HThemeManager#buildCSSTemplate warning: Theme '${_themeName
      }' does not have component '${_componentName}' installed`);
      return '';
    }
    else {
      const _tmpl = this.themeCSSTemplates[_themeName][_componentName];
      this.getThemeGfxFile = _fileName => {
        return this._buildThemePath(_fileName, _themeName);
      };
      this.getCssFilePath = _fileName => {
        return `url(${this._buildThemePath(_fileName, _themeName)})`;
      };
      let _tmplCSS = _tmpl.call(this);
      const _cssThemeUrlMatch = /#url\((.+?)\)/gm;
      while (_cssThemeUrlMatch.test(_tmplCSS)) {
        _tmplCSS = _tmplCSS.replace(
          _cssThemeUrlMatch, (_match, _fileName) => {
            return `url(${this._buildThemePath(_fileName, _themeName)})`;
          }
        );
      }
      delete this.getCssFilePath;
      delete this.getThemeGfxFile;
      return _tmplCSS;
    }
  }

  resourcesFor(_view, _themeName, _noHTML) {
    if (!this.themePaths[_themeName]) {
      this.setupThemePath(_themeName);
    }
    if (!_themeName) {
      _themeName = this.currentTheme;
    }
    if (!_view.componentName) {
      console.warn(`HThemeManager#resourcesFor warning: Theme '${_themeName
      }' does not have component '${_view._componentName}' installed`);
      return null;
    }
    else {
      const _componentName = _view.componentName;
      if (!this.allInOneCSS) {// temporarily disabled until theme refactored
        if (!this.cssByThemeAndComponentName[_themeName]) {
          this.cssByThemeAndComponentName[_themeName] = {};
        }
        const _themeCollection = this.cssByThemeAndComponentName[_themeName];
        if (!_themeCollection[_componentName]) {
          const _style = this.useCSS(this.buildCSSTemplate(this, _themeName, _componentName));
          const _cssTitle = 'rsence/' + _themeName + '/' + _componentName;
          _style.title = _cssTitle;
          _themeCollection[_componentName] = _style;
        }
        this.incrementCSSUseCount(_themeName, _componentName);
        if (!_noHTML) {
          for (let _ancestor of _view.ancestors) {
            if (!_ancestor.componentName) {
              break;
            }
            this.resourcesFor(_ancestor, _themeName, true);
          }
        }
      }
      return this.buildHTMLTemplate(_view, _themeName, _componentName);
    }
  }

  freeResourcesFor(_view, _themeName, _noRecursion) {
    if (!_themeName) {
      _themeName = this.currentTheme;
    }
    if (!_view.componentName) {
      console.warn(`HThemeManager#freeResourcesFor warning: Theme '${_themeName
      }' does not have component '${_view._componentName}' installed`);
    }
    else {
      const _componentName = _view.componentName;
      this.decrementCSSUseCount(_themeName, _componentName);
      if (!_noRecursion) {
        for (let _ancestor of _view.ancestors) {
          if (!_ancestor.componentName) {
            break;
          }
          this.freeResourcesFor(_ancestor, _themeName);
        }
      }
    }
  }

  // Creates a new cascading style sheet element and set its content with css. Returns the element.
  useCSS(_cssText) {
    // Common, standard <style> tag generation in <head>
    const _style = document.createElement('style');
    _style.type = 'text/css';
    _style.media = 'all';
    if (BROWSER_TYPE.safari || BROWSER_TYPE.chrome || BROWSER_TYPE.firefox || BROWSER_TYPE.opera) {
      // This is how to do it in KHTML browsers
      _style.appendChild(document.createTextNode(_cssText));
    }
    else {
      // This works for many others (add more checks, if problems with new browsers)
      _style.textContent = _cssText;
    }
    const _head = document.getElementsByTagName('head')[0];
    _head.appendChild(_style);
    return _style;
  }
}

module.exports = new HThemeManager();
