
const LOAD = require('core/load');
const Queue = require('comm/queue');

/* = Description
 * A class for asynchronously fetching Javascript libraries from the server.
 *
 * Loads and evalueates the code returned as a string from the server.
 * Use the jsLoader instance to get packaged Javascript libraries from the
 * standard package url.
*/

class JSLoader {

  /* = Description
  * Construct with the base url.
  *
  * The this is the base url used by the +load+ method.
  *
  **/
  constructor(_uri) {
    this._loadedJS = [];
    this.uri = _uri;
    this._okayed = false;
  }

  // Error catcher for failed requests.
  _fail(_this, _resp) {
    console.error(`failed to load js: ${_resp.url}`);
  }

  _formatUrl(_jsName) {
    const _isFullUrl = (
      _jsName.slice(0, 7) === 'http://' ||
      _jsName.slice(0, 8) === 'https://'
    );
    const _url = _isFullUrl ? _jsName : this.uri + _jsName + '.js';
    return _url;
  }

  loaded(_jsName) {
    const _url = this._formatUrl(_jsName);
    this._loadedJS.push(_url);
  }

  /* = Description
  * Loads a js package using the name.
  *
  * The base url given in the constructor is used as the prefix.
  * Omit the '.js' suffix, because it's appended automatically.
  *
  * = Parameters
  * +_jsName+::   The name of the js file to load (without the .js suffix)
  *
  * = Usage:
  * Uses the main instance set to the base path of the server's
  * js package url. Loads a package containing list components.
  *   jsLoader.load('lists');
  *
  **/
  load(_jsName) {
    const _url = this._formatUrl(_jsName);
    if (!this._loadedJS.includes(_url)) {
      Queue.pause();
      this._loadedJS.push(_url);
      const _script = document.createElement('script');
      _script.onload = () => {
        Queue.resume();
      };
      _script.onerror = () => {
        Queue.resume();
      };
      _script.src = _url;
      _script.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(_script);
    }
  }
}

module.exports = JSLoader;
