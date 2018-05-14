
const LOAD = require('core/load');

/** = Description
 ** XMLHttpRequest abstractor, and handler and utilities.
 ** The only public method is +request+
 ** The namespace also holds the following services:
 **
 ** Service Name::          Service Description
 ** +COMM.Queue+::          Singleton, used for queuing tasks
 **                         awaiting asynchronous requests to complete.
 ** +COMM.Session+::        Session key secure hashing service.
 ** +COMM.SessionWatcher+:: Polls server at regular intervals by reporting
 **                         the client's local time.
 ** +COMM.Transporter+::    Automated synchronization service, pulls server
 **                         data, tasks etc. The main server interface.
 ** +COMM.Values+::         Data value manager, handles synchronized data in
 **                         both directions (server-client-server).
 ** +COMM.JSLoader+::       Loads Javascript libraries asynchronously.
 ** +COMM.JSONRenderer+::   Constructs nodes from JSON structures as GUI
 **                         tree structures. Lowers the learning curve of GUI
 **                         development, because Javascript knowledge is not
 **                         required to define user interfaces.
 **                         The main purpose is to ease the development of
 **                         user interfaces by defining them as data on the
 **                         server, converting the data to JSON GUI trees and
 **                         letting the client handle the rest. The end result
 **                         is the same as defining the structures in
 **                         JavaScript code.
 **
***/
const COMM = {
  /* = Description
  * Finds and calls the state responder method upon a readyState change to 4.
  * - On readyStates other than 4 does nothing.
  * - The default responder for a successful response code (between 200 to 299) is onSuccess.
  * - The default responder for unsuccessful response codes is onFailure.
  * - The responders are called with the request object as the parameter.
  * - Custom response code handling is implemented as 'on' + status code,
  *   eg. 'on404' for a 404 not found error.
  **/
  _stateChange: _this => {
    if (_this.X.readyState === 4) {
      const _status = _this.X.status;
      const _responderName = `on${_status}`;
      const _success = _status >= 200 && _status < 300;
      if (typeof _this[_responderName] === 'function') {
        _this[_responderName](_this);
      }
      else if (_success) {
        typeof _this.onSuccess === 'function' && _this.onSuccess(_this);
      }
      else {
        typeof _this.onFailure === 'function' && _this.onFailure(_this);
      }
    }
  },

  /* = Description
  * Converts arrays to valid query strings.
  *
  * = Usage
  * Returns 'productId=100&customerName=J-J%20Heinonen'
  *   COMM._arrayToQueryString(['productId',100,'customerName','J-J Heinonen'])
  *
  **/
  _arrayToQueryString: _params => {
    let i = 0;
    const _length = _params.length;
    let _queryString = '';
    for (;i < _length; i++) {
      _queryString += encodeURIComponent(_params[i]);
      _queryString += (i === _length - 1) ? '' : (i % 2 === 0) ? '=' : '&';
    }
    return _queryString;
  },

  /* = Description
  * The main Request-handling object. Provides a general and fairly easy to use
  * interface for making "Ajax" requests.
  *
  * = Parameters
  * +_url+::        Full or relative url of the response handler
  * +_options+::    An +Object+, see below for content:
  *
  *
  * == Required properties for +_options+:
  * +onSuccess+::   A function that is called on a successful response.
  *                 Must accept one parameter: the request object.
  * +onFailure+::   A function that is called on an unsuccessful response.
  *                 Must accept one parameter: the request object.
  *
  * == Optional properties for +_options+:
  * +method+::      The HTTP Request Method, usually 'POST' or 'GET', but will handle
  *                 DAV and other extensions if the server supports them.
  *                 Defaults to 'POST'.
  * +async+::       Boolean; Uses asyncronous requests when true.
  *                 Defaults to true.
  * +params+::      Extra parameters to send, format: Array, see COMM._arrayToQueryString()
  * +headers+::     Extra HTTP headers to send for POST requests, format: Hash.
  * +body+::        The HTTP POST Body
  * +username+::    Username for basic authentication
  * +password+::    Password for basic authentication
  * +contentType+:: The 'content-type' -header to send.
  *                 Defaults to 'application/x-www-form-urlencoded'.
  * +charset+::     The charset type to use. Defaults to 'UTF-8'.
  *
  * = Returns
  * An +Object+ extended from the +_options+ given in the input.
  *
  **/
  request: (_url, _options) => {
    const _this = _options ? _options : {};
    const _method = _options.method ? _options.method.toUpperCase() : 'GET';
    const _async = typeof _options.async === 'undefined' ? true : _options.async;
    const _params = _options.params ? _options.params : [];
    const _headers = _options.headers ? _options.headers : {};
    const _contentType = _options.contentType ? _options.contentType : 'application/x-www-form-urlencoded';
    const _charset = _options.charset ? _options.charset : 'UTF-8';
    const _username = _options.username ? _options.username : null;
    const _password = _options.username ? _options.password : null;
    if (!_options.onFailure) {
      _this.onFailure = resp => {
        console.error('No failure handler specified, response: ', resp);
      };
    }
    if (!_options.onSuccess) {
      _this.onSuccess = function(resp) {
        console.log('No success handler specified, response: ', resp);
      };
    }
    if (!_options.on302) {
      // Redirection handler
      _this.on503 = __this => {
        const _retryAfter = parseInt(_this.X.getResponseHeader('Retry-After'), 10) * 1000;
        setTimeout(() => {
          COMM.request(__this.url, __this.options);
        }, _retryAfter);
      };
    }
    _this.url = _url;
    _this.options = _options;
    _this.X = COMM._XMLHttpRequest();
    if (_method === 'GET' && _params.length !== 0) {
      _url += (_url.includes('?') ? '&' : '?') + COMM._arrayToQueryString(_params);
    }
    _this.X.open(_method, _url, _async, _username, _password);
    _this.X.onreadystatechange = () => {
      COMM._stateChange(_this);
    };
    if (_method === 'POST') {
      _headers['Content-Type'] = _contentType + '; charset=' + _charset;
      const _body = _options.body ? _options.body : '';
      Object.entries(_headers).forEach(([_key, _value]) => {
        _this.X.setRequestHeader(_key, _value);
      });
      _this.X.send(_body);
    }
    else if (_method === 'GET') {
      _this.X.send(null);
    }
    if (!_async) {
      COMM._stateChange(_this);
    }
    return _this;
  },

  /* = Description
   * Creates a new instance of the XMLHttpRequest object
   **/
  _XMLHttpRequest: function() {
    return new XMLHttpRequest();
  }

};

COMM.Queue = require('comm/queue');
COMM.Session = require('comm/session');
COMM.Transporter = require('comm/transporter');
COMM.SessionWatcher = require('comm/sessionwatcher');
COMM.URLResponder = require('comm/urlresponder');
COMM.Values = require('comm/values');
COMM.JSLoader = require('comm/jsloader');
COMM.JSONRenderer = require('foundation/json_renderer');

// Makes the standard jsLoader instance based on the client base url
// of the server when the page is loaded.
LOAD(() => {
  COMM.jsLoader = new COMM.JSLoader(COMM.ClientPrefix + '/js/');
});

// Starts the synchronization upon page load.
COMM.AutoSyncStarter = {
  start: () => {
    COMM.urlResponder = COMM.URLResponder.new();
    COMM.Transporter.url = COMM.Transporter.HelloUrl;
    COMM.Transporter.stop = false;
    COMM.Transporter.sync();
  }
};

module.exports = COMM;
