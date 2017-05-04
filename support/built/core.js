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
__exports('core/class', function() {

const mixin = function(Parent/* , ...mixins */) {
  class Mixed extends Parent {}
  Array
    .prototype
    .slice
    .call(arguments, 1)
    .forEach(_item => {
      Object
        .entries(_item)
        .forEach(([_key, _value]) => {
          Mixed.prototype[_key] = _value;
        });
    });
  return Mixed;
};

// Includes some extras than plain classes don't have,
// some of these are for backwards-compatibility and
// deprecation warnings for legacy code.
class HClass {

  constructor() {}

  base() {
    throw new Error('HClass#base() error; Use super() rather than this.base()');
  }

  get mixin() {
    return mixin;
  }

  get ancestors() {
    throw new Error('HClass#ancestors[] error; Use #hasAncestor() to test ancestry');
  }

  hasAncestor(_obj) {
    return _obj.isPrototypeOf(this.constructor);
  }

  static new() {
    return new this(...arguments);
  }

  static nu() {
    console.warn('Using .nu() as an constructor is deprecated; use .new() instead!');
    return new this(...arguments);
  }

  extend() {
    const _klass = this;
    Array
      .prototype
      .slice
      .call(arguments, 0)
      .forEach(_item => {
        Object
          .entries(_item)
          .forEach(([_key, _value]) => {
            _klass.prototype[_key] = _value;
          });
      });
    return _klass;
  }

  static extend() {
    return mixin(this, ...Array
      .prototype
      .slice
      .call(arguments, 0)
    );
  }

  static implement() {
    const _klass = this;
    Array
      .prototype
      .slice
      .call(arguments, 0)
      .forEach(_item => {
        Object
          .entries(_item)
          .forEach(([_key, _value]) => {
            _klass.prototype[_key] = _value;
          });
      });
    return _klass;
  }

  static mixin() {
    return mixin(this, ...Array
      .prototype
      .slice
      .call(arguments, 0)
    );
  }
}

module.exports = HClass;

});

__exports('util/sha1', function() {

  /* = Description
  ** A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
  ** in FIPS 180-1. Also includes a Base64 encoder.
  **
  ** = Original implementation:
  ** Copyright Paul Johnston 2000 - 2009.
  ** Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
  ** Distributed under the BSD License
  ** See http://pajhome.org.uk/crypt/md5 for details.
  **
  */
class SHA {

  /* = Description
  * Constructs an instance of SHA
  *
  * = Parameters
  * +_chrsz+::   The input character size, in bits. Optional.
  *
  */
  constructor(_chrsz) {
    console.warn('SHA1 is not secure; use SHA256 instead!');
    /* hex output format. 0 - lowercase; 1 - uppercase        */
    this._hexcase = 0;
    /* base-64 pad character. "=" for strict RFC compliance   */
    this._b64pad = '=';
    /* bits per input character. 8 - ASCII; 16 - Unicode      */
    this._chrsz = 8;
    // set chr size:
    _chrsz && this.setChrsz(_chrsz);
  }

  /* = Description
  * Returns the letter case of the hexadecimal output.
  *
  * = Returns
  * 1 if upporcase, 0 if lowercase.
  */
  hexCase() {
    return this._hexcase;
  }

  /* = Descrition
  * Sets the letter case of the hexadecimal output.
  *
  * = Parameters:
  * +_case+::  1: Upper case
  *            0: Lower case
  *
  */
  setHexCase(_case) {
    this._hexcase = _case;
  }

  /* Returns the Base64 padding character. Is '=' by default.
  */
  base64Pad() {
    return this._b64pad;
  }

  /* = Description
  * Sets the Base64 padding character.
  *
  * Set to '=' (default) for strict RFC compliance.
  *
  * = Parameters
  * +_pad+::   The padding character
  *
  */
  setBase64Pad(_pad) {
    this._b64pad = _pad;
  }

  /* Returns the number of bits per input character. The default is 8.
  */
  chrsz() {
    return this._chrsz;
  }

  /* = Description
  * Sets the number of bits per input character.
  *
  * = Parameters
  * +_bits+::  Amount of bits per input character. 8 for ascii, 16 for unicode.
  *
  */
  setChrsz(_bits) {
    this._chrsz = _bits;
  }

  /* = Description
  * Calculates the SHA1 of a string and returns the result encoded in hexadecimal.
  *
  * = Parameters
  * +_s+::  The input string.
  *
  * = Returns
  * A hexadecimal-encoded string containing the SHA1 result.
  *
  */
  hexSHA1(_s) {
    const _this = this;
    return _this._binb2hex(
      _this._coreSHA1(
        _this._str2binb(_s),
        _s.length * _this._chrsz
      )
    );
  }

  /* = Description
  * Calculates the SHA1 of a string and returns the result encoded in Base64.
  *
  * = Parameters
  * +_s+::  The input string.
  *
  * = Returns
  * A Base64-encoded string containing the SHA1 result.
  *
  */
  b64SHA1(_s) {
    const _this = this;
    return _this._binb2b64(
      _this._coreSHA1(
        _this._str2binb(_s),
        _s.length * _this._chrsz
      )
    );
  }

  /* = Description
  * Calculates the SHA1 of a string and returns the result as a raw string.
  *
  * = Parameters
  * +_s+::  The input string.
  *
  * = Returns
  * A raw string containing the SHA1 result.
  *
  */
  strSHA1(_s) {
    const _this = this;
    return _this._binb2str(
      _this._coreSHA1(
        _this._str2binb(_s),
        _s.length * _this._chrsz
      )
    );
  }

  /* = Description
  * Calculates the HMAC-SHA1 of a string and returns the result encoded in hexadecimal.
  *
  * = Parameters
  * +_key+::   The key to use.
  * +_data+::  The input data.
  *
  * = Returns
  * A hexadecimal-encoded string containing the HMAC-SHA1 result.
  *
  */
  hexHmacSHA1(_key, _data) {
    const _this = this;
    return _this._binb2hex(
      _this._coreHmacSHA1(_key, _data)
    );
  }

  /* = Description
  * Calculates the HMAC-SHA1 of a string and returns the result encoded in Base64.
  *
  * = Parameters
  * +_key+::   The key to use.
  * +_data+::  The input data.
  *
  * = Returns
  * A Base64-encoded string containing the HMAC-SHA1 result.
  *
  */
  b64HmacSHA1(_key, _data) {
    const _this = this;
    return _this._binb2b64(
      _this._coreHmacSHA1(_key, _data)
    );
  }

  /* = Description
  * Calculates the HMAC-SHA1 of a string and returns the result as a raw string.
  *
  * = Parameters
  * +_key+::   The key to use.
  * +_data+::  The input data.
  *
  * = Returns
  * A raw string containing the HMAC-SHA1 result.
  *
  */
  strHmacSHA1(_key, _data) {
    const _this = this;
    return _this._binb2str(
      _this._coreHmacSHA1(_key, _data)
    );
  }

  /* = Description
  * Encodes a string to Base64.
  *
  * = Parameters
  * +_str+::    The input data.
  *
  * = Returns
  * The Base64 encoded version of the input data.
  *
  */
  str2Base64(_str) {
    const _this = this;
    return _this._binb2b64(_this._str2binb(_str));
  }

  /* Performs a simple self-test to see if the VM is working
  */
  test() {
    return this.hexSHA1("abc") === "a9993e364706816aba3e25717850c26c9cd0d89d";
  }

  /* Calculate the SHA-1 of an array of big-endian words, and a bit length
  */
  _coreSHA1(_x, _len) {

    _x[_len >> 5] |= 0x80 << (24 - _len % 32);
    _x[((_len + 64 >> 9) << 4) + 15] = _len;

    const _this = this;
    let _a = 1732584193;
    let _b = -271733879;
    let _c = -1732584194;
    let _d = 271733878;
    let _e = -1009589776;
    const _w = new Array(80);
    let i;
    let _olda;
    let _oldb;
    let _oldc;
    let _oldd;
    let _olde;
    let j;
    let _t;

    for (i = 0; i < _x.length; i += 16) {
      _olda = _a;
      _oldb = _b;
      _oldc = _c;
      _oldd = _d;
      _olde = _e;

      for (j = 0; j < 80; j++) {
        if (j < 16) {
          _w[j] = _x[i + j];
        }
        else {
          _w[j] = _this._rol(_w[j-3] ^ _w[j-8] ^ _w[j-14] ^ _w[j-16], 1);
        }
        _t = _this._safeAdd(_this._safeAdd(_this._rol(_a, 5), _this._sha1FT(j, _b, _c, _d)),
             _this._safeAdd(_this._safeAdd(_e, _w[j]), _this._sha1KT(j)));
        _e = _d;
        _d = _c;
        _c = _this._rol(_b, 30);
        _b = _a;
        _a = _t;
      }

      _a = _this._safeAdd(_a, _olda);
      _b = _this._safeAdd(_b, _oldb);
      _c = _this._safeAdd(_c, _oldc);
      _d = _this._safeAdd(_d, _oldd);
      _e = _this._safeAdd(_e, _olde);
    }
    return [_a, _b, _c, _d, _e];
  }

  /* Perform the appropriate triplet combination function for the current
  * iteration
  */
  _sha1FT(_t, _b, _c, _d) {
    if (_t < 20) {
      return (_b & _c) | ((~_b) & _d);
    }
    if (_t < 40) {
      return _b ^ _c ^ _d;
    }
    if (_t < 60) {
      return (_b & _c) | (_b & _d) | (_c & _d);
    }
    return _b ^ _c ^ _d;
  }

  /* Determine the appropriate additive constant for the current iteration
  */
  _sha1KT(_t) {
    return (_t < 20) ? 1518500249 : (_t < 40) ? 1859775393 :
           (_t < 60) ? -1894007588 : -899497514;
  }

  /*
   * Calculate the HMAC-SHA1 of a key and some data
   */
  _coreHmacSHA1(_key, _data) {
    const _this = this;
    let _bkey = _this._str2binb(_key);
    const _ipad = new Array(16);
    const _opad = new Array(16);
    let i;
    if (_bkey.length > 16) {
      _bkey = _this._coreSHA1(_bkey, _key.length * _this._chrsz);
    }
    for (i = 0; i < 16; i++){
      _ipad[i] = _bkey[i] ^ 0x36363636;
      _opad[i] = _bkey[i] ^ 0x5C5C5C5C;
    }
    const _hash = _this._coreSHA1(_ipad.concat(_this._str2binb(_data)), 512 + _data.length * _this._chrsz);
    return _this._coreSHA1(_opad.concat(_hash), 512 + 160);
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  _safeAdd(_x, _y) {
    const _lsw = (_x & 0xFFFF) + (_y & 0xFFFF);
    const _msw = (_x >> 16) + (_y >> 16) + (_lsw >> 16);
    return (_msw << 16) | (_lsw & 0xFFFF);
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  _rol(_num, _cnt){
    return (_num << _cnt) | (_num >>> (32 - _cnt));
  }

  /*
   * Convert an 8-bit or 16-bit string to an array of big-endian words
   * In 8-bit function, characters >255 have their hi-byte silently ignored.
   */
  _str2binb(_str) {
    const _this = this;
    const _bin = [];
    const _mask = (1 << _this._chrsz) - 1;
    const _strLenChrSZ = _str.length * _this._chrsz;
    let i;
    for (i = 0; i < _strLenChrSZ; i += _this._chrsz) {
      _bin[i>>5] |= (_str.charCodeAt(i / _this._chrsz) & _mask) << (32 - _this._chrsz - i%32);
    }
    return _bin;
  }

  /*
   * Convert an array of big-endian words to a string
   */
  _binb2str(_bin) {
    const _this = this;
    let _str = '';
    const _mask = (1 << _this._chrsz) - 1;
    let i;
    const _binLen32 = _bin.length * 32;
    const _32chrsz = 32 - _this._chrsz;
    for (i = 0; i < _binLen32; i += _this._chrsz) {
      _str += String.fromCharCode((_bin[i>>5] >>> (_32chrsz - i%32)) & _mask);
    }
    return _str;
  }

  /*
   * Convert an array of big-endian words to a hex string.
   */
  _binb2hex(_binarray) {
    const _this = this;
    const _hexTab = _this._hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    let _str = '';
    let i;
    const _binLen = _binarray.length * 4;
    for (i = 0; i < _binLen; i++) {
      _str += _hexTab.charAt((_binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
              _hexTab.charAt((_binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
    }
    return _str;
  }

  /*
   * Convert an array of big-endian words to a base-64 string
   */
  _binb2b64(_binarray) {
    const _this = this;
    const _tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let _str = '';
    let i;
    const _binLen = _binarray.length * 4;
    let _t1;
    let _t2;
    let _t3;
    let _triplet;
    let j;
    const _binLen32 = _binarray.length * 32;
    for (i = 0; i < _binLen; i += 3) {
      _t1 = (((_binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16);
      _t2 = (((_binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 );
      _t3 = ((_binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
      _triplet = (_t1 | _t2 | _t3);
      for (j = 0; j < 4; j++){
        if (i * 8 + j * 6 > _binLen32) {
          _str += _this._b64pad;
        }
        else {
          _str += _tab.charAt((_triplet >> 6*(3-j)) & 0x3F);
        }
      }
    }
    return _str;
  }
}

module.exports = SHA;

});

__exports('core/elem', function() {

/*
BROWSER_TYPE contains browser types.
Used for quick checks mostly in layout code
*/

const BROWSER_TYPE = {
  version: 0.0,
  mac: false,
  win: false,
  edge: false,
  opera: false,
  safari: false,
  chrome: false,
  firefox: false,
  firefox4: false, // version 4 or newer
  ios: false,
  iphone: false, // also true for iPod touch
  ipad: false,
  android: false,
  mobile: false,
  lang: 'en-US'
};

/**
The DOM Element abstraction engine
**/
class _ELEM {
  constructor(options) {
    if (!options) {
      options = {};
    }
    // Main control for refresh speed
    this.ELEMTickerInterval = options.ELEMTickerInterval || 33;
    this._gradientIdCount = 0;
  }

  // Sets up object members
  reset() {
    // Startup queue stuff
    this._domLoadQueue = [];
    this._domLoadTimer = null;

    // Flag which turns to true, when the document body is detected as loaded
    this._domLoadStatus = false;

    this._flushTime = 0;
    this._flushCounter = 0;
    this._idleDelay = 500;

    this._timer = null;
    this._minDelay = this.ELEMTickerInterval;
    this._flushing = false;
    this._needFlush = false;
    this._slowness = 1;

    this._elements = {};
    this._nextElemId = 0;
    this._freeElemIds = [];

    this._styleCache = {};
    this._styleTodo = {};
    this._attrTodo = {};
    this._attrCache = {};
    this._elemTodo = [];
    this._elemTodoH = {};
  }

  // Adds an element reference
  // Returns the element id
  _add(_elem) {
    let _id;
    if (this._freeElemIds.length !== 0) {
      _id = this._freeElemIds.shift();
    }
    else {
      _id = this._nextElemId;
      this._nextElemId++;
    }
    this._elements[_id] = _elem;
    return _id;
  }

  // Initializes cache object helpers
  _initCache(_id) {
    this._styleTodo[_id] = [];
    this._styleCache[_id] = {};
    this._attrTodo[_id] = [];
    this._attrCache[_id] = {};
    this._elemTodoH[_id] = false;
  }

  // Adds an existing document element by its id attribute
  bindId(_attrId) {
    const _elem = document.getElementById(_attrId);
    const _id = this._add(_elem);
    this._initCache(_id);
    return _id;
  }

  // Binds the document element
  bind(_elem) {
    const _id = this._add(_elem);
    this._initCache(_id);
    return _id;
  }

  // Returns an element by its id
  get(_id) {
    return this._elements[_id];
  }

  // Returns an element by its id attribute
  getByAttrId(_attrId) {
    return this.get(this.bindId(_attrId));
  }

  // Sets the innerHTML contents of the element
  setHTML(_id, _html) {
    const _elem = this._elements[_id];
    if (_elem.innerHTML !== _html) {
      _elem.innerHTML = _html;
    }
  }

  // Returns the innerHTML of the element
  getHTML(_id) {
    return this._elements[_id].innerHTML;
  }

  // Deletes an element and its associated metadata
  del(_id) {
    const _elem = this._elements[_id];
    const i = this._elemTodo.indexOf(_id);
    if (i !== -1) {
      this._elemTodo.splice(i, 1);
    }
    delete this._attrTodo[_id];
    delete this._styleCache[_id];
    delete this._attrCache[_id];
    delete this._elemTodoH[_id];
    delete this._elements[_id];
    this._freeElemIds.push(_id);
    const _parent = _elem.parentNode;
    if (_parent) {
      _parent.removeChild(_elem);
    }
    else {
      console.warn('ELEM.del(', _id,
        '): Invalid parent: ', _parent,
        'for elem:', _elem);
    }
  }

  // Places the source element inside the target element
  append(_srcId, _tgtId) {
    this._elements[_tgtId].appendChild(this._elements[_srcId]);
  }

  moveToParent(_id, _parentId) {
    const _elem = this._elements[_id];
    _elem.parentNode.removeChild(_elem);
    this._elements[_parentId].appendChild(_elem);
  }

  // Replaces all styles of an element with a block of css text
  setCSS(_id, _css) {
    this._elements[_id].style.cssText = _css;
  }

  // Returns the current css text of an element
  getCSS(_id) {
    return this._elements[_id].style.cssText;
  }

  // Returns the visible size of an element as a [ width, height ] tuple
  getVisibleSize(_id) {
    let _elem = this._elements[_id];
    let [w, h] = [_elem.offsetWidth, _elem.offsetHeight];
    let _parent = _elem.parentNode;
    while (_parent && _parent.nodeName.toLowerCase() !== 'body') {
      if (this._getComputedStyle(_parent, 'overflow') === 'visible') {
        if (w > _parent.clientWidth) {
          w = _parent.clientWidth - _elem.offsetLeft;
        }
        if (h > _parent.clientHeight) {
          h = _parent.clientHeight - _elem.offsetTop;
        }
      }
      _elem = _elem.parentNode;
      if (!_parent.parentNode) {
        break;
      }
      _parent = _parent.parentNode;
    }
    return [w, h];
  }

  // Returns the full offset size of the element as a [ width, height ] tuple
  getSize(_id) {
    const _elem = this._elements[_id];
    let [w, h] = [0, 0];
    if (this._isSVGElem(_elem)) {
      const _rect = _elem.getBoundingClientRect();
      [w, h] = [_rect.width, _rect.height];
    }
    else if (_elem) {
      [w, h] = [_elem.offsetWidth, _elem.offsetHeight];
    }
    else {
      console.warn('ELEM.getSize(', _id, '): Element not found');
    }
    return [w, h];
  }

  // Returns the position of the element as a [ x, y ] tuple
  getPosition(_id) {
    const _elem = this._elements[_id];
    let [x, y] = [0, 0];
    if (this._isSVGElem(_elem)) {
      const _rect = _elem.getBoundingClientRect();
      [x, y] = [_rect.left, _rect.top];
    }
    else if (_elem) {
      [x, y] = [_elem.offsetLeft, _elem.offsetTop];
    }
    else {
      console.warn('ELEM.getPosition(', _id, '): Element not found');
    }
    return [x, y];
  }

  // Returns the scroll position of the element as a [ x, y ] tuple
  getScrollPosition(_id) {
    const _elem = this._elements[_id];
    let [x, y] = [0, 0];
    if (_elem) {
      [x, y] = [_elem.scrollLeft, _elem.scrollTop];
    }
    else {
      console.warn('ELEM.getScrollPosition(', _id, '): Element not found');
    }
    return [x, y];
  }

  // Returns the scroll size of the element as a [ width, height ] tuple
  getScrollSize(_id) {
    const _elem = this._elements[_id];
    let [w, h] = [0, 0];
    if (_elem) {
      [w, h] = [_elem.scrollWidth, _elem.scrollHeight];
    }
    else {
      console.warn('ELEM.getScrollSize(', _id, '): Element not found');
    }
    return [w, h];
  }

  // Calculates the visible left position of an element
  // If _noOwnScoll is true, method not include scrollLeft of element itself.
  _getVisibleLeftPosition(_id, _noOwnScoll) {
    let _elem = this._elements[_id];
    let x = 0;
    if (_elem) {
      while (_elem !== document.body) {
        x += _elem.offsetLeft;
        if (this._getComputedStyle(_elem, 'position') === 'fixed') {
          x += document.body.scrollLeft;
          break;
        }
        if (!_noOwnScoll || _elem !== this._elements[_id]) {
          x -= _elem.scrollLeft;
        }
        _elem = _elem.parentNode;
      }
    }
    else {
      console.warn('ELEM._getVisibleLeftPosition(', _id, '): Element not found');
    }
    return x;
  }

  // Calculates the visible top position of an element
  // If _noOwnScoll is true, method not include scrollTop of element itself.
  _getVisibleTopPosition(_id, _noOwnScoll) {
    let _elem = this._elements[_id];
    let y = 0;
    if (_elem) {
      while (_elem !== document.body) {
        y += _elem.offsetTop;
        if (this._getComputedStyle(_elem, 'position' ) === 'fixed') {
          y += document.body.scrollTop;
          break;
        }
        if (!_noOwnScoll || _elem !== this._elements[_id]) {
          y -= _elem.scrollTop;
        }
        _elem = _elem.parentNode;
      }
    }
    else {
      console.warn('ELEM._getVisibleTopPosition(', _id, '): Element not found');
    }
    return y;
  }

  // Returns the visible position of the element as a [ left, top ] tuple
  // If _noOwnScoll is true, method not include scrollLeft and scrollTop of element itself.
  getVisiblePosition(_id, _noOwnScoll) {
    return [
      this._getVisibleLeftPosition(_id, _noOwnScoll),
      this._getVisibleTopPosition(_id, _noOwnScoll)
    ];
  }

  // Returns the opacity on the element as a number equaling or between 0 and 1
  getOpacity(_id) {
    const _elem = this._elements[_id];
    const _opacity = this._getComputedStyle(_elem, 'opacity');
    return parseFloat(_opacity);
  }

  // Sets the opcity of the element as a number equaling or between 0 and 1
  setOpacity(_id, _opacity) {
    this._elements[_id].style.setProperty('opacity', _opacity.toString(), '');
  }

  // Wrapper for getStyle, returns an integer number instead of a string
  getIntStyle(_id, _key) {
    return parseInt(this.getStyle(_id, _key), 10);
  }

  // Sets element position ( id, [ x, y ] )
  setPosition(_id, x, y) {
    if (!y && y !== 0 && x instanceof Array) {
      [x, y] = x; // assume tuple
    }
    this.setStyle(_id, 'left', `${x}px`);
    this.setStyle(_id, 'top', `${y}px`);
  }

  // Shortcut for filling parent dimensions with optional offset(s)
  stretchToParentBounds(_id, l, t, r, b) {
    if (!l && l !== 0) {
      [l, t, r, b] = [0, 0, 0, 0];
    }
    else if (l instanceof Array) {
      [l, t, r, b] = l;
    }
    else if (!t && t !== 0) {
      [l, t, r, b] = [l, l, l, l];
    }
    this.setStyle(_id, 'position', 'absolute');
    this.setStyle(_id, 'display', 'block');
    this.setStyle(_id, 'left', `${l}px`);
    this.setStyle(_id, 'top', `${t}px`);
    this.setStyle(_id, 'width', 'auto');
    this.setStyle(_id, 'height', 'auto');
    this.setStyle(_id, 'right', `${r}px`);
    this.setStyle(_id, 'bottom', `${b}px`);
  }

  // Sets box coordinates [ x, y, width, height ]
  setBoxCoords(_id, _coords) {
    const [x, y, w, h] = _coords;
    this.setStyle(_id, 'left', `${x}px`);
    this.setStyle(_id, 'top', `${y}px`);
    this.setStyle(_id, 'width', `${w}px`);
    this.setStyle(_id, 'height', `${h}px`);
  }

  // Gets box coordinates [ x, y, width, height ]
  getBoxCoords(_id) {
    const [x, y] = this.getPosition(_id);
    const [w, h] = this.getSize(_id);
    return [x, y, w, h];
  }

  // Returns the visible box coordinates of the element as a [ left, top, width, height ]
  getVisibleBoxCoords(_id, _noOwnScoll) {
    const [x, y] = this.getVisiblePosition(_id, _noOwnScoll);
    const [w, h] = this.getSize(_id);
    return [x, y, w, h];
  }

  // Computes extra size (padding and border size) of element
  _getExtraSize(_id, _side) {
    return (
      this.getIntStyle(_id, `padding-${_side}`) +
      this.getIntStyle(_id, `border-${_side}-width`)
    );
  }

  // Returns left-side padding and border size
  _getExtraLeftWidth(_id) {
    return this._getExtraSize(_id, 'left');
  }

  // Returns right-side padding and border size
  _getExtraRightWidth(_id) {
    return this._getExtraSize(_id, 'right');
  }

  // Returns top-side padding and border size
  _getExtraTopWidth(_id) {
    return this._getExtraSize(_id, 'top');
  }

  // Returns right-side padding and border size
  _getExtraBottomWidth(_id) {
    return this._getExtraSize(_id, 'bottom');
  }

  // Returns extra width of element (caused by padding and borders)
  getExtraWidth(_id) {
    return (
      this._getExtraSize(_id, 'left') +
      this._getExtraSize(_id, 'right')
    );
  }

  // Returns extra height of element (caused by padding and borders)
  getExtraHeight(_id) {
    return (
      this._getExtraSize(_id, 'top') +
      this._getExtraSize(_id, 'bottom')
    );
  }

  isFullScreen() {
    return !!(
      document.fullScreenElement ||
      document.mozFullScreen ||
      document.webkitIsFullScreen
    );
  }

  // Sets delay between refreshes based on the target frame rate
  setFPS(_fps) {
    this._minDelay = Math.round(1000 / _fps);
    if (this._minDelay < this.ELEMTickerInterval) {
      this._minDelay = this.ELEMTickerInterval;
    }
  }

  // Sets slowness (weighted factor for slow browsers; essentially frame-skip)
  // The d-efault 1.0 does not change the FPS, larger numbers gives more time for logic by skipping frames
  setSlowness(_slow) {
    this._slowness = _slow;
  }

  // Sets the idle delay in ms
  // This is the maximum time between setting a style or
  // property into the buffer and flushing the buffer to the DOM
  setIdleDelay(_idleDelay) {
    this._idleDelay = _idleDelay;
  }

  // Resets the flushLoop
  _resetFlushLoop(_delay, _timeDelay) {
    const _this = this;
    if (!_timeDelay) {
      _timeDelay = _delay;
    }
    this._timer = setTimeout(() => {
      _this.flushLoop(_delay);
    }, _timeDelay);
  }

  // Computes a default delay time based on various params
  _defaultDelay() {
    let _delay = Math.round(
      this._slowness * (this._flushTime / this._flushCounter)
    );
    if (_delay < this._minDelay || !_delay) {
      _delay = this._minDelay;
    }
    return _delay;
  }

  // Flushes buffered styles and properties into the DOM
  flushLoop(_delay) {
    if (!_delay && _delay !== 0) {
      _delay = this._defaultDelay();
    }
    clearTimeout(this._timer);
    if (this._flushing) {
      _delay *= 2;
      this._resetFlushLoop(_delay);
    }
    else if (!this._needFlush) {
      // go into 'sleep mode'
      this._resetFlushLoop(_delay, this._idleDelay);
    }
    else {
      _delay = this._defaultDelay();
      this._flushing = true;
      this._resetFlushLoop(_delay);
    }
    this._performFlush();
    this._flushing = false;
  }

  // Alias for flushLoop
  flush() {
    this.flushLoop();
  }

  flushElem(_elemIds) {
    if (typeof _elemIds === 'number') {
      _elemIds = [_elemIds];
    }
    const _this = this;
    _elemIds.forEach(_id => {
      if (_this._elemTodoH[_id]) {
        _this._elemTodoH[_id] = false;
        _this._flushStyleCache(_id);
        _this._flushAttrCache(_id);
      }
    });
  }

  // Performs the flush of flushLoop
  _performFlush() {
    const _flushStartTime = new Date().getTime();
    this._flushTime -= _flushStartTime;
    const _loopMaxL = this._elemTodo.length;
    if (_loopMaxL > 0) {
      const _currTodo = this._elemTodo.splice(0, _loopMaxL);
      for (const i = 0; i < _loopMaxL; i++) {
        this._flushLoopFlushed++;
        const _id = _currTodo.shift();
        if (!_id && _id !== 0) {
          console.warn('ELEM._performFlush; no id:', _id);
        }
        else {
          this._elemTodoH[_id] = false;
          this._flushStyleCache(_id);
          this._flushAttrCache(_id);
        }
      }
    }
    this._flushCounter++;
    this._flushTime += new Date().getTime();
    this._needFlush = this._elemTodo.length !== 0;
  }

  // Flushes the attribute cache
  _flushAttrCache(_id) {
    const _attrTodo = this._attrTodo[_id];
    if (_attrTodo.length !== 0) {
      const _attrCache = this._attrCache[_id];
      const _elem = this._elements[_id];
      const _loopMaxL = _attrTodo.length;
      const _currTodo = _attrTodo.splice(0, _loopMaxL);
      for (const i = 0; i < _loopMaxL; i++) {
        const _key = _currTodo.shift();
        const _val = _attrCache[_key];
        _elem[_key] = _val;
      }
    }
  }

  // Return true if element is SVGElement
  _isSVGElem(_elem) {
    try {
      return _elem instanceof SVGElement;
    }
    catch (e) {
      // not all browsers have SVGElement:
      return false;
    }
  }

  // Gets an element attribute directly from the element
  _getAttrDirect(_id, _key) {
    const _elem = this._elements[_id];
    const _attr = _elem[_key];
    if (!_attr && _attr !== 0 && _attr !== '') {
      return _elem.getAttribute(_key);
    }
    else {
      return _attr;
    }
  }

  // Gets a named element attribute from the cache or selectively direct
  getAttr(_id, _key, _noCache) {
    if (!this._attrCache[_id]) {
      return null;
    }
    else {
      if (_key === 'class') {
        _key = 'className';
      }
      let _val = this._attrCache[_id][_key];
      if (_noCache || (!_val && _val !== '' && _val !== 0)) {
        _val = this._getAttrDirect(_id, _key);
        this._attrCache[_id][_key] = _val;
      }
      return _val;
    }
  }

  // Sets a named element attribute into the cache and buffer or selectively direct
  setAttr(_id, _key, _value, _noCache) {
    if (this._elements[_id]) {
      const _attrTodo = this._attrTodo[_id];
      const _attrCache = this._attrCache[_id];
      if (_noCache) {
        this._elements[_id][_key] = _value;
      }
      const _reCache = (_value !== this.getAttr(_id, _key));
      if (_reCache || _noCache) { // skip if nothing changes
        _attrCache[_key] = _value;
        if (!_noCache) {
          if (!_attrTodo.includes(_key)) {
            _attrTodo.push(_key);
          }
          if (!this._elemTodoH[_id]) {
            this._elemTodo.push(_id);
            this._elemTodoH[ _id ] = true;
            this._checkNeedFlush();
          }
        }
      }
    }
  }

  // Deletes a named element attribute
  delAttr(_id, _key) {
    if (this._elements[_id]) {
      const _attrTodo = this._attrTodo[_id];
      const _attrCache = this._attrCache[_id];
      delete _attrCache[_key];
      this._elements[_id].removeAttribute(_key);
      const _todoIndex = _attrTodo.indexOf(_key);
      if (_todoIndex !== -1) {
        _attrTodo.splice(_todoIndex, 1);
      }
      this._checkNeedFlush();
    }
  }

  // Get classnames of element
  _getClassNames(_id) {
    const _elem = this._elements[_id];
    if (this._isSVGElem(_elem)) {
      _elem.className.baseVal;
    }
    else {
      _elem.className;
    }
  }

  // Set classnames for element
  _setClassNames(_id, _className) {
    const _elem = this._elements[_id];
    if (this._isSVGElem(_elem)) {
      _elem.className.baseVal = _className;
    }
    else {
      _elem.className = _className;
    }
  }

  // Checks if the element has a named CSS className
  hasClassName(_id, _className) {
    if (this._elements[_id]) {
      const _classNames = this._getClassNames(_id).split(' ');
      return _classNames.includes(_className);
    }
    return null;
  }

  // Adds a named CSS className to the element
  addClassName(_id, _className) {
    if (this._elements[_id]) {
      if (!this.hasClassName(_id, _className)) {
        const _elem = this._elements[_id];
        if (this._getClassNames(_id).trim() === '') {
          this._setClassNames(_id, _className);
        }
        else {
          const _classNames = this._getClassNames(_id).trim().split(' ');
          _classNames.push(_className);
          this._setClassNames(_id, _classNames.join(' '));
        }
        this._attrCache[_id].className = this._getClassNames(_id);
      }
    }
  }

  // Removes a named CSS className of the element
  delClassName(_id, _className) {
    if (this._elements[_id]) {
      if (this.hasClassName(_id, _className)) {
        const _elem = this._elements[_id];
        const _classNames = this._getClassNames(_id).split(' ');
        _classNames.splice(_classNames.indexOf(_className), 1);
        this._setClassNames(_id, _classNames.join(' '));
        this._attrCache[_id].className = this._getClassNames(_id);
      }
    }
  }

  removeClassName(_id, _className) {
    return this.delClassName(_id, _className);
  }

  // Checks if buffers need to be flushed
  _checkNeedFlush() {
    if (!this._needFlush) {
      this._needFlush = true;
      if (!this._flushing) {
        clearTimeout(this._timer);
        this._resetFlushLoop(this._minDelay);
      }
    }
  }

  // Low-level style property setter
  _setElementStyle(_elem, _key, _value) {
    _elem.style.setProperty(_key, _value, '');
  }

  // Camelizes string (mostly used for IE attribute name conversions)
  _camelize(_str) {
    return _str.replace(/((-)([a-z])(\w))/g, ($0, $1, $2, $3, $4) => {
      return $3.toUpperCase() + $4;
    });
  }

  // Decamelizes string (used for js property to css property conversion)
  _deCamelize(_str) {
    return _str.replace(/(([A-Z])(\w))/g, ($0, $1, $2, $3) => {
      return '-' + $2.toLowerCase() + $3;
    });
  }

  // Sets and buffers the named style attribute value or selectively direct
  setStyle(_id, _key, _value, _noCache) {
    if (this._elements[_id]) {
      if (!_id && _id !== 0) {
        console.error(
          'ERROR; no id in ELEM.setStyle',
          _id, _key, _value, _noCache
        );
      }
      let _cached = this._styleCache[_id];
      const _elem = this._elements[_id];
      if (!_cached && _cached !== 0 && _cached !== '') {
        this._initCache(_id);
        _cached = this._styleCache[_id];
      }
      _key = this._deCamelize(_key);
      if (_value !== _cached[_key]) {
        _cached[_key] = _value;
        if (_noCache) {
          if (_key === 'opacity') {
            this.setOpacity(_id, _value);
          }
          else {
            this._setElementStyle(_elem, _key, _value);
          }
        }
        else {
          const _styleTodo = this._styleTodo[_id];
          if (!_styleTodo.includes(_key)) {
            _styleTodo.push(_key);
          }
          if (!this._elemTodoH[_id]) {
            this._elemTodo.push(_id);
            this._elemTodoH[_id] = true;
            this._checkNeedFlush();
          }
        }
      }
    }
  }

  // Sets multiple styles at once
  setStyles(_id, _styles, _noCache) {
    const _this = this;
    if (typeof _styles === 'object') {
      _styles = Object.entries(_styles);
    }
    if (_styles instanceof Array) {
      _styles.forEach(([_key, _value]) => {
        _this.setStyle(_id, _key, _value, _noCache);
      });
    }
    else {
      console.error('ERROR calling ELEM.setStyles; _styles is not an object nor Array:', typeof _styles);
    }
  }

  // Creates a new element inside another element
  make(_targetId, _tagName, _options) {
    if (!_targetId) {
      _targetId = 0;
    }
    if (!_tagName) {
      _tagName = 'DIV';
    }
    else {
      _tagName = _tagName.toUpperCase();
    }
    const _this = this;
    const _elem = document.createElement(_tagName);
    const _id = this._add(_elem);
    this._initCache(_id);
    if (_options) {
      let _attrs;
      if (_options.attrs) {
        _attrs = _options.attrs;
      }
      else if (_options.attr) {
        _attrs = _options.attr;
      }
      if (_attrs) {
        if (typeof _attrs === 'object') {
          _attrs = Object.entries(_attrs);
        }
        if (_attrs instanceof Array) {
          _attrs.forEach(([_key, _value]) => {
            _this.setAttr(_id, _key, _value, true);
          });
        }
      }
      const _classes = _options.classes;
      if (_classes) {
        if (_classes instanceof Array) {
          _classes.forEach(_className => {
            _this.addClassName(_id, _className);
          });
        }
      }
      if (_options.styles) {
        this.setStyles(_id, _options.styles);
      }
      if (_options.html) {
        this.setHTML(_id, _options.html);
      }
    }
    this._elements[_targetId].appendChild(_elem);
    return _id;
  }

  // Returns window scroll position as [ left, top ]
  windowScroll() {
    return [
      (window.pageXOffset || document.documentElement.scrollLeft),
      (window.pageYOffset || document.documentElement.scrollTop)
    ];
  }

  // Returns inner size of the browser window as [ width, height ]
  windowSize() {
    let [w, h] = [window.innerWidth, window.innerHeight];
    if ((!w && w !== 0) || (!h && h !== 0)) {
      const _docElem = document.documentElement;
      w = _docElem.clientWidth;
      h = _docElem.clientHeight;
    }
    return [w, h];
  }

  // Returns computed style of element
  _getComputedStyle(_elem, _key) {
    return document
      .defaultView
      .getComputedStyle(_elem, null)
      .getPropertyValue(_key);
  }

  // Gets the named element style attribute value.
  getStyle(_id, _key, _noCache) {
    let _value = null;
    if (this._styleCache[_id]) {
      const _cached = this._styleCache[_id];
      _key = this._deCamelize(_key);
      if (typeof _cached[_key] === 'undefined' || _cached[_key] === null || _noCache) {
        if (_key === 'opacity') {
          _value = this.getOpacity(_id);
        }
        else {
          _value = this._getComputedStyle(this._elements[_id], _key);
        }
        _cached[_key] = _value;
      }
      else {
        _value = _cached[_key];
      }
    }
    return _value;
  }

  // Style buffer flushing method
  _flushStyleCache(_id) {
    const _elem = this._elements[_id];
    if (_elem) {
      const _styleTodo = this._styleTodo[_id];
      const _cached = this._styleCache[_id];
      const _loopMaxP = _styleTodo.length;
      if (_loopMaxP !== 0) {
        const _currTodo = _styleTodo.splice(0, _loopMaxP);
        for (const i = 0; i < _loopMaxP; i++) {
          const _key = _currTodo.shift();
          if (_key === 'opacity') {
            this.setOpacity(_id, _cached[_key]);
          }
          else {
            this._setElementStyle(_elem, _key, _cached[_key]);
          }
        }
      }
    }
  }

  // Final phase of startup, when document is loaded
  _init() {
    if (typeof window.RSenceInit === 'function') {
      window.RSenceInit();
    }
    if (!this._timer) {
      this.bind(document.body);
    }
    while (!this._initDone) {
      this._flushDomLoadQueue();
    }
    this._resetFlushLoop(this._minDelay);
  }

  // Runs a cmd
  _runCmd(_cmd) {
    const _type = typeof _cmd;
    if (_type === 'function') {
      _cmd.call();
    }
    else {
      console.error(
        'Evaluation of LOAD strings is not supported.' +
        'Please convert to anonymous function: ' + _cmd);
    }
  }

  // Processes the queue for tasks to run upon completion of document load
  _flushDomLoadQueue() {
    if (this._domLoadQueue.length === 0) {
      this._initDone = true;
    }
    else {
      this._runCmd(this._domLoadQueue.shift());
    }
  }

  /*
  Returns an array of key, value style string pair containing the gradient style supported by the current browser.

  The format of the colorSteps Object with the following items:
    Key      Description
    start    Default background color in a valid hexadecimal color format, also the start color
    end      Default gradient end color for dumber browsers
    type     Currently only 'linearTopBottom' is supported
    steps    An Array containing color, percent (number without suffix) pairs, like [ 10, '#fff']
  */
  _standardGradientSteps(_startColor, _stepsIn, _endColor) {
    const _steps = [`${_startColor} 0%`];
    if (_stepsIn.length !== 0) {
      _stepsIn.forEach(_step => {
        _steps.push(`${_step[1]} ${_step[0]}%`);
      });
    }
    _steps.push(`${_endColor} 100%`);
    return _steps;
  }

  _linearGradientStyle(_gradient) {
    // Firefox 3.6 and newer
    let _key;
    let _steps;
    let _value;
    if (BROWSER_TYPE.firefox) {
      _key = 'background';
      _steps = this._standardGradientSteps(_gradient.start, _gradient.steps, _gradient.end).join(', ');
      _value = `-moz-linear-gradient(top, ${_steps})`;
    }
    // Chrome and Safari
    else if (BROWSER_TYPE.safari || BROWSER_TYPE.chrome) {
      _key = 'background';
      // Chrome10+,Safari5.1+
      _steps = this._standardGradientSteps(_gradient.start, _gradient.steps, _gradient.end).join(',');
      _value = `-webkit-linear-gradient(top, ${_steps})`;
    }
    // Opera 11.10+
    else if (BROWSER_TYPE.opera) {
      _key = 'background';
      _steps = this._standardGradientSteps(_gradient.start, _gradient.steps, _gradient.end).join(',');
      _value = `-o-linear-gradient(top, ${_steps})`;
    }
    else {
      // Old browsers
      _key = 'background';
      _value = _gradient.start;
      // W3C standard:
      // _steps = this._standardGradientSteps(_gradient.start,_gradient.steps,_gradient.end).join(',');
      // _value = `linear-gradient(to bottom, ${_steps})`;
    }
    return [_key, _value];
  }

  _linearGradientCSS(_gradient) {
    this._linearGradientStyle(_gradient).join(': ') + ';';
  }

  // Simply checks whether navigator language includes the string _lang
  hasLang(_lang) {
    return BROWSER_TYPE.lang.includes(_lang);
  }

  // Does browser version checks and starts the document loaded check poll
  _warmup() {
    const _ua = navigator.userAgent;
    const _av = navigator.appVersion;
    const _lang = navigator.language || navigator.userLanguage;
    BROWSER_TYPE.lang = _lang;
    BROWSER_TYPE.opera = _ua.includes('Opera');
    BROWSER_TYPE.chrome = _ua.includes('Chrome') || _ua.includes('CriOS');
    BROWSER_TYPE.safari = _ua.includes('Safari') && !BROWSER_TYPE.chrome;
    const _isIE = document.all && !BROWSER_TYPE.opera;
    if (_isIE) {
      alert('Microsoft Internet Explorer is no longer supported. Please upgrade.');
    }
    BROWSER_TYPE.edge = _ua.includes('Edge');
    BROWSER_TYPE.mac = _ua.includes('Macintosh');
    BROWSER_TYPE.win = _ua.includes('Windows');
    BROWSER_TYPE.firefox = _ua.includes('Firefox');
    BROWSER_TYPE.firefox4 = BROWSER_TYPE.firefox;
    const _iPhone = _ua.includes('iPhone') || _ua.includes('iPod');
    const _iPad = _ua.includes('iPad');
    const _iPod = _ua.includes('iPod');
    BROWSER_TYPE.ios = _iPhone || _iPad || _iPod;
    BROWSER_TYPE.iphone = _iPhone;
    BROWSER_TYPE.ipad = _iPad;
    BROWSER_TYPE.ipod = _iPod;
    BROWSER_TYPE.android = _ua.includes('Android');
    BROWSER_TYPE.mobile = _av.includes('Mobile');

    // WARN: this language hack is going to be deprecated once there's a proper system around:
    BROWSER_TYPE.lang_fi = this.hasLang('fi');
    BROWSER_TYPE.lang_en = !BROWSER_TYPE.lang_fi;

    this._domWaiter();
  }

  // Adds tasks to run when the document load check is completed
  _domLoader(_cmd) {
    if (this._initDone) {
      this._runCmd(_cmd);
    }
    else {
      this._domLoadQueue.push(_cmd);
    }
  }

  // Checks if the document is fully loaded
  _domWaiter() {
    if (BROWSER_TYPE.safari && document.readyState === 'complete') {
      this._domLoadStatus = true;
    }
    else if (document.body) {
      this._domLoadStatus = true;
    }
    if (this._domLoadStatus) {
      clearTimeout(this._domLoadTimer);
      this._init();
    }
    else {
      const _this = this;
      this._domLoadTimer = setTimeout(() => {
        _this._domWaiter();
      }, 10);
    }
  }
}

const ELEM = new _ELEM();
ELEM.reset();
ELEM._warmup();
const LOAD = thing => {
  ELEM._domLoader(thing);
};

module.exports = {ELEM, LOAD, BROWSER_TYPE};

});

__exports('core/event', function() {

const {ELEM, BROWSER_TYPE} = require('core/elem');

/* = Description
** Abstracts the DOM Event differences between browsers.
**/
const Event = {

  /* Returns the element of the event.
  */
  element: function(e) {
    return e.target || e.srcElement;
  },

  /* Returns the mouse cursor x -coordinate of the event.
  */
  pointerX: function(e) {
    if (/touch/.test(e.type)) {
      return e.changedTouches[0].pageX;
    }
    else {
      return (e.pageX || e.clientX);
    }
  },

  /* Returns the mouse cursor y -coordinate of the event.
  */
  pointerY: function(e) {
    if (/touch/.test(e.type)) {
      return e.changedTouches[0].pageY;
    }
    else {
      return (e.pageY || e.clientY);
    }
  },

  /* Stops event propagation
  */
  stop: function(e) {
    if (e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    else {
      e.returnValue = false;
      e.cancelBubble = true;
    }
  },

  /* Returns true if the left mouse butten was clicked.
  */
  isLeftClick: function(e) {
    if (e.type === 'touchend' || BROWSER_TYPE.ipad || BROWSER_TYPE.iphone) {
      return true;
    }
    // IE: left 1, middle 4, right 2
    if (BROWSER_TYPE.ie && !BROWSER_TYPE.ie8 && !BROWSER_TYPE.ie9 && !BROWSER_TYPE.ie10) {
      return (e.button === 1 || e.button === 3 || e.button === 5);
    }
    else {
      return (e.button === 0);
    }
  },

  /* List of event observers
  **/
  observers: false,

  /* Implementation of observe */
  _observeAndCache: function(_elem, _name, _function, _useCapture) {
    _name = Event.wrapEventName(_name);
    if (typeof _name === 'undefined') {
      return;
    }
    if (!Event.observers) {
      Event.observers = [];
    }
    if (_elem && _elem.addEventListener) {
      this.observers.push([_elem, _name, _function, _useCapture]);
      _elem.addEventListener(_name, _function, _useCapture);
    }
    else if (_elem && _elem.attachEvent) {
      this.observers.push([_elem, _name, _function, _useCapture]);
      _elem.attachEvent('on' + _name, _function);
    }
  },

  /* Flushes the event observer cache.
  **/
  unloadCache: function() {
    if (!Event.observers) {
      return;
    }
    const l = Event.observers.length;
    for (const i = 0; i < l; i++) {
      try {
        Event.stopObserving.apply(this, Event.observers[0]);
      }
      catch (e) {
        console.warn(e);
      }
    }
    Event.observers = false;
  },

  /* Starts observing the named event of the element and
  * specifies a callback function.
  **/
  observe: function(_elem, _name, _function, _useCapture) {
    _useCapture = _useCapture || false;
    if (typeof _elem === 'number') {
      _elem = ELEM.get(_elem);
    }
    Event._observeAndCache(_elem, _name, _function, _useCapture);
    return _function;
  },

  /* Stops observing the named event of the element and
  * removes the callback function.
  **/
  stopObserving: function(_elem, _name, _function, _useCapture) {
    _name = Event.wrapEventName(_name);
    if (typeof _name === 'undefined') {
      return;
    }
    if (typeof _elem === 'number') {
      _elem = ELEM.get(_elem);
    }
    if (typeof _elem === 'undefined') {
      // console.log('Warning Event.stopObserving of event name: "' + _name + '" called with an undefined elem!');
      return;
    }
    _useCapture = _useCapture || false;
    if (_elem.removeEventListener) {
      _elem.removeEventListener(_name, _function, _useCapture);
    }
    else if (_elem.detachEvent) {
      _elem.detachEvent(`on${_name}`, _function);
    }
    let i = 0;
    while (i < Event.observers.length) {
      const eo = Event.observers[i];
      if (eo && eo[0] === _elem && eo[1] === _name && eo[2] === _function && eo[3] === _useCapture) {
        Event.observers[i] = null;
        Event.observers.splice(i, 1);
      }
      else {
        i += 1;
      }
    }
  },

  hasTouch: function() {
    return (
      ('ontouchstart' in window) ||    // html5 browsers
      (navigator.maxTouchPoints > 0)); // MS EDGE?
  },

  wrapEventName: function(_name) {
    if (Event.hasTouch()) {
      if (_name === 'mousedown') {
        _name = 'touchstart';
      }
      else if (_name === 'mousemove') {
        _name = 'touchmove';
      }
      else if (_name === 'mouseup') {
        _name = 'touchend';
      }
      else if (_name === 'click') {
        // _name = undefined;
      }
    }
    return _name;
  },

  // List of ASCII "special characters":
  KEY_BACKSPACE: 8,
  KEY_TAB: 9,
  KEY_RETURN: 13,
  KEY_ESC: 27,
  KEY_SPACE: 32,
  KEY_LEFT: 37,
  KEY_UP: 38,
  KEY_RIGHT: 39,
  KEY_DOWN: 40,
  KEY_DELETE: 46,
  KEY_HOME: 36,
  KEY_END: 35,
  KEY_PAGEUP: 33,
  KEY_PAGEDOWN: 34

};

// TODO: Deprecate this at some point:
window.Event = Event;

module.exports = Event;

});

__exports('util/util_methods', function() {

const HClass = require('core/class');
const {LOAD} = require('core/elem');
let COMM; LOAD(() => {COMM = require('comm');});
let HLocale; LOAD(() => {HLocale = require('foundation/locale');});
let moment; LOAD(() => {moment = require('moment');});

const _builtinTypeChr = [
  'b', // boolean
  'n', // number
  's' // string
];

  /*
  ** Returns object type as a single-char string.
  ** Use this method to detect the type of the object given.
  **
  ** Returns the type of the object given as a character code. Returns false,
  ** if unknown or unsupported objcet type.
  **
  ** Returns:
  ** _One of the following:_
  ** - 'a': Array
  ** - 'h': Hash (Generic Object)
  ** - 'd': Date
  ** - 'b': Boolean (true/false)
  ** - 'n': Number (integer or float, use #isFloat to see whether it's a float or integer )
  ** - 's': String
  ** - '>': Function
  ** - '~': Null
  ** - '-': Undefined
  ** - 'o': Other object
  ** - '': unknown
  **/
const typeChr = (_obj) => {
  if (typeof _obj === 'undefined') {
    return '-';
  }
  else if (_obj === null) {
    return '~';
  }
  else if (_obj instanceof Function) {
    return '>';
  }
  else {
    const _typeChr = (typeof _obj)[0];
    if (_builtinTypeChr.includes(_typeChr)) {
      // 'b', 'n' or 's':
      return _typeChr;
    }
    else if (_typeChr === 'o') {
      if (_obj instanceof Array) {
        return 'a';
      }
      else if (_obj instanceof Date) {
        return 'd';
      }
      else if (_obj.constructor === Object) {
        return 'h';
      }
      else {
        // TODO; map out occurrences here
        console.warn(
          'typeChr encountered an unknown object type, which was substituted by an "o":',
          _obj
        );
        return 'o';
      }
    }
    else {
      return '';
    }
  }
};

const _hexCharacters = '0123456789abcdef'.split('');

const _hexColorLengths = [3, 4, 6, 7];

const baseStrToNum = (_str, _base) => {
  if (typeChr(_str) !== 's') {
    return null;
  }
  if (!_base) {
    _base = 10;
  }
  return parseInt(_str, _base);
};

const baseNumToStr = (_num, _base) => {
  if (typeChr(_num) !== 'n') {
    return null;
  }
  if (!_base) {
    _base = 10;
  }
  return _num.toString(_base);
};

const _defaultEscapeHTMLArr = [
  [new RegExp(/&/gmi), '&amp;'],
  [new RegExp(/>/gmi), '&gt;'],
  [new RegExp(/</gmi), '&lt;'],
  [new RegExp(/\n/gmi), '<br>'],
];

/* = Description
* Method to escape HTML from text.
*
* Converts < to &lt; and > to &gt; and & to &amp;
*
* = Parameters
* +_html+:: The html to escape.
*
* = Returns
* A string with the html escaped.
*/
const escapeHTML = (_html, _escapes) => {
  if (!_escapes) {
    _escapes = _defaultEscapeHTMLArr;
  }
  const _tc = typeChr(_html);
  if (_tc in ['-', '~', 'o', '>', 'h']) {
    return '';
  }
  else if (_tc === 's') {
    _escapes.forEach(([_in, _out]) => {
      _html = _html.replace(_in, _out);
    });
    return _html;
  }
  else {
    return _html.toString();
  }
};

const _hex3To6Ratio = 4097; // parseInt('1001',16)

const hexToNum = (_hex) => {
  return baseStrToNum(_hex, 16);
};

const numToHex = (_int) => {
  return baseNumToStr(_int, 16);
};

// Recursively merges two objects of identical structure (array or object)
const updateObject = (_src, _dst) => {
  const _typeSrc = typeChr(_src);
  const _typeDst = typeChr(_dst);
  const _merge = (_item, i) => {
    const _itemType = typeChr(_item);
    if (_itemType === typeChr(_dst[i]) || typeChr(_dst[i]) in ['~', '-']) {
      if (_itemType === 'a' || _itemType === 'h') {
        if (_itemType === typeChr(_dst[i])) {
          updateObject(_item, _dst[i]);
        }
        else {
          _dst[i] = _item;
        }
      }
      else {
        _dst[i] = _item;
      }
    }
    else {
      console.warn('updateObject; mismatching item type: ', _itemType,
        ' (', _item, ') vs ', typeChr(_dst[i]), ' (', _dst[i], ')');
    }
  };
  if (_typeSrc === _typeDst) {
    if (_typeSrc === 'a') {
      _src.forEach((_item, i) => {
        _merge(_item, i);
      });
    }
    else if (_typeSrc === 'h') {
      Object.entries(_src).forEach(([_key, _value]) => {
        _merge(_value, _key);
      });
    }
  }
};

const _normalizeHexColorToNum = _color => {
  const _hexLen = _color.length;
  if (typeChr(_color) !== 's') {
    return null;
  }
  else if (!_hexColorLengths.includes(_hexLen)) {
    return null;
  }
  else {
    _color = _color.toLowerCase();
    let _isInvalid = false;
    const _shouldHaveHashPrefix = (_hexLen === 4 || _hexLen === 7);
    const _str = _color.split('').map((_chr, i) => {
      if (i === 0 && _shouldHaveHashPrefix) {
        if (_chr === '#') {
          return '';
        }
        else {
          _isInvalid = true;
          return _chr;
        }
      }
      else if (_hexCharacters.includes(_chr)) {
        return _chr;
      }
      else {
        _isInvalid = true;
        return _chr;
      }
    }).join('');
    if (_isInvalid || (_hexLen === 4 && _str.length !== 3) || (_hexLen === 7 && _str.length !== 6)) {
      return null;
    }
    else {
      let _num = hexToNum(_str);
      if (_num < 0) {
        _num = 0;
      }
      else if (_num > 16777215) {
        _num = 16777215;
      }
      else if (_hexLen < 6) {
        _num = _num * _hex3To6Ratio;
      }
      return _num;
    }
  }
};

const _normalizeNumToHexColor = _num => {
  if (_num < 0) {
    _num = 0;
  }
  else if (_num > 16777215) {
    _num = 16777215;
  }
  let _str = numToHex(_num);
  while (_str.length !== 6) {
    _str = '0' + _str;
  }
  if (_str[0] === _str[1] && _str[2] === _str[3] && _str[4] === _str[5]) {
    // shorten 6 to 3 char in cases like 'ffcc00' to 'fc0'
    _str = _str[0] + _str[2] + _str[4];
  }
  return '#' + _str;
};

class UtilMethods extends HClass {

  constructor() {
    super();
  }

  pushTask(_fn) {
    return COMM.Queue.push(_fn);
  }

  unshiftTask(_fn) {
    return COMM.Queue.unshift(_fn);
  }

  msNow() {
    return new Date().getTime();
  }

  getValueById(_id) {
    return COMM.Values.values[_id];
  }

  isFloat(_num) {
    return typeChr(_num) === 'n' && Math.round(_num) !== _num;
  }

  isntFloat(_num) {
    return !this.isFloat(_num);
  }

  isNullOrUndefined(_item) {
    return _item === null || typeof _item === 'undefined';
  }

  isntNullOrUndefined(_item) {
    return !this.isNullOrUndefined(_item);
  }

  isUndefinedOrNull(_item) {
    return this.isNullOrUndefined(_item);
  }

  isntUndefinedOrNull(_item) {
    return this.isntNullOrUndefined(_item);
  }

  isFunction(_item) {
    return typeChr(_item) === '>';
  }

  isntFunction(_item) {
    return !this.isFunction(_item);
  }

  isNumber(_item) {
    return typeChr(_item) === 'n';
  }

  isntNumber(_item) {
    return !this.isNumber(_item);
  }

  isInteger(_item) {
    return typeChr(_item) === 'n' && Math.round(_item) === _item;
  }

  isntInteger(_item) {
    return !this.isInteger(_item);
  }

  isString(_item) {
    return typeChr(_item) === 's';
  }

  isntString(_item) {
    return !this.isString(_item);
  }

  isArray(_item) {
    return typeChr(_item) === 'a';
  }

  isntArray(_item) {
    return !this.isArray(_item);
  }

  isObject(_item) {
    return typeChr(_item) in ['h', 'o'];
  }

  isntObject(_item) {
    return !this.isObject(_item);
  }

  isObjectOrArray(_item) {
    return typeChr(_item) in ['a', 'h', 'o'];
  }

  isntObjectOrArray(_item) {
    return !this.isObjectOrArray(_item);
  }

  isNull(_item) {
    return typeChr(_item) === '~';
  }

  isntNull(_item) {
    return !this.isNull(_item);
  }

  isUndefined(_item) {
    return typeChr(_item) === '-';
  }

  isntUndefined(_item) {
    return !this.isUndefined(_item);
  }

  isDate(_item) {
    return typeChr(_item) === 'd';
  }

  isntDate(_item) {
    return !this.isDate(_item);
  }

  isBoolean(_item) {
    return typeChr(_item) === 'b';
  }

  isntBoolean(_item) {
    return !this.isBoolean(_item);
  }

  get _momentUTCOptions() {
    return (this.options && this.options.useUTC) ||
      ((!this.options || this.isNullOrUndefined(this.options.useUTC)) && HLocale.dateTime.defaultOptions.useUTC);
  }

  moment(_date, _format) {
    if (this._momentUTCOptions) {
      return moment.utc(_date, _format);
    }
    else {
      return moment(_date, _format);
    }
  }

  momentUnix(_unixEpoch) {
    const _moment = moment.unix(_unixEpoch);
    if (this._momentUTCOptions) {
      return _moment.utc();
    }
    else {
      return _moment;
    }
  }

  get _escapeHTMLArr() {
    return _defaultEscapeHTMLArr;
  }

  escapeHTML(_html) {
    return escapeHTML(_html, this._escapeHTMLArr);
  }

  typeChr(_obj) {
    return typeChr(_obj);
  }

  baseStrToNum(_str, _base) {
    return baseStrToNum(_str, _base);
  }

  baseNumToStr(_num, _base) {
    baseNumToStr(_num, _base);
  }

  hexToNum(_hex) {
    return hexToNum(_hex);
  }

  numToHex(_int) {
    return numToHex(_int);
  }

  base36ToNum(_base36) {
    return baseStrToNum(_base36, 36);
  }

  numToBase36(_num) {
    return baseNumToStr(_num, 36);
  }

  get _hexCharacters() {
    return _hexCharacters;
  }

  _normalizeHexColorToNum(_color) {
    return _normalizeHexColorToNum(_color);
  }

  _normalizeNumToHexColor(_num) {
    return _normalizeNumToHexColor(_num);
  }

  hexColorAdd(_hex1, _hex2) {
    return this._normalizeNumToHexColor(
      this._normalizeHexColorToNum(_hex1) +
      this._normalizeHexColorToNum(_hex2)
    );
  }

  hexColorSubtract(_hex1, _hex2) {
    return this._normalizeNumToHexColor(
      this._normalizeHexColorToNum(_hex1) -
      this._normalizeHexColorToNum(_hex2)
    );
  }

  // (Deprecated/shouldfix): Encodes the native character set to url-encoded unicode.
  _encodeString(_str) {
    console.warn('WARNING: _encodeString shouldn\'t be called, but was called using: ' + _str);
    return unescape(encodeURIComponent(_str));
  }

  // (Deprecated/shouldfix): Decodes the url-encoded unicode _str to the native character set.
  _decodeString(_str) {
    console.warn('WARNING: _decodeString shouldn\'t be called, but was called using: ' + _str);
    try {
      return decodeURIComponent(escape(_str));
    }
    catch (e) {
      console.log('_decodeString failed for _str: ', _str);
      return null;
    }
  }

  updateObject(_src, _dst) {
    return updateObject(_src, _dst);
  }

  // Returns a decoded Array with the decoded content of Array _arr
  _decodeArr(_arr) {
    return _arr.map(_item => {
      return this.decodeObject(_item);
    });
  }

  // Returns a decoded Object of the Object _hash
  _decodeHash(_hash) {
    const _output = {};
    Object.entries(_hash).forEach(([_key, _value]) => {
      _output[this.decodeObject(_key)] = this.decodeObject(_value);
    });
    return _output;
  }

  /* = Description
  ** Decodes a JSON object. Decodes the url-encoded strings within.
  **
  ** = Parameters
  ** +_ibj+::  A raw object with special characters contained.
  **
  ** = Returns
  ** A version of the object with the contained strings decoded to unicode.
  **
  **/
  decodeObject(_obj) {
    if (typeof _obj === 'undefined') {
      return null;
    }
    const _type = typeChr(_obj);
    if (!_type) {
      console.warn('WARNING: decode of ' + (typeof _obj) + ' not possible');
      return null;
    }
    // return this._decodeString(_obj) if _type == 's'
    if (_type === 'a') {
      return this._decodeArr(_obj);
    }
    else if (_type === 'h') {
      return this._decodeHash(_obj);
    }
    else {
      return _obj;
    }
  }

  encodeObject(_obj) {
    try {
      return JSON.stringify(_obj);
    }
    catch (e) {
      console.warn('Invalid JSON:', _obj);
      return '{}';
    }
  }

  cloneObject(_obj) {
    if (typeof _obj === 'undefined' || _obj === null) {
      if (typeof _obj === 'undefined') {
        console.warn('WARNING: clone of undefined returns null.');
      }
      return null;
    }
    const _type = typeChr(_obj);
    if (!_type) {
      return null;
    }
    if (_type === 'a' || _type === 'h') {
      return JSON.parse(JSON.stringify(_obj));
    }
    else {
      return _obj;
    }
  }

}

module.exports = UtilMethods;

});

__exports('foundation/locale', function() {

const UtilMethods = require('util/util_methods');

const defaultLocale = {
  components: {},

  general: {
    decimalSeparator: '.',
    thousandsSeparator: ''
  },

  compUnits: {
    strings: {
      bit: ' b',
      'byte': ' B',
      kilobyte: ' kB',
      kibibyte: ' KiB',
      megabyte: ' MB',
      mebibyte: ' MiB',
      gigabyte: ' GB',
      gibibyte: ' GiB',
      terabyte: ' TB',
      tebibyte: ' TiB',
      petabyte: ' PB',
      pebibyte: ' PiB',
      exabyte: ' EB',
      ebibyte: ' EiB',
      zettabyte: ' ZB',
      zebibyte: ' ZiB',
      yottabyte: ' YB',
      yobibyte: ' YiB'
    },
    units: {
      SI: [
        [1000, 'byte'],
        [1000000, 'kilobyte'],
        [1000000000, 'megabyte'],
        [1000000000000, 'gigabyte'],
        [1000000000000000, 'terabyte'],
        [1000000000000000000, 'petabyte']
      ],
      IEC: [
        [1024, 'byte'],
        [1048576, 'kibibyte'],
        [1073741824, 'mebibyte'],
        [1099511627776, 'gibibyte'],
        [1125899906842624, 'tebibyte'],
        [1152921504606846976, 'pebibyte']
      ]
    },
    defaultUnitSystem: 'SI',
  },

  dateTime: {
    strings: {
      monthsLong: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ],
      monthsShort: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      weekDaysLong: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      weekDaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weekLong: 'Week',
      weekShort: 'WK',
      dateDelimitter: '.',
      timeDelimitter: ':',
      timeMsDelimitter: '.',
      rangeDelimitter: ' ... ',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss',
      dateTimeFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    settings: {
      zeroPadTime: true,
      AMPM: false
    },
    defaultOptions: {
      useUTC: false,
      tzMinutes: 0,
      longWeekDay: false,
      shortWeekDay: false,
      shortYear: false,
      fullYear: true,
      seconds: false,
      milliSeconds: false
    },
  }
};

const HLocale = new (class extends UtilMethods {

  constructor(locale) {
    super();
    this.setData(locale || defaultLocale);
  }

  setData(_locale) {
    this.updateObject(_locale, this);
  }

  get components() {
    return this.components;
  }

  get general() {
    return this.general;
  }

  get compUnits() {
    return this.compUnits;
  }

  get dateTime() {
    return this.dateTime;
  }

  formatBytes(_value, _decimals, _unitSystem) {
    const _units = this.compUnits;
    if (!_decimals) {
      _decimals = 0;
    }
    if (!_unitSystem) {
      _unitSystem = _units.defaultUnitSystem;
    }
    const _strings = _units.strings;
    const _decMul = Math.pow(10, _decimals);
    const _conv = _units.units[_unitSystem];
    let i = 0;
    let _div = 1;
    let _num;
    let _suffix;
    for (; i < _conv.length; i++) {
      const _lim = _conv[i][0];
      _suffix = _strings[_conv[i][1]];
      if (_value < _lim) {
        break;
      }
      _div = _lim;
    }
    if (i && _decimals) {
      _num = Math.round((_value * _decMul) / _div) / _decMul;
    }
    else {
      _num = Math.round(_value / _div);
    }
    return _num + _suffix;
  }

  dateOptions(_custom) {
    const _units = this.dateTime;
    const _default = _units.defaultOptions;
    const _options = {};
    Object.entries(_default).forEach(([_key, _value]) => {
      _options[_key] = _value;
    });
    if (_custom) {
      Object.entries(_custom).forEach(([_key, _value]) => {
        _options[_key] = _value;
      });
    }
    return _options;
  }

  zeroPadTime(_num) {
    if (this.dateTime.settings.zeroPadTime && _num < 10) {
      return `0${_num}`;
    }
    return _num.toString();
  }

  formatShortWeekDay(_dateTimeEpoch) {
    const _units = this.dateTime;
    const _date = new Date(_dateTimeEpoch * 1000);
    const _strings = _units.strings;
    const _wday = _units.options().useUTC ? _date.getUTCDay() : _date.getDay();
    return _strings.weekDaysShort[_wday];
  }

  formatLongWeekDay(_dateTimeEpoch) {
    const _units = this.dateTime;
    const _date = new Date(_dateTimeEpoch * 1000);
    const _strings = _units.strings;
    const _wday = _units.options().useUTC ? _date.getUTCDay() : _date.getDay();
    return _strings.weekDaysLong[_wday];
  }

  formatDate(_dateTimeEpoch, _options) {
    _options = this.dateOoptions(_options);
    const _units = this.dateTime;
    const _date = new Date(_dateTimeEpoch * 1000);
    const _strings = _units.strings;
    const _wday = _options.useUTC ? _date.getUTCDay() : _date.getDay();
    const _formatUTC = () => {
      return (
        _date.getUTCDate() +
        _strings.dateDelimitter +
        (_date.getUTCMonth() + 1) +
        _strings.dateDelimitter
      );
    };
    const _formatLocal = () => {
      return (
        _date.getDate() +
        _strings.dateDelimitter +
        (_date.getMonth() + 1) +
        _strings.dateDelimitter
      );
    };
    let _dateString = _options.useUTC ? _formatUTC() : _formatLocal();
    if (_options.fullYear) {
      _dateString += _options.useUTC ? _date.getUTCFullYear() : _date.getFullYear();
    }
    else if (_options.shortYear) {
      _dateString += _options.useUTC ? _date.getUTCYear() : _date.getYear();
    }

    if (_options.longWeekDay) {
      return _strings.weekDaysLong[_wday] + ' ' + _dateString;
    }
    else if (_options.shortWeekDay) {
      return _strings.weekDaysShort[_wday] + ' ' + _dateString;
    }
    return _dateString;
  }

  formatTime(_dateTimeEpoch, _options) {
    _options = this.dateOptions(_options);
    const _units = this.dateTime;
    const _date = new Date(_dateTimeEpoch * 1000);
    const _strings = _units.strings;
    const _formatUTC = () => {
      return (
        this.zeroPadTime(_date.getUTCHours()) +
        _strings.timeDelimitter +
        this.zeroPadTime(_date.getUTCMinutes())
      );
    };
    const _formatLocal = () => {
      return (
        this.zeroPadTime(_date.getHours()) +
        _strings.timeDelimitter + this.zeroPadTime(_date.getMinutes())
      );
    };
    let _timeString = _options.useUTC ? _formatUTC : _formatLocal;
    if (_options.seconds) {
      _timeString += _strings.timeDelimitter;
      _timeString += this.zeroPadTime(_options.useUTC ? _date.getUTCSeconds() : _date.getSeconds());
      if (_options.milliSeconds) {
        _timeString += _strings.timeMsDelimitter;
        _timeString += _options.useUTC ? _date.getUTCMilliseconds() : _date.getMilliseconds();
      }
    }
    return _timeString;
  }

  formatDateTime(_dateTimeEpoch, _options) {
    return (
      this.formatDate(_dateTimeEpoch, _options) +
      ' ' +
      this.formatTime(_dateTimeEpoch, _options)
    );
  }

})(defaultLocale);

// Deprecate this at some point:
window.HLocale = HLocale;

module.exports = HLocale;

});

__exports('foundation/system', function() {

const {ELEM, LOAD} = require('core/elem');
const UtilMethods = require('util/util_methods');

/** = Description
 ** Main container of global operations on +HView+ and
 ** +HApplication+ -derived classes.
 **
 ** HSystem is used to keep +HApplication+ and +HView+ instances
 ** globally managed. The managed classes themself calls +HSystem+ methods,
 ** so there is no real need to access +HSystem+ directly from user-level code.
 **
**/
const HSystem = new (class extends UtilMethods {

  constructor(options) {
    super();
    options = options || {};
    this.windowFocusMode = options.windowFocusMode in [0, 1] ? options.windowFocusMode : 1;
    // An array of HApplication instances; index is the appId:
    this.__apps = [];
    // An array (in the same order as apps); holds priority values:
    this.__appPriorities = [];
    // An array (in the same order as apps); holds busy status:
    this.busyApps = [];
    // This array holds free app id:s
    this.freeAppIds = [];
    // The default HSystem ticker interval. Unit is milliseconds.
    this.__defaultInterval = options.defaultInterval || 200;
    // The ticker interval, when window has no focus.
    this.__blurredInterval = options._blurredInterval || 300;
    // The default HApplication priority. Unit is "On the n:th tick: poll".
    this.defaultPriority = options.defaultPriority || 20;
    // The z-index of root-level +HView+ instances. All the array operations
    // are done by the inner logic of +HApplication+ and +HView+ instances.
    this.__viewsZOrder = [];
    // This is the internal "clock" counter. Gets updated on every tick.
    this.ticks = 0;
    // Time in milliseconds for the timeout of a poll to finish before
    // being classified as stuck and thus forcibly terminated.
    this.maxAppRunTime = options.maxAppRunTime || 5000;
    // Pause status of idle ticker:
    this.paused = false;
    // All +HView+ instances that are defined
    this.__views = [];
    // List of free +views+ indexes
    this._freeViewIds = [];
    // The view id of the active window. 0 means none.
    this.activeWindowId = 0;
    // optimization of zindex buffer, see +HView+
    this._updateZIndexOfChildrenBuffer = [];
    // Starts the ticking, when the document is loaded:
    LOAD(() => {this.ticker();});
  }

/** When the focus behaviour is 1, clicking on any subview brings
  * the window to front, if attached to a HWindow instance.
  * If the behaviour is 0, only direct clicks on the HWindow controls
  * brings the window to front.
  *
  **/
  get windowFocusMode() {
    return this.__windowFocusMode;
  }

  set windowFocusMode(mode) {
    if (mode in [0, 1]) {
      this.__windowFocusMode = mode;
    }
    else {
      console.warn('HSystem.windowFocusMode; invalid mode:', mode);
    }
  }

  get apps() {
    return this.__apps;
  }

  get appPriorities() {
    return this.__appPriorities;
  }

  get defaultInterval() {
    return this.__defaultInterval;
  }

  set defaultInterval(interval) {
    if (this.isNumber(interval) && interval > 10 && interval < 20000) {
      this.__defaultInterval = interval;
    }
    else {
      console.warn('HSystem.defaultInterval; invalid value:', interval, interval > 10, interval < 20000, this.isNumber(interval));
    }
  }

  get _blurredInterval() {
    return this.__blurredInterval;
  }

  get viewsZOrder() {
    return this.__viewsZOrder;
  }

  // Calls applications, uses the prority as a prioritizer.
  scheduler() {
    const {busyApps, appPriorities, ticks} = this;
    this.__apps.map((app, appId) => {
      return {
        appId, app,
        busy: busyApps[appId],
        priority: appPriorities[appId]
      };
    }).filter(({app, appId, busy, priority}) => {
      return app && !busy && priority >= 0 && ticks % priority === 0;
    }).forEach(({app, priority}) => {
      // Set the app busy, the app itself should "unbusy" itself,
      // when the idle call is done.
      // That happens in <HApplication._startIdle>
      // If the app is not busy, then make a idle call:
      app._startIdle();
    });
    if (this._updateZIndexOfChildrenBuffer.length !== 0) {
      this._flushUpdateZIndexOfChilden();
    }
  }

  // This might be dead code, but investigate whether it's on purpose or not:
  _updateFlexibleRects() {
    this.__views.forEach(_view => {
      if (_view && (_view.flexRight || _view.flexBottom)) {
        _view.rect._updateFlexibleDimensions();
      }
    });
  }

  pause() {
    clearTimeout(this._tickTimeout);
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.ticker();
  }

 /* Calls the scheduler and then calls itself after a timeout to keep
  * the loop going on.
  **/
  ticker() {
    if (!this.paused) {
      // Increment the tick counter:
      this.ticks++;
      this.scheduler();
      const _this = this;
      this._tickTimeout = setTimeout(() => {
        _this.ticker();
      }, this.__defaultInterval);
    }
  }

 /* = Description
  * Adds the structures needed for a new +HApplication+ instance.
  *
  * Called from inside the +HApplication+ constructor.
  * Binds an app and gives it a unique id.
  *
  * = Parameters
  * +_app+::       The reference to the +HApplication+ instance object.
  * +_priority+::  The app priority.
  *
  * = Returns
  * The app id.
  *
  **/
  addApp(_app, _priority) {
    let _appId;
    if (this.freeAppIds.length > 0) {
      _appId = this.freeAppIds.shift();
      this.__apps[_appId] = _app;
    }
    else {
      this.__apps.push(_app);
      _appId = this.__apps.length - 1;
    }
    _app.parent = this;
    _app.parents = [this];
    _app.appId = _appId;
    this.startApp(_appId, _priority);
    return _appId;
  }

 /* = Description
  * Starts polling an app instance (and its components).
  *
  * = Parameters
  * +_appId+::      The unique id of the app.
  * +_priority+::   The app priority.
  *
  **/
  startApp(_appId, _priority) {
    if (typeof _priority === 'undefined') {
      _priority = this.defaultPriority;
    }
    this.__appPriorities[_appId] = _priority;
    this.busyApps[_appId] = false;
  }

 /* = Description
  * Stops polling an app instance (and its components).
  *
  * = Parameters
  * +_appId+::   The id of the app.
  *
  **/
  stopApp(_appId) {
    this.busyApps[_appId] = true;
  }

 /* = Description
  * Changes the priority of the app. Calls +stopApp+ and +startApp+.
  *
  * = Parameters
  * +_appId+::     The id of the app.
  * +_priority+::  The app priority.
  *
  **/
  reniceApp(_appId, _priority) {
    this.__appPriorities[_appId] = _priority;
  }

 /* = Description
  * Stops polling and deletes an app instance (and its components).
  *
  * = Parameters
  * +_appId+::    The unique id of the app.
  * +_forced+::   (Optional) The doesn't wait for the last poll to finish.
  *
  **/
  killApp(_appId, _forced) {
    this.reniceApp(_appId, -1); // prevent new idle calls to the app
    if (_forced || this.busyApps[_appId] === false) {
      this._forceKillApp(_appId);
    }
    else {
      /* Waiting for the app to finish its idle loop before killing it */
      const _endWaiting = this.msNow() + this.maxAppRunTime;
      const _this = this;
      let _timeout;
      const _waitForForceKill = () => {
        const _isStillBusy = _this.busyApps[_appId] === true;
        if (!_isStillBusy || _this.msNow() > _endWaiting) {
          clearTimeout(_timeout);
          _this._forceKillApp(_appId);
        }
        else {
          _timeout = setTimeout(_waitForForceKill, 10);
        }
      };
      _waitForForceKill();
    }
  }

  _forceKillApp(_appId) {
    this.busyApps[_appId] = true;
    try {
      this.__apps[_appId].destroyAllViews();
    }
    catch (e) {
      console.error('HSystem._forceKillApp; unable to destrayAllViews:', e);
    }
    this.__apps[_appId] = null;
    this.freeAppIds.push(_appId);
  }

  get views() {
    return this.__views;
  }

 /* = Description
  * Adds a view and assigns it an id.
  *
  * = Parameters
  * +_view+::   The +HView+ instance.
  *
  * = Returns
  * The new view id.
  *
  **/
  addView(_view) {
    let _newId;
    if (this._freeViewIds.length > 0) {
      _newId = this._freeViewIds.pop();
      this.__views[_newId] = _view;
    }
    else {
      this.__views.push(_view);
      _newId = this.__views.length - 1;
    }
    return _newId;
  }

 /* = Description
  * Removes a view and recycles its id.
  *
  * = Parameters
  * +_viewId+::  The view id to delete.
  *
  **/
  delView(_viewId) {
    this.__views[_viewId] = null;
    this._freeViewIds.push(_viewId);
  }

 /* = Description
  * Focuses the window given and blurs the previous one.
  *
  * = Parameters
  * +_view+::   The +HView+ instance, this is almost always a
  *             +HWindow+ instance.
  *
  **/
  windowFocus(_view) {
    if (!_view) {
      this.activeWindowId = 0;
    }
    else {
      const _viewId = _view.viewId;
      if (this.__views[this.activeWindowId] && typeof this.__views[this.activeWindowId].windowBlur === 'function') {
        this.__views[this.activeWindowId].windowBlur();
      }
      this.activeWindowId = _viewId;
      _view.bringToFront();
      _view.windowFocus();
    }
  }

 /* Updates the z-indexes of the children of the given +_viewId+. **/
  updateZIndexOfChildren(_viewId) {
    if (!this._updateZIndexOfChildrenBuffer.includes(_viewId)) {
      this._updateZIndexOfChildrenBuffer.push(_viewId);
    }
    else {
      const _isDefined = typeof _viewId !== 'undefined' && _viewId !== null;
      const _view = _isDefined && this.__views[_viewId];
      const _isRootView = _view.app === _view.parent;
      if (_isDefined && _isRootView && !this._updateZIndexOfChildrenBuffer.includes(null)) {
        this._updateZIndexOfChildrenBuffer.push(null);
      }
    }
  }

 /* Flushes the z-indexes. This is a fairly expensive operation,
  * thas's why the info is buffered.
  **/
  _flushUpdateZIndexOfChilden() {
    const _this = this;
    const _buffer = this._updateZIndexOfChildrenBuffer;
    // Iterate over a clone:
    _buffer.map(_viewId => {
      _buffer.shift(); // purge first item from the original buffer
      const _view = _this.__views[_viewId];
      const _isRootView = _viewId === null;
      const _viewOrder = _isRootView ? _this.__viewsZOrder : _view.viewsZOrder;
      if (_viewOrder instanceof Array) {
        return _viewOrder;
      }
      else {
        return null;
      }
    }).filter(_viewOrder => {
      return _viewOrder !== null;
    }).map(_viewOrder => {
      let _zIndex = -1;
      return _viewOrder.map(_viewId => {
        const _view = _this.__views[_viewId];
        const _elemId = _view.elemId;
        if (_elemId) {
          _zIndex += 1;
          return [_elemId, _zIndex];
        }
        else {
          return null;
        }
      }).filter(_item => {
        return _item !== null;
      });
    }).forEach(_elemZIndexes => {
      _elemZIndexes.forEach(([_elemId, _zIndex]) => {
        ELEM.setStyle(_elemId, 'z-index', _zIndex);
      });
    });
  }
})();

module.exports = HSystem;

});

__exports('foundation/valueresponder', function() {

const UtilMethods = require('util/util_methods');

/** = Description
 ** Defines a minimal +HValue+ responder interface.
 ** It's implemented by default by +HControl+.
***/

class HValueResponder extends UtilMethods {
  /* = Description
  * Binds an HValue compatible instance to the component's valueObj. Also
  * calls +setValue+. It should not be called from user code, instead
  * use the +HValue+ instance method +bind+.
  *
  * = Parameter
  * +_aValueObj+:: The HValue instance object to bind.
  *
  * = Returns
  * +self+
  *
  **/
  setValueObj(_valueObj) {
    this.__valueObj = _valueObj;
    this.setValue(_valueObj.value);
  }

  set valueObj(_valueObj) {
    this.setValueObj(_valueObj);
  }

  get valueObj() {
    return this.__valueObj;
  }

  /* = Description
  * Checks, if the value given as parameter differs from +value+.
  *
  * = Parameters
  * +_value+:: The value to be tested.
  *
  * = Returns
  * A boolean true (different) or false (same).
  *
  **/
  valueDiffers(_value) {
    return this.encodeObject(_value) !== this.encodeObject(this.value);
  }

  /* = Description
  * Assigns the object a new value.
  * Extend it, if your component needs to do validation of the new value.
  * For +HControl+ instances, extend HControl#refreshValue to do something when
  * the +value+ has been set.
  *
  * = Parameter
  * +_value+::  The new value. Allowed values depend on the component type
  *             and other usage of the bound +HValue+ instance +self.valueObj+.
  *
  * = Returns
  * +self+
  *
  **/
  setValue(_value) {
    const _typeChr = this.typeChr(_value);
    if (_typeChr !== '-' && this.typeChr(this.valueObj) === 'o' && this.valueDiffers(_value)) {
      this.__value = _value;
      if (_typeChr in ['a', 'h', 'o']) {
        this.valueObj.set(this.cloneObject(_value));
      }
      else {
        this.valueObj.set(_value);
      }
      if (this.typeChr(this.refresh) === '>') {
        this.refresh();
      }
      else if (this.typeChr(this.refreshValue) === '>') {
        this.refreshValue();
      }
    }
  }

  set value(_value) {
    this.setValue(_value);
  }

  get value() {
    return this.__value;
  }
}

module.exports = HValueResponder;

});

__exports('foundation/application', function() {

const HSystem = require('foundation/system');
const {LOAD} = require('core/elem');
let HView; LOAD(() => {HView = require('foundation/view');});
const HValueResponder = require('foundation/valueresponder');

/** = Description
 **
 ** Simple application template.
 **
 ** Depends on <HSystem>
 **
 ** HApplication instances are good namespaces to bind your client-side logic to.
 ** Feel free to extend HApplication to suit your needs. The primary default
 ** purpose is root-level component (<HView>) management and being the
 ** root controller for <onIdle> events.
 **
 ** = Instance members
 ** +views+::    A list of child component ids bound to it via +HView+ and +HSystem+
 ** +parent+::   Usually +HSystem+.
 ** +parents+::  An array containing parent instances. In this case, just +HSystem+.
 ** +isBusy+::   A flag that is true when the app is doing onIdle events or stopped.
 **
 ** = Usage
 ** Creates the +HApplication+ instance +myApp+, makes a +HWindow+ instance
 ** as its first view.
 **   var myApp = HApplication.nu(10,'Sample Application');
 **   HWindow.nu( [10,10,320,200], myApp, {label:'myWin'} );
 **
***/
class HApplication extends HValueResponder {

  /* = Description
  *
  * = Parameters
  * All parameters are optional.
  *
  * +_priority+::   The priority, a number between 1 and Infinity. Smaller
  *                 number means higher priority, affects onIdle polling.
  *
  * +_label+::      A label for the application; for process managers.
  *
  **/
  constructor(_priority, _label) {

    super();

    this.elemId = 0; // document.body

    // Special null viewId for HApplication instances,
    // they share a system-level root view; the document object
    this.viewId = null;

    // storage for views
    this.views = [];

    // storage for dom element id's in view, not utilized in HApplication by default
    this.markupElemIds = [];

    // Views in Z order. The actual Z data is stored in HSystem, this is just a
    // reference to that array.
    this.viewsZOrder = HSystem.viewsZOrder;

    // Finalize initialization via HSystem
    HSystem.addApp(this, _priority);

    if (_label) {
      this.label = _label;
    }
    else {
      this.label = 'ProcessID=' + this.appId;
    }
  }

 /* = Description
  * Used by addView to build a +self.parents+ array of parent classes.
  *
  * = Parameters
  * +_viewId+::   The target view's ID.
  **/
  buildParents(_viewId) {
    const _view = HSystem.views[_viewId];
    _view.parent = this;
    _view.parents = [];
    this.parents.forEach(parent => {
      _view.parents.push(parent);
    });
    _view.parents.push(this);
  }

 /* = Description
  * Adds a view to the app, +HView+ defines an indentical structure for subviews.
  *
  * Called from inside the +HView+ constructor and should be automatic for all
  * components that accept the +_parent+ parameter, usually the second argument,
  * after the +HRect+ instance.
  *
  * = Parameters
  * +_view+::   Usually +this+ inside +HView+ -derived components.
  *
  * = Returns
  * The view ID.
  *
  **/
  addView(_view) {

    const _viewId = HSystem.addView(_view);
    this.views.push(_viewId);

    this.buildParents(_viewId);
    this.viewsZOrder.push(_viewId);

    return _viewId;
  }

 /* = Description
  * Removes the view of the given +_viewId+.
  *
  * Call this if you need to remove a child view from its parent without
  * destroying its view, making it in effect a view without parent.
  * Useful, for example, for moving a view from one parent component to
  * another when dragging a component to a droppable container.
  *
  * = Parameters
  * +_viewId+::   The view ID.
  *
  **/
  removeView(_viewId) {
    if (this.typeChr(_viewId) in ['h', 'o'] && this.typeChr(_viewId.remove) === '>') {
      console.warn('warning, viewId not a number:', _viewId, ', trying to call its remove method directly..');
      _viewId.remove();
    }
    const _view = HSystem.views[_viewId];
    if (_view) {
      if (this.typeChr(_view.remove) === '>') {
        _view.remove();
      }
      else {
        console.error('view does not have method "remove":', _view);
      }
    }
    else {
      console.error('tried to remove non-existent viewId:', _viewId);
    }
  }

 /* = Description
  * Removes and destructs the view of the given +_viewId+.
  *
  * Call this if you need to remove a child view from its parent, destroying
  * its child views recursively and removing all of the DOM elements too.
  *
  * = Parameters
  * +_viewId+::   The view ID.
  *
  **/
  destroyView(_viewId) {
    const _view = HSystem.views[_viewId];
    if (this.typeChr(_view.die) === '>') {
      _view.die();
    }
    else {
      console.error('view ', _view, 'does not have method "die"');
    }
  }

 /* = Description
  * The destructor of the +HApplication+ instance.
  *
  * Stops this application and destroys all its views recursively.
  *
  **/
  die() {
    HSystem.killApp(this.appId, false);
  }

 /* = Description
  * Destructs all views but doesn't destroy the +HApplication+ instance.
  *
  * Destroys all the views added to this application but doesn't destroy the
  * application itself.
  *
  **/
  destroyAllViews() {
    const _views = this.cloneObject(this.views);
    this.views = [];
    _views.forEach(_view => {
      if (this.typeChr(_view) in ['h', 'o'] && this.typeChr(_view.die) === '>') {
        _view.die();
      }
      else {
        console.error('invalid view:', _view);
      }
    });
  }

  renice(_priority) {
    HSystem.reniceApp(this.appId, _priority);
  }

  /* Calls the idle method of each view. Don't extend this method. */
  _pollViews() {
    this._pollViewsRecurse(this.views);
  }

  _pollViewsRecurse(_views) {
    if (_views && _views.length) {
      _views.map(_viewId => {
        const _view = HSystem.views[_viewId];
        if (_view) {
          ['idle', 'onIdle'].forEach(_method => {
            if (this.typeChr(_view[_method]) === '>') {
              _view[_method]();
            }
          });
          if (_view.hasAncestor && this.typeChr(_view.hasAncestor === '>') && _view.hasAncestor(HView)) {
            return _view;
          }
          else {
            return null;
          }
        }
        else {
          return null;
        }
      }).filter(_item => {
        return _item !== null;
      }).filter(_view => {
        return this.typeChr(_view.views) === 'a' && _view.views.length > 0;
      }).forEach(_view => {
        this._pollViewsRecurse(_view.views);
      });
    }
  }

  /* Gets called by +HSystem+. It makes +onIdle+ extensions more failure
  *  resistant. Do not extend.
  **/
  _startIdle() {
    HSystem.busyApps[this.appId] = true;
    this._busyTimer = setTimeout(() => {
      this.idle();
      this.onIdle();
      this._pollViews();
      HSystem.busyApps[this.appId] = false;
    }, 10);
  }

  /* = Description
  * The receiver of the +onIdle+ "poll event". The app priority defines the interval.
  *
  * Extend this method, if you are going to perform regular actions in a app.
  *
  * Intended for "slow infinite loops".
  *
  **/
  onIdle() {
    /* Extend this */
  }

  idle() {
    /* or extend this */
  }

}

module.exports = HApplication;

});

__exports('comm/queue', function() {

const HApplication = require('foundation/application');

/* A Group of localizable strings; errors and warnings.
**/
const STRINGS = {
  ERR: 'COMM.Queue Error: ',
  JS_EXEC_FAIL: 'Failed to execute the Javascript function: ',
  REASON: ' Reason:'
};

/** = Description
  * COMM.Queue executes javascript blocks in a managed queue.
  *
  * COMM.Queue is used by COMM.Transporter and JSLoader to continue
  * javascript command execution after a XMLHttpRequest finishes.
  *
  * COMM.Queue runs as a single instance, dan't try to reconstruct it.
**/
class QueueApp extends HApplication {

  /* The constructor takes no arguments and starts queue flushing automatically.
  **/
  constructor() {

    // Run with priority 10; not too demanding but not too sluggish either
    super(10, 'COMM.Queue');

    // The queue itself, is packed with anonymous functions
    this.commandQueue = [];

    this._scripts = {};

    // Flag to signal the pause and resume status.
    this.paused = false;

    if (document.head) {
      this._headElem = document.head;
    }
    else {
      this._headElem = document.getElementsByTagName('head')[0];
    }
  }

  /* Checks periodically, if the queue needs flushing.
  **/
  idle() {
    // Runs the flush operation, if the queue is not
    // empty and the state is not resumed:
    !this.paused && this.commandQueue.length !== 0 && this.flush();
  }

  /* = Description
  * Pauses the queue.
  *
  * Use to stop execution, if some data or code needs to be loaded that the
  * rest of the queue depends on.
  * Typically called before an +XMLHttpRequest+ with the +onSuccess+
  * event defined to call +resume+ when the request is done.
  *
  **/
  pause() {
    this.paused = true;
  }

  /* = Description
  * Resumes queue flushing.
  *
  * Use to resume execuption, when some depending code for the rest
  * of the queue has been loaded.
  * Typically on an +XMLHttpRequest+ +onSuccess+ event.
  *
  **/
  resume() {
    this.paused = false;
    this.flush();
  }

  /* Basic queue item exception reporter. Override with your own, if needed.
  **/
  clientException(_exception, _item) {
    return (
      STRINGS.ERR_PREFIX +
      STRINGS.JS_EXEC_FAIL +
      _exception.name + '->' + _exception.message +
      STRINGS.REASON +
      _exception
    );
  }

  /* = Description
  * Flushes the queue until stopped.
  *
  * Iterates through the +commandQueue+ and calls each function.
  * Removes items from the queue after execution.
  *
  **/
  flush() {
    const len = this.commandQueue.length;
    const endTime = this.msNow() + 250;
    for (let i = 0; i < len; i++) {
      if (this.paused) {
        break;
      }
      else if (this.msNow() > endTime) {
        this.pause();
        setTimeout(() => {
          this.resume();
        }, 0);
        break;
      }
      else {
        const _item = this.commandQueue.shift();

        try {
          const _itemType = this.typeChr(_item);
          if (_itemType === '>') {
            _item.call();
          }
          else if (_itemType === 'a') {
            const [_function, _arguments] = _item;
            _function.apply(this, _arguments);
          }
        }
        catch (e) {
          this.clientException(e, _item);
        }
      }
    }
  }

  /* = Description
  * Adds an item to the beginning of the queue.
  *
  * Use to make the given +_function+ with its
  * optional +_arguments+ the next item to flush.
  *
  * = Parameters:
  * +_function+::  An anonymous function. Contains the code to execute.
  *
  * +_arguments+:: _Optional_ arguments to pass on to the +_function+
  **/
  unshift(_function, _arguments) {
    if (typeof _arguments !== 'undefined') {
      this.commandQueue.unshift([_function, _arguments]);
    }
    else {
      this.commandQueue.unshift(_function);
    }
  }

  /* = Description
  * Adds an item to the end of the queue.
  *
  * Use to make the given +_function+ with its
  * optional +_arguments+ the last item to flush.
  *
  * = Parameters:
  * +_function+::  An anonymous function. Contains the code to execute.
  *
  * +_arguments+:: _Optional_ arguments to pass on to the +_function+
  **/
  push(_function, _arguments) {
    if (typeof _arguments !== 'undefined') {
      this.commandQueue.push([_function, _arguments]);
    }
    else {
      this.commandQueue.push(_function);
    }
  }

  addScript(_scriptId, _scriptSrc) {
    const _script = document.createElement('script');
    this._scripts[_scriptId] = _script;
    if (typeof _script.textContent !== 'undefined' && _script.textContent !== null) {
      _script.textContent = _scriptSrc;
    }
    else if (typeof _script.text !== 'undefined' && _script.text !== null) {
      _script.text = _scriptSrc;
    }
    else {
      _script.appendChild(document.createTextNode(_scriptSrc));
    }
    this._headElem.appendChild(_script);
  }

  delScript(_scriptId) {
    const _script = this._scripts[_scriptId];
    this._headElem.removeChild(_script);
    delete this._scripts[_scriptId];
  }
}

module.exports = new QueueApp();

});

__exports('comm/session', function() {

const SHA = require('util/sha1');

/** = Description
  * COMM.Session is the session key manager.
  *
  * COMM.Session is used by COMM.Transporter to generate key hashes for
  * the session management of COMM.Transporter's keys.
  *
  * The server expects this exact algorithm and refuses to serve unless
  * the SHA1 hash sum of the keys matches.
  *
  * Uses a +SHA+ instance for generation.
  *
  * +COMM.Queue+ runs as a single instance, don't try to reconstruct it.
**/
class Session {

  /* The constructor takes no arguments.
  **/
  constructor() {
    this.sha = new SHA(8);
    this.sha_key = this.sha.hexSHA1(((new Date().getTime()) * Math.random() * 1000).toString());
    this.ses_key = '0:1:' + this.sha_key;
    this.req_num = 0;
  }

  /* = Description
  * Generates a new SHA1 sum using a combination of
  * the previous sum and the +_newKey+ given.
  *
  * Sets +self.ses_key+ and +self.sha_key+
  *
  * = Parameters:
  * +_newKey+:: A key set by the server.
  *
  **/
  newKey(_sesKey) {
    const shaKey = this.sha.hexSHA1(_sesKey + this.sha_key);
    this.old_key = _sesKey;
    this.req_num++;
    this.ses_key = this.req_num + ':1:' + shaKey;
    this.sha_key = shaKey;
  }
}

module.exports = new Session();

});

__exports('comm/sessionwatcher', function() {
const HApplication = require('foundation/application');

/** = Description
 ** The single instance of this class is constructed after the first
 ** handshake request with the server by the 'main' plugin.
 **
 ** It has dual functionality:
 ** - It tells the the client time.
 **   It's available as the server HValue instance
 **   +msg.session[:main][:client_time]+ from
 **   any Plugin instance.
 ** - It polls the server on regular intervals.
 **   The polling interval is defined by the server
 **   as the _timeoutSecs constructor parameter.
 **
**/
class SessionWatcher extends HApplication {
  constructor(_timeoutSecs, _sesTimeoutValueId) {
    // onIdle is called when HSystem's ticker count % 100 == 0
    // this means it's 5 seconds with HSystemTickerInterval 50
    super(10, 'SesWatcher');
    // gets the HValue represented by
    // sesTimeoutValueId (:client_time in server)
    this.sesTimeoutValue = this.getValueById(_sesTimeoutValueId);
    this.timeoutSecs = _timeoutSecs;
  }

  // Tells the server the client's current time
  idle() {
    const _now = this.msNow();
    if ((_now - this.sesTimeoutValue.value) > this.timeoutSecs) {
      this.sesTimeoutValue.set(_now);
    }
  }
}

module.exports = SessionWatcher;

});

__exports('comm/urlresponder', function() {

const HApplication = require('foundation/application');

/** = Description
 ** This application registers url responders to hide/show
 ** certain views automatically whenever the anchor
 ** part of the url is changed.
 **
 ** It is bound to the server HValue instance
 ** +msg.session[:main][:location_href]+ by
 ** the 'main' plugin. By default it runs with
 ** a client-side-only HValue instance until then.
 **
**/
class URLResponder extends HApplication {
  constructor() {
    super(1, 'URLResponder');
    this.urlMatchers = [];
    this.urlCallBacks = [];
    this.defaultCallBacks = [];
    this.prevCallBacks = [];
    this.prevMatchStrs = [];
    this.value = 0;
  }

  // sets the view to show when there is
  // no matches (like a virtual 404)
  setDefaultResponder(_callBack) {
    this.defaultCallBacks = [_callBack];
    this.refresh();
  }

  addDefaultResponder(_callBack) {
    this.defaultCallBacks.push(_callBack);
    this.refresh();
  }

  delDefaultResponder(_callBack) {
    this.defaultCallBacks.splice(this.defaultCallbacks.indexOf(_callBack), 1);
    this.refresh();
  }

  // Removes responder
  // - matchStr is an url that the callBack will
  //   respond to
  // - callBack is the component registered
  delResponder(_matchStr, _callBack) {
    const _urlMatcher = new RegExp(_matchStr);
    if (this.prevCallBacks.includes(_callBack)) {
      this.prevCallBacks.splice(this.prevCallBacks.indexOf(_callBack), 1);
      this.prevMatchStrs.splice(this.prevMatchStrs.indexOf(_matchStr), 1);
    }
    for (let i = 0; i < this.urlMatchers.length; i++) {
      const _urlMatch = this.urlMatchers[i].toString() === _urlMatcher.toString();
      if (_urlMatch) {
        this.urlMatchers.splice(i, 1);
        this.urlCallBacks.splice(i, 1);
        return 1;
      }
    }
    this.refresh();
    return 0;
  }

  // Adds responder
  // - matchRegExp is the regular expression
  //   that matches the anchor part of the uri
  // - callBack is the component that will receive hide/show calls
  // - activate is a flag that tells the view to be immediately
  //   activate (and the previous one to deactivate)
  addResponder(_matchRegExp, _callBack, _activate) {
    const _urlMatcher = new RegExp(_matchRegExp);
    this.urlMatchers.push(_urlMatcher);
    this.urlCallBacks.push(_callBack);
    if (this.typeChr(_activate) === 's') {
      window.location.href = _activate;
    }
    const _matchStr = this.value;
    if (_urlMatcher.test(_matchStr)) {
      _callBack.show();
      if (this.prevMatchStrs.includes(_matchStr)) {
        this.prevMatchStrs.push(_matchStr);
      }
      this.prevCallBacks.push(_callBack);
    }
  }

  // Checks the matchStr agains regular expressions
  checkMatch(_matchStr) {
    if (this.prevMatchStrs.includes(_matchStr)) {
      return 0;
    }
    const _urlCallBacks = [];
    for (let i = 0; i < this.urlMatchers.length; i++) {
      const _urlMatch = this.urlMatchers[i].test(_matchStr);
      if (_urlMatch) {
        _urlCallBacks.push(this.urlCallBacks[i]);
      }
    }
    if (_urlCallBacks.length !== 0) {
      for (let i = 0; i < _urlCallBacks.length; i++) {
        const _urlCallBack = _urlCallBacks[i];
        _urlCallBack.show();
        if (this.prevMatchStrs.includes(_matchStr)) {
          this.prevMatchStrs.push(_matchStr);
        }
      }
      let _prevCallBack;
      for (let i = 0; i < this.prevCallBacks.length; i++) {
        _prevCallBack = this.prevCallBacks[i];
        if (!_urlCallBacks.includes(_prevCallBack)) {
          this.prevCallBacks[i].hide();
        }
      }
      this.prevCallBacks = _urlCallBacks;
      return 1;
    }
    if (this.defaultCallBacks.length !== 0) {
      if (this.prevCallBacks.length !== 0) {
        for (let i = 0; i < this.prevCallBacks.length; i++) {
          this.prevCallBacks[i].hide();
        }
      }
      this.prevCallBacks = [];
      for (let i = 0; i < this.defaultCallBacks.length; i++) {
        this.defaultCallBacks[i].show();
        this.prevCallBacks.push(this.defaultCallBacks[i]);
      }
    }
    return -1;
  }

  refresh() {
    if (this.value.length === 0) {
      return;
    }
    this.checkMatch(this.value);
  }

  idle() {
    if (this.valueObj) {
      const _href = window.location.href;
      if (_href !== this.value) {
        this.setValue(_href);
      }
    }
  }
}

module.exports = URLResponder;

});

__exports('foundation/value/dummyvalue', function() {

/** = Description
 ** A HDummyValue is just a placeholder for HValue values. HDummyValue
 ** is a light-weight alternative that doesn't implement any actual HValue
 ** functionality, but implements the essential methods and keeps the HControl
 ** content when an actual HValue instance isn't bound.
 ** It's the default valueObj type for components not bound to real HValue instances.
**/
class HDummyValue {

  /* = Description
  * HDummyValue is initialized just like a real HValue.
  *
  * = Parameters
  * +_id+::    Any string or integer, just a placeholder for HValue.id
  * +_value+:: Any valid js object, just as for HValue.value
  *
  **/
  constructor(_id, _value) {
    this.id = _id;
    this.value = _value;
  }

  /* Sets a new instance payload value.
  **/
  set(_value) {
    this.value = _value;
  }

  /* Returns the instance payload value.
  **/
  get() {
    return this.value;
  }

  /* Binds HControl, does actually nothing.
  **/
  bind(_theObj) {

  }

  /* Unbinds (releases) HControl, does actually nothing.
  **/
  unbind(_theObj) {

  }
}

module.exports = HDummyValue;

});

__exports('foundation/value', function() {
const HClass = require('core/class');
const {LOAD} = require('core/elem');
let Values; LOAD(() => {Values = require('comm/values');});
const HDummyValue = require('foundation/value/dummyvalue');
const Queue = require('comm/queue');

/** = Description
 ** Data value synchonization container object.
 **
 ** +HValue+ is the default class to use for data syrchronization purposes.
 ** It's smart enough to tell COMM.Values (Value Manager) that it has
 ** been changed.
 **
 ** A single HValue instance can be bound to any number of responders, the
 ** main client-side responder class is +HControl+.
 **
 ** When you change the value in one of the instances bound to the HValue
 ** instances, all other instances get notified too and the server is also
 ** notified and can be further bound on the server side to any number of
 ** responders there too.
 **
 ** An instance constructed with "false" (Boolean) as its id is not reported
 ** to the server. Such an instance can be used for client-side responder
 ** synchronization.
 **
 ** Priority-wise, only the server can create a value id. If a value id is
 ** created on the client, the server won't recognize nor accept it.
 **
 ** If a value is changed on the server, it overrides the changes on
 ** the client, so no server-client lock is needed in this model.
 **
 ** = Instance variables:
 **  +id+::     Value Id, used by the whole value management system to identify individual values.
 **  +type+::   '[HValue]'
 **  +value+::  The container/"payload" data value itself.
 **  +views+::  A list of Components that uses this value.
 **             Used for automatic value syncronization between responders.
**/
class HValue extends HClass {

  /* = Description
  * Constructs a value with the initial value +_value+ and the unique id +_id+.
  *
  * Only the server can create value id's, so use false when constructing
  * from the client. A value with a false id is not reported to the server.
  *
  * = Parameters
  * +_id+::     The source id (ideally set by server, should be unique)
  * +_value+::  The initial data
  *
  **/
  constructor(_id, _value) {
    super();
    this.id = _id;
    this.value = _value;
    this.views = [];
    if (_id) {
      Values.add(_id, this);
    }
  }

  get isProduction() {
    return true; // TODO: do something to enable dev vs production build differentiation
  }

  /* Destructor method. Releases all bindings.
  **/
  die() {
    this.views.forEach(_view => {
      _view.setValueObj(HDummyValue.new());
    });
    this.views = [];
    if (this.id) {
      Values.del(this.id);
    }
  }

  /* = Description
  * Interface for valuemanager, returns its to-be-sent-to-server value.
  **/
  toSync() {
    return this.value;
  }

  /* = Description
  * Replaces the data of the value.
  *
  * Extend this method, if you want client-side validation in the value itself.
  *
  * = Parameters
  * +_value+::  The new data to replace the old data with.
  *
  **/
  set(_value) {
    if (this.differs(_value)) {
      this.value = _value;
      if (this.id) {
        Values.changed(this);
      }
      Queue.push(() => {
        this.refresh();
      });
    }
  }

  /* Compares +_value+ with +self.value+.
  * = Returns
  * true or false, depending on the equality
  **/
  differs(_value) {
    return Values.encode(_value) !== Values.encode(this.value);
  }

  /* = Description
  * Setter for the server.
  *
  * Just as +self.set+, but doesn't re-notify the server about the change.
  **/
  s(_value) {
    this.value = _value;
    this.refresh();
  }

  /* = Description
  * Return the data, returns the +self.value+ instance variable
  *
  * Returns:
  *  The value instance variable (the data "payload")
  **/
  get() {
    return this.value;
  }

  bind(_responder) {
    console.warn('HValue#bind is deprecated; use #bindResponder instead!');
    return this.bindResponder(_responder);
  }

  /* = Description
  * Bind a responder to the value, use to attach HValues to responders derived from HControl.
  *
  * = Parameters
  * +_responder+::   Any responder that is derived from HControl or any other
  *                  class instance that implements HValueResponder or has
  *                  compatible typing.
  **/
  bindResponder(_responder) {
    if (typeof _responder === 'undefined') {
      throw new Error('HValueBindError: responder is undefined!');
    }
    if (!this.views.includes(_responder)) {
      this.views.push(_responder);
      _responder.setValueObj(this);
    }
  }

  unbind(_responder) {
    console.warn('HValue#unbind is deprecated; use #releaseResponder instead!');
    return this.releaseResponder(_responder);
  }

  release(_responder) {
    console.warn('HValue#release is deprecated; use #releaseResponder instead!');
    return this.releaseResponder(_responder);
  }

  /* = Description
  * Release a responder bound to the HValue instance itself.
  *
  * = Parameters
  * +_responder+::   Any responder that is derived from HControl or any other
  *                  class instance that implements HValueResponder or has
  *                  compatible typing.
  **/
  releaseResponder(_responder) {
    const _respIndex = this.views.indexOf(_responder);
    if (_respIndex !== -1) {
      this.views.splice(_respIndex, 1);
    }
  }

  /* Calls the setValue method all responders bound to this HValue.
  **/
  refresh() {
    this.views.forEach(_responder => {
      if (_responder.value !== this.value && !_responder._valueIsBeingSet) {
        _responder._valueIsBeingSet = true;
        _responder.setValue(this.value);
        _responder._valueIsBeingSet = false;
      }
    });
  }
}

module.exports = HValue;


});

__exports('foundation/value/pushvalue', function() {

const HValue = require('foundation/value');
const {LOAD} = require('core/elem');
let Values; LOAD(() => {Values = require('comm/values');});

/* Client -> Server push value buffer.
* Works like HValue, but only streams out changes
* instead of keeping only the last state.
* The nature of the buffer is volatile, so don't rely
* on re-transmission on failures.
* Ideal for event logging purposes.
*/
class HPushValue extends HValue {
  constructor(_id, _value) {
    super(_id, null);
    this.buffer = [];
  }

  toSync() {
    const _arr = [];
    const _histLen = this.buffer.length;
    for (let i = 0; i < _histLen; i++) {
      _arr.push(this.buffer.shift());
    }
    return _arr;
  }

  set(_value) {
    this.buffer.push(_value);
    Values.changed(this);
    this.refresh();
  }

  die() {
    this.buffer = null;
    delete this.buffer;
    super.die();
  }
}

module.exports = HPushValue;

});

__exports('foundation/value/pullvalue', function() {

const HValue = require('foundation/value');

// Opposite of HPushValue (Server -> Client push)
class HPullValue extends HValue {
  s(_values) {
    _values.forEach(_value => {
      this.value = _value;
      this.refresh();
    });
  }
}

module.exports = HPullValue;

});

__exports('comm/jsloader', function() {

const {LOAD} = require('core/elem');
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

});

__exports('util/geom/point', function() {

const HClass = require('core/class');

/** = Description
  * Point objects represent points on a two-dimensional coordinate grid. The
  * object's coordinates are stored as public x and y data members.
  *
  * = Instance Variables
  * +type+::  '[HPoint]'
  * +x+::     The X coordinate of the point
  * +y+::     The Y coordinate of the point
  *
  **/
class HPoint extends HClass {

  /* = Description
   * Creates a new Point object that corresponds to the point (x, y), or that's
   * copied from point. If no coordinate values are assigned, the Point's
   * location is indeterminate.
   *
   * = Parameters
   * by using a HPoint instance:
   * +point+::  Another +HPoint+ or other compatible structure.
   *
   * by using separate numeric coordinates:
   * +x+::  x coordinate
   * +y+::  y coordinate
   *
   * = Usage
   *  var myPoint = new HPoint(100,200);
   *  var mySameCoordPoint = new HPoint( myPoint );
   *
   **/
  constructor() {
    super();
    if (arguments.length === 0) {
      this._constructorDefault();
    }
    else if (arguments.length === 2) {
      this._constructorValues(arguments[0], arguments[1]);
    }
    else if (arguments.length === 1) {
      this._constructorPoint(arguments[0]);
    }
    else {
      throw new Error('HPoint#constructor error: Invalid number of arguments.');
    }
  }

  _constructorDefault() {
    this.x = null;
    this.y = null;
  }
  _constructorValues(x, y) {
    this.x = x;
    this.y = y;
  }

  _constructorPoint(_point) {
    this.x = _point.x;
    this.y = _point.y;
  }

  /* = Description
  * Sets the Point's x and y coordinates.
  *
  * = Parameters
  * +x+::  The new X coordinate of the point
  * +y+::  The new Y coordinate of the point
  *
  **/
  set() {
    if (arguments.length === 0) {
      this._constructorDefault();
    }
    else if (arguments.length === 2) {
      this._constructorValues(arguments[0], arguments[1]);
    }
    else if (arguments.length === 1) {
      this._constructorPoint(arguments[0]);
    }
    else {
      throw new Error('HPoint#set error: Invalid number of arguments.');
    }
    return this;
  }

  /* = Description
  * Ensures that the Point lies within rect. If it's already contained in the
  * rectangle, the Point is unchanged; otherwise, it's moved to the rect's
  * nearest edge.
  *
  * = Parameters
  * +_rect+::   A HRect instance to constrain to.
  *
  **/
  constrainTo(_rect) {
    if (this.x < _rect.left) {
      this.x = _rect.left;
    }
    if (this.y < _rect.top) {
      this.y = _rect.top;
    }
    if (this.x > _rect.right) {
      this.x = _rect.right;
    }
    if (this.y > _rect.bottom) {
      this.y = _rect.bottom;
    }
    return this;
  }

  /* = Description
  * Creates and returns a new Point that adds the given Point and this Point
  * together. The new object's x coordinate is the sum of the operands' x
  * values; its y value is the sum of the operands' y values.
  *
  * = Parameters
  * with HPoint:
  * +_point+::  An HPoint to add to.
  *
  * with coordinates:
  * +_x+::  An X-coordinate to add to.
  * +_y+::  An Y-coordinate to add to.
  *
  * = Returns
  * A new HPoint.
  *
  **/
  add(x, y) {
    if (arguments.length === 1 && x.hasAncestor && x.hasAncestor(HPoint)) {
      return new HPoint(this.x + x.x, this.y + x.y);
    }
    else if (arguments.length === 1 && x instanceof Array && x.length === 2) {
      return new HPoint(this.x + x[0], this.y + x[1]);
    }
    else if (arguments.length === 2) {
      return new HPoint(this.x + x, this.y + y);
    }
    else {
      throw new Error('HPoint#add: Invalid arguments.');
    }
  }

  /* = Description
  * Creates and returns a new Point that subtracts the given Point from this
  * Point. The new object's x coordinate is the difference between the
  * operands' x values; its y value is the difference between the operands'
  * y values.
  *
  * = Parameters
  *
  * with HPoint:
  * +_point+:: An HPoint to subtract from.
  *
  * with coordinates:
  * +_x+::  An X-coordinate to subtract from.
  * +_y+::  An Y-coordinate to subtract from.
  *
  * = Returns
  * A new HPoint.
  *
  **/
  subtract(x, y) {
    if (arguments.length === 1 && x.hasAncestor && x.hasAncestor(HPoint)) {
      return new HPoint(this.x - x.x, this.y - x.y);
    }
    else if (arguments.length === 1 && x instanceof Array && x.length === 2) {
      return new HPoint(this.x - x[0], this.y - x[1]);
    }
    else if (arguments.length === 2) {
      return new HPoint(this.x - x, this.y - y);
    }
    else {
      throw new Error('HPoint#subtract: Invalid arguments.');
    }
  }

  /* = Description
  * Returns true if the two objects' point exactly coincide.
  *
  * = Parameter
  * +_point+::  A HPoint to compare to.
  *
  * = Returns
  * The result; true or false.
  *
  **/
  equals(_point) {
    return this.x === _point.x && this.y === _point.y;
  }

  clone() {
    return new HPoint(this);
  }

}

module.exports = HPoint;

});

__exports('util/geom/rect', function() {

const HValueResponder = require('foundation/valueresponder');
const ELEM = require('core/elem');
const HSystem = require('foundation/system');
const HPoint = require('util/geom/point');

/** = Description
  * A Rect object represents a rectangle. Rects are used throughout the
  * Components to define the frames of windows, views, bitmaps even the
  * screen itself. A HRect is defined by its four sides, expressed as the public
  * data members left, top, right, and bottom.
  *
  * If you change a component's rect, you should call its HView.drawRect method.
  *
  * = Instance Variables
  * +type+::         '[HRect]'
  * +top+::          The position of the rect's top side (from parent top)
  * +left+::         The position of the rect's left side (from parent left)
  * +bottom+::       The position of the rect's bottom side (from parent top)
  * +right+::        The position of the rect's right side (from parent left)
  * +leftTop+::      A HPoint representing the coordinate of the rect's left top corner
  * +leftBottom+::   A HPoint representing the coordinate of the rect's left bottom corner
  * +rightTop+::     A HPoint representing the coordinate of the rect's right top corner
  * +rightBottom+::  A HPoint representing the coordinate of the rect's right bottom corner
  * +width+::        The width of the rect.
  * +height+::       The height of the rect.
  **/
class HRect extends HValueResponder {
  /* = Description
  * Initializes a Rect as four sides, as two diametrically opposed corners,
  * or as a copy of some other Rect object. A rectangle that's not assigned
  * any initial values is invalid, until a specific assignment is made, either
  * through a set() function or by setting the object's data members directly.
  *
  * = Parameters
  * using a HRect instance:
  * +rect+::  Another HRect.
  *
  * using two HPoint instances:
  * +leftTop+::       Coordinates of the left top corner.
  * +rightBottom+::   Coordinates of the right bottom corner.
  *
  * using separate numeric coordinates:
  * +left+::    The coordinate of left side.
  * +top+::     The coordinate of top side.
  * +right+::   The coordinate of right side.
  * +bottom+::  The coordinate of bottom side.
  *
  * = Usage
  *  var myLeftTopPoint = new HPoint(100,200);
  *  var myBottomRightPoint = new HPoint(300,400);
  *  var myRectFromOppositeCornerPoints = new HRect( myLeftTopPoint, myBottomRightPoint );
  *  var myRectFromSideCoordinates = new HRect(100,200,300,400);
  *  var myRectFromAnotherRect = new HRect( myRectFromEdgeCoordinates );
  *
  **/
  constructor(_left, _top, _right, _bottom) {
    super();
    // HValue and HView binding support:
    this.valueObj = null;
    this.viewIds = [];
    const _argLen = arguments.length;
    if (_argLen === 0) {
      this._constructorDefault();
    }
    else if (_argLen === 4) {
      this._constructorSides(_left, _top, _right, _bottom);
    }
    else if (_argLen === 2) {
      this._constructorPoint(_left, _top);
    }
    else if (_argLen === 1) {
      if (_left instanceof Array && _left.length === 4) {
        const _arr = _left;
        this._constructorSides(_arr[0], _arr[1], _arr[2], _arr[3]);
      }
      else if (_left instanceof Array && _left.length === 6) {
        const _arr = _left;
        throw new Error('HRect#constructor error: six-argument rect-array not properly implemented yet!');
      }
      else if (_left.hasAncestor && _left.hasAncestor(HRect)) {
        const _rect = _left;
        this._constructorRect(_rect);
      }
    }
    else {
      throw new Error('HRect#constructor error: Invalid number of arguments.');
    }
    this.updateSecondaryValues();
  }

  _constructorDefault() {
    this.top = 0;
    this.left = 0;
    this.bottom = -1;
    this.right = -1;
  }

  _constructorSides(_left, _top, _right, _bottom) {
    this.top = _top;
    this.left = _left;
    this.bottom = _bottom;
    this.right = _right;
  }

  _constructorPoint(_leftTop, _rightBottom) {
    this.top = _leftTop.y;
    this.left = _leftTop.x;
    this.bottom = _rightBottom.y;
    this.right = _rightBottom.x;
  }

  _constructorRect(_rect) {
    this.top = _rect.top;
    this.left = _rect.left;
    this.bottom = _rect.bottom;
    this.right = _rect.right;
  }

  clone() {
    return new HRect(this);
  }

  toArray() {
    const _arr = [null, null, null, null, null, null];
    const _view = HSystem.views[this.viewIds[0]];
    const _parentSize = _view.parentSize();
    if (_view && (_view.flexRight || _view.flexBottom)) {
      if (this.viewIds.length !== 1) {
        throw new Error(`HRect#toArray; unsupported amount of bound views: ${this.viewIds.length}.`);
      }
      _arr[0] = _view.flexLeft ? this.left : null;
      _arr[1] = _view.flexTop ? this.top : null;
      _arr[2] = _view.minWidth !== 0 ? _view.minWidth : this.width;
      _arr[3] = _view.minHeight !== 0 ? _view.minHeight : this.height;
      _arr[4] = _view.flexRight ? _view.flexRightOffset : null;
      _arr[5] = _view.flexBottom ? _view.flexBottomOffset : null;
      return _arr;
    }
    else {
      return [this.left, this.top, this.width, this.height];
    }
  }

  _updateFlexibleDimensions() {
    if (this.viewIds.length !== 1) {
      throw new Error(`HRect#_updateFlexibleDimensions; unsupported amount of bound views: ${this.viewIds.length}.`);
    }
    const _view = HSystem.views[this.viewIds[0]];
    if (_view.flexRight || _view.flexBottom) {
      ELEM.flush();

      // TODO: This will increase performance somewhat, but needs to be broader than it is:
      // var i=0,_parentElemIds=[_view.elemId],_parentView;
      // for(;i<_view.parents.length;i++){
      //   _parentView = _view.parents[i];
      //   if(_parentView && _parentView.elemId !== null && _parentView.elemId !== undefined){
      //     _parentElemIds.push(_parentView.elemId);
      //   }
      // }
      // ELEM.flushElem(_parentElemIds);

      const [_parentWidth, _parentHeight] = _view.parentSize();
      if (_view.flexRight && _view.flexLeft) {
        // calculate width and right
        const _virtualWidth = _parentWidth - this.left - _view.flexRightOffset;
        if (_view.minWidth !== null && _virtualWidth < _view.minWidth) {
          this.width = _view.minWidth;
        }
        else {
          this.width = _virtualWidth;
        }
        this.right = this.left + this.width;
      }
      else if (_view.flexRight) {
        // calculate left and right
        this.width = _view.minWidth;
        this.left = _parentWidth - this.width - _view.flexRightOffset;
        this.right = this.width + this.left;
      }
      else {
        // calculate width
        this.width = this.right - this.left;
      }
      if (_view.flexTop && _view.flexBottom) {
        // calculate height and bottom
        const _virtualHeight = _parentHeight - this.top - _view.flexBottomOffset;
        if (_view.minHeight !== null && _virtualHeight < _view.minHeight) {
          this.height = _view.minHeight;
        }
        else {
          this.height = _virtualHeight;
        }
        this.bottom = this.top + this.height;
      }
      else if (_view.flexBottom) {
        // calculate top and bottom
        this.height = _view.minHeight;
        this.top = _parentHeight - this.height - _view.flexBottomOffset;
        this.bottom = this.height + this.top;
      }
      else {
        // calculate height
        this.height = this.bottom - this.top;
      }
      this.updateSecondaryValues(true);
    }
  }

  /* = Description
  * You should call this on the instance to update secondary values, like
  * width and height, if you change a primary (left/top/right/bottom) value
  * straight through the property.
  *
  * Do not change properties other than the primaries through properties.
  *
  * Use the accompanied methods instead.
  *
  **/
  updateSecondaryValues(_noSize) {

    // this._updateFlexibleDimensions();

    /**
      * isValid is true if the Rect's right side is greater than or equal to its left
      * and its bottom is greater than or equal to its top, and false otherwise.
      * An invalid rectangle can't be used to define an interface area (such as
      * the frame of a view or window).
      **/
    this.isValid = this.right >= this.left && this.bottom >= this.top;

    /**
      *
      * The Point-returning functions return the coordinates of one of the
      * rectangle's four corners.
      **/
    this.leftTop = new HPoint(this.left, this.top);
    this.leftBottom = new HPoint(this.left, this.bottom);
    this.rightTop = new HPoint(this.right, this.top);
    this.rightBottom = new HPoint(this.right, this.bottom);

    /**
      * The width and height of a Rect's rectangle, as returned through these
      * properties.
      **/
    if (!_noSize) {
      this.width = (this.right - this.left);
      this.height = (this.bottom - this.top);
    }
    this.position = [this.left, this.top];
    this.size = [this.width, this.height];
    return this;
  }

  /* = Description
  * Sets the object's rectangle by defining the coordinates of all four
  * sides.
  *
  * The other set...() functions move one of the rectangle's corners to the
  * Point argument; the other corners and sides are modified concomittantly.
  *
  * None of these methods prevents you from creating an invalid rectangle.
  *
  * = Parameters
  * +_left+::     The coordinate of the left side.
  * +_top+::      The coordinate of the top side.
  * +_right+::    The coordinate of the right side.
  * +_bottom+::   The coordinate of the bottom side.
  *
  **/
  set(_left, _top, _right, _bottom) {
    const _argLen = arguments.length;
    if (_argLen === 0) {
      this._constructorDefault();
    }
    else if (_argLen === 4) {
      this._constructorSides(_left, _top, _right, _bottom);
    }
    else if (_argLen === 2) {
      this._constructorPoint(_left, _top);
    }
    else if (_argLen === 1) {
      if (_left instanceof Array && _left.length === 4) {
        const _arr = _left;
        this._constructorSides(_arr[0], _arr[1], _arr[2], _arr[3]);
      }
      else if (_left instanceof Array && _left.length === 6) {
        const _arr = _left;
        throw new Error('HRect#set error: six-argument rect-array not properly implemented yet!');
      }
      else if (_left.hasAncestor && _left.hasAncestor(HRect)) {
        const _rect = _left;
        this._constructorRect(_rect);
      }
    }
    else {
      throw new Error('HRect#set error: Invalid number of arguments.');
    }
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rect's left side to a new coordinate.
  *
  * = Parameters
  * +_left+::  The new left side coordinate (in px)
  *
  **/
  setLeft(_left) {
    this.left = _left;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rect's right side to a new coordinate.
  *
  * = Parameters
  * +_right+::  The new right side coordinate (in px)
  *
  **/
  setRight(_right) {
    this.right = _right;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rect's top side to a new coordinate.
  *
  * = Parameters
  * +_top+::  The new top side coordinate (in px)
  *
  **/
  setTop(_top) {
    this.top = _top;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rect's bottom side to a new coordinate.
  *
  * = Parameters
  * +_bottom+::  The new bottom side coordinate (in px)
  *
  **/
  setBottom(_bottom) {
    this.bottom = _bottom;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects left and top sides to a new point. Affects the position,
  * width and height.
  *
  * = Parameters
  * +_point+::  A HPoint instance to mode the sides to.
  *
  **/
  setLeftTop(_point) {
    this.left = _point.x;
    this.top = _point.y;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects left and bottom sides to a new point. Affects the left
  * position, width and height.
  *
  * = Parameters
  * +_point+::  A HPoint instance to mode the sides to.
  *
  **/
  setLeftBottom(_point) {
    this.left = _point.x;
    this.bottom = _point.y;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects right and top sides to a new point. Affects the top
  * position, width and height.
  *
  * = Parameters
  * +_point+::  A HPoint instance to mode the sides to.
  *
  **/
  setRightTop(_point) {
    this.right = _point.x;
    this.top = _point.y;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects right and bottom sides to a new point. Affects the width
  * and height. Does not affect the position.
  *
  * = Parameters
  * +_point+::  A HPoint instance to mode the sides to.
  *
  **/
  setRightBottom(_point) {
    this.right = _point.x;
    this.bottom = _point.y;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects right side to a new coordinate. Does not affect the position.
  *
  * = Parameters
  * +_width+::  A numeric value representing the new target width of the rect.
  *
  **/
  setWidth(_width) {
    this.right = this.left + _width;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects bottom side to a new coordinate. Does not affect the position.
  *
  * = Parameters
  * +_height+::   A numeric value representing the new target height of the rect.
  *
  **/
  setHeight(_height) {
    this.bottom = this.top + _height;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects right and bottom sides to new coordinates. Does not affect the position.
  *
  * = Parameters
  * by separate numeric values:
  * +_width+::   A numeric value representing the new target width of the rect.
  * +_height+::  A numeric value representing the new target height of the rect.
  *
  * by HPoint used as "HSize":
  * +_point.x+::   A numeric value representing the new target width of the rect.
  * +_point.y+::   A numeric value representing the new target height of the rect.
  *
  **/
  setSize(_width, _height) {
    const _argLen = arguments.length;
    // Using width and height:
    if (_argLen === 2) {
    }
    // Using a point:
    else if (_argLen === 1 && _width.hasAncestor && _width.hasAncestor(HPoint)) {
      const _point = _width;
      _width = _point.x;
      _height = _point.y;
    }
    // From a rect:
    else if (_argLen === 1 && _width.hasAncestor && _width.hasAncestor(HRect)) {
      const _rect = _width;
      _width = _rect.width;
      _height = _rect.height;
    }
    this.right = this.left + _width;
    this.bottom = this.top + _height;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Returns true if the Rect has any area even a corner or part
  * of a side in common with rect, and false if it doesn't.
  *
  * = Parameters
  * +_rect+::      A HRect instance to intersect this rect with
  * +_insetByX+::  Insets +_rect+ by +_insetBy+ pixels, optional
  * +_insetByY+::  Insets +_rect+ by +_insetBy+ pixels, optional.
  *   If omitted, but +_insetByX+ is defined, then +_insetByY+ equals +_insetByX+.
  *
  * = Returns
  * A Boolean (true/false) depending on the result.
  *
  **/
  intersects(_rect, _insetByX, _insetByY) {
    if (typeof _insetByX === 'number') {
      _rect = new HRect(_rect);
      if (typeof _insetByY === 'undefined') {
        _insetByY = _insetByX;
      }
      _rect.insetBy(_insetByX, _insetByY);
    }
    return !(this.left > _rect.right || this.right < _rect.left ||
             this.top > _rect.bottom || this.bottom < _rect.top);
  }

  // overlaps an alias of intersects
  overlaps(_rect, _insetbyX, _insetByY) {
    return this.intersects(_rect, _insetbyX, _insetByY);
  }

  /* = Description
  * Returns true if point or rect lies entirely within the Rect's
  * rectangle (and false if not). A rectangle contains the points that lie
  * along its edges; for example, two identical rectangles contain each other.
  *
  * Also works with HPoint instances.
  *
  * = Parameters
  * +_obj+::  A HRect or HPoint to check the containment with.
  *
  * = Returns
  * A Boolean (true/false) depending on the result.
  *
  **/
  contains(_obj) {
    if (_obj instanceof HPoint) {
      return this._containsPoint(_obj);
    }
    else if (_obj instanceof HRect) {
      return this._containsRect(_obj);
    }
    else {
      throw new TypeError(`HRect#contains; Wrong argument type: ${typeof _obj}`);
    }
  }

  _containsPoint(_point) {
    return (_point.x >= this.left && _point.x <= this.right &&
            _point.y >= this.top && _point.y <= this.bottom);
  }

  _containsRect(_rect) {
    return (_rect.left >= this.left && _rect.right <= this.right &&
            _rect.top >= this.top && _rect.bottom <= this.bottom);
  }

  /* = Description
  * Insets the sides of the Rect's rectangle by x units (left and
  * right sides) and y units (top and bottom). Positive inset values shrink
  * the rectangle; negative values expand it. Note that both sides of each
  * pair moves the full amount. For example, if you inset a Rect by (4,4), the
  * left side moves (to the right) four units and the right side moves (to the
  * left) four units (and similarly with the top and bottom).
  *
  * = Parameters
  * using a HPoint:
  * +point+::  A HPoint to inset by.
  *
  * using separate x and y coordinates:
  * +x+::  x Coordinate
  * +y+::  y Coordinate
  *
  **/
  insetBy(x, y) {
    const _argLen = arguments.length;
    if (_argLen === 1 && x instanceof HPoint) {
      const _point = x;
      this._insetByPoint(_point);
    }
    else if (_argLen === 2) {
      this._insetByXY(x, y);
    }
    else {
      throw new Error(`HRect#insetBy; Invalid number of arguments: ${_argLen}`);
    }
    this.updateSecondaryValues();
    return this;
  }

  _insetByPoint(_point) {
    this._insetByXY(_point.x, _point.y);
  }

  _insetByXY(x, y) {
    this.left += x;
    this.top += y;
    this.right -= x;
    this.bottom -= y;
  }

  /* = Description
  * Moves the Rect horizontally by x units and vertically by y
  * units. The rectangle's size doesn't change.
  *
  * = Parameters
  * using a HPoint:
  * +point+::  A HPoint to offset by.
  *
  * using separate x and y coordinates
  * +x+::  X coordinate
  * +y+::  Y coordinate
  *
  **/
  offsetBy(x, y) {
    const _argLen = arguments.length;
    if (_argLen === 1 && x instanceof HPoint) {
      const _point = x;
      this._offsetByPoint(_point);
    }
    if (_argLen === 1 && x instanceof Array && x.length === 2) {
      [x, y] = x;
      this._offsetByXY(x, y);
    }
    else if (_argLen === 2) {
      this._offsetByXY(x, y);
    }
    else {
      throw new Error(`HRect#offsetBy; Invalid number of arguments: ${_argLen}`);
    }
    this.updateSecondaryValues();
    return this;
  }

  _offsetByPoint(_point) {
    this._offsetByXY(_point.x, _point.y);
  }

  _offsetByXY(x, y) {
    this.left += x;
    this.top += y;
    this.right += x;
    this.bottom += y;
  }

  /* = Description
  * Moves the Rect to the location (x,y).
  *
  * = Parameters
  * using a HPoint:
  * +point+::  A HPoint to offset to.
  *
  * using separate x and y coordinates):
  * +x+::  X coordinate
  * +y+::  Y coordinate
  *
  **/
  offsetTo(x, y) {
    const _argLen = arguments.length;
    if (_argLen === 1 && x instanceof HPoint) {
      const _point = x;
      this._offsetToPoint(_point);
    }
    else if (_argLen === 1 && x instanceof Array && x.length === 2) {
      [x, y] = x;
      this._offsetToXY(x, y);
    }
    else if (_argLen === 2) {
      this._offsetToXY(x, y);
    }
    else {
      throw new Error(`HRect#offsetTo; Invalid number of arguments: ${_argLen}`);
    }
    this.updateSecondaryValues();
    return this;
  }

  _offsetToPoint(_point) {
    this._offsetToXY(_point.x, _point.y);
  }

  _offsetToXY(x, y) {
    this.right += x - this.left;
    this.left = x;
    this.bottom += y - this.top;
    this.top = y;
  }

  /* = Description
  * Returns true if the two objects' rectangles exactly coincide.
  *
  * = Parameters
  * +_rect+::  A HRect instance to compare to.
  *
  * = Returns
  * A Boolean (true/false) depending on the result.
  *
  **/
  equals(_rect) {
    return (this.left === _rect.left && this.top === _rect.top &&
            this.right === _rect.right && this.bottom === _rect.bottom);
  }

  /* = Description
  * Creates and returns a new Rect that's the intersection of this Rect and
  * the specified Rect. The new Rect encloses the area that the two Rects have
  * in common. If the two Rects don't intersect, the new Rect will be invalid.
  *
  * = Parameters
  * +_rect+::   A HRect instance to compare to.
  *
  * = Returns
  * A new HRect instance.
  *
  **/
  intersection(_rect) {
    return new HRect(
       Math.max(this.left, _rect.left), Math.max(this.top, _rect.top),
       Math.min(this.right, _rect.right), Math.min(this.bottom, _rect.bottom)
    );
  }

  /* = Description
  * Creates and returns a new Rect that minimally but completely encloses the
  * area defined by this Rect and the specified Rect.
  *
  * = Parameters
  * +_rect+::   A HRect instance to compare to.
  *
  * = Returns
  * A new HRect instance.
  *
  **/
  union(_rect) {
    return new HRect(
      Math.min(this.left, _rect.left), Math.min(this.top, _rect.top),
      Math.max(this.right, _rect.right), Math.max(this.bottom, _rect.bottom)
    );
  }

  bind(_view) {
    console.warn('HRect#bind is deprecated; use #bindView instead');
    return this.bindView(_view);
  }

  /* = Description
  * Binds an HView instance to the rect
  * This is the "opposite" function of #releaseView
  *
  * = Parameters
  * +_view+:: HView instance
  *
  **/
  bindView(_view) {
    if (!this.viewIds.includes(_view.viewId)) {
      this.viewIds.push(_view.viewId);
    }
    this._updateFlexibleDimensions();
    return this;
  }

  release(_view) {
    console.warn('HRect#release is deprecated; use #releaseView instead');
    return this.releaseView(_view);
  }

  /* = Description
  * Releases an HView instance from the rect
  * This is the "opposite" function of #bindView
  *
  * = Parameters
  * +_view+:: HView instance
  *
  **/
  releaseView(_view) {
    if (this.viewIds.includes(_view.viewId)) {
      this.viewIds.splice(this.viewIds.indexOf(_view.viewId), 1);
    }
    return this;
  }

  refreshValue() {
    this.set(this.__value);
    this.viewIds
      .map(_viewId => {
        return HSystem.views[_viewId];
      })
      .filter(_view => {
        return !!_view;
      })
      .forEach(_view => {
        _view.drawRect();
      });
    return this;
  }

}

module.exports = HRect;

});

__exports('foundation/thememanager', function() {
const HClass = require('core/class');
const {BROWSER_TYPE, ELEM} = require('core/elem');

class HThemeManager extends HClass {
  constructor() {
    super();
    // temporary solution until new theme is crafted:
    this.allInOneCSS = true;
    this.currentTheme = 'default';
    this.currentThemePath = null;
    this.themePaths = {};
    this.themes = [];
    // CSS Templates and CSS Template methods per theme name
    this.themeCSSTemplates = {};
    // HTML Templates and HTML Template methods per theme name
    this.themeHTMLTemplates = {};
    // Simple reference counting by theme name and component name, when 0, clear the style sheet
    this.cssCountUsedBy = {};
    this.cssByThemeAndComponentName = {};
    this._variableMatch = /#\{([a-z0-9]+?)\}/;
    this._assignmentMatch = /\$\{([a-z0-9]+?)\}/;
  }

  // Set the graphics loading path of the the themeName
  setThemePath(_clientPrefix) {
    this.currentThemePath = _clientPrefix;
    this.themes.forEach(_themeName => {
      this.setupThemePath(_themeName);
    });
  }

  setupAllInOneCSS(_themeName) {
    let _cssText = '';
    Object
      .entries(this.themeCSSTemplates[_themeName])
      .forEach(([_componentName]) => {
        _cssText += this.buildCSSTemplate(
          this, _themeName, _componentName
        );
      });
    const _style = this.useCSS(_cssText);
    try {
      // Causes issues in Firefox?
      const _cssTitle = `rsence/${_themeName}`;
      _style.title = _cssTitle;
    }
    catch (e) {
      console.warn('HThemeManager#setupAllInOneCSS error; e:', e);
    }
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
    if (!this.themeHTMLTemplates[_themeName]) {
      console.warn(`HThemeManager#buildHTMLTemplate warning: Theme '${_themeName}' is not installed`);
      return '';
    }
    else if (!this.themeHTMLTemplates[_themeName][_componentName]) {
      console.warn(`HThemeManager#buildHTMLTemplate warning: Theme '${_themeName
      }' does not have component '${_componentName}' installed`);
      return '';
    }
    else {
      const _tmpl = this.themeHTMLTemplates[_themeName][_componentName];
      const _tmplJS = _tmpl[0];
      let _tmplHTML = _tmpl[1];
      let _rect = _view.rect;
      if (!_rect) {
        _rect = [0, 0, 0, 0];
      }
      _tmplHTML = _tmplHTML
        .replace(/\]I\[/g, _view.elemId.toString())
        .replace(/\]W\[/g, _rect.width)
        .replace(/\]H\[/g, _rect.height);
      if (_tmplJS.length === 0) {
        return _tmplHTML;
      }
      else {
        const [_variableMatch, _assignmentMatch] = [this._variableMatch, this._assignmentMatch];
        const _callValue = (_id, _isAssign) => {
          _id = parseInt(_id, 36) - 10;
          try {
            const _out = _tmplJS[_id].apply(_view, [_view.elemId.toString(), _rect.width, _rect.height]);
            return _isAssign ? '' : _out;
          }
          catch (e) {
            console.error(`HThemeManager#buildHTMLTemplate; Template error(${e
            }) in ${_themeName}/${_componentName}: ${_tmplJS[_id]}`);
            return '';
          }
        };
        while (_assignmentMatch.test(_tmplHTML)) {
          _tmplHTML = _tmplHTML.replace(_assignmentMatch, _callValue(RegExp.$1, true));
        }
        while (_variableMatch.test(_tmplHTML)) {
          _tmplHTML = _tmplHTML.replace(_variableMatch, _callValue(RegExp.$1));
        }
        return _tmplHTML;
      }
    }
  }

  gradientStyle(..._colors) {
    const [_key, _value] = ELEM._linearGradientStyle({
      start: _colors.shift(),
      end: _colors.pop(),
      steps: _colors
    }
    );
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
      const _tmplJS = _tmpl[0];
      let _tmplCSS = _tmpl[1];
      const [_variableMatch, _assignmentMatch] = [this._variableMatch, this._assignmentMatch];
      this.getThemeGfxFile = _fileName => {
        return this._buildThemePath(_fileName, _themeName);
      };
      this.getCssFilePath = _fileName => {
        return `url(${this._buildThemePath(_fileName, _themeName)})`;
      };
      const _cssThemeUrlMatch = /#url\((.+?)\)/gm;
      // if (_cssThemeUrlMatch.test(_tmplCSS)) {
      while (_cssThemeUrlMatch.test(_tmplCSS)) {
        _tmplCSS = _tmplCSS.replace(
          _cssThemeUrlMatch, (_match, _fileName) => {
            return `url(${this._buildThemePath(_fileName, _themeName)})`;
          }
        );
      }
      if (_tmplJS.length === 0) {
        return _tmplCSS;
      }
      else {
        const _callValue = (_id, _isAssign) => {
          const _oid = _id;
          _id = parseInt(_id, 36) - 10;
          try {
            const _out = _tmplJS[_id].apply(_context);
            return _isAssign ? '' : _out;
          }
          catch (e) {
            console.error(`HThemeManager#buildCSSTemplate; Template error(${e
            }) in ${_themeName}/${_componentName}: ${_tmplJS[_id]}`);
            return '';
          }
        };
        while (_assignmentMatch.test(_tmplCSS)) {
          _tmplCSS = _tmplCSS.replace(_assignmentMatch, _callValue(RegExp.$1, false));
        }
        while (_variableMatch.test(_tmplCSS)) {
          _tmplCSS = _tmplCSS.replace(_variableMatch, _callValue(RegExp.$1));
        }
        delete this.getCssFilePath;
        delete this.getThemeGfxFile;
        return _tmplCSS;
      }
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
          for (const _ancestor in _view.ancestors) {
            if (!_ancestor.componentName) {
              break;
            }
            this.resourcesFor(_ancestor, _themeName, true);
          }
        }
      }
      this.buildHTMLTemplate(_view, _themeName, _componentName);
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
        for (const _ancestor in _view.ancestors) {
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
    const _head = document.getElementsByTagName('head')[0];
    _head.appendChild(_style);
    if (BROWSER_TYPE.safari || BROWSER_TYPE.firefox || BROWSER_TYPE.opera) {
      // This is how to do it in KHTML browsers
      _style.appendChild(document.createTextNode(_cssText));
    }
    else {
      // This works for many others (add more checks, if problems with new browsers)
      _style.textContent = _cssText;
    }
    return _style;
  }
}

module.exports = new HThemeManager();

});

__exports('foundation/view', function() {

const HClass = require('core/class');
const {BROWSER_TYPE, ELEM, LOAD} = require('core/elem');
let EVENT; LOAD(() => {EVENT = require('foundation/eventmanager');});
const UtilMethods = require('util/util_methods');
const HRect = require('util/geom/rect');
const HPoint = require('util/geom/point');
const HLocale = require('foundation/locale');
const HSystem = require('foundation/system');
const HThemeManager = require('foundation/thememanager');

/** = Description
  * Define default HView setting here. Will be used, when no or invalid constructor
  * options are supplied.
  **/
class HViewDefaults extends HClass.mixin({
  /* Whether or not to draw when constructed.
  */
  autoDraw: true,
  /** The default label. A label is the "visual value" of a component that
  * operates on a "hidden" value.
  **/
  label: '',
  /** The default initial visibility of the component.
  **/
  visible: true,
  /** The default value of the component
  **/
  value: 0,
  /**  Use utc time as default
  **/
  useUTC: false
}) {
  constructor() {
    super();
  }
}

/** = Description
 ** HView is the foundation class for all views. HView is useful for
 ** any type of view and control grouping. It is designed for easy extension
 ** and it's the foundation for HControl and all other controls.
 **
 ** The major differences between HView and HControl is that HView handles
 ** only visual representation and structurization. In addition to HView's
 ** features, HControl handles labels, values, events, states and such.
 ** However, HControl is more complex, so use HView instead whenever you don't
 ** need the additional features of HControl. HView implements the HMarkupView
 ** interface for template-related task.
 **
 ** = Usage
 **  var myAppInstance = HApplication.nu();
 **  var rect1 = [10, 10, 100, 100];
 **  var myViewInstance = HView.nu( rect1, myAppInstance, { style: { backgroundColor: '#fc0' } } );
 **  var rect2 = [10, 10, 70, 70];
 **  var mySubView1 = HView.nu( rect2, myViewInstance, { style: { backgroundColor: '#cfc' } } );
 **  var rect3 = [20, 20, 50, 50];
 **  var mySubView2 = HView.nu( rect3, mySubView1, { style: { backgroundColor: '#000' } } );
 **
**/
class HView extends UtilMethods.mixin({
  isView: true,  // attribute to check if the object is a view
  isCtrl: false, // attribute to check for if the object is a control
  isDead: false, // attribute to check for killed object references

/** Component specific theme path.
  **/
  themePath: null,

/** Component CSS position type: absolute|relative|fixed
  **/
  cssPosition: 'absolute',

/** Component CSS overflow type: false|visible|hidden|scroll|auto|initial|inherit
  **/
  cssOverflow: 'hidden',

/** Component CSS overflow-x type: false|visible|hidden|scroll|auto|initial|inherit
  **/
  cssOverflowY: false,

/** Component CSS overflow-x type: false|visible|hidden|scroll|auto|initial|inherit
  **/
  cssOverflowX: false,

/** The display mode to use.
  * Defaults to 'block'.
  * The other sane alternative is 'inline'.
  **/
  displayMode: 'block',

/** The visual value of a component, usually a String.
  * See +#setLabel+.
  **/
  label: null,

/** When true, calls the +refreshLabel+ method whenever
  * +self.label+ is changed.
  **/
  refreshOnLabelChange: true,

/** Escapes HTML in the label when true.
  **/
  escapeLabelHTML: false,

/** True, if the coordinates are right-aligned.
  * False, if the coordinates are left-aligned.
  * Uses _rightOffset if true. Defined with 6-item arrays
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexRight method.
  **/
  flexRight: false,

/** True, if the coordinates are left-aligned.
  * False, if the coordinates are right-aligned.
  * Uses the X-coordinate of rect, if true.
  * Disabled using 6-item arrays with null x-coordinate
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexLeft method.
  **/
  flexLeft: true,

/** True, if the coordinates are top-aligned.
  * False, if the coordinates are bottom-aligned.
  * Uses the Y-coordinate of rect, if true.
  * Disabled using 6-item arrays with null x-coordinate
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexTop method.
  **/
  flexTop: true,

/** True, if the coordinates are bottom-aligned.
  * False, if the coordinates are top-aligned.
  * Uses _bottomOffset if true. Defined with 6-item arrays
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexRight method.
  **/
  flexBottom: false,

/** The amount of pixels to offset from the right edge when
  * flexRight is true. Defined with 6-item arrays
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexRight method.
  **/
  _rightOffset: 0,

/** The amount of pixels to offset from the bottom edge when
  * flexBottom is true.Defined with 6-item arrays
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexBottom method.
  **/
  _bottomOffset: 0,

/** The drawn flag is false before the component is visually
  * drawn, it's true after it's drawn.
  **/
  drawn: false,

/** The theme the component is constructed with. By default,
  * uses the HThemeManager.currentTheme specified at the time
  * of construction.
  **/
  theme: null,

/** The preserveTheme flag prevents the view from being redrawn
  * if HThemeManager.currentTheme is changed after the view
  * has been drawn. Is true, if theme has been set.
  **/
  preserveTheme: false,

/** The optimizeWidthOnRefresh flag, when enabled, allows
  * automatic width calculation for components that support
  * that feature.
  **/
  optimizeWidthOnRefresh: false,

/** The parent is the +_parent+ supplied to the constructor.
  * This is a complete object reference to the parent's name-space.
  **/
  parent: null,

/** The parents is an array containing parent instances up to
  * the root controller level. The root controller is almost
  * always an instance of HApplication.
  **/
  parents: null,

/** The viewId is the unique ID (serial number) of this view.
  * This means the view can be looked up globally based on its
  * id by using the +HSystem.views+ array.
  **/
  viewId: null,

/** The appId is the unique ID (serial number) of the app process
  * acting as the root controller of the view tree of which this
  * view is a member.
  * This means the app can be looked up globally based on this
  * id by using the +HSystem.apps+ array.
  **/
  appId: null,

/** The app is the reference of the app process acting as
  * the root controller of the view tree of which this view is a
  * member.
  * This is a complete object reference to the app's name-space.
  **/
  app: null,

/** The views array contains a list of sub-views of this view
  * by id. To access the object reference, use the +HSystem.views+
  * array with the id.
  **/
  views: null,

/** The viewsZOrder array contains a list of sub-views ordered by
  * zIndex. To change the order, use the bringToFront,
  * sendToBack, bringForwards, sendBackwards, bringToFrontOf and
  * sentToBackOf methods.
  **/
  viewsZOrder: null,

/** The isHidden flog reflects the visibility of the view.
  **/
  isHidden: false,

/** The +HRect+ instance bound to +self+ using the +constructor+ or +setRect+.
  **/
  rect: null,

/** An reference to the options block given as the constructor
  * parameter _options.
  **/
  options: null,

/** The viewDefaults is a HViewDefaults object that is extended
  * in the constructor with the options block given. The format of
  * it is an Object.
  * It's only used when not extended via HControl, see HControl#controlDefaults.
  **/
  viewDefaults: HViewDefaults,

  // Allows text to be selected when true
  textSelectable: false,

  markupElemNames: ['bg', 'label', 'state', 'control', 'value', 'subview'],

  minWidth: 0,
  minHeight: 0,
  _stringSizeImportantAttrs: [
    'fontSize',
    'fontWeight',
    'fontFamily',
    'lineHeight'
  ],
}) /* end of mixin, class begins */ {
  /* = Description
  * Constructs the logic part of a HView.
  * The view still needs to be drawn on screen. To do that, call draw after
  * subcomponents of the view are initialized.
  *
  * = Parameters
  * +_rect+::     An instance of +HRect+, defines the position and size of views.
  *               It can be also defined with an array, see below.
  * +_parent+::   The parent instance this instance will be contained within.
  *               A valid parent can be another HView compatible instance,
  *               an HApplication instance, a HControl or a similar extended
  *               HView instance. The origin of the +_rect+ is the same as the
  *               parent's offset. For HApplication instances, the web browser's
  *               window's left top corner is the origin.
  *
  * == The +_rect+ dimensions as arrays
  * Instead of an instance of +HRect+, dimensions can also be supplied as arrays.
  * The array length must be either 4 or 6. If the length is 4, the dimensions are
  * specified as follows: +[ x, y, width, height ]+. Note that this is different
  * from the construction parameters of +HRect+ that takes the coordinates as two
  * points, like: +( left, top, right, bottom )+.
  * Arrays with 6 items are a bit more complex (and powerful) as they can specify
  * the flexible offsets too.
  *
  * === The array indexes for a +_rect+ configured as an 4-item array:
  * Always left/top aligned, all items must be specified.
  * Index::            Description
  * +0+::              The X-coordinate (measured from the parent's left edge)
  * +1+::              The Y-coordinate (measured from the parent's top edge)
  * +2+::              The width.
  * +3+::              The height.
  *
  * === The array indexes a +_rect+ configured as an 6-item array:
  * Can be any configuration of left/top/right/bottom alignment and supports
  * flexible widths. At least 4 items must be specified.
  * Index::            Description
  * +0+::              The left-aligned X-coordinate or +null+ if the view is
  *                    right-aligned and using a right-aligned X-coordinate at
  *                    index +4+ as well as the width specified at index +2+.
  * +1+::              The top-aligned Y-coordinate or +null+ if the view is
  *                    bottom-aligned and using a right-aligned X-coordinate at
  *                    index +5+ as well as the height specified at index +3+.
  * +2+::              The width, if only one X-coordinate specifies the
  *                    position (at indexes +0+ or +4+).
  *                    If both X-coordinates (at indexes +0+ and +4+) are
  *                    specified, the width can be specified with a +null+ for
  *                    automatic (flexible) width. If the width is specified,
  *                    it's used as the minimum width.
  * +3+::              The height, if only one Y-coordinate specifies the
  *                    position (at indexes +1+ or +5+).
  *                    If both Y-coordinates (at indexes +1+ and +5+) are
  *                    specified, the height can be specified with a +null+ for
  *                    automatic (flexible) height. if the height is specified,
  *                    it's used as the minimum height.
  * +4+::              The right-aligned X-coordinate or +null+ if the view is
  *                    left-aligned and using a left-aligned X-coordinate at
  *                    index +0+ as well as the width specified at index +2+.
  * +5+::              The bottom-aligned Y-coordinate or +null+ if the view is
  *                    top-aligned and using a top-aligned X-coordinate at
  *                    index +1+ as well as the height specified at index +3+.
  * == Usage examples of +_rect+:
  * Specified as two instances of +HPoint+,
  * x: 23, y: 75, width: 200, height: 100:
  *  HRect.nu( HPoint.nu( 23, 75 ), HPoint.nu( 223, 175 ) )
  *
  * The same as above, but without +HPoint+ instances:
  *  HRect.nu( 23, 75, 223, 175 )
  *
  * The same as above, but with an array as the constructor
  * parameter for +HRect+:
  *  HRect.nu( [ 23, 75, 223, 175 ] )
  *
  * The same as above, but with an array instead of a +HRect+ instance:
  *  [ 23, 75, 200, 100 ]
  *
  * The same as above, but with a 6-item array:
  *  [ 23, 75, 200, 100, null, null ]
  *
  * The same as above, but aligned to the right instead of left:
  *  [ null, 75, 200, 100, 23, null ]
  *
  * The same as above, but aligned to the right/bottom edges:
  *  [ null, null, 200, 100, 23, 75 ]
  *
  * The same as above, but aligned to the left/bottom edges:
  *  [ 23, null, 200, 100, null, 75 ]
  *
  * Flexible width (based on the parent's dimensions):
  *  [ 23, 75, null, 100, 23, null ]
  *
  * Flexible height (based on the parent's dimensions):
  *  [ 23, 75, 200, null, null, 75 ]
  *
  * Flexible width and height (based on the parent's dimensions):
  *  [ 23, 75, null, null, 23, 75 ]
  *
  * Flexible width and height, but limited to a minimum width
  * of 200 and a minimum height of 100 (based on the parent's dimensions):
  *  [ 23, 75, 200, 100, 23, 75 ]
  *
  **/
  constructor(_rect, _parent, _options) {
    super();
    // destructable timeouts:
    this.timeouts = [];
    // adds the parentClass as a "super" object
    this.parent = _parent;
    if (this.isNullOrUndefined(_options)) {
      _options = {};
    }
    if (this.isntNullOrUndefined(HSystem.apps[_options.appId])) {
      this.appId = _options.appId;
    }
    else {
      this.appId = this.parent.appId;
    }
    this.app = HSystem.apps[this.appId];
    if (!this.isinherited) {
      _options = (this.viewDefaults.extend(_options)).new(this);
    }
    if (this.isFunction(this.customOptions)) {
      this.customOptions(_options);
    }
    this.options = _options;
    this.label = _options.label;
    // Moved these to the top to ensure safe theming operation
    if (_options.theme) {
      this.theme = _options.theme;
      this.preserveTheme = true;
    }
    else if (!this.theme) {
      this.theme = HThemeManager.currentTheme;
      this.preserveTheme = false;
    }
    else {
      this.preserveTheme = true;
    }
    if (_options.visible === false || _options.hidden === true) {
      this.isHidden = true;
    }
    this.viewId = this.parent.addView(this);
    // the parent addView method adds this.parents.
    // sub-view ids, index of HView-derived objects that are found in HSystem.views[viewId]
    this.views = [];
    // Sub-views in Z order.
    this.viewsZOrder = [];
    // Keep the view (and its sub-views) hidden until its drawn.
    this.createElement();
    // Set the geometry
    this.setRect(_rect);
    // Additional DOM element bindings are saved into this array so they can be
    // deleted from the element manager when the view gets destroyed.
    this._domElementBindings = [];
    if (!this.isinherited && this.options.autoDraw) {
      this.draw();
    }
  }

  /* = Description
  * When the +_flag+ is true, the view will be aligned to the right.
  * The +_px+ offset defines how many pixels from the parent's right
  * edge the right edge of this view will be. If both setFlexRight
  * and setFlexLeft are set, the width is flexible.
  * Use the constructor or setRect instead of calling this method
  * directly.
  *
  * = Parameters
  * +_flag+::    Boolean flag (true/false). Enables
  *              right-alignment when true.
  * +_px+::      The amount of pixels to offset from the right
  *              edge of the parent's right edge.
  *
  * = Returns
  * +self+
  **/
  setFlexRight(_flag, _px) {
    if (this.isNullOrUndefined(_flag)) {
      _flag = true;
    }
    this.flexRight = _flag;
    if (this.isNullOrUndefined(_px)) {
      _px = 0;
    }
    this._rightOffset = _px;
    return this;
  }

  /* = Description
  * When the +_flag+ is true, the view will be aligned to the left (default).
  * The +_px+ offset defines how many pixels from the parent's left
  * edge the left edge of this view will be. If both setFlexLeft
  * and setFlexRight are set, the width is flexible.
  * Use the constructor or setRect instead of calling this method
  * directly.
  *
  * = Parameters
  * +_flag+::    Boolean flag (true/false). Enables
  *              left-alignment when true.
  * +_px+::      The amount of pixels to offset from the left
  *              edge of the parent's left edge.
  *
  * = Returns
  * +self+
  **/
  setFlexLeft(_flag, _px) {
    if (this.isNullOrUndefined(_flag)) {
      _flag = true;
    }
    this.flexLeft = _flag;
    if ((_px || _px === 0) && this.rect) {
      this.rect.setLeft(_px);
    }
    return this;
  }

  /* = Description
  * When the +_flag+ is true, the view will be aligned to the top (default).
  * The +_px+ offset defines how many pixels from the parent's top
  * edge the top edge of this view will be. If both setFlexTop
  * and setFlexBottom are set, the height is flexible.
  * Use the constructor or setRect instead of calling this method
  * directly.
  *
  * = Parameters
  * +_flag+::    Boolean flag (true/false). Enables
  *              top-alignment when true.
  * +_px+::      The amount of pixels to offset from the top
  *              edge of the parent's top edge.
  *
  * = Returns
  * +self+
  **/
  setFlexTop(_flag, _px) {
    if (this.isNullOrUndefined(_flag)) {
      _flag = true;
    }
    this.flexTop = _flag;
    if ((_px || _px === 0) && this.rect) {
      this.rect.setTop(_px);
    }
    return this;
  }

  /* = Description
  * When the +_flag+ is true, the view will be aligned to the bottom.
  * The +_px+ offset defines how many pixels from the parent's bottom
  * edge the bottom edge of this view will be. If both setFlexBottom
  * and setFlexTop are set, the height is flexible.
  * Use the constructor or setRect instead of calling this method
  * directly.
  *
  * = Parameters
  * +_flag+::    Boolean flag (true/false). Enables
  *              bottom-alignment when true.
  * +_px+::      The amount of pixels to offset from the bottom
  *              edge of the parent's bottom edge.
  *
  * = Returns
  * +self+
  **/
  setFlexBottom(_flag, _px) {
    if (this.isNullOrUndefined(_flag)) {
      _flag = true;
    }
    this.flexBottom = _flag;
    if (this.isNullOrUndefined(_px)) {
      _px = 0;
    }
    this._bottomOffset = _px;
    return this;
  }

  /* = Description
  * Used by html theme templates to get the theme-specific full image path.
  *
  * = Returns
  * The full path of the theme-specific gfx path as a string.
  **/
  getThemeGfxPath() {
    const _themeName = this.preserveTheme ? this.theme : HThemeManager.currentTheme;
    return HThemeManager.themePaths[_themeName];
  }

  /* = Description
  * Used by html theme templates to get the theme-specific full path
  * of the _fileName given.
  *
  * = Returns
  * The full path of the file.
  **/
  getThemeGfxFile(_fileName) {
    const _themeName = this.preserveTheme ? this.theme : HThemeManager.currentTheme;
    return HThemeManager._buildThemePath(_fileName, _themeName);
  }

  /* = Description
  * The _makeElem method does the ELEM.make call to create
  * the <div> element of the component. It assigns the elemId.
  * It's a separate method to ease creating component that require
  * other element types.
  * ++
  **/
  _makeElem(_parentElemId) {
    this.elemId = ELEM.make(_parentElemId, 'div');
    ELEM.setAttr(this.elemId, 'view_id', this.viewId, true);
    ELEM.setAttr(this.elemId, 'elem_id', this.elemId, true);
  }

  /* = Description
  * Delete elems by ids by calling ELEM.del for each id.
  * If elems is not array, do nothing.
  * Return always new empty array
  **/
  _delElems(_elems) {
    if (this.isArray(_elems)) {
      _elems.forEach(_elemId => {
        ELEM.del(_elemId);
      });
    }
    return [];
  }

  /* = Description
  * The getParentElemId method returns the ELEM ID of the parent.
  */
  getParentElemId() {
    if (this.isNullOrUndefined(this.parent.getSubviewId)) {
      return this.parent.elemId || 0;
    }
    else {
      return this.parent.getSubviewId();
    }
  }

  _getParentElemId() {
    console.warn('HView#_getParentElemId is deprecated, use #getParentElemId instead');
    this.getParentElemId();
  }

  getSubviewId() {
    if (this.markupElemIds && this.isntNullOrUndefined(this.markupElemIds.subview)) {
      return this.markupElemIds.subview;
    }
    else if (this.isntNullOrUndefined(this.elemId)) {
      return this.elemId;
    }
    return 0;
  }

  _getSubviewId() {
    console.warn('HView#_getSubviewId is deprecated, use #getSubviewId instead');
    this.getSubviewId();
  }

  /* = Description
  * The selectable state defines when the view should be selectable or not.
  *
  **/
  updateTextSelectable() {
    if (this.textSelectable) {
      ELEM.delClassName(this.elemId, 'textunselectable');
      ELEM.addClassName(this.elemId, 'textselectable');
    }
    else {
      ELEM.delClassName(this.elemId, 'textselectable');
      ELEM.addClassName(this.elemId, 'textunselectable');
    }
  }

  setTextSelectable(_flag) {
    this.textSelectable = !!_flag;
    this.updateTextSelectable();
  }

  /* = Description
  * The createElement method calls the methods required to initialize the
  * main DOM element of the view.
  **/
  createElement() {
    if (this.isntNullOrUndefined(this.elemId)) {
      this._makeElem(this.getParentElemId());
      if (this.cssOverflowY === false && this.cssOverflowX === false) {
        if (this.cssOverflow) {
          ELEM.setStyle(this.elemId, 'overflow', this.cssOverflow, true);
        }
      }
      if (this.cssOverflowY !== false) {
        ELEM.setStyle(this.elemId, 'overflow-y', this.cssOverflowY, true);
      }
      if (this.cssOverflowX !== false) {
        ELEM.setStyle(this.elemId, 'overflow-x', this.cssOverflowX, true);
      }
      ELEM.setStyle(this.elemId, 'visibility', 'hidden', true);
      ELEM.setStyle(this.elemId, 'position', this.cssPosition);

      // Theme name => CSS class name
      if (this.preserveTheme) {
        ELEM.addClassName(this.elemId, this.theme);
      }
      else {
        ELEM.addClassName(this.elemId, HThemeManager.currentTheme);
      }
      // componentName => CSS class name
      if (this.isntNullOrUndefined(this.componentName)) {
        ELEM.addClassName(this.elemId, this.componentName);
      }
      // BROWSER_TYPE.* = true => CSS class names
      Object.entries(BROWSER_TYPE).forEach(([_browserName, _active]) => {
        if (_active) {
          ELEM.addClassName(this.elemId, _browserName);
        }
      });
      if (this.isntNullOrUndefined(this.options.textSelectable)) {
        this.textSelectable = this.options.textSelectable;
      }
      this.updateTextSelectable();
    }
  }

  _createElement() {
    console.warn('HView#_createElement is deprecated, use #createElement instead');
    this.createElement();
  }

  /* = Description
  * The +drawRect+ method refreshes the dimensions of the view.
  * It needs to be called to affect changes in the rect.
  * It enables the drawn flag.
  *
  * = Returns
  * +self+
  *
  **/
  drawRect() {
    if (this.isntNullOrUndefined(this.rect)) {
      if (this.drawn === false) {
        this._updateZIndex();
      }
      this.drawn = true;
      return this;
    }
    else {
      if (!this.rect.isValid || !this.parent) {
        !this.rect.isValid && console.error('HView#drawRect; invalid rect:', this.rect);
        !this.parent && console.error('Hview#drawRect; invalid parent:', ELEM.get(this.elemId));
      }
      else {
        Object.entries({
          left: this.flexLeft ? this.rect.left : 'auto',
          top: this.flexTop ? this.rect.top : 'auto',
          right: this.flexRight ? this._rightOffset : 'auto',
          bottom: this.flexBottom ? this._bottomOffset : 'auto',
          width: (this.flexLeft && this.flexRight) ? 'auto' : this.rect.width,
          height: (this.flexTop && this.flexBottom) ? 'auto' : this.rect.height,
          display: this.displayMode,
        }).forEach(([_key, _value], i) => {
          if (i < 6 && _value !== 'auto') {
            _value += 'px';
          }
          ELEM.setStyle(this.elemId, _key, _value, true);
        });
        // Show the rectangle once it gets created, unless visibility was set to
        // hidden in the constructor.
        if (!this.isHidden) {
          ELEM.setStyle(this.elemId, 'visibility', 'inherit', true);
        }
        if (this.drawn === false) {
          this._updateZIndex();
        }
        if (this.isntNullOrUndefined(this.themeStyle)) {
          this.themeStyle.call(this);
        }
        this.drawn = true;
      }
      return this;
    }
  }

  /* This method updates the z-index property of the children of self.
  * It's essentially a wrapper for HSystem.updateZIndexOfChildren passed
  * with the viewId of self.
  */
  _updateZIndex() {
    HSystem.updateZIndexOfChildren(this.viewId);
  }

  /* This method updates the z-index property of the siblings of self.
  * It's essentially a wrapper for HSystem.updateZIndexOfChildren passed
  * with the parent's viewId of self.
  */
  _updateZIndexAllSiblings() {
    HSystem.updateZIndexOfChildren(this.parent.viewId);
  }

  /* = Description
  * The higher level draw wrapper for drawRect, drawMarkup and drawSubviews.
  * Finally calls refresh.
  *
  * = Returns
  * +self+
  *
  */
  draw() {
    this.drawRect();
    if (!this.drawn) {
      this.firstDraw();
      if (this.isntNullOrUndefined(this.componentName)) {
        this.drawMarkup();
      }
      if (this.isArray(this.options.classNames)) {
        this.options.classNames.forEach(_className => {
          this.setCSSClass(_className);
        });
      }
      this.options.style && this.setStyles(this.options.style);
      this.options.html && this.setHTML(this.options.html);
      // Extended draw for components to define / extend.
      // This is preferred over drawSubviews, when defining
      // parts of a complex component.
      if (this.isFunction(this.extDraw)) {
        this.extDraw();
      }
      // Extended draw for the purpose of drawing sub-views.
      this.drawSubviews();
      // if options contain a sub-views function, call it with the name-space of self
      if (this.isFunction(this.options.subviews)) {
        this.options.subviews.call(this, this);
      }
      // for external testing purposes, a custom className can be defined:
      if (this.options.testClassName) {
        ELEM.addClassName(this.elemId, this.options.testClassName);
      }
      if (this.isntNullOrUndefined(this.options.tabIndex)) {
        this.setTabIndex(this.options.tabIndex);
      }
      if (!this.isHidden) {
        this.show();
      }
      if (this.options.focusOnCreate === true && !BROWSER_TYPE.mobile) {
        this.timeouts.push(setTimeout(() => {this.setFocus();}, 300));
      }
    }
    this.refresh();
    return this;
  }

  /* = Description
  * Called once, before the layout of the view is initially drawn.
  * Doesn't do anything by itself, but provides an extension point.
  *
  **/
  firstDraw() {}

  /* = Description
  * Called once, when the layout of the view is initially drawn.
  * Doesn't do anything by itself, but provides an extension point for making
  * sub-views.
  *
  **/
  drawSubviews() {}

  /* = Description
  * Replaces the contents of the view's DOM element with html from the theme specific html file.
  *
  * = Returns
  * +self+
  **/
  drawMarkup() {
    const _themeName = this.preserveTheme ? this.theme : HThemeManager.currentTheme;
    const _markup = HThemeManager.resourcesFor(this, _themeName);
    this.markupElemIds = {};
    if (_markup !== '') {
      ELEM.setHTML(this.elemId, _markup);
      this.markupElemNames.forEach(_partName => {
        const _elemName = _partName + this.elemId;
        const _htmlIdMatch = `id="${_elemName}"`;
        if (_markup.includes(_htmlIdMatch)) {
          this.markupElemIds[_partName] = this.bindDomElement(_elemName);
        }
      });
      if (this.isntNullOrUndefined(this.themeStyle)) {
        this.themeStyle.call(this);
      }
    }
    return this;
  }

  /* = Description
  * Sets or unsets the _className into a DOM element that goes by the ID
  * _elemId.
  *
  * = Parameters
  * +_elemId+:: ID of the DOM element, or the element itself, to be
  *                modified.
  * +_className+::  Name of the CSS class to be added or removed.
  * +_state+::     Boolean value that tells should the CSS class be added or
  *                removed. If undefined or null, toggles the current state.
  *
  * = Returns
  * +self+
  *
  **/
  toggleCSSClass(_elemId, _className, _state) {
    if (this.isntNullOrUndefined(_elemId)) {
      if (this.isString(_elemId)) {
        _elemId = this.markupElemIds[_elemId];
      }
      if (this.isInteger(_elemId) && this.isString(_className)) {
        if (this.isNullOrUndefined(_state)) {
          _state = !ELEM.hasClassName(_elemId, _className);
        }
        if (_state) {
          ELEM.addClassName(_elemId, _className);
        }
        else {
          ELEM.delClassName(_elemId, _className);
        }
      }
      else {
        console.error(`HView#toggleCSSClass error; elemId(${_elemId
          }) is not an integer or className('${_className
          }') is not a string!`);
      }
    }
    else {
      console.error(`HView#toggleCSSClass error; null or undefined elemId ${_elemId}`);
    }
    return this;
  }

  setCSSClass(_first, _second) {
    const _hasElemId = this.isntNullOrUndefined(_second);
    const _elemId = _hasElemId ? _first : this.elemId;
    const _className = _hasElemId ? _second : _first;
    return this.toggleCSSClass(this.elemId, _className, true);
  }

  unsetCSSClass(_first, _second) {
    const _hasElemId = this.isntNullOrUndefined(_second);
    const _elemId = _hasElemId ? _first : this.elemId;
    const _className = _hasElemId ? _second : _first;
    return this.toggleCSSClass(this.elemId, _className, false);
  }

  /* = Description
  * Replaces the contents of the view's DOM element with custom html.
  *
  * = Parameters
  * +_html+:: The HTML (string-formatted) to replace the content with.
  *
  * = Returns
  * +self+
  *
  **/
  setHTML(_html) {
    ELEM.setHTML(this.elemId, _html);
    return this;
  }

  /* = Description
  * Wrapper for setHTML, sets escaped html, if tags and such are present.
  *
  * = Parameters
  * +_text+:: The text to set. If it contains any html, it's escaped.
  *
  * = Returns
  * +self+
  **/
  setText(_text) {
    return this.setHTML(this.escapeHTML(_text));
  }

  /* = Description
  *
  * This method should be extended in order to redraw only specific parts. The
  * base implementation calls optimizeWidth when optimizeWidthOnRefresh is set
  * to true.
  *
  * = Returns
  * +self+
  *
  **/
  refresh() {
    if (this.drawn) {
      // this.drawn is checked here so the rectangle doesn't get drawn by the
      // constructor when setRect() is initially called.
      this.drawRect();
    }
    if (this.refreshOnLabelChange) {
      this.refreshLabel();
    }
    if (this.isFunction(this.themeStyle)) {
      this.themeStyle.call(this);
    }
    if (this.optimizeWidthOnRefresh && this.options.pack && this.drawn) {
      this.optimizeWidth();
    }
    return this;
  }

  /* Gets the size of the parent. If the parent is the document body, uses the browser window size.
  **/
  parentSize() {
    if (!this.parent) {
      console.warn('HView#parentSize; no parent!');
      return [0, 0];
    }
    if (this.parent.elemId === 0) {
      return ELEM.windowSize();
    }
    else {
      return ELEM.getSize(this.parent.elemId);
    }
  }

  /* Returns the maximum rect */
  maxRect() {
    return [0, 0, null, null, 0, 0];
  }

  setMinWidth(_minWidth) {
    if (this.isNumber(_minWidth)) {
      this.minWidth = _minWidth;
      ELEM.setStyle(this.elemId, 'min-width', this.minWidth + 'px', true);
    }
    else {
      console.warn(`HView#setMinWidth warning; setMinWidth(${typeof _minWidth
        } ${_minWidth}) should be a number; value ignored!`);
    }
  }

  setMinHeight(_minHeight) {
    if (this.isNumber(_minHeight)) {
      this.minHeight = _minHeight;
      ELEM.setStyle(this.elemId, 'min-height', this.minHeight + 'px', true);
    }
    else {
      console.warn(`HView#setMinHeight warning; setMinHeight(${typeof _minHeight
        } ${_minHeight}) should be a number; value ignored!`);
    }
  }

  _setArrayRect(_arr) {
    const _arrLen = _arr.length;
    const _throwPrefix = 'HView#_setArrayRect: If the HRect instance is replaced by an array, ';
    if (_arrLen === 4 || _arrLen === 6) {
      let [_leftOffset, _topOffset, _width, _height, _rightOffset, _bottomOffset] = _arr;
      let _right = null;
      let _bottom = null;
      const _validLeftOffset = this.isInteger(_leftOffset);
      const _validTopOffset = this.isInteger(_topOffset);
      const _validRightOffset = this.isInteger(_rightOffset);
      const _validBottomOffset = this.isInteger(_bottomOffset);
      let _validWidth = this.isInteger(_width);
      let _validHeight = this.isInteger(_height);
      const [_parentWidth, _parentHeight] = (_arrLen === 6) ? this.parentSize() : [null, null];
      if (_validLeftOffset && _validRightOffset && !_validWidth) {
        _width = 0;
        _validWidth = true;
      }
      if (_validTopOffset && _validBottomOffset && !_validHeight) {
        _height = 0;
        _validHeight = true;
      }
      // Validate the invalid complex rules isolated:
      (() => {
        const _invalidLeftAndRight = !_validLeftOffset && !_validRightOffset;
        const _invalidTopAndBottom = !_validTopOffset && !_validBottomOffset;
        const _invalidLeftOrRight = !(_validLeftOffset && _validRightOffset);
        const _invalidTopOrBottom = !(_validTopOffset && _validBottomOffset);
        const _invalidWidthAndLeftOrRight = !_validWidth && _invalidLeftOrRight;
        const _invalidHeightAndTopOrBottom = !_validHeight && _invalidTopOrBottom;
        if (_invalidLeftAndRight || _invalidTopAndBottom) {
          throw new Error(_throwPrefix + '(left or top) and (top or bottom) must be specified.');
        }
        else if (_invalidWidthAndLeftOrRight || _invalidHeightAndTopOrBottom) {
          throw new Error(_throwPrefix +
            'the (height or width) must be specified unless both (left and top) ' +
            'or (top and bottom) are specified.');
        }
      })();
      if (_validLeftOffset && _validWidth && !_validRightOffset) {
        _right = _leftOffset + _width;
        this.setMinWidth(0);
      }
      else if (!_validLeftOffset && _validWidth && _validRightOffset) {
        _right = _parentWidth - _validRightOffset;
        _leftOffset = _right - _width;
        this.setMinWidth(_width);
      }
      else if (_validLeftOffset && _validRightOffset) {
        _right = _parentWidth - _rightOffset;
        if (_validWidth) {
          this.setMinWidth(_width);
          if ((_parentWidth - _leftOffset) < _width) {
            console.warn(
              `HView#_setArrayRect warning; The minWidth(${_width
              }) is less than available width(${_parentWidth - _leftOffset - _rightOffset
              }); right(${_right}) yields to ${_leftOffset + _width}!`);
            _right = _leftOffset + _width;
          }
        }
        else if (_right < _leftOffset) {
          console.warn(
            `HView#_setArrayRect warning; There is not enough width (${_parentWidth
            }) to fit _rightOffset (${_rightOffset}) and left (${_leftOffset
            }); right(${_right}) yields to (${_leftOffset
            }) and _rightOffset(${_rightOffset}) yields to ${_parentWidth - _leftOffset}!`);
          _rightOffset = _parentWidth - _leftOffset;
          _right = _leftOffset;
        }
      }
      if (_validTopOffset && _validHeight && !_validBottomOffset) {
        _bottom = _topOffset + _height;
        this.setMinHeight(0);
      }
      else if (!_validTopOffset && _validHeight && _validBottomOffset) {
        _bottom = _parentHeight - _validBottomOffset;
        _topOffset = _bottom - _height;
        this.setMinHeight(_height);
      }
      else if (_validTopOffset && _validBottomOffset) {
        _bottom = _parentHeight - _bottomOffset;
        if (_validHeight) {
          this.setMinHeight(_height);
          if (_parentHeight - _topOffset < _height) {
            console.warn(
              `HView#_setArrayRect warning; The minHeight(${_height
              }) is less than available height(${_parentHeight - _topOffset - _bottom
              }); bottom(${_bottom}) yields to ${_topOffset + _height}!`);
            _bottom = _topOffset + _height;
          }
        }
        else if (_bottom < _topOffset) {
          console.warn(
            `HView#_setArrayRect warning; There is not enough height (${_parentHeight
            }) to fit _bottomOffset (${_bottom}) and bottom (${_bottomOffset
            }); bottom yields to ${_topOffset
            } and _bottomOffset yields to ${_parentHeight - _topOffset}!`);
          _bottomOffset = _parentHeight - _topOffset;
          _bottom = _topOffset;
        }
      }
      if (_leftOffset > _right) {
        _right = _leftOffset;
      }
      if (_topOffset > _bottom) {
        _bottom = _topOffset;
      }
      this.setMinWidth(this.minWidth);
      this.setMinHeight(this.minHeight);
      this.setFlexLeft(_validLeftOffset, _leftOffset);
      this.setFlexTop(_validTopOffset, _topOffset);
      this.setFlexRight(_validRightOffset, _rightOffset);
      this.setFlexBottom(_validBottomOffset, _bottomOffset);
      this.rect = new HRect(_leftOffset, _topOffset, _right, _bottom);
      if (!this.rect.isValid && !this.isProduction) {
        console.log('---------------------------------------------');
        console.log(`invalid rect; left: ${this.rect.left
          }, top: ${this.rect.top}, width: ${this.rect.width}, height: ${this.rect.height
          }, right: ${this.rect.right}, bottom: ${this.rect.bottom}`);
        console.log(' parent size:', this.parentSize());
        console.log('  rect array:', _arr);
        console.log('---------------------------------------------');
      }
    }
    else {
      throw new Error(_throwPrefix + 'the length has to be either 4 or 6.');
    }
  }

  /* = Description
  * Replaces the rect of the component with a new HRect instance and
  * then refreshes the display.
  *
  * = Parameters
  * +_rect+:: The new HRect instance to replace the old rect instance with.
  * +_rect+:: Array format, see HView#constructor for further details.
  *
  * = Returns
  * +self+
  *
  **/
  setRect(_rect) {
    if (this.rect) {
      this.rect.releaseView(this);
    }
    if (this.isString(_rect) && this.isFunction(this[_rect])) {
      _rect = this[_rect]();
    }
    if (this.isArray(_rect)) {
      this._setArrayRect(_rect);
    }
    else if (_rect.hasAncestor(HRect)) {
      this.rect = _rect;
    }
    if (this.rect) {
      this.rect.bindView(this);
    }
    // this.refresh();
    return this;
  }

  /* = Description
  * Sets any arbitrary style of the main DOM element of the component.
  * Utilizes Element Manager's drawing queue / cache to perform the action.
  *
  * = Parameters
  * +_name+::          The style name (css syntax, eg. 'background-color')
  * +_value+::         The style value (css syntax, eg. 'rgb(255,0,0)')
  * +_cacheOverride+:: Cache override flag.
  *
  * = Returns
  * +self+
  *
  **/
  setStyle(_name, _value, _cacheOverride) {
    if (this.elemId) {
      ELEM.setStyle(this.elemId, _name, _value, _cacheOverride);
    }
    return this;
  }

  setStyles(_styles) {
    if (this.isArray(_styles)) {
      this.setStylesArray(_styles);
    }
    else if (this.isObject(_styles)) {
      this.setStylesHash(_styles);
    }
    else {
      throw new TypeError(
        `HView#setStyles: Invalid style type ${this.getChr(_styles)
        }, expected array or object; got: ${_styles}`);
    }
    return this;
  }

  setStylesArray(_styles) {
    _styles.forEach(([_styleKey, _styleValue]) => {
      this.setStyle(_styleKey, _styleValue);
    });
    return this;
  }

  setStylesHash(_styles) {
    return this.setStylesArray(Object.entries(_styles));
  }

  /* = Description
  * Returns a style of the main DOM element of the component.
  * Utilizes +ELEM+ cache to perform the action.
  *
  * = Parameters
  * +_name+:: The style name (css syntax, eg. 'background-color')
  *
  * = Returns
  * The style property value (css syntax, eg. 'rgb(255,0,0)')
  *
  **/
  style(_name) {
    if (this.elemId) {
      return ELEM.getStyle(this.elemId, _name);
    }
    else {
      console.warn('HView#style warning; no elemId!');
      return '';
    }
  }

  _getMarkupElemIdPart(_partName, _warnPrefix) {
    if (!_warnPrefix) {
      _warnPrefix = 'HView#_getMarkupElemIdPart';
    }
    if (!this.markupElemIds) {
      console.warn(_warnPrefix +
        ` warning; componentName: ${this.componentName} with viewId: ${this.viewId} does not have any markupElemIds!`);
      return null;
    }
    else if (this.isNullOrUndefined(this.markupElemIds[_partName])) {
      console.warn(_warnPrefix +
        ` warning; partName: ${_partName} does not exist for viewId: ${this.viewId}`);
      return null;
    }
    else {
      return this.markupElemIds[_partName];
    }
  }

  /* = Description
  * Sets a style for a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+:: The identifier of the markup element.
  * +_name+::     The style name
  * +_value+::    The style value
  *
  * = Returns
  * +self+
  *
  **/
  setStyleOfPart(_partName, _name, _value, _force) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#setStyleOfPart');
    if (this.isntNull(_elemId) && this.isObjectOrArray(_name)) {
      ELEM.setStyles(this.markupElemIds[_partName], _name);
    }
    else if (_elemId) {
      ELEM.setStyle(this.markupElemIds[_partName], _name, _value, _force);
    }
    return this;
  }

  /* = Description
  * Returns a style of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  * +_name+::      The style name
  *
  * = Returns
  * The style of a specified markup element.
  *
  **/
  styleOfPart(_partName, _name, _force) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#styleOfPart');
    if (this.isntNull(_elemId)) {
      return ELEM.getStyle(_elemId, _name, _force);
    }
    else {
      return '';
    }
  }

  /* = Description
  * Sets a style of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  * +_value+::     Value for markup element.
  *
  * = Returns
  * +self+
  *
  **/
  setMarkupOfPart(_partName, _value) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#setMarkupOfPart');
    if (this.isntNull(_elemId)) {
      ELEM.setHTML(_elemId, _value);
    }
    return this;
  }

  /* = Description
  * Returns a style of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  *
  * = Returns
  * The markup of a specified markup element.
  *
  **/
  markupOfPart(_partName) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#markupOfPart');
    if (this.isntNull(_elemId)) {
      return ELEM.getHTML(_elemId);
    }
    else {
      return '';
    }
  }

  /* = Description
  * Sets a element attribute of the view's cell.
  *
  * = Parameters
  * +_key+::       The attribute key to set.
  * +_value+::     Value for markup element.
  * +_force+::     Optional force switch, defaults to false
  *
  * = Returns
  * +self+
  *
  **/
  setAttr(_key, _value, _force) {
    ELEM.setAttr(this.elemId, _key, _value, _force);
    return this;
  }

  /* = Description
  * Gets a element attribute of the view's cell.
  *
  * = Parameters
  * +_key+::       The attribute key to get.
  * +_force+::     Optional force switch, defaults to false
  *
  * = Returns
  * The attribute value.
  *
  **/
  attr(_key, _force) {
    return ELEM.getAttr(this.elemId, _key, _force);
  }

  /* = Description
  * Sets a element attribute of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  * +_key+::       The attribute key to set
  * +_value+::     Value for markup element.
  * +_force+::     Optional force switch, defaults to false
  *
  * = Returns
  * +self+
  *
  **/
  setAttrOfPart(_partName, _key, _value, _force) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#setAttrOfPart');
    if (this.isntNull(_elemId)) {
      ELEM.setAttr(_elemId, _key, _value, _force);
    }
    return this;
  }

  /* = Description
  * Returns a element attribute of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  * +_key+::       The attribute key to get.
  * +_force+::     Optional force switch, defaults to false
  *
  * = Returns
  * The attribute of a specified markup element.
  *
  **/
  attrOfPart(_partName, _key, _force) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#attrOfPart');
    if (this.isntNull(_elemId)) {
      return ELEM.getAttr(_elemId, _key, _force);
    }
    else {
      return '';
    }
  }

  /* = Description
  * Returns a element itself of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  *
  * = Returns
  * The element of a specified markup element.
  *
  **/
  elemOfPart(_partName) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#elemOfPart');
    if (this.isntNull(_elemId)) {
      return ELEM.get(_elemId);
    }
    else {
      return '';
    }
  }

  /* = Description
  * Hides the component's main DOM element (and its children).
  *
  * = Returns
  * +self+
  *
  **/
  hide() {
    ELEM.setStyle(this.elemId, 'visibility', 'hidden', true);
    this.isHidden = true;
    return this;
  }

  /* = Description
  * Restores the visibility of the component's main DOM element (and its children).
  *
  * = Return
  * +self+
  *
  **/
  show() {
    ELEM.setStyle(this.elemId, 'display', this.displayMode, true);
    ELEM.setStyle(this.elemId, 'visibility', 'inherit', true);
    this.isHidden = false;
    return this;
  }

  /* = Description
  * Toggles between hide and show.
  *
  * = Returns
  * +self+
  *
  **/
  toggleVisibility(_visible) {
    if (_visible === true || _visible === 1) {
      this.show();
    }
    else if (_visible === false || _visible === 0) {
      this.hide();
    }
    else if (this.isHidden) {
      this.show();
    }
    else {
      this.hide();
    }
    return this;
  }

  toggle(_visible) {
    console.warn('HView#toggle is deprecated; use #toggleVisibility instead');
    return this.toggleVisibility(_visible);
  }

  /* = Description
  * Call this if you need to remove a component from its parent's views array without
  * destroying the DOM element itself, making it in effect a view without parent.
  * Useful, for example, for moving a view from one parent component to another.
  *
  * = Returns
  * +self+
  *
  **/
  remove() {
    if (this.parent) {
      const _viewZIndex = this.parent.viewsZOrder.indexOf(this.viewId);
      const _viewParentIndex = this.parent.views.indexOf(this.viewId);
      this.parent.views.splice(_viewParentIndex, 1);
      HSystem.delView(this.viewId);
      this.parent.viewsZOrder.splice(_viewZIndex, 1);
      const _sysUpdateZIndexOfChildrenBufferIndex = HSystem._updateZIndexOfChildrenBuffer.indexOf(this.viewId);
      if (_sysUpdateZIndexOfChildrenBufferIndex !== -1) {
        HSystem._updateZIndexOfChildrenBuffer.splice(_sysUpdateZIndexOfChildrenBufferIndex, 1);
      }
      this._updateZIndexAllSiblings();
      delete this.parent;
      this.parents = [];
    }
    return this;
  }

  /* = Description
  * Deletes the component and all its children.
  * Should normally be called from the parent.
  *
  **/
  die(_delay) {
    if (this.isNumber(_delay)) {
      this.timeouts.push(setTimeout(() => {
        this.dieMethods();
      }, _delay));
    }
    else {
      this.dieMethods();
    }
    return true;
  }

  dieMethods() {
    if (!this.isDead) {
      this.isDead = true;
      // hide self, makes destruction seem faster
      this.hide();
      this.drawn = false;
      if (this.timeouts) {
        while (this.timeouts.length) {
          clearTimeout(this.timeouts.pop());
        }
        delete this.timeouts;
      }
      // Delete the children first.
      while (this.views && this.views.length) {
        const _childViewId = this.views[0];
        this.destroyView(_childViewId);
      }
      // Remove this object's bindings, except the DOM element.
      this.remove();
      // Remove the DOM element bindings.
      while (this._domElementBindings.length) {
        this.cloneObject(this._domElementBindings).forEach(_elemId => {
          this._domElementBindings.pop();
          if (!ELEM.get(_elemId)) {
            debugger;
          }
          ELEM.del(_elemId);
        });
      }
      delete this._domElementBindings;
      // Remove the DOM object itself
      ELEM.del(this.elemId);
      delete this.rect;
      Object.entries(this).forEach(([_item, _value]) => {
        if (_item !== 'isDead') {
          delete this[_item];
        }
      });
    }
  }

  /* = Description
  * A convenience method to call #die after 10ms using a setTimeout.
  * Use this method, if destroying self or destroying from a sub-view.
  *
  **/
  dieSoon() {
    this.die(10);
  }

  /* Used by addView to build a parents array of parent classes.
  **/
  buildParents(_viewId) {
    const _view = HSystem.views[_viewId];
    _view.parent = this;
    _view.parents = [];
    this.parents.forEach(_parent => {
      _view.parents.push(_parent);
    });
    _view.parents.push(this);
  }

  /* = Description
  * Adds a sub-view / component to the view. Called from inside the
  * HView#constructor and should be automatic for all components that accept
  * the 'parent' parameter, usually the second argument, after the HRect. May
  * also be used to attach a freely floating component (removed with remove)
  * to another component.
  *
  * = Parameter
  * +_view+:: Usually this inside HView derivate components.
  *
  * = Returns
  * The view id.
  *
  **/
  addView(_view) {
    const _viewId = HSystem.addView(_view);
    this.views.push(_viewId);
    this.buildParents(_viewId);
    this.viewsZOrder.push(_viewId);
    return _viewId;
  }

  /* = Description
  * Call this if you need to remove a child view from this view without
  * destroying its element, making it in effect a view without parent.
  * Useful, for example, for moving a view from one parent component to another.
  *
  * = Parameters
  * +_viewId+:: The parent-specific view id. Actually an array index.
  *
  * = Returns
  * +self+
  *
  **/
  removeView(_viewId) {
    this.app.removeView(_viewId);
    return this;
  }

  /* = Description
  * Call this if you need to remove a child view from this view, destroying its
  * child elements recursively and removing all DOM elements too.
  *
  * = Parameters
  * +_viewId+::  The parent-specific view id. Actually an array index.
  *
  * = Returns
  * +self+
  **/
  destroyView(_viewId) {
    HSystem.views[_viewId].die();
    return this;
  }

  /* = Description
  * Returns bounds rectangle that defines the size and coordinate system
  * of the component. This should be identical to the rectangle used in
  * constructing the object, unless it has been changed after construction.
  *
  * = Returns
  * A new <HRect> instance with identical values to this component's rect.
  *
  **/
  bounds() {
    const _bounds = new HRect(this.rect);
    _bounds.offsetTo(0, 0);
    return _bounds;
  }

  /* = Description
  * This method resizes the view, without moving its left and top sides.
  * It adds horizontal coordinate units to the width and vertical units to
  * the height of the view.
  * Since a View's frame rectangle must be aligned on screen pixels, only
  * integral values should be passed to this method. Values with
  * fractional components will be rounded to the nearest whole integer.
  * If the View is attached to a window, this method causes its parent view
  * to be updated, so the View is immediately displayed in its new size. If it
  * doesn't have a parent or isn't attached to a window, this method
  * merely alter its frame and bounds rectangle.
  *
  * = Parameters
  * +_horizonal+:: Horizontal units to add to the width (negative units subtract)
  * +_vertical+::  Vertical units to add to the height (negative units subtract)
  *
  * = Returns
  * +self+
  *
  **/
  resizeBy(_horizontal, _vertical) {
    this.rect.right += _horizontal;
    this.rect.bottom += _vertical;
    this.rect.updateSecondaryValues();
    this.drawRect();
    return this;
  }

  /* = Description
  * This method makes the view width units wide
  * and height units high. This method adjust the right and bottom
  * components of the frame rectangle accordingly.
  * Since a View's frame rectangle must be aligned on screen pixels, only
  * integral values should be passed to this method. Values with
  * fractional components will be rounded to the nearest whole integer.
  * If the View is attached to a window, this method causes its parent view
  * to be updated, so the View is immediately displayed in its new size. If it
  * doesn't have a parent or isn't attached to a window, this method
  * merely alter its frame and bounds rectangle.
  *
  * = Parameters
  * +_width+::  The new width of the view.
  * +_height+:: The new height of the view.
  *
  * = Returns
  * +self+
  *
  **/
  resizeTo(_width, _height) {
    if (this.isNumber(_width)) {
      this.rect.right = this.rect.left + _width;
    }
    if (this.isNumber(_height)) {
      this.rect.bottom = this.rect.top + _height;
    }
    this.rect.updateSecondaryValues();
    this.drawRect();
    return this;
  }

  /* = Description
  * This method moves the view to a new coordinate. It adjusts the
  * left and top components of the frame rectangle accordingly.
  * Since a View's frame rectangle must be aligned on screen pixels, only
  * integral values should be passed to this method. Values with
  * fractional components will be rounded to the nearest whole integer.
  * If the View is attached to a window, this method causes its parent view
  * to be updated, so the View is immediately displayed in its new size. If it
  * doesn't have a parent or isn't attached to a window, this method
  * merely alter its frame and bounds rectangle.
  *
  * = Parameters
  * +_x+:: The new x-coordinate of the view.
  * +_y+:: The new y-coordinate of the view.
  *
  * +_point+:: The new coordinate point of the view.
  *
  * = Returns
  * +self+
  *
  **/
  offsetTo() {
    this.rect.offsetTo.apply(this.rect, arguments);
    this.drawRect();
    return this;
  }

  /* = Description
  * Alias method for offsetTo.
  *
  * = Returns
  * +self+
  *
  **/
  moveTo() {
    return this.offsetTo.apply(this, arguments);
  }

  /* = Description
  * This method re-positions the view without changing its size.
  * It adds horizontal coordinate units to the x coordinate and vertical
  * units to the y coordinate of the view.
  * Since a View's frame rectangle must be aligned on screen pixels, only
  * integral values should be passed to this method. Values with
  * fractional components will be rounded to the nearest whole integer.
  * If the View is attached to a window, this method causes its parent view
  * to be updated, so the View is immediately displayed in its new size. If it
  * doesn't have a parent or isn't attached to a window, this method
  * merely alter its frame and bounds rectangle.
  *
  * = Parameters
  * +_horizonal+::  Horizontal units to change the x coordinate (negative units subtract)
  * +_vertical+::   Vertical units to add to change the y coordinate (negative units subtract)
  *
  * = Returns
  * +self+
  *
  **/
  offsetBy(_horizontal, _vertical) {
    this.rect.offsetBy(_horizontal, _vertical);
    this.drawRect();
    return this;
  }

  /* = Description
  * Alias method for offsetBy.
  *
  * = Returns
  * +self+
  *
  **/
  moveBy() {
    this.offsetBy.apply(this, arguments);
    return this;
  }

  /* = Description
  * Brings the view to the front by changing its Z-Index.
  *
  * = Returns
  * +self+
  *
  **/
  bringToFront() {
    if (this.parent) {
      const _index = this.zIndex();
      this.parent.viewsZOrder.splice(_index, 1);
      this.parent.viewsZOrder.push(this.viewId);
      this._updateZIndexAllSiblings();
    }
    return this;
  }

  /* = Description
  * Brings itself to the front of the given view by changing its Z-Index.
  * Only works on sibling views.
  *
  * = Parameters
  * +_view+::  The view to bring to the front of.
  *
  * = Returns
  * +self+
  *
  **/
  bringToFrontOf(_view) {
    // Ensure the views are siblings:
    if (this.parent.viewId === _view.parent.viewId) {
      this.parent.viewsZOrder.splice(this.zIndex(), 1);
      this.parent.viewsZOrder.splice(_view.zIndex() + 1, 0, this.viewId);
      this._updateZIndexAllSiblings();
    }
    return this;
  }

  /* = Description
  * Sends itself to the back of the given view by changing its Z-Index.
  * Only works on sibling views.
  *
  * = Parameters
  * +_view+::  The view to send to the back of.
  *
  * = Returns
  * +self+
  *
  **/
  sendToBackOf(_view) {
    // Ensure the views are siblings
    if (this.parent.viewId === _view.parent.viewId) {
      this.parent.viewsZOrder.splice(this.zIndex(), 1);
      this.parent.viewsZOrder.splice(_view.zIndex(), 0, this.viewId);
      this._updateZIndexAllSiblings();
    }
    return this;
  }

  /* = Description
  * Sends itself one step backward by changing its Z-Index.
  *
  * = Returns
  * +self+
  *
  **/
  sendBackward() {
    const _index = this.zIndex();
    // 0 is already at the back
    if (_index !== 0) {
      this.parent.viewsZOrder.splice(_index, 1);
      this.parent.viewsZOrder.splice(_index - 1, 0, this.viewId);
      this._updateZIndexAllSiblings();
    }
    return this;
  }

  /* = Description
  * Brings itself one step forward by changing its Z-Index.
  *
  * = Returns
  * +self+
  *
  **/
  bringForward() {
    const _index = this.zIndex();
    // don't do anything if already in front:
    if (_index !== this.parent.viewsZOrder.length - 1) {
      this.parent.viewsZOrder.splice(_index, 1);
      this.parent.viewsZOrder.splice(_index + 1, 0, this.viewId);
      this._updateZIndexAllSiblings();
    }
    return this;
  }

  /* = Description
  * Sends the view to the back by changing its Z-Index.
  *
  * = Returns
  * +self+
  *
  **/
  sendToBack() {
    if (this.parent) {
      const _index = this.zIndex();
      if (_index !== 0) {
        this.parent.viewsZOrder.splice(_index, 1); // removes this index from the arr
        this.parent.viewsZOrder.splice(0, 0, this.viewId); // un-shifts viewId
        this._updateZIndexAllSiblings();
      }
    }
    return this;
  }

  /* = Description
  * Use this method to get the Z-Index of itself.
  *
  * = Returns
  * The current Z-Index value.
  *
  **/
  zIndex() {
    if (!this.parent) {
      return -1;
    }
    // Returns the z-order of this item as seen by the parent.
    return this.parent.viewsZOrder.indexOf(this.viewId);
  }

  /* = Description
  * Measures the characters encoded in length bytes of the string - or,
  * if no length is specified, the entire string up to the null character,
  * '0', which terminates it. The return value totals the width of all the
  * characters in coordinate units; it's the length of the baseline required
  * to draw the string.
  *
  * = Parameters
  * +_string+::   The string to measure.
  * +_length+::   Optional, How many characters to count.
  * +_elemId+::   Optional, The element ID where the temporary string is created
  *               in.
  * +_wrap+::     Optional boolean value, wrap white-space?
  * +_customStyle+:: Optional, extra css to add.
  *
  * = Returns
  * The width in pixels required to draw a string in the font.
  *
  **/
  stringSize(_string, _length, _elemId, _wrap, _customStyle) {
    if (!_customStyle) {
      _customStyle = {};
    }
    if (this.isString(_customStyle)) {
      console.warn('HView#stringSize: use style objects instead of css text!');
      _customStyle = {};
    }
    if (_length || _length === 0) {
      _string = _string.substring(0, _length);
    }
    if (!_elemId && _elemId !== 0) {
      _elemId = this.elemId || 0;
    }
    _customStyle.visibility = 'hidden';
    if (!_wrap) {
      _customStyle.whiteSpace = 'nowrap';
    }
    this._stringSizeImportantAttrs.forEach(_attr => {
      if (!_customStyle[_attr]) {
        _customStyle[_attr] = ELEM.getStyle(_elemId, _attr);
      }
    });
    const _stringParent = ELEM.make(_elemId, 'div');
    const _stringElem = ELEM.make(_stringParent, 'span');
    ELEM.setStyles(_stringElem, _customStyle);
    ELEM.setHTML(_stringElem, _string);
    ELEM.flushElem([_stringParent, _stringElem]);
    const [_width, _height] = ELEM.getSize(_stringElem);
    ELEM.del(_stringElem); ELEM.del(_stringParent);
    return [_width + _width % 2, _height + _height % 2];
  }

  /* Returns the string width
  **/
  stringWidth(_string, _length, _elemId, _customStyle) {
    return this.stringSize(_string, _length, _elemId, false, _customStyle)[0];
  }

  /* Returns the string height.
  **/
  stringHeight(_string, _length, _elemId, _customStyle) {
    return this.stringSize(_string, _length, _elemId, true, _customStyle)[1];
  }

  /* Returns the X coordinate that has the scrolled position calculated.
  **/
  pageX() {
    return ELEM._getVisibleLeftPosition(this.elemId);
  }

  /* Returns the Y coordinate that has the scrolled position calculated.
  **/
  pageY() {
    return ELEM._getVisibleTopPosition(this.elemId);
  }

  inElem(_elemId, x, y) {
    if (this.isNumber(x) && this.isNumber(y)) {
      const p = ELEM.getVisiblePosition(_elemId, true);
      const s = ELEM.getSize(_elemId);
      return !(x < p[0] || x > p[0] + s[0] || y < p[1] || y > p[1] + s[1]);
    }
    else {
      console.error(`HView#inElem error; not a number x: ${x} or y: ${y}`);
      return false;
    }
  }

  contains(x, y) {
    return this.inElem(this.elemId, x, y);
  }

  intersect(x, y, w, h) {
    const p = ELEM.getVisiblePosition(this.elemId, true);
    const s = ELEM.getSize(this.elemId);
    return !(p[0] > x + w || p[0] + s[0] < x ||
             p[1] > y + h || p[1] + s[1] < y);
  }

  /* Set tabindex attribute for element
  **/
  setTabIndex(_tabIndex) {
    this.setAttr('tabIndex', _tabIndex);
    if (_tabIndex === 1 && !BROWSER_TYPE.mobile) {
      this.setFocus();
    }
  }

  setFocus() {
    const _elem = ELEM.get(this.elemId);
    if (this.isntNullOrUndefined(_elem)) {
      _elem.focus();
      EVENT.changeActiveControl(this);
    }
  }

  /* = Description
  * Sets the label on a control component: the text that's displayed in
  * HControl extensions. Visual functionality is implemented in component
  * theme templates and refreshLabel method extensions.
  *
  * Avoid extending directly, extend +refreshLabel+ instead.
  *
  * = Parameters
  * +_label+:: The text the component should display.
  *
  * = Returns
  * +self+
  *
  **/
  setLabel(_label) {
    if (this.escapeLabelHTML) {
      _label = this.escapeHTML(_label);
    }
    if (_label !== this.label) {
      this.label = _label;
      this.options.label = _label;
      this.refresh();
    }
    return this;
  }

  /* = Description
  * Called when the +self.label+ has been changed. By default
  * tries to update the label element defined in the theme of
  * the component. Of course, the HControl itself doesn't
  * define a theme, so without a theme doesn't do anything.
  *
  * = Returns
  * +self+
  *
  **/
  refreshLabel() {
    const _elemId = this._getMarkupElemIdPart('label', 'HView#refreshLabel');
    if (_elemId) {
      ELEM.setHTML(_elemId, this.label);
    }
    return this;
  }

  /* Returns the HPoint that has the scrolled position calculated.
  **/
  pageLocation() {
    return new HPoint(this.pageX(), this.pageY());
  }

  /* = Description
  * An abstract method that derived classes may implement, if they are able to
  * resize themselves so that their content fits nicely inside.
  * Similar to pack, might be renamed when components are written to
  * be savvy of this feature.
  **/
  optimizeWidth() {}

  /* = Description
  * Binds a DOM element to the +ELEM+ cache. This is a wrapper for
  * the ELEM#elem_bind that keeps track of the bound elements and
  * frees them from the element manager when the view is destroyed.
  *
  * = Parameters
  * +_domElementId+:: The value of the DOM element's id attribute that is
  *                   to be bound to the element cache.
  *
  * = Returns
  * The element index id of the bound element.
  *
  **/
  bindDomElement(_domElementId) {
    const _cacheId = ELEM.bindId(_domElementId);
    if (_cacheId) {
      this._domElementBindings.push(_cacheId);
    }
    return _cacheId;
  }

  /* = Description
  * Removes a DOM element from the +ELEM+ cache. This is a wrapper
  * for the ELEM#elem_del. This is used for safely removing DOM
  * nodes from the cache.
  *
  * = Parameters
  * +_elemId+:: The id of the element in the element manager's cache
  *                that is to be removed from the cache.
  *
  **/
  unbindDomElement(_elemId) {
    const _indexOfElementId = this._domElementBindings.indexOf(_elemId);
    if (_indexOfElementId !== -1) {
      ELEM.del(_elemId);
      this._domElementBindings.splice(_indexOfElementId, 1);
    }
  }

  destroyMarkupElem(_name) {
    const _elemId = this._getMarkupElemIdPart(_name, 'HView#destroyMarkupElem');
    if (_elemId) {
      this.unbindDomElement(this.markupElemIds[_name]);
      delete this.markupElemIds[_name];
    }
  }

  /* = Description
  * Finds a string from the locale of the component.
  * The attrPath is a string or array to find an object.
  * For instance, if a component has a structure like this defined:
  *   HLocale.components.FooComponent = {
  *     strings: {
  *       defaultLabel: 'Default Label',
  *       otherLabel: 'Other Label',
  *     }
  *   };
  *
  * To get the defaultLabel, call getLocaleString like this:
  *   this.getLocaleString( 'FooComponent', 'strings.defaultLabel' );
  * ..or:
  *   this.getLocaleString( 'FooComponent', ['strings','defaultLabel'] );
  * ..or:
  *   this.getLocaleString( 'FooComponent.strings.defaultLabel' );
  *
  * = Parameters
  * +_componentClassName+:: The name of the item in HLocale.components
  * +_attrPath+::     The object path to the string. String or Array.
  * +_default+::      The default object to return if nothing matched.
  *
  **/
  getLocaleString(_componentClassName, _attrPath, _default) {
    if (this.isNullOrUndefined(_default)) {
      _default = '';
    }
    let _searchTarget = HLocale.components[_componentClassName];
    if (this.isNullOrUndefined(_searchTarget) && this.isString(_componentClassName)) {
      _searchTarget = HLocale.components;
      _attrPath = _componentClassName;
      _default = _attrPath;
    }
    if (this.isString(_attrPath)) {
      if (_attrPath.indexOf('.') > 0) {
        _attrPath = _attrPath.split('.');
      }
      else {
        _attrPath = [_attrPath];
      }
    }
    if (this.isNullOrUndefined(_searchTarget[_attrPath[0]])) {
      _searchTarget = HLocale;
    }
    if (this.isNullOrUndefined(_searchTarget[_attrPath[0]])) {
      return _default;
    }
    for (const _key = 0; _key < _attrPath.length; _key++) {
      const _targetValue = _searchTarget[_key];
      if (this.isObjectOrArray(_targetValue)) {
        _searchTarget = _targetValue;
      }
      else if (this.isString(_targetValue)) {
        return _targetValue;
      }
    }
    return _default;
  }

  isParentOf(_obj) {
    if (!_obj) {
      return false;
    }
    else if (this.isFunction(_obj.hasAncestor) && this.isArray(_obj.parent) && _obj.parents.includes(this)) {
      return true;
    }
    else {
      return false;
    }
  }

  isChildOf(_obj) {
    if (!_obj) {
      return false;
    }
    else if (this.isFunction(_obj.isParentOf)) {
      return _obj.isParentOf(this);
    }
    else {
      return false;
    }
  }

  isSiblingOf(_obj) {
    if (!_obj) {
      return false;
    }
    else if (this.isArray(_obj.parents)) {
      if (_obj.parents.length !== this.parents.length) {
        return false;
      }
      else {
        return _obj.parents.every((_item, i) => {
          return _item === this.parents[i];
        });
      }
    }
    else {
      return false;
    }
  }
}

module.exports = HView;

});

__exports('foundation/eventmanager', function() {

const {BROWSER_TYPE, ELEM, LOAD} = require('core/elem');
const Event = require('core/event');
const HApplication = require('foundation/application');
const HSystem = require('foundation/system');
const HView = require('foundation/view');
const HPoint = require('util/geom/point');
const HRect = require('util/geom/rect');
const Queue = require('comm/queue');

// The EventManager is a proxy between the DOM-level
// events and the higher-lever GUI API's.
class EventManagerApp extends HApplication.mixin({
  // The default options array, each flag corresponds to events received.
  _defaultEventOptions: {
    //
    // The recipient's #mouseMove(x,y) method gets called,
    // whether it has focus or not
    mouseMove: false,
    //
    // The recipient's #mouseDown(x,y,button) method gets called,
    // if focused.
    mouseDown: false,
    //
    // The recipient's #click(x,y,button) method gets called,
    // if focused.
    click: false,
    //
    // The recipient's #mouseUp(x,y,button) method gets called,
    // if focused.
    mouseUp: false,
    //
    // The recipient's #startDrag(x, y), #drag(x, y) and
    // #endDrag(x, y) methods get called, if focused and
    // a draging operation is done with the pointing device.
    draggable: false,
    //
    // The recipient's #startHover(dragObj), #hover(dragObj) and
    // #endHover(dragObj) methods get called, when a dragged object
    // is hovered over it. See the rectHover option to set the topmost
    // vs any mode.
    droppable: false,
    //
    // The drop modes define how the hover area responds to dragged objects
    //  false: point; the [x,y] point of the pointer
    //  true: area; the [l,t,r,b] contains rectangle of the dragged object
    //  'contains': for areas; same as true
    //  'intersects': for areas; intersection instead of containment
    rectHover: false,
    //
    // Allows multiple (other than the non-topmost drop target).
    // Set on both the draggable as well as the drop target object.
    multiDrop: false,
    //
    // The recipient's #keyDown(keyCode) method gets called,
    // if active and a keyboard key is pressed.
    keyDown: false,
    //
    // The recipient's #keyUp(keyCode) method gets called,
    // if active and a keyboard key is released.
    keyUp: false,
    //
    // The recipient's #mouseWheel(delta) method gets called,
    // if active and a scroll device is used.
    mouseWheel: false,
    //
    // The recipient's #resize() method gets called, when the
    // browser's window or a HWindow (and similar components) are
    // resized, this event is triggered on all recipients.
    resize: false,
    //
    // The recipient's #textEnter() method gets called, when a keyboard key
    // has been pressed and released, whether it has focus or not.
    textEnter: false,
    //
    // The recipient's #doubleClick(x,y) method gets called, when
    // the pointing device is double-clicked, if focused.
    doubleClick: false,
    //
    // The recipient's #contextMenu() method gets called, when the
    // pointing device's or keyboard's context button (usually the
    // right mouse button) has been pressed, if focused.
    contextMenu: false,
  },
  //
  // The status object has a list of the most recent HID events by id and name.
  // Each id and name and states are booleans.
  //   button1      =>  The state of the left mouse button.
  //   button2      =>  The state of the right mouse button.
  //   crsrX        =>  The X-coordinate of the mouse cursor (or last point of touch).
  //   crsrY        =>  The Y-coordinate of the mouse cursor (or last point of touch).
  //   keysDown     =>  An Array of the key codes of keys being held down.
  //   altKeyDown   =>  The state of the Alt key (or equivalent, like Option).
  //   ctrlKeyDown  =>  The state of the Ctrl key.
  //   shiftKeyDown => The state of the Shift key.
  //   metaKeyDown  =>  The state of the Meta key.
  //   cmdKeyDown   =>  The state of the Command key (or equivalent, like the Windows key).
  status: (() => {
    // Private _status:
    const _status = {
      button1: false,
      button2: false,
      crsrX: -1,
      crsrY: -1,
      mouseDownPos: {
        x: -1, y: -1
      },
      mouseDownDiff: {
        x: 0, y: 0
      },
      keysDown: [],
      modifierKeys: {
        alt: false,
        ctrl: false,
        shift: false,
        meta: false,
        cmd: false,
      }
    };
    return new (class {
      get button1() {
        return _status.button1;
      }
      set button1(f) {
        _status.button1 = f;
      }
      get button2() {
        return _status.button2;
      }
      set button2(f) {
        _status.button2 = f;
      }
      get mouseDownPos() {
        return [
          _status.mouseDownPos.x,
          _status.mouseDownPos.y
        ];
      }
      get mouseDownDiff() {
        return [
          _status.mouseDownDiff.x,
          _status.mouseDownDiff.y
        ];
      }
      get crsr() {
        return [
          _status.crsrX,
          _status.crsrY
        ];
      }
      get crsrX() {
        return _status.crsrX;
      }
      set crsrX(x) {
        _status.mouseDownDiff.x += Math.abs(_status.crsrX - x);
        _status.crsrX = x;
      }
      get crsrY() {
        return _status.crsrY;
      }
      set crsrY(y) {
        _status.mouseDownDiff.y += Math.abs(_status.crsrY - y);
        _status.crsrX = y;
      }
      setCrsr(x, y) {
        this.crsrX = x;
        this.crsrY = y;
      }
      hasKeyDown(k) {
        return !_status.keysDown.includes(k);
      }
      addKeyDown(k) {
        if (!this.hasKeyDown(k)) {
          _status.keysDown.push(k);
        }
      }
      delKeyDown(k) {
        const i = _status.keysDown.indexOf(k);
        if (i !== -1) {
          _status.keysDown.splice(i, 1);
        }
      }
      resetKeysDown() {
        _status.keysDown = [];
      }
      get altKeyDown() {
        return _status.modifierKeys.alt;
      }
      setAltKey(f) {
        _status.modifierKeys.alt = !!f;
      }
      get ctrlKeyDown() {
        return _status.modifierKeys.ctrl;
      }
      setCtrlKey(f) {
        _status.modifierKeys.ctrl = !!f;
      }
      get shiftKeyDown() {
        return _status.modifierKeys.shift;
      }
      setShiftKey(f) {
        _status.modifierKeys.shift = !!f;
      }
      get metaKeyDown() {
        return _status.modifierKeys.meta;
      }
      setMetaKey(f) {
        _status.modifierKeys.meta = !!f;
      }
      get cmdKeyDown() {
        return _status.modifierKeys.cmd;
      }
      setCmdKey(f) {
        _status.modifierKeys.cmd = !!f;
      }
      setMouseDownPos(x, y) {
        _status.mouseDownPos.x = x;
        _status.mouseDownPos.y = y;
        _status.mouseDownDiff.x = 0;
        _status.mouseDownDiff.y = 0;
      }
    })();
  })(),
  //
  // List of used event methods for global purposes:
  _eventMethods: [
    'resize', 'mouseMove', 'doubleClick', 'contextMenu', 'click', 'mouseUp',
    'mouseDown', 'keyUp', 'keyDown', 'mouseWheel'
  ],
  //
  // This structure keeps track of registered elem/event/object/method; see #observe and #stopObserving
  _observerMethods: {},
  //
  // This structure keeps track of view-event bindings:
  _listeners: {
    byId: {}, // viewId => [ eventName, eventName, .. ]
    _rectHoverIntersectMode: [],
    byEvent: {// event names by viewId
      mouseMove: [], // viewIds
      mouseDown: [], // viewIds
      mouseUp: [], // viewIds
      draggable: [], // viewIds
      droppable: [], // viewIds
      rectHover: [], // viewIds
      multiDrop: [], // viewIds
      keyRepeat: [], // viewIds
      keyDown: [], // viewIds
      keyUp: [], // viewIds
      mouseWheel: [], // viewIds
      textEnter: [], // viewIds
      click: [], // viewIds
      resize: [], // viewIds
      doubleClick: [], // viewIds
      contextMenu: [], // viewIds
    },
    focused: [], // viewIds
    enabled: [], // viewIds
    dragged: [], // viewIds
    selected: [], // viewIds
    hovered: [], // viewIds
    active: [], // viewIds
  },
  //
  // Queue of items to check for focus, because it's fairly slow directly:
  _topmostQueue: [],
  //
  // Keycode translation tables
  _keyTrans: {
    opera: {
      // Symbol keys:
      59: 186, // [;:]
      61: 187, // [=+]
      44: 188, // [,<]
      45: 189, // [-_]
      46: 190, // [.>]
      47: 191, // [/?]
      96: 192, // [`~]
      91: 219, // [[{]
      92: 220, // [\|]
      93: 221, // []}]
      39: 222, // ['"]

      // Numeric keypad keys can't be mapped on Opera, because Opera
      // doesn't differentiate between the keys on the numeric keypad
      // versus the functionally same keys elsewhere on the keyboard.

      // Branded keys:
      // Apple Command keys are same as ctrl, but ctrl is 0; Can't be re-mapped reliably.
      // The Windows Menu key also return 0, so it can't be re-mapped either.
      219: 91, // Left Windows key (Start)
      220: 92, // Right Windows key (Start)
    },
    mozilla: {
      // Symbol keys:
      59: 186, // [;:]
      61: 187, // [=+]
      109: 189, // [-_]

      // Branded keys:
      224: 91, // Apple Command key to left windows key mapping
    }
  },
  //
  // List of keycodes considered command keys
  _cmdKeys: [
    17, // Ctrl
    91, // Others (Left Start Key or Left Command Key)
    92, // Others (Right Start Key)
    93, // Others (Menu Key or Right Command Key)
  ],
  //
  // Special key method handlers for ESC and RETURN, maybe others in the future
  _defaultKeyActions: {
    '13': 'defaultKey', // return
    '27': 'escKey', // esc
  }

}) /* end of mixin, class begins */ {

  constructor() {
    super(40, 'Event Manager');
    LOAD(() => {
      this.start();
    });
  }

  // Cleans up events that would be lost, when the browser window is blurred.
  _domWindowBlur() {
    this.status.resetKeysDown();
    this.status.setAltKey(false);
    this.status.setCtrlKey(false);
    this.status.setShiftKey(false);
    this.status.setMetaKey(false);
    this.status.setCmdKey(false);
    this._origDroppableChecks = this.enableDroppableChecks;
    this.enableDroppableChecks = false;
    if (HSystem.defaultInterval !== HSystem._blurredInterval) {
      this._sysDefaultInterval = HSystem.defaultInterval;
      Queue.push(() => {
        HSystem.defaultInterval = HSystem._blurredInterval;
      });
    }
  }

  // Restores system poll frequency
  _domWindowFocus() {
    this.enableDroppableChecks = this._origDroppableChecks;
    if (HSystem.defaultInterval === HSystem._blurredInterval && this._sysDefaultInterval) {
      Queue.push(() => {
        HSystem.defaultInterval = this._sysDefaultInterval;
      });
    }
  }

  // Observe event, cache anon function; eventName => elem => anonFn
  observe(_elem, _eventName, _targetMethodName, _targetObj, _capture) {
    if (this.isNullOrUndefined(_targetObj)) {
      _targetObj = this;
    }
    if (this.isNullOrUndefined(_capture)) {
      _capture = false;
    }
    const _anonFn = e => {
      _targetObj[_targetMethodName](e);
    };
    if (this.isntObject(this._observerMethods[_eventName])) {
      this._observerMethods[_eventName] = {
        elems: [],
        fns: [],
        capture: [],
      };
    }
    const _cache = this._observerMethods[_eventName];
    const _elemIdx = _cache.elems.indexOf(_elem);
    if (_elemIdx !== -1) {
      const _prevFn = _cache.fns[_elemIdx];
      const _prevCapture = _cache.capture[_elemIdx];
      Event.stopObserving(_elem, _eventName, _prevFn, _prevCapture);
      _cache.elems.splice(_elemIdx, 1);
      _cache.fns.splice(_elemIdx, 1);
      _cache.capture.splice(_elemIdx, 1);
    }
    Event.observe(_elem, _eventName, _anonFn, _capture);
    _cache.elems.unshift(_elem);
    _cache.fns.unshift(_anonFn);
    _cache.capture.unshift(_capture);
    return true;
  }

  // Stop observing event
  stopObserving(_elem, _eventName) {
    if (this.isObject(this._observerMethods[_eventName])) {
      if (this._observerMethods[_eventName].elems.length === 0) {
        delete this._observerMethods[_eventName];
      }
      else {
        const _cache = this._observerMethods[_eventName];
        const _elemIdx = _cache.elems.indexOf(_elem);
        if (_elemIdx !== -1) {
          const _prevFn = _cache.fns[_elemIdx];
          const _prevCapture = _cache.capture[_elemIdx];
          Event.stopObserving(_elem, _eventName, _prevFn, _prevCapture);
          _cache.elems.splice(_elemIdx, 1);
          _cache.fns.splice(_elemIdx, 1);
          _cache.capture.splice(_elemIdx, 1);
          return true;
        }
      }
    }
    return false;
  }

  // Returns the global target element based on browser type
  _getGlobalTargetElem() {
    return window;
  }

  // Starts EventManager
  start() {
    this._views = HSystem.views; // shortcut to system views
    const _targetElem = this._getGlobalTargetElem();
    if (!BROWSER_TYPE.safari && !this._eventMethods.includes('keyPress')) {
      this._eventMethods.push('keyPress');
    }
    this._eventMethods.map(_methodName => {
      if (_methodName === 'doubleClick') {
        return [_methodName, 'dblclick'];
      }
      else {
        return [_methodName, _methodName.toLowerCase()];
      }
    }).forEach(([_methodName, _eventName]) => {
      this.observe(_targetElem, _eventName, _methodName);
    });
    if (this.isntNullOrUndefined(window.addEventListener)) {
      this.observe(window, 'DOMMouseScroll', 'mouseWheel');
      this.observe(window, 'resize', 'resize');
    }
    this.observe(window, 'blur', '_domWindowBlur');
    this.observe(window, 'focus', '_domWindowFocus');
  }

  // Stops EventManager
  stop() {
    delete this._views;
    const _targetElem = this._getGlobalTargetElem();
    if (!BROWSER_TYPE.safari && !this._eventMethods.includes('keyPress')) {
      this._eventMethods.push('keyPress');
    }
    this._eventMethods.map(_methodName => {
      if (_methodName === 'doubleClick') {
        return [_methodName, 'dblclick'];
      }
      else {
        return [_methodName, _methodName.toLowerCase()];
      }
    }).forEach(([_methodName, _eventName]) => {
      this.stopObserving(_targetElem, _eventName, _methodName);
    });
    if (this.isntNullOrUndefined(window.addEventListener)) {
      this.stopObserving(window, 'DOMMouseScroll', 'mouseWheel');
      this.stopObserving(window, 'resize', 'resize');
    }
    this.stopObserving(window, 'blur', '_domWindowBlur');
    this.stopObserving(window, 'focus', '_domWindowFocus');
  }

  // Ensures the type of the object is a HControl
  _ensureValidControl(_ctrl, _warnMethodName) {
    if (this.isNullOrUndefined(_warnMethodName)) {
      _warnMethodName = '_ensureValidControl';
    }
    if (this.isntFunction(_ctrl.hasAncestor)) {
      console.warn(`EventManager#${_warnMethodName} => Not a HClass: `, _ctrl);
      return false;
    }
    else if (this.isFunction(_ctrl.hasAncestor) && _ctrl.hasAncestor(HView) && _ctrl.isCtrl) {
      console.warn(`EventManager#${_warnMethodName} => Not a HControl: `, _ctrl);
      return false;
    }
    else {
      return true;
    }
  }

  // Ensure valid eventOptions
  _ensureValidEventOptions(_eventOptions, _warnMethodName) {
    if (this.isNullOrUndefined(_warnMethodName)) {
      _warnMethodName = '_ensureValidEventOptions';
    }
    if (this.isntObject(_eventOptions)) {
      console.warn(`EventManager#${_warnMethodName} => Invalid eventOptions: `, _eventOptions);;
      return false;
    }
    else {
      return true;
    }
  }

  // Converts eventOptions into a list of enabled event names
  _setEventOptions(_ctrl, _eventOptions, _warnMethodName) {
    if (this.isNullOrUndefined(_warnMethodName)) {
      _warnMethodName = '_setEventOptions';
    }
    const _viewId = _ctrl.viewId;
    const _eventsOn = [];
    Object.entries(this._defaultEventOptions).forEach(([_key, _defaultValue]) => {
      if (_key !== 'base' && _key !== 'constructor') {
        if (this.isntNullOrUndefined(this._listeners.byEvent[_key]) &&
            this.isntNullOrUndefined(_eventOptions[_key])) {
          const _value = _eventOptions[_key];
          if (_value) {
            _eventsOn.push(_key);
            if (_key === 'keyDown') {
              if (_value === 'repeat') {
                if (!this._listeners.byEvent.keyRepeat.includes(_viewId)) {
                  this._listeners.byEvent.keyRepeat.unshift(_viewId);
                }
              }
              else {
                const _idx = this._listeners.byEvent.keyRepeat.indexOf(_viewId);
                if (_idx !== -1) {
                  this._listeners.byEvent.keyRepeat.splice(_idx, 1);
                }
              }
            }
            if (!this._listeners.byEvent[_key].includes(_viewId)) {
              this._listeners.byEvent[_key].unshift(_viewId);
            }
            if (_key === 'rectHover' && _value === 'intersects' &&
                 !this._listeners._rectHoverIntersectMode.includes(_viewId)) {
              this._listeners._rectHoverIntersectMode.unshift(_viewId);
            }
          }
          else {// not _value
            const _keys = [_key];
            if (_key === 'keyDown') {
              _keys.push('keyRepeat');
            }
            _keys.forEach(_ikey => {
              const _idx = this._listeners.byEvent[_ikey].indexOf(_viewId);
              if (_idx !== -1) {
                this._listeners.byEvent[_key].splice(_idx, 1);
              }
            });
          }
        }
        else {
          console.warn(`EventManager#${_warnMethodName} => Invalid event type: ${_key}`);
        }
      }
    });
    this._listeners.byId[_viewId] = _eventsOn;
    if (_ctrl.enabled) {
      if (!this._listeners.enabled.includes(_viewId)) {
        this._listeners.enabled.unshift(_viewId);
      }
      const _elem = ELEM.get(_ctrl.elemId);
      const [x, y] = this.status.crsr;
      this._topmostQueue.push([HPoint.new(x, y), _ctrl]);
    }
  }

  // Releases bindings done by #_setEventOptions
  _unsetEventOptions(_ctrl, _warnMethodName) {
    if (this.isNullOrUndefined(_warnMethodName)) {
      _warnMethodName = '_unsetEventOptions';
    }
    const _viewId = _ctrl.viewId;
    if (this.isntNullOrUndefined(this._listeners.byId[_viewId])) {
      delete this._listeners.byId[_viewId];
    }
    else {
      console.warn(`EventManager#${_warnMethodName} => viewId not registered: ${_viewId}`);
    }
    Object.entries(this._listeners.byEvent).forEach(([_key, _value]) => {
      const _viewIdx = _value.indexOf(_viewId);
      if (_viewIdx !== -1) {
        _value.splice(_viewIdx, 1);
      }
      if (_key === 'rectHover') {
        const _intersectHoverIdx = this._listeners._rectHoverIntersectMode.indexOf(_viewId);
        if (_intersectHoverIdx !== -1) {
          this._listeners._rectHoverIntersectMode.splice(_intersectHoverIdx, 1);
        }
      }
    });
    const _elem = ELEM.get(_ctrl.elemId);
    ['dragged', 'selected', 'hovered', 'active', 'focused', 'enabled'].forEach(_statusItem => {
      const _viewIdx = this._listeners[_statusItem].indexOf(_viewId);
      if (_viewIdx !== -1) {
        if (_statusItem === 'dragged') {
          _ctrl.endDrag(this.status.crsrX, this.status.crsrY);
        }
        else if (_statusItem === 'selected') {
          _ctrl.deselect();
        }
        else if (_statusItem === 'hovered') {
          _ctrl.endHover(null);
        }
        else if (_statusItem === 'active') {
          _ctrl._lostActiveStatus(null);
        }
        else if (_statusItem === 'focused') {
          this.blur(_ctrl);
        }
        else if (_statusItem === 'enabled') {
          if (_ctrl.enabled) {
            _ctrl.setEnabled(false);
          }
        }
        _viewIdx = this._listeners[_statusItem].indexOf(_viewId);
        if (_viewIdx !== -1) {
          this._listeners[_statusItem].splice(_viewIdx, 1);
        }
      }
    });
  }

  // Cancels the drag operation for the ctrl
  cancelDrag(_ctrl) {
    const _dragIdx = this._listeners.dragged.indexOf(_ctrl.viewId);
    if (_dragIdx !== -1) {
      this._listeners.dragged.splice(_dragIdx, 1);
    }
  }

  // Registers the HControl -derived object _ctrl by event listener flags
  // in _eventOptions.;
  reg(_ctrl, _eventOptions) {
    if (!this._ensureValidControl(_ctrl, 'reg')) {
      return false;
    }
    else if (!this._ensureValidEventOptions(_eventOptions, 'reg')) {
      return false;
    }
    else {
      this._setEventOptions(_ctrl, _eventOptions, 'reg');
      return true;
    }
  }

  // Returns status of registration
  _isreg(_ctrl) {
    return this.isntNullOrUndefined(this._listeners.byId[_ctrl.viewId]);
  }

  // Unregisters the HControl -derived object from all its bindings
  unreg(_ctrl) {
    if (!this._ensureValidControl(_ctrl, 'unreg')) {
      return false;
    }
    else if (!this._isreg(_ctrl)) {
      return false;
    }
    else {
      return this._unsetEventOptions(_ctrl, 'unreg');
    }
  }

  // ----------------------------------------
  // Event responders; mid-level handlers.
  // These all receive the global events and check where to delegate them.

  // Handle event modifiers
  _modifiers(e) {
    const [_x, _y] = ELEM.getScrollPosition(0);
    const [x, y] = [Event.pointerX(e), Event.pointerY(e)];
    if (!isNaN(x) || isNaN(y)) {
      this.status.setCrsr(x, y);
    }
    this.status.setAltKey(e.altKey);
    this.status.setCtrlKey(e.ctrlKey);
    this.status.setShiftKey(e.shiftKey);
    this.status.setMetaKey(e.metaKey);
  }

  // Resize is an event triggered by resizing the browser window
  // (as well as the HWindow component, as a special case)
  //
  // The HSystem._updateFlexibleRects call may not be neccessary to call
  // both before and after in all circumstances, but better be safe than sure.
  resize(e) {
    ELEM.flush();
    this._listeners.byEvent.resize.forEach(_viewId => {
      const _ctrl = this._views[_viewId];
      if (this.isntNullOrUndefined(_ctrl) && this.isFunction(_ctrl.resize)) {
        _ctrl.resize();
      }
    });
  }

  // Finds the next elem with a view_id attribute
  _findViewId(_elem) {
    while (_elem && this.isntNullOrUndefined(_elem.view_id) && (_elem !== document.body)) {
      _elem = _elem.parentNode;
    }
    return _elem;
  }

  // Finds the ctrl based on the element by getting the view_id attribute
  _findEventControl(e, _warnMethodName, _stop) {
    if (this.isNullOrUndefined(_warnMethodName)) {
      _warnMethodName = '_findEventControl';
    }
    let _elem = Event.element(e);
    let _ctrl = null;
    while (this.isNullOrUndefined(_ctrl)) {
      _elem = this._findViewId(_elem);
      if (_elem === document.body) {
        return false;
      }
      else if (this.isNullOrUndefined(_elem.view_id)) {
        console.warn(`EventManager#${_warnMethodName} => The element doesn't have an 'view_id' attribute.`);
        return false;
      }
      else {
        const _viewId = parseInt(_elem.view_id, 10);
        if (this.isNullOrUndefined(this._views[_viewId])) {
          console.warn(`EventManager#${_warnMethodName} => The viewId:${_viewId} doesn't have a view.`);
          return false;
        }
        else {
          _ctrl = this._views[_viewId];
          if (!_ctrl.isCtrl || !this._ensureValidControl(_ctrl, _warnMethodName)) {
            _ctrl = null;
            _elem = _elem.parentNode;
          }
        }
      }
    }
    if (_stop) {
      Event.stop(e);
    }
    return _ctrl;
  }

  // Focuses a control, triggered based on the view-element-specific
  // mouseover event.
  focus(_ctrl) {
    const _viewId = _ctrl.viewId;
    if (this._listeners.focused.includes(_viewId)) {
      return false;
    }
    else {
      const _elem = ELEM.get(_ctrl.elemId);
      this._listeners.focused.unshift(_viewId);
      if (this.isntFunction(_ctrl.focus)) {
        console.warn(`EventManager#focus => The viewId:${_viewId} doesn't have a 'focus' method.`);
        return false;
      }
      else {
        return _ctrl.focus();
      }
    }
  }

  // Blurs a control, triggered based on the view-element-specific
  // mouseout event.
  blur(_ctrl) {
    const _viewId = _ctrl.viewId;
    const _viewIdx = this._listeners.focused.indexOf(_viewId);
    if (_viewIdx === -1) {
      return false;
    }
    else {
      const _elem = ELEM.get(_ctrl.elemId);
      this._listeners.focused.splice(_viewIdx, 1);
      if (this.isntFunction(_ctrl.blur)) {
        console.warn(`EventManager#blur => The viewId:${_viewId} doesn't have a 'blur' method.`);
        return false;
      }
      else {
        return _ctrl.blur();
      }
    }
  }

  _debugHighlight() {
    if (this.isProduction && BROWSER_TYPE.mobile) {
      return false;
    }
    else {
      const _focused = this._listeners.focused;
      if (_focused.length > 0) {
        const _ctrl = this._views[_focused[_focused.length - 1 ]];
        if (this.isntNullOrUndefined(_ctrl)) {
          if (this.isNullOrUndefined(this._debugElem)) {
            this._debugElem = ELEM.make(0, 'div', {
              styles: {
                position: 'absolute',
                border: '1px solid red',
                zIndex: 20000,
                pointerEvents: 'none',
                boxSizing: 'border-box',
                MozBoxSizing: 'border-box',
                WebkitBoxSizing: 'border-box'
              }
            }
           );
          }
          ELEM.setBoxCoords(this._debugElem, ELEM.getVisibleBoxCoords(_ctrl.elemId, true));
        }
      }
      else if (this.isntNullOrUndefined(this._debugElem)) {
        ELEM.del(this._debugElem);
        this._debugElem = null;
      }
      return true;
    }
  }

  // Finds new focusable components after the
  // mouse has been moved (replacement of mouseover/mouseout)
  _findNewFocus(x, y) {
    const _matchIds = this._findTopmostEnabled(HPoint.new(x, y), 'contains', null);
    const _focused = this._listeners.focused;
    // blur all previously focused:
    if (_matchIds.length === 0) {
      _focused.forEach(_focusId => {
        const _ctrl = this._views[_focusId];
        if (this.isntNullOrUndefined(_ctrl)) {
          this.blur(_ctrl);
        }
        _focused.splice(_focused.indexOf(_focusId), 1);
      });
    }
    else {
      _matchIds.filter(_viewId => {
        return !_focused.includes(_viewId);
      }).map(_viewId => {
        return this._views[_viewId];
      }).forEach(_ctrl => {
        this.cloneObject(_focused).forEach(_focusId => {
          const _focusCtrl = this._views[_focusId];
          if (this.isntNullOrUndefined(_focusCtrl)) {
            this.blur(_focusCtrl);
          }
          _focused.splice(_focused.indexOf(_focusId), 1);
        });
        this.focus(_ctrl);
      });
    }
  }

  // Just split to gain namespace:
  _handleMouseMove(x, y) {
    this._findNewFocus(x, y);
    this._debugHighlight();
    const _mouseMoveHandled = this._delegateMouseMove(x, y);
    const _currentlyDragging = this._delegateDrag(x, y);
    return (_mouseMoveHandled || _currentlyDragging);
  }

  // Handle items being dragged, sending #drag(x,y) calls to them
  _delegateDrag(x, y) {
    const _dragItems = this._listeners.dragged;
    if (_dragItems.length === 0) {
      return false;
    }
    else {
      _dragItems.forEach(_viewId => {
        const _ctrl = this._views[_viewId];
        _ctrl.drag(x, y);
        this._delegateHover(_ctrl, x, y);
      });
      return true;
    }
  }

  // Handle items wanting #mouseMove(x,y) calls
  _delegateMouseMove(x, y) {
    const _mouseMoveItems = this._listeners.byEvent.mouseMove;
    if (_mouseMoveItems.length === 0) {
      return false;
    }
    else {
      return _mouseMoveItems.map(_viewId => {
        return this._views[_viewId];
      }).filter(_ctrl => {
        if (this.isntNullOrUndefined(_ctrl) && _ctrl.mouseMove(x, y)) {
          return true;
        }
        else {
          return false;
        }
      }).length !== 0;
    }
  }

  // Handle items wanting #startHover(_dragObj), #hover(_dragObj) and #endHover(_dragObj) calls
  _delegateHover(_ctrl, x, y) {
    const _hoverItems = (_byEvent => {
      const {_area, _matchMethod} = (() => {
        // find by point containment:
        if (!_byEvent.rectHover.includes(_ctrl.viewId)) {
          return {
            _area: HPoint.new(x, y),
            _matchMethod: 'contains'
          };
        }
        // find by rect intersection:
        else if (!this._listeners._rectHoverIntersectMode.includes(_ctrl.viewId)) {
          return {
            _area: HRect.new(x, y, _ctrl.rect.width, _ctrl.rect.height),
            _matchMethod: 'intersects',
          };
        }
        // find by rect containment:
        else {
          return {
            _area: HRect.new(x, y, _ctrl.rect.width, _ctrl.rect.height),
            _matchMethod: 'contains',
          };
        }
      })();
      // find all:
      if (_byEvent.multiDrop.includes(_ctrl.viewId)) {
        return this._findAllDroppable(_area, _matchMethod, _ctrl.viewid);
      }
      // find only topmost:
      else {
        return this._findTopmostDroppable(_area, _matchMethod, _ctrl.viewId);
      }
    })(this._listeners.byEvent);
    // delegate startHover:
    _hoverItems.filter(_hoverId => {
      return !this._listeners.hovered.includes(_hoverId);
    }).forEach(_viewId => {
      this._views[_viewId].startHover(_ctrl);
    });
    // delegate hover:
    _hoverItems.forEach(_viewId => {
      this._views[_viewId].hover(_ctrl);
    });
    // delegate endHover:
    this._listeners.hovered.filter(_hoverId => {
      return !_hoverItems.includes(_hoverId);
    }).forEach(_viewId => {
      this._views[_viewId].endHover(_ctrl);
    });
    // finally store hovered items for the next time:
    this._listeners.hovered = _hoverItems;
  }

  _isValidView(_view) {
    return (
      this.isntNullOrUndefined(_view) &&
      this.isFunction(_view.hasAncestor) &&
      _view.hasAncestor(HView)
    );
  }

  // Finds the topmost item from array of viewId's
  _findTopmostOf(_arrOfIds, _area, _matchMethodName, _selfId) {
    const _matchMethod = {
      contains: _view => {
        return _view.contains(_area.x, _area.y);
      },
      intersects: _view => {
        return _view.intersects(_area.x, _area.y, _area.width, _area.height);
      }
    }[_matchMethodName];
    if (this.isntFunction(_matchMethod)) {
      console.error(
        `HThemeManager#_findTopmostOf error; unknown _matchMethodName: ${_matchMethodName}`);
      return [];
    }
    else {
      const _search = _viewIds => {
        const _subviews = _viewIds.filter(_viewId => {
          // first filter out all but self:
          return _viewId !== _selfId;
        }).map(_viewId => {
          // then convert _viewId to _view:
          return this._views[_viewId];
        }).filter(_view => {
          // then filter out non-views and hidden views:
          return this._isValidView(_view) && !_view.isHidden;
        }).map(_view => {
          return [_view.viewId, _view];
        });
        let _viewId;
        let _view;
        // TODO: combine this with the map/filter above via reduce:
        for ([_viewId, _view] of _subviews) {
          // recursive search for matching geometry
          if (_matchMethod(_view)) {
            const _foundId = _search(_view.viewZOrder.slice().reverse());
            if (_viewId in _arrOfIds) {
              if (_foundId !== false) {
                return _foundId;
              }
              else {
                // no (matching) subviews:
                return _viewId;
              }
            }
            else if (_foundId !== false) {
              return _foundId;
            }
          }
          // elses of both are: continue loop
        }
        return false; // end of loop without matches, or no _subviews
      };
      const _foundId = _search(HSystem.viewsZOrder.slice().reverse());
      if (_foundId !== false) {
        return [_foundId];
      }
      else {
        return [];
      }
    }
  }

  // Finds the topmost drop/hover target within the area specified by rectHover
  _findTopmostDroppable(_area, _matchMethod, _selfId) {
    return this._findTopmostOf(this._listeners.byEvent.droppable, _area, _matchMethod, _selfId);
  }

  // Finds the topmost enabled target within the area specified by area
  _findTopmostEnabled(_area, _matchMethod, _selfId) {
    return this._findTopmostOf(this._listeners.enabled, _area, _matchMethod, _selfId);
  }

  // Finds all drop/hover targets within the area specified by rectHover
  _findAllDroppable(_area, _matchMethod, _selfId) {
    const _views = this._views;
    const _droppable = this._listeners.byEvent.droppable;
    const _foundIds = [];
    const _search = _parentIds => {
      _parentIds
        .filter(_viewId => {
          return _viewId !== _selfId;
        })
        .map(_viewId => {
          return _views[_viewId];
        })
        .filter(this._isValidView).filter(_view => {
          return _view.rect &&
            this.isFunction(_view.rect[_matchMethod]) &&
            _view.rect[_matchMethod](_area);
        })
        .forEach(_view => {
          if (_droppable.includes(_view.viewId)) {
            _foundIds.push(_view.viewId);
          }
          _search(_view.viewsZOrder.slice().reverse());
        });
    };
    _search(HSystem.viewsZOrder.slice().reverse());
    return _foundIds;
  }

  _validateActiveListeners() {
    this._listeners.active = this._listeners.active.filter(_viewId => {
      if (_viewId === null) {
        console.warn('EventManager#_validateActiveListeners warning; encountered null viewId in active listeners!');
        return false;
      }
      else if (!this._isValidView(this._views[_viewId])) {
        console.warn('EventManager#_validateActiveListeners warning; encountered invalid viewId in active listeners!');
        return false;
      }
      else if (this._views[_viewId].isDead) {
        console.warn(
          'EventManager#_validateActiveListeners warning; encountered a dead control: ',
          this._views[_viewId]);
        return true; // TODO: should probably be false; possible bug?
      }
      else {
        return true;
      }
    });
    if (this.listeners.active.length > 1) {
      console.warn('EventManager#_validateActiveListeners warning; too many active items: ', this._listeners.active);
      // TODO: should probably make this an error and throw something; see delActiveControl as well about the situation
    }
  }

  _viewIdToCtrl(_viewId) {
    return this._views[_viewId];
  }

  _delegateEndHoverAndDrop(_ctrl) {
    this.listeners.hovered
      .map(this._viewIdToCtrl)
      .filter(this._isValidView)
      .forEach(_dropView => {
        this.isFunction(_dropView.endHover) &&
          _dropView.endHover(_ctrl);
        this.isFunction(_dropView.drop) &&
          _dropView.drop(_ctrl);
      });
  }

  _filterViewIdToValidView(_arr, _filter) {
    if (this.isntFunction(_filter)) {
      // don't filter, if there's nothing to filter:
      _filter = () => {
        return true;
      };
    }
    return _arr
      .filter(_filter)
      .map(this._viewIdToCtrl)
      .filter(this._isValidView);
  }

  // Removes the active control
  delActiveControl(_newActiveControl) {
    this._validateActiveListeners();
    const {active, focused, dragged} = this._listeners;
    const _newActiveIsValidView = this._isValidView(_newActiveControl);
    if (active.length > 0) {
      const _prevActiveControl = this._views[active[0]];
      const _isntSameAsNewActive = _newActiveIsValidView ?
        _viewId => {
          return _viewId !== _newActiveControl.viewId;
        } : () => {
          return true; // always true, if no new active view
        };
      // TODO: This is probably overcomplicating something that
      //       really should have a single item in it; see _validateActiveListeners
      this._filterViewIdToValidView(active, _isntSameAsNewActive)
        .forEach(_view => {
          const _viewId = _view.viewId;
          _view.active = false;
          const _dragIdx = dragged.indexOf(_viewId);
          if (_dragIdx) {
            dragged.splice(_dragIdx, 1);
            this._delegateEndHoverAndDrop(_view);
            const [x, y] = this.status.crsr;
            _view.endDrag(x, y);
          }
          const _activeIndex = active.indexOf(_viewId);
          active.splice(_activeIndex, 1);
          if (focused.includes(_viewId)) {
            this.blur(_view);
          }
          _view._lostActiveStatus(_newActiveControl);
          _view.lostActiveStatus(_newActiveControl);
        });
      return _prevActiveControl;
    }
    else {
      return null;
    }
  }

  // Adds the active control
  addActiveControl(_ctrl, _prevActiveControl) {
    if (this._isValidView(_ctrl) &&
      this.isFunction(_ctrl.allowActiveStatus) &&
      _ctrl.allowActiveStatus(_prevActiveControl)
    ) {
      const {active, focused} = this._listeners;
      const _viewId = _ctrl.viewId;
      if (!active.includes(_viewId)) {
        active.unshift(_ctrl.viewId);
        if (!focused.includes(_ctrl.viewId)) {
          this.focus(_ctrl);
        }
        _ctrl.active = true;
        _ctrl._gainedActiveStatus(_prevActiveControl);
        _ctrl.gainedActiveStatus(_prevActiveControl);
      }
    }
  }

  // Sets the active control
  changeActiveControl(_ctrl) {
    const _prevActiveControl = this._views[this._listeners.active[0]];
    if (this._isValidView(_ctrl) && _ctrl !== _prevActiveControl) {
      return null;
    }
    else if (_ctrl === null || (
        this.isFunction(_ctrl.allowActiveStatus) &&
        _ctrl.allowActiveStatus(_prevActiveControl)
      )
    ) {
      this.delActiveControl(_ctrl);
      this.addActiveControl(_ctrl, _prevActiveControl);
      return true;
    }
    else {
      // TODO: Investigate this; possible bug?
      return true;
    }
  }

  // Method to be called, when you want to make an item draggable from outside of the EventManager
  startDragging(_ctrl) {
    if (_ctrl.enabled) {
      const _viewId = _ctrl.viewId;
      this.focus(_viewId);
      this.changeActiveControl(_ctrl);
      if (!this._listeners.dragged.includes(_viewId)) {
        this._listeners.dragged.unshift(_viewId);
      }
      _ctrl.startDrag(this.status.crsrX, this.status.crsrY, this.status.button2);
    }
  }

  // Cancels text selections
  _cancelTextSelection() {
    // Remove possible selections.
    ELEM.get(0).focus();
  }

  // Mouse button press manager. Triggered by the global mouseDown event.
  // Delegates the following event responder methods to active HControl instances:
  // - mouseDown
  // - startDrag
  mouseDown(e) {
    this._modifiers(e);
    const _leftClick = Event.isLeftClick(e);
    if (_leftClick) {
      this.status.button1 = true;
    }
    else {
      // TODO: check for button 3 where available:
      this.status.button2 = true;
    }
    const {focused, active, dragged} = this._listeners;
    const _mouseDownable = this._listeners.byEvent.mouseDown;
    const _draggable = this._listeners.byEvent.draggable;
    const _wantsToStopTheEvent = [];
    const _wantsTextSelectionCancelled = [];
    // newly activated views:
    this._filterViewIdToValidView(focused, _viewId => {
      return !active.includes(_viewId);
    }).forEach(_ctrl => {
      this.changeActiveControl(_ctrl);
    });
    const [x, y] = this.status.crsr;
    this.status.setMouseDownPos(x, y);
    this._handleMouseMove(x, y);
    // delegate mouseDown:
    this._filterViewIdToValidView(focused, _viewId => {
      return _mouseDownable.includes(_viewId);
    }).forEach(_ctrl => {
      if (this.isFunction(_ctrl.mouseDown) && _ctrl.mouseDown(x, y, _leftClick)) {
        _wantsToStopTheEvent.push(_ctrl.viewId);
      }
      _wantsTextSelectionCancelled.push(_ctrl.viewId);
    });
    // delegate startDrag:
    this._filterViewIdToValidView(active, _viewId => {
      return _draggable.includes(_viewId) && !dragged.includes(_viewId);
    }).forEach(_ctrl => {
      dragged.unshift(_ctrl.viewId);
      if (this.isFunction(_ctrl.startDrag) && _ctrl.startDrag(x, y, _leftClick)) {
        _wantsToStopTheEvent.push(_ctrl.viewId);
      }
      _wantsTextSelectionCancelled.push(_ctrl.viewId);
    });
    if (_wantsTextSelectionCancelled.length !== 0) {
      this._cancelTextSelection();
    }
    if (e.type === 'touchstart') {
      return true;
    }
    else if (_wantsToStopTheEvent.length !== 0) {
      Event.stop(e);
      return false;
    }
    else {
      return null;
    }
  }

  // Mouse button press manager. Triggered by the global mouseDown event.
  // Delegates the following event responder methods to active HControl instances:
  // - mouseUp
  // - endDrag
  // - endHover
  // - drop
  mouseUp(e) {
    this._modifiers(e);
    const _leftClick = Event.isLeftClick(e);
    if (!_leftClick) {
      this.status.button2 = false;
      return false;
    }
    this.status.button1 = false;
    const {focused, active, dragged, hovered} = this._listeners;
    const _mouseUppable = this._listeners.byEvent.mouseUp;
    const _draggable = this._listeners.byEvent.draggable;
    const _wantsToStopTheEvent = [];
    const _wantsTextSelectionCancelled = [];
    const [x, y] = this.status.crsr;
    this._handleMouseMove(x, y);
    // delegate mouseUp:
    this._filterViewIdToValidView(focused, _viewId => {
      return _mouseUppable.includes(_viewId);
    }).forEach(_ctrl => {
      if (this.isFunction(_ctrl.mouseUp) && _ctrl.mouseUp(x, y, _leftClick)) {
        _wantsToStopTheEvent.push(_ctrl.viewId);
      }
      _wantsTextSelectionCancelled.push(_ctrl.viewId);
    });
    // delegate endDrag and drop:
    this._filterViewIdToValidView(focused, _viewId => {
      if (_draggable.includes(_viewId) && dragged.includes(_viewId)) {
        dragged.splice(dragged.indexOf(_viewId), 1);
        return true;
      }
      else {
        return false;
      }
    }).forEach(_ctrl => {
      this._delegateEndHoverAndDrop(_ctrl);
      if (_ctrl.endDrag(x, y, _leftClick)) {
        _wantsToStopTheEvent.push(_ctrl.viewId);
      }
    });
    this._listeners.hovered = [];
    this._listeners.dragged = [];
    if (_wantsTextSelectionCancelled.length !== 0) {
      this._cancelTextSelection();
    }
    if (e.type === 'touchend') {
      this.click(e);
      return true;
    }
    else if (_wantsToStopTheEvent.length !== 0) {
      Event.stop(e);
      return false;
    }
    else {
      return null;
    }
  }

  // Mouse movement manager. Triggered by the global mousemove event.
  // Delegates the following event responder methods to focused HControl instances:
  // - drag
  // - mouseMove
  // - endHover
  // - startHover
  mouseMove(e) {
    this._modifiers(e); // fetch event modifiers
    const [x, y] = this.status.crsr;
    this._handleMouseMove(x, y) && Event.stop(e);
  }

  // Handles mouse button clicks
  // It's different from mouseUp/mouseDown, because it's a different event,
  // and is supported by touch screen devices
  click(e) {
    this._modifiers(e);
    const _leftClick = Event.isLeftClick(e);
    if (_leftClick) {
      this.status.button1 = false;
    }
    else {
      // there is a separate event for context menu, and only
      // Firefox fires click separately.
      // the handler is contextMenu
      return true;
    }
    const [xd, yd] = this.status.mouseDownDiff;
    if (xd > 20 || yd > 20) {
      return true;
    }
    // Focus check here
    const {focused, active} = this._listeners;
    const _clickable = this._listeners.byEvent.click;
    const _doubleClickable = this._listeners.byEvent.doubleClick;
    const _wantsToStopTheEvent = [];
    const [x, y] = this.status.crsr;
    this._handleMouseMove(x, y);
    let _clickWasStopped = false;
    // newly activated views:
    this._filterViewIdToValidView(focused, _viewId => {
      return !active.includes(_viewId);
    }).forEach(_ctrl => {
      this.changeActiveControl(_ctrl);
    });
    // delegation of delayed click for ones listening to doubleclick as well
    // the purpose of this is to not get an extra click before doubleclick
    const _doubleClickWait = this._filterViewIdToValidView(focused, _viewId => {
      return _clickable.includes(_viewId) && _doubleClickable.includes(_viewId);
    }).filter(_ctrl => {
      return this.isFunction(_ctrl.click);
    });
    if (_doubleClickWait.length) {
      this.dblClickWait = setTimeout(() => {
        _doubleClickWait.forEach(_ctrl => {
          if (_ctrl.click(x, y, _leftClick)) {
            _wantsToStopTheEvent.push(_ctrl.viewId);
          }
        });
        if (_wantsToStopTheEvent.length !== 0 && !_clickWasStopped) {
          Event.stop(e);
        }
      }, 50);
    }
    // delegate clicks:
    this._filterViewIdToValidView(focused, _viewId => {
      return _clickable.includes(_viewId) && !_doubleClickable.includes(_viewId);
    }).filter(_ctrl => {
      return this.isFunction(_ctrl.click);
    }).forEach(_ctrl => {
      if (_ctrl.click(x, y, _leftClick)) {
        _wantsToStopTheEvent.push(_ctrl.viewId);
      }
    });
    if (_wantsToStopTheEvent.length !== 0) {
      _clickWasStopped = true;
      Event.stop(e);
      return false;
    }
    else {
      return null;
    }
  }

  // Handles doubleClick events
  doubleClick(e) {
    if (this.dblClickWait) {
      clearTimeout(this.dblClickWait);
      delete this.dblClickWait;
    }
    this._modifiers(e);
    const _leftClick = Event.isLeftClick(e);
    this.status.button1 = false;
    this.status.button2 = false;
    const [x, y] = this.status.crsr;
    this._handleMouseMove(x, y);
    const {focused} = this._listeners;
    const _doubleClickable = this._listeners.byEvent.doubleClick;
    const _wantsToStopTheEvent = [];
    this._filterViewIdToValidView(focused, _viewId => {
      return _doubleClickable.includes(_viewId);
    }).filter(_ctrl => {
      return this.isFunction(_ctrl.doubleClick);
    }).forEach(_ctrl => {
      if (_ctrl.doubleClick(x, y, _leftClick)) {
        _wantsToStopTheEvent.push(_ctrl.viewId);
      }
    });
    if (_wantsToStopTheEvent.length !== 0) {
      Event.stop(e);
    }
  }

  // Handles mouseWheel events (any HID scroll event)
  mouseWheel(e) {
    if (!e) {
      e = window.event;
    }
    this._modifiers(e);
    let _delta;
    if (e.wheelDelta) {
      _delta = 0 - (e.wheelDelta / 120);
    }
    else if (e.detail) {
      _delta = 0 - (e.detail / 3);
    }
    if (BROWSER_TYPE.opera || BROWSER_TYPE.safari) {
      _delta = 0 - _delta;
    }
    const focused = this._listeners.focused;
    const _wantsToStopTheEvent = [];
    const _mouseWheelable = this._listeners.byEvent.mouseWheel;
    this._filterViewIdToValidView(focused, _viewId => {
      return _mouseWheelable.includes(_viewId);
    }).filter(_ctrl => {
      return this.isFunction(_ctrl.mouseWheel);
    }).forEach(_ctrl => {
      if (_ctrl.mouseWheel(_delta)) {
        _wantsToStopTheEvent.push(_ctrl.viewId);
      }
    });
    if (_wantsToStopTheEvent.length !== 0) {
      Event.stop(e);
    }
  }

  // Handles the contextMenu event
  contextMenu(e) {
    this._modifiers(e);
    // TODO: solve reliable handling of these:
    // this.status.button1 = false;
    // this.status.button2 = true;
    const focused = this._listeners.focused;
    const _wantsToStopTheEvent = [];
    const _contextMenuable = this._listeners.byEvent.contextMenu;
    this._filterViewIdToValidView(focused, _viewId => {
      return _contextMenuable.includes(_viewId);
    }).filter(_ctrl => {
      return this.isFunction(_ctrl.contextMenu);
    }).forEach(_ctrl => {
      if (_ctrl.contextMenu()) {
        _wantsToStopTheEvent.push(_ctrl.viewId);
      }
    });
    if (_wantsToStopTheEvent.length !== 0) {
      Event.stop(e);
    }
  }

  // Translates keyCodes to the normalized pseudo-ascii used by IE and WebKit browsers.
  // Opera and Mozilla browsers use different codes, so they'll need translations.
  translateKeyCodes(_keyCode) {
    let _transCode;
    // We use the WebKit browsers as the normalization base, because
    // there is no variance between in these. Returns the keyCode as-is for
    // browsers in this category.
    if (BROWSER_TYPE.safari) {
      return _keyCode;
    }
    // Opera has its own keyCodes, which are different from all others.
    else if (BROWSER_TYPE.opera) {
      _transCode = this._keyTrans.opera[_keyCode];
    }
    // The assumption is that the other browsers do what mozille does.
    else {
      _transCode = this._keyTrans.mozilla[_keyCode];
    }
    if (this.isNullOrUndefined(_transCode)) {
      // No translation needed:
      return _keyCode;
    }
    else {
      // Return translated:
      return _transCode;
    }
  }

  _detectCmdKey(_keyCode) {
    // On Opera, return true on any of the keycodes
    if (BROWSER_TYPE.opera) {
      return this._cmdKeys.includes(_keyCode);
    }
    // Any mac browser (except opera, above) uses left or right windows key
    // equivalent as the Command key.
    else if (BROWSER_TYPE.mac) {
      return _keyCode === 91 || _keyCode === 93;
    }
    // Other platforms use CTRL as the command key.
    return _keyCode === 17;
  }

  // Traverses down the parent hierarchy searching for a parent object
  // that responds true to _methodName. If _ctrl is undefined, use
  // a special default rule of auto-selecting the active control and
  // checking all of its siblings before traversing.
  defaultKey(_methodName, _ctrl, _testedIds) {
    if (_ctrl && this.isFunction([_methodName]) && _ctrl[_methodName]() === true) {
      return true;
    }
    if (!this._listeners.active || this._listeners.active.length === 0) {
      return null;
    }
    if (this.isNullOrUndefined(_ctrl)) {
      _ctrl = this._views[this._listeners.active[0]];
      if (this.isNullOrUndefined(_ctrl)) {
        return null;
      }
    }
    const _ctrlId = _ctrl.viewId;
    if (_testedIds.includes(_ctrlId)) {
      return null;
    }
    if (this.isFunction(_ctrl[_methodName]) && _ctrl[_methodName]() === true) {
      return true;
    }
    let _stop = null;
    _testedIds.push(_ctrlId);
    const _filteredViewIds = _ctrl.parent.views.filter(_viewId => {
      return !_testedIds.include(_viewId);
    });
    for (const _viewId of _ctrl.parent.views) {
      if (this._isValidView(_ctrl) && _ctrl.viewId !== _viewId) {
        _ctrl = this._views[_viewId];
        if (this._isValidView(_ctrl) && this.isFunction(_ctrl[_methodName])) {
          const _stopStatus = _ctrl[_methodName]();
          if ([true, false].includes(_stopStatus)) {
            if (!_stop) {
              _stop = _stopStatus;
            }
          }
        }
        if (_stop !== null) {
          return _stop; // true or false, once found (not null)
        }
      }
    }
    if (this._isValidView(_ctrl) &&
        _ctrl.parent &&
        this.defaultKey(_methodName, _ctrl.parent, _testedIds) === true
    ) {
      return true;
    }
    else {
      return null; // nothing found
    }
  }

  // Handles the keyDown event
  keyDown(e) {
    this._modifiers(e);
    const _keyCode = this.translateKeyCodes(e.keyCode);
    const _wantsToStopTheEvent = [];
    if (!this.status.cmdKeyDown && this._detectCmdKey(_keyCode)) {
      this.status.setCmdKey(true);
      _wantsToStopTheEvent.push(true);
    }
    const active = this._listeners.active;
    const _keyDowners = this._listeners.byEvent.keyDown;
    const _keyRepeaters = this._listeners.byEvent.keyRepeat;
    const _repeating = this._lastKeyDown === _keyCode && this.status.hasKeyDown(_keyCode);
    this.status.addKeyDown(_keyCode);
    const _filterMethod = _repeating ? _viewId => {
      return _keyRepeaters.includes(_viewId) && _keyDowners.includes(_viewId);
    } : _viewId => {
      return _keyDowners.includes(_viewId);
    };
    this._filterViewIdToValidView(active, _filterMethod).filter(_ctrl => {
      return this.isFunction(_ctrl.keyDown);
    }).some(_ctrl => {
      if (_ctrl.keyDown(_keyCode)) {
        _wantsToStopTheEvent.push(_ctrl.viewId);
        // no other keyDown events delegated after first responder returns true
        return true;
      }
      else {
        return false;
      }
    });
    // Some keys are special (esc and return) and they have their own
    // special events: defaultKey and escKey, which aren't limited
    // to instances of HControl, but any parent object will work.
    if (_wantsToStopTheEvent.length === 0 && !_repeating && this._defaultKeyActions[_keyCode.toString()]) {
      const _defaultKeyMethod = this._defaultKeyActions[_keyCode.toString()];
      if (this.defaultKey(_defaultKeyMethod, null, [])) {
        _wantsToStopTheEvent.push(true);
      }
    }
    this._lastKeyDown = _keyCode;
    if (_wantsToStopTheEvent.length !== 0) {
      Event.stop(e);
    }
  }

  keyUp(e) {
    this._modifiers(e);
    const _keyCode = this.translateKeyCodes(e.keyCode);
    const _wantsToStopTheEvent = [];
    if (this.status.cmdKeyDown && this._detectCmdKey(_keyCode)) {
      this.status.setCmdKey(false);
      _wantsToStopTheEvent.push(true);
    }
    const active = this._listeners.active;
    const enabled = this._listeners.enabled;
    const _keyUppers = this._listeners.byEvent.keyUp;
    // delegation of textEnter events is via iterating the
    // byEvent array first, because it's shorter than the
    // list of enabled views
    const _textEnterers = this._listeners.byEvent.textEnter;
    this._filterViewIdToValidView(_textEnterers, _viewId => {
      return enabled.include(_viewId);
    }).filter(_ctrl => {
      return this.isFunction(_ctrl.textEnter);
    }).forEach(_ctrl => {
      if (_ctrl.textEnter(_keyCode)) {
        _wantsToStopTheEvent.push(_ctrl.viewId);
      }
    });
    // delegate keyUp event to everything that has this keyCode set down
    if (this.status.hasKeyDown(_keyCode)) {
      this.status.delKeyDown(_keyCode);
      this._filterViewIdToValidView(active, _viewId => {
        return _keyUppers.include(_viewId);
      }).filter(_ctrl => {
        return this.isFunction(_ctrl.keyUp);
      }).some(_ctrl => {
        if (_ctrl.keyUp(_keyCode)) {
          _wantsToStopTheEvent.push(_ctrl.viewId);
          // no other keyUp events delegated after first responder returns true
          return true;
        }
        else {
          return false;
        }
      });
    }
    if (_wantsToStopTheEvent.length !== 0) {
      Event.stop(e);
    }
  }

  die() {
    this.stop();
    super.die();
  }
}

module.exports = new EventManagerApp();

});

__exports('comm/transporter', function() {

const ELEM = require('core/elem');

const HRect = require('util/geom/rect');
const HSystem = require('foundation/system');
const HApplication = require('foundation/application');
const HView = require('foundation/view');

const COMM = require('comm');
const {Values, Session, Queue} = COMM;

class ServerInterruptView extends HView {

  constructor(rect, parent) {
    super(rect, parent);
    this._errorIndex = 0;
    this._retryIndex = 0;
    this._lastError = this.msNow();
  }

  _setCustomMessage(_text) {
    ELEM.setHTML(this._messageDiv, _text);
  }

  _setCustomColor(_color) {
    this.setStyle('background-color', _color);
  }

  _setFailedResp(_resp) {
    const _respType = this.typeChr(_resp);
    if (_respType !== '-' && _respType !== 's') {
      this._failedResp = _resp;
    }
    this._errorIndex++;
    return this;
  }

  _retry() {
    this._retryIndex++;
    const {url, options} = this._failedResp;
    COMM.request(url, options);
  }

  idle() {
    const _currentDate = this.msNow();
    this.bringToFront();
    if (
      this._errorIndex > 0 &&
      this._retryIndex !== this._errorIndex &&
      this._lastError + 2000 < _currentDate &&
      this._failedResp
    ) {
      this._lastError = _currentDate;
      this._retry();
    }
    super.idle();
  }

  die() {
    HSystem.reniceApp(this.app.appId, this._origPriority);
    this.base();
    this.app.sync();
  }

  drawSubviews() {
    this.setStyles({
      paddingLeft: '8px',
      backgroundColor: '#600',
      textAlign: 'center',
      color: '#fff',
      fontSize: '16px',
      opacity: 0.85
    });
    this._messageDiv = ELEM.make(this.elemId);
    ELEM.setHTML(this._messageDiv, this.app.serverLostMessage);
    this._origPriority = HSystem.appPriorities[this.appId];
    if (HSystem.appPriorities[this.appId] < 10) {
      HSystem.reniceApp(this.appId, 10);
    }
    class AnimView extends HView {
      constructor(rect, parent) {
        super(rect, parent);
        this._animIndex = 0;
        this.base(rect, parent);
      }
      _anim() {
        let _targetRect;
        const _width = ELEM.getSize(this.parent.elemId)[0];
        this._animIndex++;
        if (this._animIndex % 2 === 0) {
          _targetRect = HRect.new(0, 0, 80, 20);
        }
        else {
          _targetRect = HRect.new(_width - 80, 0, _width, 20);
        }
        this.animateTo(_targetRect, 2000);
      }
      onAnimationEnd() {
        if (this.drawn) {
          this._anim();
        }
      }
    }
    this._anim = AnimView.new(
      [0, 0, 80, 20], this
    ).setStyles({
      backgroundColor: '#fff',
      opacity: 0.8
    })._anim();
  }
}

/** = Description
  * Implements the client-server interface.
  *
  * COMM.Transporter manages the client side of the server-client-server
  * data synchronization and the server-client command channel.
  *
  * It uses COMM.Session for session key handling, COMM.Queue for command
  * queuing and COMM.Values for data value management.
  *
  * COMM.Transporter operates in a fully automatic mode and starts when
  * the document has been loaded.
  *
  * Don't call any of its methods from your code.
**/
class Transporter extends HApplication {

  /* Sets up the default settings upon construction.
  **/
  constructor() {
    super(1, 'Transporter');
    this.serverLostMessage = 'Server Connection Lost: Reconnecting...';
    this.url = false;
    this.busy = false;
    this.stop = true;
    this._serverInterruptView = false;
    this._clientEvalError = false;
    this._busyFlushTimeout = false;
  }

  /* Tries to (re)connect to the server as often as possible,
  * mandated essentially by the priority of its
  * HApplication instance.
  **/
  idle() {
    this.sync();
  }

  /* (Re)sets the priority of itself, effects how
  * frequently +onIdle+ is called.
  * Usually set by the server.
  **/
  poll(_pri) {
    HSystem.reniceApp(this.appId, _pri);
  }

  parseResponseArray(_responseText) {
    return JSON.parse(_responseText);
  }

  setValues(_values) {
    if (!_values instanceof Object) {
      console.error('Invalid values block: ', _values);
    }
    else {
      if (this.typeChr(_values.new) === 'a') {
        _values.new.forEach(([_valueId, _valueData, _valueType]) => {
          if (this.typeChr(_valueType) === '-') {
            _valueType = 0;
          }
          Values.create(_valueId, _valueData, _valueType);
        });
      }
      if (this.typeChr(_values.set) === 'a') {
        _values.set.forEach(([_valueId, _valueData]) => {
          Values.s(_valueId, _valueData);
        });
      }
      if (this.typeChr(_values.del) === 'a') {
        _values.del.forEach(_valueId => {
          Values.del(_valueId);
        });
      }
    }
  }

  runScripts(_scripts, _sesKey) {
    Queue.addScript(_sesKey, '(function(Q,T){' + _scripts.map(_script => {
      return `Q.push((function(){${_script}}));`;
    }).join('') +
    'Q.push((function(){T.flushBusy();}));' +
    `Q.push((function(){Q.delScript('${_sesKey}')}));` +
    'Q.flush();})(require("comm/queue"),require("comm/transport"));');
  }

  /* = Description
  * Handles synchronization responses.
  *
  * Upon a successful request, this method is called by
  * the onSuccess event of the XMLHttpRequest.
  *
  * It splits up the response string and passes the response
  * messages to COMM.Queue for execution.
  *
  * Parameters:
  * +resp+:: The response object.
  *
  **/
  success(resp) {
    if (!resp.X.responseText) {
      this.failure(resp);
    }
    else {
      const [_sesKey, _values, _scripts] = this.parseResponseArray(resp.X.responseText);
      if (_sesKey === '') {
        console.error('Invalid session key, error message should follow...');
      }
      else if (_sesKey === Session.old_key) {
        // TODO: (which?) iPad sometimes sends same request 3 times. Skip repsonder if it has same ses key than previous one.
        console.warn('Session key is the same as the previous one; skipping response...');
      }
      else {
        Session.newKey(_sesKey);
        this.setValues(_values);
        this.runScripts(_scripts, _sesKey);
      }
      if (this._serverInterruptView && _sesKey !== '') {
        this._serverInterruptView.die();
        this._serverInterruptView = false;
      }
    }
  }

  /* Sets the +busy+ flag to false and resynchronizes immediately,
  * if COMM.Values contain any unsynchronized values.
  **/
  flushBusy() {
    this.busy = false;
    if (Values.tosync.length !== 0) {
      this.sync();
    }
  }

  failMessage(_title, _message) {
    console.error('failMessage title:', _title, ', message:', _message);
    this.stop = true;
    Queue.push(() => {
      ReloadApp.new(_title, _message);
    });
  }

  setInterruptAnim(_customMessage, _customColor) {
    const _msgType = this.typeChr(_customMessage);
    if (!this._serverInterruptView) {
      this._serverInterruptView = ServerInterruptView.new([0, 0, 200, 20, 0, null], this);
      if (_msgType !== 's') {
        this._serverInterruptView._setFailedResp(_customMessage);
      }
    }
    if (_msgType === 's') {
      this._serverInterruptView._setCustomMessage(_customMessage);
    }
    if (!this.stop) {
      this._serverInterruptView._setFailedResp();
    }
    if (_customColor) {
      this._serverInterruptView._setCustomColor(_customColor);
    }
  }

  /* Called by the XMLHttpRequest, when there was a failure in communication.
  **/
  failure(_resp) {
    // server didn't respond, likely network issue.. retry.
    if (_resp.X.status === 0) {
      console.warn('Server Connection Lost: Reconnecting...');
    }
    else {
      console.error('Transporter was unable to complete the synchronization request.');
    }
    Queue.push(() => {
      this.busy = false;
    });
    window.location.reload(true);
  }

  /* Starts requests.
  **/
  sync() {
    if (!this.stop && !this.busy) {
      this.busy = true;
      const _now = this.msNow();
      if (window.sesWatcher && window.sesWatcher.sesTimeoutValue) {
        // Sets the value of the session watcher to the current time.
        // It could cause an unnecessary re-sync poll immediately after this sync otherwise.
        sesWatcher.sesTimeoutValue.set(_now);
      }
      const _body = COMM.Values.sync();
      COMM.request(
        this.url, {
          _this: this,
          contentType: 'application/json',
          onSuccess: COMM.Transporter.success,
          onFailure: COMM.Transporter.failure,
          method: 'POST',
          async: true,
          body: _body
        }
      );
    }
  }
}

module.exports = new Transporter();

});

__exports('comm/values', function() {

const UtilMethods = require('util/util_methods');
const HValue = require('foundation/value');
const HPushValue = require('foundation/value/pushvalue');
const HPullValue = require('foundation/value/pullvalue');
const HDummyValue = require('foundation/value/dummyvalue');
const Transporter = require('comm/transporter');
const Session = require('comm/session');

/** = Description
 ** Manages data value synchronization.
 **
 ** Keeps track of all +HValue+ instances present.
**/
class ValueManager extends UtilMethods {

/** No constructor, singleton class.
  **/
  constructor() {
    super();
    /** An +Object+ containing all values by key.
      **/
    this.values = {};
    /** A list of value keys whose value has changed. To be synchronized asap.
      **/
    this.tosync = [];
  }

  /* = Description
  * Creates a new +HValue+ instance. Its main purpose is to act as the main
  * client-side value creation interface for the server representation of
  * +HValue+.
  *
  * = Parameters
  * +_id+::     The unique id of the +HValue+ instance (set by the server)
  * +_data::    The initial data of the +HValue+ instance (set by the server)
  * +_type::    The value type: 0=HValue, 1=HPushValue, 2=HPullValue
  *
  **/
  create(_id, _data, _type) {
    if (!_type) {
      HValue.new(_id, _data);
    }
    else if (_type === 1) {
      HPushValue.new(_id, _data);
    }
    else if (_type === 2) {
      HPullValue.new(_id, _data);
    }
    else {
      console.warn(`Unknown value type: ${_type}`);
    }
  }

  /* = Description
  * Binds a +HValue+ instance created externally to +self.values+.
  * Called from +HValue+ upon construction.
  *
  * = Parameters
  * +_id+::     The unique id of the +HValue+ instance (set by the server)
  * +_value+::  The +HValue+ instance itself.
  *
  **/
  add(_id, _value) {
    this.values[_id] = _value;
  }

  /* = Description
  * Sets the data of the +HValue+ instance by +_Id+.
  *
  * = Parameters
  * +_id+::     The unique id of the +HValue+ instance (set by the server)
  * +_data+::   The new data, any Object type supported by JSON.
  *
  **/
  set(_id, _data) {
    this.values[_id].set(_data);
  }

  /* = Description
  * Sets and decodes the +_data+. Main value setter interface
  * for the server representation of +HValue+.
  *
  * = Parameters
  * +_id+::     The unique id of the +HValue+ instance (set by the server)
  * +_data+::   The new data from the server, to be decoded.
  *
  **/
  s(_id, _data) {
    _data = this.decode(_data);
    this.values[_id].s(_data);
  }

  /* = Description
  * Deletes a +HValue+ instance by +_id+.
  *
  * = Parameters
  * +_id+::     The unique id of the +HValue+ instance (set by the server)
  *
  **/
  del(_id) {
    const _value = this.values[_id];
    _value.views.forEach(_view => {
      _view.valueObj = HDummyValue.new(0, _value.value);
    });
    _value.views = [];
    delete this.values[_id];
  }

  /* = Description
  * Marks the +HValue+ instance as changed and tries to send it
  * immediately, unless COMM.Transporter has an ongoing transfer.
  * Usually called by the +HValue+ instance internally.
  *
  * = Parameters
  * +_value+::     The +HValue+ instanche that changed.
  *
  **/
  changed(_value) {
    if (!this.tosync.includes(_value.id)) {
      this.tosync.push(_value.id);
      if (!Transporter.busy) {
        Transporter.sync();
      }
    }
  }

  /* = Description
  * Use this method to detect the type of the object given.
  *
  * Returns the type of the object given as a character code. Returns false,
  * if unknown or unsupported objcet type.
  *
  * = Returns
  * _One of the following:_
  * - 'a': Array
  * - 'h': Hash (Generic Object)
  * - 'd': Date
  * - 'b': Boolean (true/false)
  * - 'n': Number (integers and floats)
  * - 's': String
  * - '~': Null
  * - '-': Undefined
  *
  **/
  type(_obj) {
    return this.typeChr(_obj);
  }

  /* = Description
  * Returns an URI-encoded string representation of all the changed values to
  * synchronize to the server.
  *
  * = Returns
  * An encoded string representation of values to synchronize.
  **/
  sync() {
    const _response = [Session.ses_key, {}, []];
    const _error = Transporter._clientEvalError;

    if (_error) {
      _response[2].push({'err_msg': _error});
    }

    // new implementation, symmetric with the server response format
    if (this.tosync.length > 0) {
      _response[1].set = [];
      const _syncValues = _response[1].set;
      const _values = this.values;
      const _tosync = this.tosync;
      let i = _tosync.length;
      while (i--) {
        const _id = _tosync.shift();
        const _value = _values[_id].toSync();
        _syncValues.push([_id, _value]);
      }
    }
    return this.encodeObject(_response);
  }

  encode(_obj) {
    return this.encodeObject(_obj);
  }

  decode(_obj) {
    return this.decodeObject(_obj);
  }

  clone(_obj) {
    return this.cloneObject(_obj);
  }

}

module.exports = new ValueManager();

});

__exports('foundation/json_renderer', function() {

const UtilMethods = require('util/util_methods');

const HApplication = require('foundation/application');
const HView = require('foundation/view');
const HValue = require('foundation/value');

/* Constructs nodes from JSON structures as GUI
 * tree structures. Lowers the learning curve of GUI
 * development, because Javascript knowledge is not
 * required to define user interfaces.
 * The main purpose is to ease the development of
 * user interfaces by defining them as data on the
 * server, converting the data to JSON GUI trees and
 * letting the client handle the rest. The end result
 * is the same as defining the structures in
 * JavaScript code.
 *
 * This class is still in development, so expect more
 * features and documentation as it matures.
*/
class JSONRenderer extends UtilMethods {

  get version() {
    return 1.1;
  }

  _validateTypeAndVersion(_data) {
    return _data.type === 'GUITree' && this.version >= _data.version;
  }

  /* = Description
  * Renders JSON structured data, see some of the demos for usage examples.
  *
  * = Parameters:
  * +_data+:   The data structure used for building.
  * +_parent+: The parent view (or app) (Optional)
  **/
  constructor(_data, _parent) {
    super();
    if (this._validateTypeAndVersion(_data)) {
      this.data = _data;
      this.parent = _parent;
      this.byId = {};
      this.byName = {};
      this.render();
      if (this.view.hasAncestor(HApplication)) {
        this.view.getViewById = _id => {
          return this.getViewById(_id);
        };
        this.view.getViewsByName = _id => {
          return this.getViewsByName(_id);
        };
      }
      else if (this.view.hasAncestor(HView)) {
        this.view.app.getViewById = _id => {
          return this.getViewById(_id);
        };
        this.view.app.getViewsByName = _id => {
          return this.getViewsByName(_id);
        };
      }
    }
    else {
      throw new Error(`JSONRenderer: Only GUITree version ${this.version} or older data can be handled.`);
    }
  }

  getViewById(_id) {
    if (this.typeChr(this.byId[_id]) !== '-') {
      return this.byId[_id];
    }
    else {
      console.error(`JSONRenderer; no such view Id: ${_id}`);
      return null;
    }
  }

  addViewId(_id, _view) {
    if (this.typeChr(this.byId[_id]) !== '-') {
      console.warn(`JSONRenderer; already has id: ${_id} (replacing)`);
    }
    this.byId[_id] = _view;
  }

  getViewsByName(_name) {
    if (this.typeChr(this.byName[_name]) !== '-') {
      return this.byName[_name];
    }
    console.log(`JSONRenderer; no views named: ${_name}`);
    return [];
  }

  addViewName(_name, _view) {
    if (this.typeChr(this.byName[_name]) === '-') {
      this.byName[_name] = [];
    }
    this.byName[_name].push(_view);
  }

  render() {
    this.scopes = [window];
    this.scopeDepth = 0;
    this.view = this.renderNode(this.data, this.parent);
  }

  die() {
    this.view.die();
  }

  get _reservedScopeKeys() {
    return ['class', 'extend', 'implement'];
  }

  defineInScope(_definition) {
    const _defType = this.typeChr(_definition);
    if (_defType !== 'h') {
      console.error(`JSONRenderer; definition must be an Object, got: "${_defType}": `, _definition);
    }
    else {
      const _extension = {};
      const _reserved = this._reservedScopeKeys;
      const _className = _definition[_reserved[0]];
      const _extendName = _definition[_reserved[1]];
      const _implementName = _definition[_reserved[2]];
      const _extend = _extendName ? this.findInScope(_extendName) : false;
      const _implement = _implementName ? this.findInScope(_implementName) : false;
      const _scope = this.scopes[this.scopeDepth];
      if (this.typeChr(_className) === '-') {
        console.error(`JSONRenderer; class name "${_className}" missing in definition scope.`);
      }
      else {
        if (!_extend) {
          _extend = class {};
        }
        Object.entries(_definition).forEach(([_key, _value]) => {
          if (!_reserved.includes(_key)) {
            if (this.typeChr(_value) === 's') {
              _value = this.extEval(_value);
            }
            _extension[_key] = _value;
          }
        });
        _scope[_className] = _extend.extend(_extension);
        if (_implement) {
          this.updateObject(_implement, _scope[_className]);
        }
      }
    }
  }

  undefineInScope() {}

  findInScope(_className) {
    if (this.typeChr(_className) === '-') {
      return false;
    }
    else {
      if (_className.includes('.')) {
        const _splitClass = _className.split('.');
        let j = 1;
        let _classPart = _splitClass[0];
        let _classFull = this.findInScope(_classPart);
        if (!_classFull) {
          return false;
        }
        for (; j < _splitClass.length; j++) {
          _classPart = _splitClass[j];
          _classFull = _classFull[_classPart];
          if (!_classFull) {
            return false;
          }
        }
        return _classFull;
      }
      let i = this.scopes.length - 1;
      let _scope;
      for (; i > -1; i--) {
        _scope = this.scopes[i];
        if (this.typeChr(_scope[_className]) !== '-') {
          return _scope[_className];
        }
      }
      return false;
    }
  }

  extEval(_block) {
    if (_block.indexOf('function(') === 0) {
      console.warning('JSONRenderer.extEval; evaluation of functions is deprecated!');
      eval(`_block = ${_block}`);
    }
    return _block;
  }

  initStraight(_class, _args) {
    if (this.typeChr(_args) === 'a') {
      return new _class(..._args);
    }
    else {
      return new _class(_args);
    }
  }

  _handleCall(_instance, _call) {
    if (this.typeChr(_call) === 'h') {
      Object.entries(_call).forEach(([_methodName, _args]) => {
        const _method = _instance[_methodName];
        if (this.typeChr(_method) === '>') {
          _method.apply(_instance, _args);
        }
        else {
          console.error(`JSONRenderer handleCall error; method '${_methodName}' is not a function: `, _method);
        }
      });
    }
    else {
      console.error('JSONRenderer handleCall error, unable to handle call format: ', _call);
    }
  }

  get _reservedNodeKeys() {
    return [
      'type', 'args', 'version', 'class', 'rect',
      'bind', 'extend', 'options', 'subviews', 'define'
    ];
  }

  get _autoOptionItems() {
    return [
      'label', 'style', 'visible', 'theme', 'html',
      'value', 'enabled', 'events', 'active', 'minValue',
      'maxValue'
    ];
  }

  _parseRenderNode(_dataNode) {
    const _retVal = (() => {
      // The class name is found and given, just use it:
      if (_dataNode.class && this.typeChr(_dataNode.class) === 's') {
        const _className = _dataNode.class;
        return {
          _className,
          _class: this.findInScope(_className),
          _origNode: null,
          _dataNode,
          _straightParams: false
        };
      }
      // Find the actual dataNode:
      else {
        const _reserved = this._reservedNodeKeys;
        for (const _nodeKey in _dataNode) {
          // Use the first match:
          if (!_reserved.includes(_nodeKey)) {
            const _className = _nodeKey;
            const _class = this.findInScope(_className);
            if (_class) {
              return {
                _className,
                _class,
                _origNode: _dataNode,
                _dataNode: _dataNode[_nodeKey],
                _straightParams: this.typeChr(_dataNode[_nodeKey]) === 'a'
              };
            }
          }
        }
        return {
          _dataNode
        };
      }
    })();
    if (_retVal._dataNode) {
      if (this.typeChr(_retVal._dataNode.id) === 's') {
        _retVal._id = _retVal._dataNode.id;
      }
      if (this.typeChr(_retVal._dataNode.name) === 's') {
        _retVal._name = _retVal._dataNode.name;
      }
    }
    return _retVal;
  }

  _guessClassConstructorType(_class) {
    if (this.typeChr(_class.hasAncestor) !== '-') {
      if (_class.hasAncestor(HApplication)) {
        return 'HApplication';
      }
      else if (_class.hasAncestor(HView)) {
        return 'HView';
      }
      else {
        console.warn('JSONRenderer._guessClassConstructorType warning; guessing this class is a function:', _class);
        return 'function';
      }
    }
    else {
      return 'function';
    }
  }

  _initStraightInstance({_straightParams, _class, _dataNode, _origNode}) {
    if (_straightParams) {
      return this.initStraight(_class, _dataNode);
    }
    else if (this.typeChr(_dataNode.args) !== '-') {
      return this.initStraight(_class, _dataNode.args);
    }
    else if (_origNode && this.typeChr(_origNode.args) !== '-') {
      return this.initStraight(_class, _origNode.args);
    }
    else {
      return null;
    }
  }

  _findRectInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _rectType = this.typeChr(_node.rect);
      const _hasRect = ['a', 's', 'h'].includes(_rectType);
      if (_hasRect) {
        const _rect = _node.rect;
        // TODO: additional validation
        if (_rectType === 'h') {
          return [_rect.left, _rect.top, _rect.width, _rect.height, _rect.right, _rect.bottom];
        }
        else {
          return _rect;
        }
      }
    }
    return null;
  }

  _findSubviewsInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _subviewType = this.typeChr(_node.subviews);
      if (_subviewType !== '-') {
        // TODO: additional validation
        return _node.subviews;
      }
    }
    return null;
  }

  _findOptionsInDataNodes(_dataNodes) {
    let _hasOptions = false;
    const _options = (() => {
      for (const _node of _dataNodes) {
        const _optionsType = this.typeChr(_node.options);
        if (_optionsType !== '-') {
          // TODO: additional validation
          _hasOptions = true;
          return _node.options;
        }
      }
      return {};
    })();
    _dataNodes.some(_node => {
      return this
        ._autoOptionItems
        .map(_optName => {
          const _optValue = _node[_optName];
          const _optValueType = this.typeChr(_optValue);
          if (_optValueType !== '-') {
            _hasOptions = true;
            _options[_optName] = _optValue;
            return _optName;
          }
          else {
            return null;
          }
        })
        .some(_test => {
          return !!_test;
        });
    });
    if (_hasOptions) {
      return _options;
    }
    else {
      return null;
    }
  }

  _findExtensionsInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _extendType = this.typeChr(_node.extend);
      if (_extendType === 'h') {
        const _extBlock = {};
        Object.entries(_node.extend).forEach(([_name, _block]) => {
          if (this.typeChr(_block) === 's') {
            _block = this.extEval(_block);
          }
          _extBlock[_name] = _block;
        });
        return _extBlock;
      }
      else if (_extendType !== '-') {
        console.error(
          `JSONRenderer error; invalid extension block type: '${_extendType
          }; should be Object, extension: `, _node.extend);
        return null;
      }
    }
    return null;
  }

  _findValueBindingInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _bindType = this.typeChr(_node.bind);
      if (_bindType !== '-') {
        let _bind = _node.bind;
        if (_bindType === 's' || _bindType === 'n') {
          _bind = this.getValueById(_bind);
        }
        if (this.typeChr(_bind.hasAncestor) === '>' && _bind.hasAncestor(HValue)) {
          return _bind;
        }
        else {
          console.error(
            'JSONRenderer _findValueBindingInDataNodes error; invalid bind:', _bind);
          return null;
        }
      }
    }
    return null;
  }

  _findFunctionCallInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _callType = this.typeChr(_node.call);
      if (_callType !== '-') {
        // TODO: additional validation
        return _node.call;
      }
    }
    return null;
  }

  _findDefinitionsInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _defineType = this.typeChr(_node.define);
      if (_defineType === 'a') {
        return _node.define;
      }
      else if (!['~', '-'].includes(_defineType)) {
        console.warn(
          `JSONRenderer warning; invalid define type: '${_defineType
          }'; should be Array, define: `, _node.define);
      }
    }
    return null;
  }

  renderNode(_rawDataNode, _parent) {
    const _parsedNode = this._parseRenderNode(_rawDataNode);
    const {
      _className, _origNode, _dataNode, _straightParams,
      _id, _name
    } = _parsedNode;
    if (_origNode || _dataNode) {
      let {_class} = _parsedNode;
      const _classConstructorType = this._guessClassConstructorType(_class);
      let _instance = this._initStraightInstance({_straightParams, _class, _dataNode, _origNode});
      if (_instance) {
        _id && this.addViewId(_id, _instance);
        _name && this.addViewName(_name, _instance);
        return _instance;
      }
      else {
        const _rect = this._findRectInDataNodes([_dataNode, _origNode]);
        if (_classConstructorType !== 'HView' && _rect) {
          console.warn(
            `JSONRenderer.renderNode warning; className: '${_className
            }' is not a HView, but is supplied with rect: `, _rect);
        }
        else if (_classConstructorType === 'HView' && !_rect) {
          console.warn(
            `JSONRenderer.renderNode warning; className: '${_className
            }' is a HView, but is not supplied with rect: `, _rect);
        }
        const _subviews = this._findSubviewsInDataNodes([_dataNode, _origNode]);
        const _options = this._findOptionsInDataNodes([_dataNode, _origNode]);
        const _extension = this._findExtensionsInDataNodes([_dataNode, _origNode]);
        const _valueBinding = this._findValueBindingInDataNodes([_dataNode, _origNode]);
        const _functionCall = this._findFunctionCallInDataNodes([_dataNode, _origNode]);
        const _definitions = this._findDefinitionsInDataNodes([_dataNode, _origNode]);
        this.scopeDepth += 1;
        this.scopes.push({});
        if (_definitions) {
          _definitions.forEach(_definition => {
            this.defineInScope(_definition);
          });
        }
        if (_class) {
          if (_extension) {
            _class = _class.extend(_extension);
          }
          if (_options && _valueBinding) {
            _options.valueObj = _valueBinding;
          }
          else if (_options && !_valueBinding && this.typeChr(_options.valueObjId) in ['s', 'n']) {
            const _valueIdBinding = this.getValueById(_options.valueObjId);
            if (_valueIdBinding.hasAncestor && _valueIdBinding.hasAncestor(HValue)) {
              _options.valueObj = _valueIdBinding;
            }
            else {
              console.error('JSONRenderer.renderNode error; invalid valueObjId:', _options.valueObjId);
            }
          }
          if (_classConstructorType === 'HApplication') {
            if (_options) {
              _instance = _class.new(_options);
            }
            else {
              _instance = _class.new();
            }
          }
          else if (_classConstructorType === 'HView') {
            _instance = _class.new(_rect, _parent, _options);
          }
          else if (_rect && _options) {
            _instance = _class.new(_rect, _parent, _options);
          }
          else if (_rect && !_options) {
            _instance = _class.new(_rect, _parent);
          }
          else if (_options) {
            _instance = _class.new(_parent, _options);
          }
          else {
            _instance = _class.new(_parent);
          }
          if (_instance && !_options && _valueBinding) {
            _valueBinding.bind(_instance);
          }
        }
        else if (!_subviews) {
          // NOT _class:
          console.error(
            `JSONRenderer.renderNode error; not a class: '${_className
            }', and has no subviews; node: `, _rawDataNode);
        }
        if (!_instance) {
          _instance = _parent;
        }
        _id && this.addViewId(_id, _instance);
        _name && this.addViewName(_name, _instance);
        _functionCall && this._handleCall(_instance, _functionCall);

        // Iterates recursively through all subviews, if specified.
        if (_subviews) {
          _subviews.forEach(_subview => {
            this.renderNode(_subview, _instance);
          });
        }
        this.scopes.pop();
        this.scopeDepth -= 1;
        return _instance;
      }
    }
    else {
      console.error('JSONRenderer.renderNode error; invalid node:', _rawDataNode);
      return null;
    }
  }
}

module.exports = JSONRenderer;

});

__exports('comm', function() {

const {LOAD} = require('core/elem');

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

});

__exports('foundation/valueview', function() {
const HDummyValue = require('foundation/value/dummyvalue');
const HValueResponder = require('foundation/valueresponder');
const HView = require('foundation/view');

class HValueView extends HView.mixin(HValueResponder, {
  refreshOnValueChange: true
}) {
  constructor(_rect, _parent, _options) {
    if (this.isNullOrUndefined(_options)) {
      _options = {};
    }
    _options = this.viewDefaults.extend(_options).new(this);
    if (this.isntNullOrUndefined(_options.valueObj)) {
      _options.valueObj.bind(this);
    }
    if (_options.bind) {
      if (this.isString(_options.bind)) {
        const _valueId = _options.bind;
        const _valueObj = this.getValueById(_valueId);
        if (_valueObj) {
          _valueObj.bind(this);
        }
      }
      else {
        _options.bind.bind(this);
      }
    }

    if (this.isNullOrUndefined(this.valueObj)) {
      this.valueObj = new HDummyValue();
    }

    if (this.isNullOrUndefined(this.value) && this.isntNullOrUndefined(_options.value)) {
      this.setValue(_options.value);
    }
    super(_rect, _parent, _options);
  }

  refresh() {
    if (this.drawn && this.refreshOnValueChange) {
      this.refreshValue();
    }
    return this;
  }

  refreshValue() {
    return true;
  }
}

module.exports = HValueView;

});

__exports('foundation/eventresponder', function() {

const HClass = require('core/class');
const HSystem = require('foundation/system');
const EVENT = require('foundation/eventmanager');

/** = Description
 ** Automatic event responder. Defines what events HControl listens to
 ** and actions to be taken.
 **
 ** = Event handler methods
 ** Pre-defined event handler methods, extend these in your subclass.
 **
 ** +focus+::               Called when the component gets focus
 ** +blur+::                Called when the component loses focus
 ** +mouseDown+::           Called when the mouse button is pushed down
 ** +mouseUp+::             Called when the mouse button is released
 ** +mouseWheel+::          Called when the mouse wheel is used
 ** +startDrag+::           Called when the mouse button
 **                         is pressed (and item is draggable).
 ** +endDrag+::             Called when the mouse button
 **                         is released (and item is draggable).
 ** +drag+::                Called when the mouse is moved and mouse button
 **                         is down (and item is draggable).
 ** +drop+::                Called when a draggable item is released
 **                         on the droppable.
 ** +startHover+::          Called when a draggable item is moved
 **                         over the droppable.
 ** +hover+::               Called while a dragged item is moved between
 **                         startHover and endHover.
 ** +endHover+::            Called when a draggable item is moved out
 **                         of the droppable.
 ** +keyDown+::             Called when the user presses a key, and
 **                         the control is active.
 ** +keyUp+::               Called when the user releases a key, and
 **                         the control is active.
 ** +textEnter+::           Called when the user releases a key regardless
 **                         if the control is active or not.
 ** +gainedActiveStatus+::  Called when the component gets activated.
 ** +lostActiveStatus+::    Called when the component gets deactivated.
**/
const _EventResponderBase = HClass.mixin({
/** Default event listeners.
  **/
  defaultEvents: {},
  // state of item that is clicked an in focus:
  selected: false,
});

class HEventResponder extends _EventResponderBase {

/** = Description
  * The event responder interface for +HControl+.
  * Registers the events defined by boolean properties of
  * the events object to the control instance. The event manager
  * handles the event mapping and abstraction itself.
  * NOTE startDrag vs mouseDown and endDrag vs mouseUp events
  * conflict, if both are set simultaneously.
  *
  * = Parameters
  * +_events+::  A +{ event: state }+ Object structure, sets events based on the
  *              keys and the flag. All states are Booleans (true or false).
  *              A true state means the event listening for the event is
  *              enabled and a false state means the event listening is disabled.
  *              See the Event Types below:
  *
  * == Event States
  * Event State::    Description
  * +mouseMove+::   The global +mouseMove+ event state. The component receives
  *                 this event regardless if it's focused or not. The event
  *                 responder method for it is +mouseMove+ and it receives the
  *                 absolute x and y coordinates of the mouse pointer when the
  *                 mouse cursor position changes. Can also be toggled
  *                 separately by using the +setMouseMove+ method.
  * +textEnter+::   The global +textEnter+ event state. The component receives
  *                 this event regardless if it's focused or not. The event
  *                 responder method for it is +textEnter+ and it receives a
  *                 every time a key on the keyboard is pressed. Can also
  *                 be toggled separately by using the +setTextEnter+ method.
  * +click+::       The local +click+ event state. The component receives
  *                 this event only if it's focused. The event responder
  *                 method for it is +click+ and it receives the absolute x
  *                 and y coordinates of the mouse pointer as well as which
  *                 mouse button was used to trigger the event. Can also be
  *                 toggled separately by using the +setClickable+ method.
  * +mouseDown+::   The local +mouseDown+ event state. The component receives
  *                 this event only if it's focused. The event responder
  *                 method for it is +mouseDown+ and it receives the absolute x
  *                 and y coordinates of the mouse pointer as well as which
  *                 mouse button was used to trigger the event. Can also be
  *                 toggled separately by using the +setMouseDown+ method.
  * +mouseUp+::     The local +mouseUp+ event state. The component receives
  *                 this event only if it's focused. The event responder
  *                 method for it is +mouseUp+ and it receives the absolute x
  *                 and y coordinates of the mouse pointer as well as which
  *                 mouse button was used to trigger the event. Can also be
  *                 toggled separately by using the +setMouseUp+ method.
  * +mouseWheel+::  The local +mouseWheel+ event state. The component receives
  *                 this event only if it's focused. The event responder
  *                 method for it is +mouseWheel+ and it receives the delta of
  *                 the amount of the mouse scroll wheel was rolled: a floating
  *                 point number, larger or smaller than 0, depending on the
  *                 direction the scroll wheel was rolled. Can also be
  *                 toggled separately by using the +setMouseWheel+ method.
  * +draggable+::   The local +draggable+ event states. The component receives
  *                 these events only if it's focused. The event responders
  *                 methods are +startDrag+, +drag+ and +endDrag+. The events
  *                 receive the mouse cursor coordinates.
  *                 Can also be toggled separately by using the +setDraggable+
  *                 method.
  * +droppable+::   The local +droppable+ event states. The component receives
  *                 this event only if another component is dragged (hovered)
  *                 or dropped with the area of this component as the target.
  *                 The event responders method for it are +hoverStart+,
  *                 +drop+ and +hoverEnd+.
  *                 Can also be toggled separately by using the
  *                 +setDroppable+ method.
  * +keyDown+::     The local +keyDown+ event state. The component receives
  *                 this event only if it's focused. The event responder
  *                 method for it is +keyDown+ and it receives the ascii key
  *                 code whenever a keyboard key is pressed. Can also be
  *                 toggled separately by using the +setKeyDown+ method.
  *                 Also supports special mode 'repeat', when listening to
  *                 key repetitions is needed.
  * +keyUp+::       The local +keyUp+ event state. The component receives
  *                 this event only if it's focused. The event responder
  *                 method for it is +keyUp+ and it receives the ascii key
  *                 code whenever a keyboard key is released. Can also be
  *                 toggled separately by using the +setKeyUp+ method.
  *
  * = Usage
  *   HControl.new(
  *     [0,0,100,20],
  *     HApplication.nu()
  *   ).setEvents({
  *     mouseUp: true,
  *     mouseDown: true
  *   });
  *
  * = Returns
  * +self+
  *
  **/
  setEvents(_events) {
    if (!this.events) {
      if (this.isntObject(_events)) {
        _events = {};
      }
      this.events = HClass.mixin({
        mouseMove: false,
        mouseDown: false,
        mouseUp: false,
        draggable: false,
        droppable: false,
        keyDown: false,
        keyUp: false,
        mouseWheel: false,
        textEnter: false,
        click: false,
        resize: false,
        doubleClick: false,
        contextMenu: false,
        rectHover: false,
        multiDrop: false
      }, this.defaultEvents, _events).new();
    }
    EVENT.reg(this, this.events);
    return this;
  }

/** = Description
  * Enables the HControl instance, if the enabled flag is true, and disables
  * it if enabled is false. A disabled HControl won't respond events.
  * Component themes reflect the disabled state typically with
  * a dimmer appearance.
  *
  * = Parameters
  * +_flag+:: Boolean; true enables, false disables.
  *
  * = Returns
  * +this+
  *
  **/
  setEnabled(_flag) {
    const _viewsLen = this.views ? this.views.length : 0;

    // Enable/disable the children first.
    for (const i = 0; i < _viewsLen; i++) {
      const _view = HSystem.views[this.views[i]];
      this.isFunction(_view.setEnabled) && _view.setEnabled(_flag);
    }

    if (this.enabled === _flag) {
      // No change in enabled status, do nothing.
      return this;
    }

    this.enabled = _flag;

    if (_flag && this.events) {
      EVENT.reg(this, this.events);
    }
    else {
      EVENT.unreg(this);
    }

    // Toggle the CSS class: enabled/disabled
    this.toggleCSSClass(this.elemId, 'enabled', _flag);
    this.toggleCSSClass(this.elemId, 'disabled', !_flag);
    return this;
  }

/** = Description
  * Alias for #setEnabled(true)
  *
  **/
  enable() {
    return this.setEnabled(true);
  }

/** = Description
  * Alias for #setEnabled(false)
  *
  **/
  disable() {
    return this.setEnabled(false);
  }

/** = Description
  * Alternative flag setter for the mouseMove event type. If set to true,
  * starts listening to mouseDown events when the component has focus.
  *
  * = Parameters
  * +_flag+:: Set the mouseDown event listening on/off (true/false) for
  *           the component instance.
  *
  * = Returns
  * +self+
  *
  **/
  setMouseMove(_flag) {
    this.events.mouseMove = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Alternative flag setter for the click event type. If set to true,
  * starts listening to click events when the component has focus.
  *
  * = Parameters
  * +_flag+:: Set the click event listening on/off (true/false) for
  *           the component instance.
  *
  * = Returns
  * +self+
  *
  **/
  setClickable(_flag) {
    this.events.click = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Registers or releases event listening for mouseDown events depending on
  * the value of the flag argument.
  *
  * = Parameters
  * +_flag+:: Set the mouseDown event listening on/off (true/false) for
  *           the component instance.
  *
  * = Returns
  * +self+
  *
  **/
  setMouseDown(_flag) {
    this.events.mouseDown = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Registers or releases event listening for doubleClick events depending on
  * the value of the flag argument.
  *
  * = Parameters
  * +_flag+:: Set the doubleClick event listening on/off (true/false) for
  *           the component instance.
  *
  * = Returns
  * +self+
  *
  **/
  setDoubleClickable(_flag) {
    this.events.doubleClick = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Registers or releases event listening for contextMenu events depending on
  * the value of the flag argument.
  *
  * = Parameters
  * +_flag+:: Set the contextMenu event listening on/off (true/false) for
  *           the component instance.
  *
  * = Returns
  * +self+
  *
  **/
  setContextMenu(_flag) {
    this.events.contextMenu = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Registers or releases event listening for mouseUp events depending on the
  * value of the flag argument.
  *
  * = Parameters
  * +_flag+:: Set the mouseUp event listening on/off (true/false) for
  *           the component instance.
  *
  * = Returns
  * +self+
  *
  **/
  setMouseUp(_flag) {
    this.events.mouseUp = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Alternative flag setter for the mouseWheel event type. If set to true,
  * starts listening to mouseWheel events when the component has focus.
  *
  * = Parameters
  * +_flag+:: Set the mouseWheel event listening on/off (true/false) for
  *           the component instance.
  *
  * = Returns
  * +self+
  *
  **/
  setMouseWheel(_flag) {
    this.events.mouseWheel = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Registers or releases event listening for startDrag, drag and
  * endDrag -events depending on the value of the flag argument.
  *
  * = Parameters
  * +_flag+:: Set the startDrag, drag and endDrag event listening
  *           on/off (true/false) for the component instance.
  *
  * = Returns
  * +self+
  *
  **/
  setDraggable(_flag) {
    this.events.draggable = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Registers or releases event listening for startHover, drop and
  * endHover -events depending on the value of the flag argument.
  *
  * = Parameters
  * +_flag+:: Set the startHover, drop and endHover event listening
  *           on/off (true/false) for the component instance.
  *
  * = Returns
  * +self+
  *
  **/
  setDroppable(_flag) {
    this.events.droppable = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Registers or releases event listening for keyDown events depending on the
  * value of the flag argument.
  *
  * = Parameters
  * +_flag+:: Set the keyDown event listening on/off (true/false) for
  *           the component instance. Also supports special mode 'repeat',
  *           when listening to key repetitions is needed.
  *
  * = Returns
  * +self+
  *
  **/
  setKeyDown(_flag) {
    this.events.keyDown = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Registers or releases event listening for keyUp events depending on
  * the value of the flag argument.
  *
  * = Parameters
  * +_flag+:: Set the keyUp event listening on/off (true/false) for
  *           the component instance.
  *
  * = Returns
  * +self+
  *
  **/
  setKeyUp(_flag) {
    this.events.keyUp = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Registers or releases event listening for textEnter events
  * depending on the value of the flag argument.
  *
  * = Returns
  * +self+
  *
  **/
  setTextEnter(_flag) {
    this.events.textEnter = _flag;
    this.setEvents();
    return this;
  }

/** = Description
  * Registers or releases event listening for resize events
  * depending on the value of the flag argument.
  *
  * = Returns
  * +self+
  *
  **/
  setResize(_flag) {
    this.events.resize = _flag;
    this.setEvents();
    return this;
  }

/** Same as +setClickable+
  **/
  setClick(_flag) {
    return this.setClickable(_flag);
  }

/** Same as +setDoubleClickable+
  **/
  setDoubleClick(_flag) {
    return this.setDoubleClickable(_flag);
  }

/** = Description
  * Default focus event responder method. Does nothing by default.
  * Called when the component gets focus.
  *
  **/
  focus() {}

/** = Description
  * Default blur event responder method. Does nothing by default.
  * Called when the component loses focus.
  *
  **/
  blur() {}

/** = Description
  * Return true if this component allow gain active status.
  *
  */
  allowActiveStatus(_prevActive) {
    return true;
  }

/** = Description
  * Default gainedActiveStatus event responder method. Does nothing by default.
  * Called when the component gains active status; both focused and clicked.
  *
  * = Parameters
  * +_lastActiveControl+:: A reference to the control that was active
  *                        before this control became active. Can
  *                        be null if there was no active control.
  *
  **/
  gainedActiveStatus(_lastActiveControl) {
    const _parentIdx = this.parents.length - 1;
    if (HSystem.windowFocusMode === 1 && _parentIdx > 1) {
      for (; _parentIdx > 0; _parentIdx--) {
        // Send gainedActiveStatus to HWindow parent(s)
        if (this.isntNullOrUndefined(this.parents[_parentIdx].windowFocus)) {
          this.parents[_parentIdx].gainedActiveStatus();
        }
      }
    }

  }

  // A low-level handler for active status, don't extend this.
  _gainedActiveStatus(_lastActiveControl) {
    if (this.enabled) {
      this.setCSSClass('active');
    }
    return this.gainedActiveStatus(_lastActiveControl);
  }

/** = Description
  * Default lostActiveStatus event responder method. Does nothing by default.
  * Called when the component loses active status; another component was
  * focused and clicked.
  *
  * = Parameters
  * +_newActiveControl+:: A reference to the control that became the currently
  *                       active control. Can be null if there is no active
  *                       control.
  *
  **/
  lostActiveStatus(_newActiveControl) {
    return true;
  }

  // --A low-level handler for lost active status, don't extend this.++
  _lostActiveStatus(_newActiveControl) {
    if (this.lostActiveStatus(_newActiveControl) !== false) {
      if (this.enabled) {
        this.unsetCSSClass('active');
      }
      return true;
    }
    else {
      return false;
    }
  }

/** = Description
  * Default mouseMove event responder method. Does nothing by default.
  * Called whenever the mouse cursor is moved regardless if the
  * component is active or has focus.
  *
  * = Parameters
  * +x+:: The horizontal coordinate units (px) of the mouse cursor position.
  * +y+:: The vertical coordinate units (px) of the mouse cursor position.
  *
  **/
  mouseMove(x, y) {}

/** = Description
  * Default click event responder method. Does nothing by default.
  *
  * = Parameters
  * +x+::              The horizontal coordinate units (px) of the
  *                    mouse cursor position.
  * +y+::              The vertical coordinate units (px) of the
  *                    mouse cursor position.
  * +_isLeftButton+::  Boolean flag; false if the right(context) mouse
  *                    button is pressed.
  *
  **/
  click(x, y, _isLeftButton) {}

/** = Description
  * Default click event responder method. Does nothing by default.
  *
  * = Parameters
  * +x+::              The horizontal coordinate units (px) of the
  *                    mouse cursor position.
  * +y+::              The vertical coordinate units (px) of the
  *                    mouse cursor position.
  * +_isLeftButton+::  Boolean flag; false if the right(context) mouse
  *                    button is pressed.
  *
  **/
  doubleClick(x, y, _isLeftButton) {}

/** = Description
  * Default contextMenu event responder method. Does nothing by default.
  * Extend to return true to allow the default action of the browser.
  *
  **/
  contextMenu(x, y, _isLeftButton) {}

/** = Description
  * Default mouseDown event responder method. Does nothing by default.
  *
  * = Parameters
  * +x+::              The horizontal coordinate units (px) of the
  *                    mouse cursor position.
  * +y+::              The vertical coordinate units (px) of the
  *                    mouse cursor position.
  * +_isLeftButton+::  Boolean flag; false if the right(context) mouse
  *                    button is pressed.
  *
  **/
  mouseDown(x, y, _isLeftButton) {}

/** = Description
  * Default mouseDown event responder method. Does nothing by default.
  *
  * = Parameters
  * +x+::              The horizontal coordinate units (px) of the
  *                    mouse cursor position.
  * +y+::              The vertical coordinate units (px) of the
  *                    mouse cursor position.
  * +_isLeftButton+::  Boolean flag; false if the right(context) mouse
  *                    button is pressed.
  *
  **/
  mouseUp(x, y, _isLeftButton) {}

/** = Description
  * Default mouseWheel event responder method. Does nothing by default.
  *
  * = Parameters
  * +_delta+:: Scrolling delta, the wheel angle change. If delta is positive,
  *            wheel was scrolled up. Otherwise, it was scrolled down.
  *
  **/
  mouseWheel(_delta) {}

/** = Description
  * Default startDrag event responder method. Sets internal flags by default.
  * This is the preferred method to extend if you want to do something
  * when a drag event starts. If you extend, remember to call +this.base();+
  *
  * = Parameters
  * +x+:: The horizontal coordinate units (px) of the mouse cursor position.
  * +y+:: The vertical coordinate units (px) of the mouse cursor position.
  *
  **/
  startDrag(x, y) {}

/** = Description
  * Default drag event responder method. Does nothing by default.
  * This is the preferred method to extend while a drag method is ongoing.
  * Called whenever the mouse cursor moves and a drag event has been started.
  *
  * = Parameters
  * +x+:: The horizontal coordinate units (px) of the mouse cursor position.
  * +y+:: The vertical coordinate units (px) of the mouse cursor position.
  *
  **/
  drag(x, y) {
    this.doDrag(x, y);
  }

  doDrag(x, y) {}

/** = Description
  * Default endDrag event responder method. Sets internal flags by default.
  * This is the preferred method to extend if you want to do something
  * when a drag event ends. If you extend, remember to call +this.base();+
  *
  * = Parameters
  * +x+:: The horizontal coordinate units (px) of the mouse cursor position.
  * +y+:: The vertical coordinate units (px) of the mouse cursor position.
  *
  **/
  endDrag(x, y) {}

/** = Description
  * Default drop event responder method. Does nothing by default.
  * Extend the drop method, if you want to do something
  * when this instance is the target of another instance's endDrag event.
  * Called when a dragged component instance is dropped on the target instance.
  *
  * = Parameters
  * +obj+:: The dragged component object.
  *
  **/
  drop(obj) {
    this.onDrop(obj);
  }

  onDrop(obj) {}

/** = Description
  * Default startHover event responder method. Does nothing by default.
  * Extend the startHover method, if you want to do something
  * when this instance is the target of another instance's drag event.
  * Called when a dragged component instance is dragged over
  * the target instance.
  *
  * = Parameters
  * +obj+:: The dragged component object.
  *
  **/
  startHover(obj) {
    this.onHoverStart(obj);
  }

  onHoverStart(obj) {}

  hover(obj) {}

/** = Description
  * Default endHover event responder method. Does nothing by default.
  * Extend the endHover method, if you want to do something
  * when this instance is no longer the target of another instance's
  * drag event. Called when a dragged component instance is dragged
  * away from the target instance.
  *
  * = Parameters
  * +obj+:: The dragged component object.
  *
  **/
  endHover(obj) {
    this.onHoverEnd(obj);
  }
  onHoverEnd(obj) {}

/** = Description
  * Default keyDown event responder method. Does nothing by default.
  * Extend the keyDown method, if you want to do something
  * when a key is pressed and the component is active.
  *
  * = Parameters
  * +_keycode+:: The ascii key code of the key that was pressed.
  *
  **/
  keyDown(_keycode) {}

/** = Description
  * Default keyUp event responder method. Does nothing by default.
  * Extend the keyUp method, if you want to do something
  * when a key is released and the component is active.
  *
  * = Parameters
  * +_keycode+:: The ascii key code of the key that was released.
  *
  **/
  keyUp(_keycode) {}

/** = Description
  * Default textEnter event responder method. Does nothing by default.
  * Extend the textEnter method, if you want to do something
  * when a key is released regardless if the component is active,
  * has focus or not.
  *
  * = Parameters
  * +_keycode+:: The ascii key code of the key that was released.
  *
  **/
  textEnter() {}

/** Selection handling. Preferably extend #select and #deselect.
  **/
  select() {}

  deselect() {
    if (this.isFunction(this.deSelect)) {
      console.warn('HEventResponder#deSelect is deprecated; use #deselect instead!');
      this.deSelect();
    }
  }

  setSelected(_state) {
    this.toggleCSSClass(this.elemId, 'selected', _state);
    if (_state) {
      this.selected = true;
      this.select();
    }
    else {
      this.selected = false;
      this.deselect();
    }
  }
}

module.exports = HEventResponder;

});

__exports('foundation/control', function() {

const HClass = require('core/class');
const HView = require('foundation/view');
const HValueResponder = require('foundation/valueresponder');
const HEventResponder = require('foundation/eventresponder');
const HDummyValue = require('foundation/value/dummyvalue');
const EVENT = require('foundation/eventmanager');
const {ELEM} = require('core/elem');

/** = Description
  * Define default setting here. Will be used, when no or invalid constructor
  * options are supplied.
  **/
class HControlDefaults extends HClass.mixin({
  /* Whether or not to draw when constructed.
  */
  autoDraw: true,

  /* The default label. A label is the "visual value" of a component that
  * operates on a "hidden" value.
  **/
  label: '',

  /* The default initial visibility of the component.
  **/
  visible: true,

  /* The default initial event responders to register to a component.
  *  By default no events are enabled.
  **/
  events: null,

  /* The default initial value of the component.
  **/
  value: 0,

  /* The default initial enabled state of the component.
  **/
  enabled: true,

  /* The default initial active state of the component.
  **/
  active: false,

  /* The default initial minimum value of the component.
  **/
  minValue: -2147483648,

  /* The default initial maximum value of the component.
  **/
  maxValue: 2147483648,

  /* The default focus value of the component.
  **/
  focusOnCreate: false,

  /*  Use utc time as default
  **/
  useUTC: false

}) {
  constructor() {
    super();
    if (typeof this.events !== 'object') {
      this.events = {};
    }
  }
}

/** = Description
  * The foundation class for all active visual components that
  * implement events and values.
  *
  * Extend +HControl+ to suit your needs. See any component
  * for extension reference.
  *
  **/
class HControl extends HView.mixin(HValueResponder, HEventResponder, {

  isCtrl: true,

/** A flag: when true, calls the +refreshValue+ method whenever
  * +self.value+ is changed.
  **/
  refreshOnValueChange: true,

/** The event object structure that specifies which events to listen to.
  **/
  events: null,

/** The enabled/disabled flag. See setEnabled.
  **/
  enabled: null,

/** The current value of a component. See setValue.
  **/
  value: null,

/** The current HValue compatible object. Do not set directly.
  * Holds reference to the bound HValue instance.
  * Set with HValue.bind.
  **/
  valueObj: null,

/** The minimum numeric value allowed, when the component
  * utilizes value ranges. See setValueRange
  **/
  minValue: null,

/** The maximum allowed value, when the component
  * utilizes value ranges. See setValueRange
  **/
  maxValue: null,

/** A boolean value that shows whether this control is currently
  * active or not. Control gets active when the user clicks on it.
  **/
  active: null,

/** -- Use this object to specify class-specific default settings. ++
  * The controlDefaults is a HControlDefaults object that is extended
  * in the constructor with the options block given. The format of
  * it is an Object.
  **/
  controlDefaults: HControlDefaults
}) /* end of mixin, class begins */ {

/** = Description
  * The constructor of HControl implements the same model as HView,
  * but accepts a third parameter: the options object, that contain
  * optional properties, like the value and events.
  *
  * = Parameters
  * +_rect+::     An instance of +HRect+, defines the position and size of views.
  *               It can be also defined with an array, see below.
  * +_parent+::   The parent instance this instance will be contained within.
  *               A valid parent can be another HView compatible instance,
  *               an HApplication instance, a HControl or a similar extended
  *               HView instance. The origin of the +_rect+ is the same as the
  *               parent's offset. For HApplication instances, the web browser's
  *               window's left top corner is the origin.
  * +_options+:: Optional, all other parameters as object attributes.
  *              Defaults to an instance of +HControlDefaults+, see controlDefaults
  *
  * == The +_rect+ dimensions as arrays
  * Instead of an instance of +HRect+, dimensions can also be supplied as arrays.
  * The array length must be either 4 or 6. If the length is 4, the dimensions are
  * specified as follows: +[ x, y, width, height ]+. Note that this is different
  * from the construction parameters of +HRect+ that takes the coordinates as two
  * points, like: +( left, top, right, bottom )+.
  * Arrays with 6 items are a bit more complex (and powerful) as they can specify
  * the flexible offsets too.
  *
  * === The array indexes for a +_rect+ configured as an 4-item array:
  * Always left/top aligned, all items must be specified.
  * Index::            Description
  * +0+::              The X-coordinate (measured from the parent's left edge)
  * +1+::              The Y-coordinate (measured from the parent's top edge)
  * +2+::              The width.
  * +3+::              The height.
  *
  * === The array indexes a +_rect+ configured as an 6-item array:
  * Can be any configuration of left/top/right/bottom alignment and supports
  * flexible widths. At least 4 items must be specified.
  * Index::            Description
  * +0+::              The left-aligned X-coordinate or +null+ if the view is
  *                    right-aligned and using a right-aligned X-coordinate at
  *                    index +4+ as well as the width specified at index +2+.
  * +1+::              The top-aligned Y-coordinate or +null+ if the view is
  *                    bottom-aligned and using a right-aligned X-coordinate at
  *                    index +5+ as well as the height specified at index +3+.
  * +2+::              The width, if only one X-coordinate specifies the
  *                    position (at indexes +0+ or +4+).
  *                    If both X-coordinates (at indexes +0+ and +4+) are
  *                    specified, the width can be specified with a +null+ for
  *                    automatic (flexible) width. If the width is specified,
  *                    it's used as the minimum width.
  * +3+::              The height, if only one Y-coordinate specifies the
  *                    position (at indexes +1+ or +5+).
  *                    If both Y-coordinates (at indexes +1+ and +5+) are
  *                    specified, the height can be specified with a +null+ for
  *                    automatic (flexible) height. if the height is specified,
  *                    it's used as the minimum height.
  * +4+::              The right-aligned X-coordinate or +null+ if the view is
  *                    left-aligned and using a left-aligned X-coordinate at
  *                    index +0+ as well as the width specified at index +2+.
  * +5+::              The bottom-aligned Y-coordinate or +null+ if the view is
  *                    top-aligned and using a top-aligned X-coordinate at
  *                    index +1+ as well as the height specified at index +3+.
  * == Usage examples of +_rect+:
  * Specified as two instances of +HPoint+,
  * x: 23, y: 75, width: 200, height: 100:
  *  HRect.nu( HPoint.nu( 23, 75 ), HPoint.nu( 223, 175 ) )
  *
  * The same as above, but without +HPoint+ instances:
  *  HRect.nu( 23, 75, 223, 175 )
  *
  * The same as above, but with an array as the constructor
  * parameter for +HRect+:
  *  HRect.nu( [ 23, 75, 223, 175 ] )
  *
  * The same as above, but with an array instead of a +HRect+ instance:
  *  [ 23, 75, 200, 100 ]
  *
  * The same as above, but with a 6-item array:
  *  [ 23, 75, 200, 100, null, null ]
  *
  * The same as above, but aligned to the right instead of left:
  *  [ null, 75, 200, 100, 23, null ]
  *
  * The same as above, but aligned to the right/bottom edges:
  *  [ null, null, 200, 100, 23, 75 ]
  *
  * The same as above, but aligned to the left/bottom edges:
  *  [ 23, null, 200, 100, null, 75 ]
  *
  * Flexible width (based on the parent's dimensions):
  *  [ 23, 75, null, 100, 23, null ]
  *
  * Flexible height (based on the parent's dimensions):
  *  [ 23, 75, 200, null, null, 75 ]
  *
  * Flexible width and height (based on the parent's dimensions):
  *  [ 23, 75, null, null, 23, 75 ]
  *
  * Flexible width and height, but limited to a minimum width
  * of 200 and a minimum height of 100 (based on the parent's dimensions):
  *  [ 23, 75, 200, 100, 23, 75 ]
  *
  * == The +_options+ Object, all options are optional and default to what's
  * defined in +controlDefaults+.
  * Key::         Description
  * +value+::     The initial value of the component. It's type and meaning
  *               differs between components.
  * +valueObj+::  An HValue instance to bind immediately. The value of the
  *               HValue instance overrides the +value+ option.
  * +label+::     The label of the component. It's usually a text (or html)
  *               String. Its meaning differs between components.
  *               See +#setLabel+ and +#refreshLabel+
  * +visible+::   A Boolean value defining the initial visibility of the
  *               component. A true value means visible and false means
  *               hidden.
  * +events+::    An Object containing the events to listen to.
  *               See setEvents and EVENT
  * +enabled+::   A Boolean value defining the initial enabled -state
  *               of the component. Set to false to initially disable the
  *               component. See setEnabled
  * +active+::    A Boolean value defining the initial active (clicked
  *               or focused) state of the component.
  * +minValue+::  A Number for components utilizing value ranges.
  *               See setValueRange
  * +maxValue+::  A Number for components utilizing value ranges.
  *               See setValueRange
  *
  *
  **/
  constructor(_rect, _parent, _options) {
    if (!this.isntObject(_options)) {
      _options = {};
    }
    _options = new this.controlDefaults.mixin(_options)(this);
    if (this.isinherited) {
      super(_rect, _parent, _options);
    }
    else {
      this.isinherited = true;
      super(_rect, _parent, _options);
      this.isinherited = false;
    }

    const _isValueRange = (_options.minValue || _options.maxValue);
    const _events = _options.events;

    if (_isValueRange) {
      this.minValue = _options.minValue;
      this.maxValue = _options.maxValue;
    }

    this.setEvents(_events);
    this.setEnabled(_options.enabled);

    // The traditional HValue instance to pass in options to be bound:
    if (_options.valueObj) {
      _options.valueObj.bindResponder(this);
    }

    // The newer HValue instance to pass in options to be bound:
    // - Same as in guitree syntax, also allows it to be just a valueId
    if (_options.bind) {
      if (this.isString(_options.bind)) {
        const _valueId = _options.bind;
        const _valueObj = this.getValueById(_valueId);
        if (_valueObj) {
          _valueObj.bind(this);
        }
      }
      else if (this.isObject(_options.bind)) {
        _options.bind.bind(this);
      }
    }

    // If none of the above value bindings exist, use a lighter-weight
    // dummy valueObj instead
    if (this.isntObject(this.valueObj)) {
      this.valueObj = new HDummyValue();
    }

    if (this.isNullOrUndefined(this.value) && this.isntNullOrUndefined(_options.value)) {
      this.setValue(_options.value);
    }
    if (_isValueRange) {
      this.setValueRange(this.value, _options.minValue, _options.maxValue);
    }
    if (!this.isinherited && this.options.autoDraw) {
      this.draw();
    }
  }

/** = Description
  * The destructor of +HControl+ instances.
  * Releases events and values before passing through to the base HView.die.
  * Extend it, you you allocate new instance members that need to be
  * deallocated upon destruction.
  *
  **/
  die(_delay) {
    if (this.valueObj) {
      this.valueObj.releaseResponder(this);
      this.valueObj = null;
    }
    EVENT.unreg(this);
    super.die(_delay);
  }

/** = Description
  * Assigns the object a new value range. Used for sliders, steppers etc. Calls
  * setValue with the value given.
  *
  * = Parameters
  * +_value+::    The new value to be set to the component's
  *               HValue compatible instance.
  *
  * +_minValue+:: The new minimum value limit. See minValue.
  *
  * +_maxValue+:: The new maximum value limit. See maxValue.
  *
  * = Returns
  * +self+
  *
  **/
  setValueRange(_value, _minValue, _maxValue) {
    this.minValue = _minValue;
    this.maxValue = _maxValue;
    if (this.isNumber(_value)) {
      _value = (_value < _minValue) ? _minValue : _value;
      _value = (_value > _maxValue) ? _maxValue : _value;
      this.setValue(_value);
    }
    return this;
  }

/** = Description
  * Called when the +self.value+ has been changed. By default
  * tries to update the value element defined in the theme of
  * the component. Of course, the HControl itself doesn't
  * define a theme, so without a theme doesn't do anything.
  *
  * = Returns
  * +self+
  *
  **/
  refreshValue() {
    if (this.markupElemIds) {
      if (this.markupElemIds.value) {
        ELEM.setHTML(this.markupElemIds.value, this.value);
      }
    }
    return this;
  }

/** = Description
  * Called mostly internally whenever a property change requires usually visual
  * action. It's called by methods like setLabel and setValue.
  * Extends HView.refresh. The boolean properties refreshOnValueChange and
  * refreshOnLabelChange control whether refreshValue or refreshLabel
  * should be called. It's used as-is in most components. If you implement
  * your class extension with properties similar to value or label,
  * you are advised to extend the refresh method.
  *
  * = Returns
  * +self+
  *
  **/
  refresh() {
    super.refresh();
    if (this.drawn) {
      if (this.refreshOnValueChange) {
        this.refreshValue();
      }
    }
    return this;
  }
}

});

__exports('foundation/valueaction', function() {
const HClass = require('core/class');
const UtilMethods = require('util/util_methods');
const HValueResponder = require('foundation/valueresponder');
const HSystem = require('foundation/system');

class HValueAction extends UtilMethods.mixin(HValueResponder) {
  constructor(_rect, _parent, _options) {
    super();
    if (this.isntNullOrUndefined(_rect) &&
        this.isFunction(_rect.hasAncestor) &&
        _rect.hasAncestor(HClass)
    ) {
      _options = _parent;
      _parent = _rect;
    }
    else {
      console.warn(
        'Warning: the rect constructor argument of HValueAction is deprecated:',
        _rect);
    }
    this.parent = _parent;
    this.options = _options;
    if (_options.value) {
      this.value = _options.value;
    }
    if (_options && this.isntNullOrUndefined(_options.bind)) {
      let _valueObj = _options.bind;
      if (this.isString(_valueObj)) {
        _valueObj = this.getValueById(_valueObj);
      }
      _valueObj.bindResponder(this);
    }
    else if (_options.valueObj) {
      _options.valueObj.bindResponder(this);
    }
    if (this.isFunction(this.parent.addView)) {
      this.viewId = this.parent.addView(this);
    }
    this.inited = true;
  }

  remove() {
    if (this.parent) {
      const _viewZIdx = this.parent.viewsZOrder.indexOf(this.viewId);
      const _viewPIdx = this.parent.views.indexOf(this.viewId);
      this.parent.views.splice(_viewPIdx, 1);
      HSystem.delView(this.viewId);
      this.parent.viewsZOrder.splice(_viewZIdx, 1);
      const _sysUpdateZIndexOfChildrenBufferIndex = HSystem
        ._updateZIndexOfChildrenBuffer
        .indexOf(this.viewId);
      if (_sysUpdateZIndexOfChildrenBufferIndex !== -1) {
        HSystem
          ._updateZIndexOfChildrenBuffer
          .splice(_sysUpdateZIndexOfChildrenBufferIndex, 1);
      }
      this.parent = null;
      this.parents = [];
    }
    return this;
  }

  die() {
    if (this.isFunction(this.parent.removeView)) {
      this.parent.removeView(this.viewId);
    }
    if (this.isntNullOrUndefined(this.valueObj)) {
      this.valueObj.releaseResponder(this);
    }
    this.value = null;
    this.viewId = null;
  }

  refresh() {
    if (this.options.skipFirstRefresh && !this.inited) {
      return false;
    }
    else {
      if (this.options.refreshAction || this.options.action) {
        const _refreshAction = this.options.refreshAction ?
          this.options.refreshAction :
          this.options.action;
        if (this.isObject(this.parent) &&
            this.isFunction(this.parent[_refreshAction])
        ) {
          this.parent[_refreshAction](this.value);
        }
        else {
          this.parent[_refreshAction] = this.value;
        }
      }
      return true;
    }
  }
}


});

__exports('core/rsence_ns', function() {

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

});

__exports('datetime/moment', function() {
!function(a,b){"object"==typeof exports&&"undefined"!=typeof module?module.exports=b():"function"==typeof define&&define.amd?define(b):a.moment=b()}(this,function(){"use strict";function a(){return re.apply(null,arguments)}function b(a){re=a}function c(a){return a instanceof Array||"[object Array]"===Object.prototype.toString.call(a)}function d(a){return null!=a&&"[object Object]"===Object.prototype.toString.call(a)}function e(a){var b;for(b in a)return!1;return!0}function f(a){return void 0===a}function g(a){return"number"==typeof a||"[object Number]"===Object.prototype.toString.call(a)}function h(a){return a instanceof Date||"[object Date]"===Object.prototype.toString.call(a)}function i(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function j(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function k(a,b){for(var c in b)j(b,c)&&(a[c]=b[c]);return j(b,"toString")&&(a.toString=b.toString),j(b,"valueOf")&&(a.valueOf=b.valueOf),a}function l(a,b,c,d){return sb(a,b,c,d,!0).utc()}function m(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],meridiem:null,rfc2822:!1,weekdayMismatch:!1}}function n(a){return null==a._pf&&(a._pf=m()),a._pf}function o(a){if(null==a._isValid){var b=n(a),c=te.call(b.parsedDateParts,function(a){return null!=a}),d=!isNaN(a._d.getTime())&&b.overflow<0&&!b.empty&&!b.invalidMonth&&!b.invalidWeekday&&!b.nullInput&&!b.invalidFormat&&!b.userInvalidated&&(!b.meridiem||b.meridiem&&c);if(a._strict&&(d=d&&0===b.charsLeftOver&&0===b.unusedTokens.length&&void 0===b.bigHour),null!=Object.isFrozen&&Object.isFrozen(a))return d;a._isValid=d}return a._isValid}function p(a){var b=l(NaN);return null!=a?k(n(b),a):n(b).userInvalidated=!0,b}function q(a,b){var c,d,e;if(f(b._isAMomentObject)||(a._isAMomentObject=b._isAMomentObject),f(b._i)||(a._i=b._i),f(b._f)||(a._f=b._f),f(b._l)||(a._l=b._l),f(b._strict)||(a._strict=b._strict),f(b._tzm)||(a._tzm=b._tzm),f(b._isUTC)||(a._isUTC=b._isUTC),f(b._offset)||(a._offset=b._offset),f(b._pf)||(a._pf=n(b)),f(b._locale)||(a._locale=b._locale),ue.length>0)for(c=0;c<ue.length;c++)d=ue[c],e=b[d],f(e)||(a[d]=e);return a}function r(b){q(this,b),this._d=new Date(null!=b._d?b._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),ve===!1&&(ve=!0,a.updateOffset(this),ve=!1)}function s(a){return a instanceof r||null!=a&&null!=a._isAMomentObject}function t(a){return a<0?Math.ceil(a)||0:Math.floor(a)}function u(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=t(b)),c}function v(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;d<e;d++)(c&&a[d]!==b[d]||!c&&u(a[d])!==u(b[d]))&&g++;return g+f}function w(b){a.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+b)}function x(b,c){var d=!0;return k(function(){if(null!=a.deprecationHandler&&a.deprecationHandler(null,b),d){for(var e,f=[],g=0;g<arguments.length;g++){if(e="","object"==typeof arguments[g]){e+="\n["+g+"] ";for(var h in arguments[0])e+=h+": "+arguments[0][h]+", ";e=e.slice(0,-2)}else e=arguments[g];f.push(e)}w(b+"\nArguments: "+Array.prototype.slice.call(f).join("")+"\n"+(new Error).stack),d=!1}return c.apply(this,arguments)},c)}function y(b,c){null!=a.deprecationHandler&&a.deprecationHandler(b,c),we[b]||(w(c),we[b]=!0)}function z(a){return a instanceof Function||"[object Function]"===Object.prototype.toString.call(a)}function A(a){var b,c;for(c in a)b=a[c],z(b)?this[c]=b:this["_"+c]=b;this._config=a,this._dayOfMonthOrdinalParseLenient=new RegExp((this._dayOfMonthOrdinalParse.source||this._ordinalParse.source)+"|"+/\d{1,2}/.source)}function B(a,b){var c,e=k({},a);for(c in b)j(b,c)&&(d(a[c])&&d(b[c])?(e[c]={},k(e[c],a[c]),k(e[c],b[c])):null!=b[c]?e[c]=b[c]:delete e[c]);for(c in a)j(a,c)&&!j(b,c)&&d(a[c])&&(e[c]=k({},e[c]));return e}function C(a){null!=a&&this.set(a)}function D(a,b,c){var d=this._calendar[a]||this._calendar.sameElse;return z(d)?d.call(b,c):d}function E(a){var b=this._longDateFormat[a],c=this._longDateFormat[a.toUpperCase()];return b||!c?b:(this._longDateFormat[a]=c.replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a])}function F(){return this._invalidDate}function G(a){return this._ordinal.replace("%d",a)}function H(a,b,c,d){var e=this._relativeTime[c];return z(e)?e(a,b,c,d):e.replace(/%d/i,a)}function I(a,b){var c=this._relativeTime[a>0?"future":"past"];return z(c)?c(b):c.replace(/%s/i,b)}function J(a,b){var c=a.toLowerCase();Ge[c]=Ge[c+"s"]=Ge[b]=a}function K(a){return"string"==typeof a?Ge[a]||Ge[a.toLowerCase()]:void 0}function L(a){var b,c,d={};for(c in a)j(a,c)&&(b=K(c),b&&(d[b]=a[c]));return d}function M(a,b){He[a]=b}function N(a){var b=[];for(var c in a)b.push({unit:c,priority:He[c]});return b.sort(function(a,b){return a.priority-b.priority}),b}function O(b,c){return function(d){return null!=d?(Q(this,b,d),a.updateOffset(this,c),this):P(this,b)}}function P(a,b){return a.isValid()?a._d["get"+(a._isUTC?"UTC":"")+b]():NaN}function Q(a,b,c){a.isValid()&&a._d["set"+(a._isUTC?"UTC":"")+b](c)}function R(a){return a=K(a),z(this[a])?this[a]():this}function S(a,b){if("object"==typeof a){a=L(a);for(var c=N(a),d=0;d<c.length;d++)this[c[d].unit](a[c[d].unit])}else if(a=K(a),z(this[a]))return this[a](b);return this}function T(a,b,c){var d=""+Math.abs(a),e=b-d.length,f=a>=0;return(f?c?"+":"":"-")+Math.pow(10,Math.max(0,e)).toString().substr(1)+d}function U(a,b,c,d){var e=d;"string"==typeof d&&(e=function(){return this[d]()}),a&&(Le[a]=e),b&&(Le[b[0]]=function(){return T(e.apply(this,arguments),b[1],b[2])}),c&&(Le[c]=function(){return this.localeData().ordinal(e.apply(this,arguments),a)})}function V(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function W(a){var b,c,d=a.match(Ie);for(b=0,c=d.length;b<c;b++)Le[d[b]]?d[b]=Le[d[b]]:d[b]=V(d[b]);return function(b){var e,f="";for(e=0;e<c;e++)f+=z(d[e])?d[e].call(b,a):d[e];return f}}function X(a,b){return a.isValid()?(b=Y(b,a.localeData()),Ke[b]=Ke[b]||W(b),Ke[b](a)):a.localeData().invalidDate()}function Y(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(Je.lastIndex=0;d>=0&&Je.test(a);)a=a.replace(Je,c),Je.lastIndex=0,d-=1;return a}function Z(a,b,c){bf[a]=z(b)?b:function(a,d){return a&&c?c:b}}function $(a,b){return j(bf,a)?bf[a](b._strict,b._locale):new RegExp(_(a))}function _(a){return aa(a.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e}))}function aa(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$BUNDLE$")}function ba(a,b){var c,d=b;for("string"==typeof a&&(a=[a]),g(b)&&(d=function(a,c){c[b]=u(a)}),c=0;c<a.length;c++)cf[a[c]]=d}function ca(a,b){ba(a,function(a,c,d,e){d._w=d._w||{},b(a,d._w,d,e)})}function da(a,b,c){null!=b&&j(cf,a)&&cf[a](b,c._a,c,a)}function ea(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function fa(a,b){return a?c(this._months)?this._months[a.month()]:this._months[(this._months.isFormat||of).test(b)?"format":"standalone"][a.month()]:c(this._months)?this._months:this._months.standalone}function ga(a,b){return a?c(this._monthsShort)?this._monthsShort[a.month()]:this._monthsShort[of.test(b)?"format":"standalone"][a.month()]:c(this._monthsShort)?this._monthsShort:this._monthsShort.standalone}function ha(a,b,c){var d,e,f,g=a.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],d=0;d<12;++d)f=l([2e3,d]),this._shortMonthsParse[d]=this.monthsShort(f,"").toLocaleLowerCase(),this._longMonthsParse[d]=this.months(f,"").toLocaleLowerCase();return c?"MMM"===b?(e=nf.call(this._shortMonthsParse,g),e!==-1?e:null):(e=nf.call(this._longMonthsParse,g),e!==-1?e:null):"MMM"===b?(e=nf.call(this._shortMonthsParse,g),e!==-1?e:(e=nf.call(this._longMonthsParse,g),e!==-1?e:null)):(e=nf.call(this._longMonthsParse,g),e!==-1?e:(e=nf.call(this._shortMonthsParse,g),e!==-1?e:null))}function ia(a,b,c){var d,e,f;if(this._monthsParseExact)return ha.call(this,a,b,c);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;d<12;d++){if(e=l([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}}function ja(a,b){var c;if(!a.isValid())return a;if("string"==typeof b)if(/^\d+$/.test(b))b=u(b);else if(b=a.localeData().monthsParse(b),!g(b))return a;return c=Math.min(a.date(),ea(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a}function ka(b){return null!=b?(ja(this,b),a.updateOffset(this,!0),this):P(this,"Month")}function la(){return ea(this.year(),this.month())}function ma(a){return this._monthsParseExact?(j(this,"_monthsRegex")||oa.call(this),a?this._monthsShortStrictRegex:this._monthsShortRegex):(j(this,"_monthsShortRegex")||(this._monthsShortRegex=rf),this._monthsShortStrictRegex&&a?this._monthsShortStrictRegex:this._monthsShortRegex)}function na(a){return this._monthsParseExact?(j(this,"_monthsRegex")||oa.call(this),a?this._monthsStrictRegex:this._monthsRegex):(j(this,"_monthsRegex")||(this._monthsRegex=sf),this._monthsStrictRegex&&a?this._monthsStrictRegex:this._monthsRegex)}function oa(){function a(a,b){return b.length-a.length}var b,c,d=[],e=[],f=[];for(b=0;b<12;b++)c=l([2e3,b]),d.push(this.monthsShort(c,"")),e.push(this.months(c,"")),f.push(this.months(c,"")),f.push(this.monthsShort(c,""));for(d.sort(a),e.sort(a),f.sort(a),b=0;b<12;b++)d[b]=aa(d[b]),e[b]=aa(e[b]);for(b=0;b<24;b++)f[b]=aa(f[b]);this._monthsRegex=new RegExp("^("+f.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+e.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+d.join("|")+")","i")}function pa(a){return qa(a)?366:365}function qa(a){return a%4===0&&a%100!==0||a%400===0}function ra(){return qa(this.year())}function sa(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return a<100&&a>=0&&isFinite(h.getFullYear())&&h.setFullYear(a),h}function ta(a){var b=new Date(Date.UTC.apply(null,arguments));return a<100&&a>=0&&isFinite(b.getUTCFullYear())&&b.setUTCFullYear(a),b}function ua(a,b,c){var d=7+b-c,e=(7+ta(a,0,d).getUTCDay()-b)%7;return-e+d-1}function va(a,b,c,d,e){var f,g,h=(7+c-d)%7,i=ua(a,d,e),j=1+7*(b-1)+h+i;return j<=0?(f=a-1,g=pa(f)+j):j>pa(a)?(f=a+1,g=j-pa(a)):(f=a,g=j),{year:f,dayOfYear:g}}function wa(a,b,c){var d,e,f=ua(a.year(),b,c),g=Math.floor((a.dayOfYear()-f-1)/7)+1;return g<1?(e=a.year()-1,d=g+xa(e,b,c)):g>xa(a.year(),b,c)?(d=g-xa(a.year(),b,c),e=a.year()+1):(e=a.year(),d=g),{week:d,year:e}}function xa(a,b,c){var d=ua(a,b,c),e=ua(a+1,b,c);return(pa(a)-d+e)/7}function ya(a){return wa(a,this._week.dow,this._week.doy).week}function za(){return this._week.dow}function Aa(){return this._week.doy}function Ba(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")}function Ca(a){var b=wa(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")}function Da(a,b){return"string"!=typeof a?a:isNaN(a)?(a=b.weekdaysParse(a),"number"==typeof a?a:null):parseInt(a,10)}function Ea(a,b){return"string"==typeof a?b.weekdaysParse(a)%7||7:isNaN(a)?null:a}function Fa(a,b){return a?c(this._weekdays)?this._weekdays[a.day()]:this._weekdays[this._weekdays.isFormat.test(b)?"format":"standalone"][a.day()]:c(this._weekdays)?this._weekdays:this._weekdays.standalone}function Ga(a){return a?this._weekdaysShort[a.day()]:this._weekdaysShort}function Ha(a){return a?this._weekdaysMin[a.day()]:this._weekdaysMin}function Ia(a,b,c){var d,e,f,g=a.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],d=0;d<7;++d)f=l([2e3,1]).day(d),this._minWeekdaysParse[d]=this.weekdaysMin(f,"").toLocaleLowerCase(),this._shortWeekdaysParse[d]=this.weekdaysShort(f,"").toLocaleLowerCase(),this._weekdaysParse[d]=this.weekdays(f,"").toLocaleLowerCase();return c?"dddd"===b?(e=nf.call(this._weekdaysParse,g),e!==-1?e:null):"ddd"===b?(e=nf.call(this._shortWeekdaysParse,g),e!==-1?e:null):(e=nf.call(this._minWeekdaysParse,g),e!==-1?e:null):"dddd"===b?(e=nf.call(this._weekdaysParse,g),e!==-1?e:(e=nf.call(this._shortWeekdaysParse,g),e!==-1?e:(e=nf.call(this._minWeekdaysParse,g),e!==-1?e:null))):"ddd"===b?(e=nf.call(this._shortWeekdaysParse,g),e!==-1?e:(e=nf.call(this._weekdaysParse,g),e!==-1?e:(e=nf.call(this._minWeekdaysParse,g),e!==-1?e:null))):(e=nf.call(this._minWeekdaysParse,g),e!==-1?e:(e=nf.call(this._weekdaysParse,g),e!==-1?e:(e=nf.call(this._shortWeekdaysParse,g),e!==-1?e:null)))}function Ja(a,b,c){var d,e,f;if(this._weekdaysParseExact)return Ia.call(this,a,b,c);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),d=0;d<7;d++){if(e=l([2e3,1]).day(d),c&&!this._fullWeekdaysParse[d]&&(this._fullWeekdaysParse[d]=new RegExp("^"+this.weekdays(e,"").replace(".",".?")+"$","i"),this._shortWeekdaysParse[d]=new RegExp("^"+this.weekdaysShort(e,"").replace(".",".?")+"$","i"),this._minWeekdaysParse[d]=new RegExp("^"+this.weekdaysMin(e,"").replace(".",".?")+"$","i")),this._weekdaysParse[d]||(f="^"+this.weekdays(e,"")+"|^"+this.weekdaysShort(e,"")+"|^"+this.weekdaysMin(e,""),this._weekdaysParse[d]=new RegExp(f.replace(".",""),"i")),c&&"dddd"===b&&this._fullWeekdaysParse[d].test(a))return d;if(c&&"ddd"===b&&this._shortWeekdaysParse[d].test(a))return d;if(c&&"dd"===b&&this._minWeekdaysParse[d].test(a))return d;if(!c&&this._weekdaysParse[d].test(a))return d}}function Ka(a){if(!this.isValid())return null!=a?this:NaN;var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=Da(a,this.localeData()),this.add(a-b,"d")):b}function La(a){if(!this.isValid())return null!=a?this:NaN;var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")}function Ma(a){if(!this.isValid())return null!=a?this:NaN;if(null!=a){var b=Ea(a,this.localeData());return this.day(this.day()%7?b:b-7)}return this.day()||7}function Na(a){return this._weekdaysParseExact?(j(this,"_weekdaysRegex")||Qa.call(this),a?this._weekdaysStrictRegex:this._weekdaysRegex):(j(this,"_weekdaysRegex")||(this._weekdaysRegex=yf),this._weekdaysStrictRegex&&a?this._weekdaysStrictRegex:this._weekdaysRegex)}function Oa(a){return this._weekdaysParseExact?(j(this,"_weekdaysRegex")||Qa.call(this),a?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(j(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=zf),this._weekdaysShortStrictRegex&&a?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)}function Pa(a){return this._weekdaysParseExact?(j(this,"_weekdaysRegex")||Qa.call(this),a?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(j(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=Af),this._weekdaysMinStrictRegex&&a?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)}function Qa(){function a(a,b){return b.length-a.length}var b,c,d,e,f,g=[],h=[],i=[],j=[];for(b=0;b<7;b++)c=l([2e3,1]).day(b),d=this.weekdaysMin(c,""),e=this.weekdaysShort(c,""),f=this.weekdays(c,""),g.push(d),h.push(e),i.push(f),j.push(d),j.push(e),j.push(f);for(g.sort(a),h.sort(a),i.sort(a),j.sort(a),b=0;b<7;b++)h[b]=aa(h[b]),i[b]=aa(i[b]),j[b]=aa(j[b]);this._weekdaysRegex=new RegExp("^("+j.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+i.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+h.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+g.join("|")+")","i")}function Ra(){return this.hours()%12||12}function Sa(){return this.hours()||24}function Ta(a,b){U(a,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),b)})}function Ua(a,b){return b._meridiemParse}function Va(a){return"p"===(a+"").toLowerCase().charAt(0)}function Wa(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"}function Xa(a){return a?a.toLowerCase().replace("_","-"):a}function Ya(a){for(var b,c,d,e,f=0;f<a.length;){for(e=Xa(a[f]).split("-"),b=e.length,c=Xa(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=Za(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&v(e,c,!0)>=b-1)break;b--}f++}return null}function Za(a){var b=null;if(!Ff[a]&&"undefined"!=typeof module&&module&&module.exports)try{b=Bf._abbr,require("./locale/"+a),$a(b)}catch(a){}return Ff[a]}function $a(a,b){var c;return a&&(c=f(b)?bb(a):_a(a,b),c&&(Bf=c)),Bf._abbr}function _a(a,b){if(null!==b){var c=Ef;if(b.abbr=a,null!=Ff[a])y("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),c=Ff[a]._config;else if(null!=b.parentLocale){if(null==Ff[b.parentLocale])return Gf[b.parentLocale]||(Gf[b.parentLocale]=[]),Gf[b.parentLocale].push({name:a,config:b}),null;c=Ff[b.parentLocale]._config}return Ff[a]=new C(B(c,b)),Gf[a]&&Gf[a].forEach(function(a){_a(a.name,a.config)}),$a(a),Ff[a]}return delete Ff[a],null}function ab(a,b){if(null!=b){var c,d=Ef;null!=Ff[a]&&(d=Ff[a]._config),b=B(d,b),c=new C(b),c.parentLocale=Ff[a],Ff[a]=c,$a(a)}else null!=Ff[a]&&(null!=Ff[a].parentLocale?Ff[a]=Ff[a].parentLocale:null!=Ff[a]&&delete Ff[a]);return Ff[a]}function bb(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return Bf;if(!c(a)){if(b=Za(a))return b;a=[a]}return Ya(a)}function cb(){return ze(Ff)}function db(a){var b,c=a._a;return c&&n(a).overflow===-2&&(b=c[ef]<0||c[ef]>11?ef:c[ff]<1||c[ff]>ea(c[df],c[ef])?ff:c[gf]<0||c[gf]>24||24===c[gf]&&(0!==c[hf]||0!==c[jf]||0!==c[kf])?gf:c[hf]<0||c[hf]>59?hf:c[jf]<0||c[jf]>59?jf:c[kf]<0||c[kf]>999?kf:-1,n(a)._overflowDayOfYear&&(b<df||b>ff)&&(b=ff),n(a)._overflowWeeks&&b===-1&&(b=lf),n(a)._overflowWeekday&&b===-1&&(b=mf),n(a).overflow=b),a}function eb(a){var b,c,d,e,f,g,h=a._i,i=Hf.exec(h)||If.exec(h);if(i){for(n(a).iso=!0,b=0,c=Kf.length;b<c;b++)if(Kf[b][1].exec(i[1])){e=Kf[b][0],d=Kf[b][2]!==!1;break}if(null==e)return void(a._isValid=!1);if(i[3]){for(b=0,c=Lf.length;b<c;b++)if(Lf[b][1].exec(i[3])){f=(i[2]||" ")+Lf[b][0];break}if(null==f)return void(a._isValid=!1)}if(!d&&null!=f)return void(a._isValid=!1);if(i[4]){if(!Jf.exec(i[4]))return void(a._isValid=!1);g="Z"}a._f=e+(f||"")+(g||""),lb(a)}else a._isValid=!1}function fb(a){var b,c,d,e,f,g,h,i,j={" GMT":" +0000"," EDT":" -0400"," EST":" -0500"," CDT":" -0500"," CST":" -0600"," MDT":" -0600"," MST":" -0700"," PDT":" -0700"," PST":" -0800"},k="YXWVUTSRQPONZABCDEFGHIKLM";if(b=a._i.replace(/\([^\)]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").replace(/^\s|\s$/g,""),c=Nf.exec(b)){if(d=c[1]?"ddd"+(5===c[1].length?", ":" "):"",e="D MMM "+(c[2].length>10?"YYYY ":"YY "),f="HH:mm"+(c[4]?":ss":""),c[1]){var l=new Date(c[2]),m=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][l.getDay()];if(c[1].substr(0,3)!==m)return n(a).weekdayMismatch=!0,void(a._isValid=!1)}switch(c[5].length){case 2:0===i?h=" +0000":(i=k.indexOf(c[5][1].toUpperCase())-12,h=(i<0?" -":" +")+(""+i).replace(/^-?/,"0").match(/..$/)[0]+"00");break;case 4:h=j[c[5]];break;default:h=j[" GMT"]}c[5]=h,a._i=c.splice(1).join(""),g=" ZZ",a._f=d+e+f+g,lb(a),n(a).rfc2822=!0}else a._isValid=!1}function gb(b){var c=Mf.exec(b._i);return null!==c?void(b._d=new Date(+c[1])):(eb(b),void(b._isValid===!1&&(delete b._isValid,fb(b),b._isValid===!1&&(delete b._isValid,a.createFromInputFallback(b)))))}function hb(a,b,c){return null!=a?a:null!=b?b:c}function ib(b){var c=new Date(a.now());return b._useUTC?[c.getUTCFullYear(),c.getUTCMonth(),c.getUTCDate()]:[c.getFullYear(),c.getMonth(),c.getDate()]}function jb(a){var b,c,d,e,f=[];if(!a._d){for(d=ib(a),a._w&&null==a._a[ff]&&null==a._a[ef]&&kb(a),null!=a._dayOfYear&&(e=hb(a._a[df],d[df]),(a._dayOfYear>pa(e)||0===a._dayOfYear)&&(n(a)._overflowDayOfYear=!0),c=ta(e,0,a._dayOfYear),a._a[ef]=c.getUTCMonth(),a._a[ff]=c.getUTCDate()),b=0;b<3&&null==a._a[b];++b)a._a[b]=f[b]=d[b];for(;b<7;b++)a._a[b]=f[b]=null==a._a[b]?2===b?1:0:a._a[b];24===a._a[gf]&&0===a._a[hf]&&0===a._a[jf]&&0===a._a[kf]&&(a._nextDay=!0,a._a[gf]=0),a._d=(a._useUTC?ta:sa).apply(null,f),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()-a._tzm),a._nextDay&&(a._a[gf]=24)}}function kb(a){var b,c,d,e,f,g,h,i;if(b=a._w,null!=b.GG||null!=b.W||null!=b.E)f=1,g=4,c=hb(b.GG,a._a[df],wa(tb(),1,4).year),d=hb(b.W,1),e=hb(b.E,1),(e<1||e>7)&&(i=!0);else{f=a._locale._week.dow,g=a._locale._week.doy;var j=wa(tb(),f,g);c=hb(b.gg,a._a[df],j.year),d=hb(b.w,j.week),null!=b.d?(e=b.d,(e<0||e>6)&&(i=!0)):null!=b.e?(e=b.e+f,(b.e<0||b.e>6)&&(i=!0)):e=f}d<1||d>xa(c,f,g)?n(a)._overflowWeeks=!0:null!=i?n(a)._overflowWeekday=!0:(h=va(c,d,e,f,g),a._a[df]=h.year,a._dayOfYear=h.dayOfYear)}function lb(b){if(b._f===a.ISO_8601)return void eb(b);if(b._f===a.RFC_2822)return void fb(b);b._a=[],n(b).empty=!0;var c,d,e,f,g,h=""+b._i,i=h.length,j=0;for(e=Y(b._f,b._locale).match(Ie)||[],c=0;c<e.length;c++)f=e[c],d=(h.match($(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&n(b).unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),j+=d.length),Le[f]?(d?n(b).empty=!1:n(b).unusedTokens.push(f),da(f,d,b)):b._strict&&!d&&n(b).unusedTokens.push(f);n(b).charsLeftOver=i-j,h.length>0&&n(b).unusedInput.push(h),b._a[gf]<=12&&n(b).bigHour===!0&&b._a[gf]>0&&(n(b).bigHour=void 0),n(b).parsedDateParts=b._a.slice(0),n(b).meridiem=b._meridiem,b._a[gf]=mb(b._locale,b._a[gf],b._meridiem),jb(b),db(b)}function mb(a,b,c){var d;return null==c?b:null!=a.meridiemHour?a.meridiemHour(b,c):null!=a.isPM?(d=a.isPM(c),d&&b<12&&(b+=12),d||12!==b||(b=0),b):b}function nb(a){var b,c,d,e,f;if(0===a._f.length)return n(a).invalidFormat=!0,void(a._d=new Date(NaN));for(e=0;e<a._f.length;e++)f=0,b=q({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._f=a._f[e],lb(b),o(b)&&(f+=n(b).charsLeftOver,f+=10*n(b).unusedTokens.length,n(b).score=f,(null==d||f<d)&&(d=f,c=b));k(a,c||b)}function ob(a){if(!a._d){var b=L(a._i);a._a=i([b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],function(a){return a&&parseInt(a,10)}),jb(a)}}function pb(a){var b=new r(db(qb(a)));return b._nextDay&&(b.add(1,"d"),b._nextDay=void 0),b}function qb(a){var b=a._i,d=a._f;return a._locale=a._locale||bb(a._l),null===b||void 0===d&&""===b?p({nullInput:!0}):("string"==typeof b&&(a._i=b=a._locale.preparse(b)),s(b)?new r(db(b)):(h(b)?a._d=b:c(d)?nb(a):d?lb(a):rb(a),o(a)||(a._d=null),a))}function rb(b){var e=b._i;f(e)?b._d=new Date(a.now()):h(e)?b._d=new Date(e.valueOf()):"string"==typeof e?gb(b):c(e)?(b._a=i(e.slice(0),function(a){return parseInt(a,10)}),jb(b)):d(e)?ob(b):g(e)?b._d=new Date(e):a.createFromInputFallback(b)}function sb(a,b,f,g,h){var i={};return f!==!0&&f!==!1||(g=f,f=void 0),(d(a)&&e(a)||c(a)&&0===a.length)&&(a=void 0),i._isAMomentObject=!0,i._useUTC=i._isUTC=h,i._l=f,i._i=a,i._f=b,i._strict=g,pb(i)}function tb(a,b,c,d){return sb(a,b,c,d,!1)}function ub(a,b){var d,e;if(1===b.length&&c(b[0])&&(b=b[0]),!b.length)return tb();for(d=b[0],e=1;e<b.length;++e)b[e].isValid()&&!b[e][a](d)||(d=b[e]);return d}function vb(){var a=[].slice.call(arguments,0);return ub("isBefore",a)}function wb(){var a=[].slice.call(arguments,0);return ub("isAfter",a)}function xb(a){for(var b in a)if(Rf.indexOf(b)===-1||null!=a[b]&&isNaN(a[b]))return!1;for(var c=!1,d=0;d<Rf.length;++d)if(a[Rf[d]]){if(c)return!1;parseFloat(a[Rf[d]])!==u(a[Rf[d]])&&(c=!0)}return!0}function yb(){return this._isValid}function zb(){return Sb(NaN)}function Ab(a){var b=L(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._isValid=xb(b),this._milliseconds=+k+1e3*j+6e4*i+1e3*h*60*60,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=bb(),this._bubble()}function Bb(a){return a instanceof Ab}function Cb(a){return a<0?Math.round(-1*a)*-1:Math.round(a)}function Db(a,b){U(a,0,0,function(){var a=this.utcOffset(),c="+";return a<0&&(a=-a,c="-"),c+T(~~(a/60),2)+b+T(~~a%60,2)})}function Eb(a,b){var c=(b||"").match(a);if(null===c)return null;var d=c[c.length-1]||[],e=(d+"").match(Sf)||["-",0,0],f=+(60*e[1])+u(e[2]);return 0===f?0:"+"===e[0]?f:-f}function Fb(b,c){var d,e;return c._isUTC?(d=c.clone(),e=(s(b)||h(b)?b.valueOf():tb(b).valueOf())-d.valueOf(),d._d.setTime(d._d.valueOf()+e),a.updateOffset(d,!1),d):tb(b).local()}function Gb(a){return 15*-Math.round(a._d.getTimezoneOffset()/15)}function Hb(b,c,d){var e,f=this._offset||0;if(!this.isValid())return null!=b?this:NaN;if(null!=b){if("string"==typeof b){if(b=Eb($e,b),null===b)return this}else Math.abs(b)<16&&!d&&(b=60*b);return!this._isUTC&&c&&(e=Gb(this)),this._offset=b,this._isUTC=!0,null!=e&&this.add(e,"m"),f!==b&&(!c||this._changeInProgress?Xb(this,Sb(b-f,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,a.updateOffset(this,!0),this._changeInProgress=null)),this}return this._isUTC?f:Gb(this)}function Ib(a,b){return null!=a?("string"!=typeof a&&(a=-a),this.utcOffset(a,b),this):-this.utcOffset()}function Jb(a){return this.utcOffset(0,a)}function Kb(a){return this._isUTC&&(this.utcOffset(0,a),this._isUTC=!1,a&&this.subtract(Gb(this),"m")),this}function Lb(){if(null!=this._tzm)this.utcOffset(this._tzm,!1,!0);else if("string"==typeof this._i){var a=Eb(Ze,this._i);null!=a?this.utcOffset(a):this.utcOffset(0,!0)}return this}function Mb(a){return!!this.isValid()&&(a=a?tb(a).utcOffset():0,(this.utcOffset()-a)%60===0)}function Nb(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function Ob(){if(!f(this._isDSTShifted))return this._isDSTShifted;var a={};if(q(a,this),a=qb(a),a._a){var b=a._isUTC?l(a._a):tb(a._a);this._isDSTShifted=this.isValid()&&v(a._a,b.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function Pb(){return!!this.isValid()&&!this._isUTC}function Qb(){return!!this.isValid()&&this._isUTC}function Rb(){return!!this.isValid()&&(this._isUTC&&0===this._offset)}function Sb(a,b){var c,d,e,f=a,h=null;return Bb(a)?f={ms:a._milliseconds,d:a._days,M:a._months}:g(a)?(f={},b?f[b]=a:f.milliseconds=a):(h=Tf.exec(a))?(c="-"===h[1]?-1:1,f={y:0,d:u(h[ff])*c,h:u(h[gf])*c,m:u(h[hf])*c,s:u(h[jf])*c,ms:u(Cb(1e3*h[kf]))*c}):(h=Uf.exec(a))?(c="-"===h[1]?-1:1,f={y:Tb(h[2],c),M:Tb(h[3],c),w:Tb(h[4],c),d:Tb(h[5],c),h:Tb(h[6],c),m:Tb(h[7],c),s:Tb(h[8],c)}):null==f?f={}:"object"==typeof f&&("from"in f||"to"in f)&&(e=Vb(tb(f.from),tb(f.to)),f={},f.ms=e.milliseconds,f.M=e.months),d=new Ab(f),Bb(a)&&j(a,"_locale")&&(d._locale=a._locale),d}function Tb(a,b){var c=a&&parseFloat(a.replace(",","."));return(isNaN(c)?0:c)*b}function Ub(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function Vb(a,b){var c;return a.isValid()&&b.isValid()?(b=Fb(b,a),a.isBefore(b)?c=Ub(a,b):(c=Ub(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c):{milliseconds:0,months:0}}function Wb(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(y(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=Sb(c,d),Xb(this,e,a),this}}function Xb(b,c,d,e){var f=c._milliseconds,g=Cb(c._days),h=Cb(c._months);b.isValid()&&(e=null==e||e,f&&b._d.setTime(b._d.valueOf()+f*d),g&&Q(b,"Date",P(b,"Date")+g*d),h&&ja(b,P(b,"Month")+h*d),e&&a.updateOffset(b,g||h))}function Yb(a,b){var c=a.diff(b,"days",!0);return c<-6?"sameElse":c<-1?"lastWeek":c<0?"lastDay":c<1?"sameDay":c<2?"nextDay":c<7?"nextWeek":"sameElse"}function Zb(b,c){var d=b||tb(),e=Fb(d,this).startOf("day"),f=a.calendarFormat(this,e)||"sameElse",g=c&&(z(c[f])?c[f].call(this,d):c[f]);return this.format(g||this.localeData().calendar(f,this,tb(d)))}function $b(){return new r(this)}function _b(a,b){var c=s(a)?a:tb(a);return!(!this.isValid()||!c.isValid())&&(b=K(f(b)?"millisecond":b),"millisecond"===b?this.valueOf()>c.valueOf():c.valueOf()<this.clone().startOf(b).valueOf())}function ac(a,b){var c=s(a)?a:tb(a);return!(!this.isValid()||!c.isValid())&&(b=K(f(b)?"millisecond":b),"millisecond"===b?this.valueOf()<c.valueOf():this.clone().endOf(b).valueOf()<c.valueOf())}function bc(a,b,c,d){return d=d||"()",("("===d[0]?this.isAfter(a,c):!this.isBefore(a,c))&&(")"===d[1]?this.isBefore(b,c):!this.isAfter(b,c))}function cc(a,b){var c,d=s(a)?a:tb(a);return!(!this.isValid()||!d.isValid())&&(b=K(b||"millisecond"),"millisecond"===b?this.valueOf()===d.valueOf():(c=d.valueOf(),this.clone().startOf(b).valueOf()<=c&&c<=this.clone().endOf(b).valueOf()))}function dc(a,b){return this.isSame(a,b)||this.isAfter(a,b)}function ec(a,b){return this.isSame(a,b)||this.isBefore(a,b)}function fc(a,b,c){var d,e,f,g;return this.isValid()?(d=Fb(a,this),d.isValid()?(e=6e4*(d.utcOffset()-this.utcOffset()),b=K(b),"year"===b||"month"===b||"quarter"===b?(g=gc(this,d),"quarter"===b?g/=3:"year"===b&&(g/=12)):(f=this-d,g="second"===b?f/1e3:"minute"===b?f/6e4:"hour"===b?f/36e5:"day"===b?(f-e)/864e5:"week"===b?(f-e)/6048e5:f),c?g:t(g)):NaN):NaN}function gc(a,b){var c,d,e=12*(b.year()-a.year())+(b.month()-a.month()),f=a.clone().add(e,"months");return b-f<0?(c=a.clone().add(e-1,"months"),d=(b-f)/(f-c)):(c=a.clone().add(e+1,"months"),d=(b-f)/(c-f)),-(e+d)||0}function hc(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function ic(){if(!this.isValid())return null;var a=this.clone().utc();return a.year()<0||a.year()>9999?X(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):z(Date.prototype.toISOString)?this.toDate().toISOString():X(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")}function jc(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var a="moment",b="";this.isLocal()||(a=0===this.utcOffset()?"moment.utc":"moment.parseZone",b="Z");var c="["+a+'("]',d=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY",e="-MM-DD[T]HH:mm:ss.SSS",f=b+'[")]';return this.format(c+d+e+f)}function kc(b){b||(b=this.isUtc()?a.defaultFormatUtc:a.defaultFormat);var c=X(this,b);return this.localeData().postformat(c)}function lc(a,b){return this.isValid()&&(s(a)&&a.isValid()||tb(a).isValid())?Sb({to:this,from:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function mc(a){return this.from(tb(),a)}function nc(a,b){return this.isValid()&&(s(a)&&a.isValid()||tb(a).isValid())?Sb({from:this,to:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function oc(a){return this.to(tb(),a)}function pc(a){var b;return void 0===a?this._locale._abbr:(b=bb(a),null!=b&&(this._locale=b),this)}function qc(){return this._locale}function rc(a){switch(a=K(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":case"date":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a&&this.weekday(0),"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this}function sc(a){return a=K(a),void 0===a||"millisecond"===a?this:("date"===a&&(a="day"),this.startOf(a).add(1,"isoWeek"===a?"week":a).subtract(1,"ms"))}function tc(){return this._d.valueOf()-6e4*(this._offset||0)}function uc(){return Math.floor(this.valueOf()/1e3)}function vc(){return new Date(this.valueOf())}function wc(){var a=this;return[a.year(),a.month(),a.date(),a.hour(),a.minute(),a.second(),a.millisecond()]}function xc(){var a=this;return{years:a.year(),months:a.month(),date:a.date(),hours:a.hours(),minutes:a.minutes(),seconds:a.seconds(),milliseconds:a.milliseconds()}}function yc(){return this.isValid()?this.toISOString():null}function zc(){return o(this)}function Ac(){
return k({},n(this))}function Bc(){return n(this).overflow}function Cc(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}}function Dc(a,b){U(0,[a,a.length],0,b)}function Ec(a){return Ic.call(this,a,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)}function Fc(a){return Ic.call(this,a,this.isoWeek(),this.isoWeekday(),1,4)}function Gc(){return xa(this.year(),1,4)}function Hc(){var a=this.localeData()._week;return xa(this.year(),a.dow,a.doy)}function Ic(a,b,c,d,e){var f;return null==a?wa(this,d,e).year:(f=xa(a,d,e),b>f&&(b=f),Jc.call(this,a,b,c,d,e))}function Jc(a,b,c,d,e){var f=va(a,b,c,d,e),g=ta(f.year,0,f.dayOfYear);return this.year(g.getUTCFullYear()),this.month(g.getUTCMonth()),this.date(g.getUTCDate()),this}function Kc(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)}function Lc(a){var b=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")}function Mc(a,b){b[kf]=u(1e3*("0."+a))}function Nc(){return this._isUTC?"UTC":""}function Oc(){return this._isUTC?"Coordinated Universal Time":""}function Pc(a){return tb(1e3*a)}function Qc(){return tb.apply(null,arguments).parseZone()}function Rc(a){return a}function Sc(a,b,c,d){var e=bb(),f=l().set(d,b);return e[c](f,a)}function Tc(a,b,c){if(g(a)&&(b=a,a=void 0),a=a||"",null!=b)return Sc(a,b,c,"month");var d,e=[];for(d=0;d<12;d++)e[d]=Sc(a,d,c,"month");return e}function Uc(a,b,c,d){"boolean"==typeof a?(g(b)&&(c=b,b=void 0),b=b||""):(b=a,c=b,a=!1,g(b)&&(c=b,b=void 0),b=b||"");var e=bb(),f=a?e._week.dow:0;if(null!=c)return Sc(b,(c+f)%7,d,"day");var h,i=[];for(h=0;h<7;h++)i[h]=Sc(b,(h+f)%7,d,"day");return i}function Vc(a,b){return Tc(a,b,"months")}function Wc(a,b){return Tc(a,b,"monthsShort")}function Xc(a,b,c){return Uc(a,b,c,"weekdays")}function Yc(a,b,c){return Uc(a,b,c,"weekdaysShort")}function Zc(a,b,c){return Uc(a,b,c,"weekdaysMin")}function $c(){var a=this._data;return this._milliseconds=dg(this._milliseconds),this._days=dg(this._days),this._months=dg(this._months),a.milliseconds=dg(a.milliseconds),a.seconds=dg(a.seconds),a.minutes=dg(a.minutes),a.hours=dg(a.hours),a.months=dg(a.months),a.years=dg(a.years),this}function _c(a,b,c,d){var e=Sb(b,c);return a._milliseconds+=d*e._milliseconds,a._days+=d*e._days,a._months+=d*e._months,a._bubble()}function ad(a,b){return _c(this,a,b,1)}function bd(a,b){return _c(this,a,b,-1)}function cd(a){return a<0?Math.floor(a):Math.ceil(a)}function dd(){var a,b,c,d,e,f=this._milliseconds,g=this._days,h=this._months,i=this._data;return f>=0&&g>=0&&h>=0||f<=0&&g<=0&&h<=0||(f+=864e5*cd(fd(h)+g),g=0,h=0),i.milliseconds=f%1e3,a=t(f/1e3),i.seconds=a%60,b=t(a/60),i.minutes=b%60,c=t(b/60),i.hours=c%24,g+=t(c/24),e=t(ed(g)),h+=e,g-=cd(fd(e)),d=t(h/12),h%=12,i.days=g,i.months=h,i.years=d,this}function ed(a){return 4800*a/146097}function fd(a){return 146097*a/4800}function gd(a){if(!this.isValid())return NaN;var b,c,d=this._milliseconds;if(a=K(a),"month"===a||"year"===a)return b=this._days+d/864e5,c=this._months+ed(b),"month"===a?c:c/12;switch(b=this._days+Math.round(fd(this._months)),a){case"week":return b/7+d/6048e5;case"day":return b+d/864e5;case"hour":return 24*b+d/36e5;case"minute":return 1440*b+d/6e4;case"second":return 86400*b+d/1e3;case"millisecond":return Math.floor(864e5*b)+d;default:throw new Error("Unknown unit "+a)}}function hd(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*u(this._months/12):NaN}function id(a){return function(){return this.as(a)}}function jd(a){return a=K(a),this.isValid()?this[a+"s"]():NaN}function kd(a){return function(){return this.isValid()?this._data[a]:NaN}}function ld(){return t(this.days()/7)}function md(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function nd(a,b,c){var d=Sb(a).abs(),e=tg(d.as("s")),f=tg(d.as("m")),g=tg(d.as("h")),h=tg(d.as("d")),i=tg(d.as("M")),j=tg(d.as("y")),k=e<=ug.ss&&["s",e]||e<ug.s&&["ss",e]||f<=1&&["m"]||f<ug.m&&["mm",f]||g<=1&&["h"]||g<ug.h&&["hh",g]||h<=1&&["d"]||h<ug.d&&["dd",h]||i<=1&&["M"]||i<ug.M&&["MM",i]||j<=1&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,md.apply(null,k)}function od(a){return void 0===a?tg:"function"==typeof a&&(tg=a,!0)}function pd(a,b){return void 0!==ug[a]&&(void 0===b?ug[a]:(ug[a]=b,"s"===a&&(ug.ss=b-1),!0))}function qd(a){if(!this.isValid())return this.localeData().invalidDate();var b=this.localeData(),c=nd(this,!a,b);return a&&(c=b.pastFuture(+this,c)),b.postformat(c)}function rd(){if(!this.isValid())return this.localeData().invalidDate();var a,b,c,d=vg(this._milliseconds)/1e3,e=vg(this._days),f=vg(this._months);a=t(d/60),b=t(a/60),d%=60,a%=60,c=t(f/12),f%=12;var g=c,h=f,i=e,j=b,k=a,l=d,m=this.asSeconds();return m?(m<0?"-":"")+"P"+(g?g+"Y":"")+(h?h+"M":"")+(i?i+"D":"")+(j||k||l?"T":"")+(j?j+"H":"")+(k?k+"M":"")+(l?l+"S":""):"P0D"}
//! moment.js locale configuration
//! locale : Belarusian [be]
//! author : Dmitry Demidov : https://github.com/demidov91
//! author: Praleska: http://praleska.pro/
//! Author : Menelion Elensúle : https://github.com/Oire
function sd(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&b%10<=4&&(b%100<10||b%100>=20)?c[1]:c[2]}function td(a,b,c){var d={mm:b?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:b?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===c?b?"хвіліна":"хвіліну":"h"===c?b?"гадзіна":"гадзіну":a+" "+sd(d[c],+a)}
//! moment.js locale configuration
//! locale : Breton [br]
//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou
function ud(a,b,c){var d={mm:"munutenn",MM:"miz",dd:"devezh"};return a+" "+xd(d[c],a)}function vd(a){switch(wd(a)){case 1:case 3:case 4:case 5:case 9:return a+" bloaz";default:return a+" vloaz"}}function wd(a){return a>9?wd(a%10):a}function xd(a,b){return 2===b?yd(a):a}function yd(a){var b={m:"v",b:"v",d:"z"};return void 0===b[a.charAt(0)]?a:b[a.charAt(0)]+a.substring(1)}
//! moment.js locale configuration
//! locale : Bosnian [bs]
//! author : Nedim Cholich : https://github.com/frontyard
//! based on (hr) translation by Bojan Marković
function zd(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}function Ad(a){return a>1&&a<5&&1!==~~(a/10)}function Bd(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"pár sekund":"pár sekundami";case"m":return b?"minuta":d?"minutu":"minutou";case"mm":return b||d?e+(Ad(a)?"minuty":"minut"):e+"minutami";break;case"h":return b?"hodina":d?"hodinu":"hodinou";case"hh":return b||d?e+(Ad(a)?"hodiny":"hodin"):e+"hodinami";break;case"d":return b||d?"den":"dnem";case"dd":return b||d?e+(Ad(a)?"dny":"dní"):e+"dny";break;case"M":return b||d?"měsíc":"měsícem";case"MM":return b||d?e+(Ad(a)?"měsíce":"měsíců"):e+"měsíci";break;case"y":return b||d?"rok":"rokem";case"yy":return b||d?e+(Ad(a)?"roky":"let"):e+"lety"}}
//! moment.js locale configuration
//! locale : German (Austria) [de-at]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Martin Groller : https://github.com/MadMG
//! author : Mikolaj Dadela : https://github.com/mik01aj
function Cd(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : German (Switzerland) [de-ch]
//! author : sschueller : https://github.com/sschueller
function Dd(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : German [de]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Mikolaj Dadela : https://github.com/mik01aj
function Ed(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : Estonian [et]
//! author : Henry Kehlmann : https://github.com/madhenry
//! improvements : Illimar Tambek : https://github.com/ragulka
function Fd(a,b,c,d){var e={s:["mõne sekundi","mõni sekund","paar sekundit"],m:["ühe minuti","üks minut"],mm:[a+" minuti",a+" minutit"],h:["ühe tunni","tund aega","üks tund"],hh:[a+" tunni",a+" tundi"],d:["ühe päeva","üks päev"],M:["kuu aja","kuu aega","üks kuu"],MM:[a+" kuu",a+" kuud"],y:["ühe aasta","aasta","üks aasta"],yy:[a+" aasta",a+" aastat"]};return b?e[c][2]?e[c][2]:e[c][1]:d?e[c][0]:e[c][1]}function Gd(a,b,c,d){var e="";switch(c){case"s":return d?"muutaman sekunnin":"muutama sekunti";case"m":return d?"minuutin":"minuutti";case"mm":e=d?"minuutin":"minuuttia";break;case"h":return d?"tunnin":"tunti";case"hh":e=d?"tunnin":"tuntia";break;case"d":return d?"päivän":"päivä";case"dd":e=d?"päivän":"päivää";break;case"M":return d?"kuukauden":"kuukausi";case"MM":e=d?"kuukauden":"kuukautta";break;case"y":return d?"vuoden":"vuosi";case"yy":e=d?"vuoden":"vuotta"}return e=Hd(a,d)+" "+e}function Hd(a,b){return a<10?b?$g[a]:Zg[a]:a}
//! moment.js locale configuration
//! locale : Konkani Latin script [gom-latn]
//! author : The Discoverer : https://github.com/WikiDiscoverer
function Id(a,b,c,d){var e={s:["thodde secondanim","thodde second"],m:["eka mintan","ek minute"],mm:[a+" mintanim",a+" mintam"],h:["eka horan","ek hor"],hh:[a+" horanim",a+" hor"],d:["eka disan","ek dis"],dd:[a+" disanim",a+" dis"],M:["eka mhoinean","ek mhoino"],MM:[a+" mhoineanim",a+" mhoine"],y:["eka vorsan","ek voros"],yy:[a+" vorsanim",a+" vorsam"]};return b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : Croatian [hr]
//! author : Bojan Marković : https://github.com/bmarkovic
function Jd(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}function Kd(a,b,c,d){var e=a;switch(c){case"s":return d||b?"néhány másodperc":"néhány másodperce";case"m":return"egy"+(d||b?" perc":" perce");case"mm":return e+(d||b?" perc":" perce");case"h":return"egy"+(d||b?" óra":" órája");case"hh":return e+(d||b?" óra":" órája");case"d":return"egy"+(d||b?" nap":" napja");case"dd":return e+(d||b?" nap":" napja");case"M":return"egy"+(d||b?" hónap":" hónapja");case"MM":return e+(d||b?" hónap":" hónapja");case"y":return"egy"+(d||b?" év":" éve");case"yy":return e+(d||b?" év":" éve")}return""}function Ld(a){return(a?"":"[múlt] ")+"["+ih[this.day()]+"] LT[-kor]"}
//! moment.js locale configuration
//! locale : Icelandic [is]
//! author : Hinrik Örn Sigurðsson : https://github.com/hinrik
function Md(a){return a%100===11||a%10!==1}function Nd(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"nokkrar sekúndur":"nokkrum sekúndum";case"m":return b?"mínúta":"mínútu";case"mm":return Md(a)?e+(b||d?"mínútur":"mínútum"):b?e+"mínúta":e+"mínútu";case"hh":return Md(a)?e+(b||d?"klukkustundir":"klukkustundum"):e+"klukkustund";case"d":return b?"dagur":d?"dag":"degi";case"dd":return Md(a)?b?e+"dagar":e+(d?"daga":"dögum"):b?e+"dagur":e+(d?"dag":"degi");case"M":return b?"mánuður":d?"mánuð":"mánuði";case"MM":return Md(a)?b?e+"mánuðir":e+(d?"mánuði":"mánuðum"):b?e+"mánuður":e+(d?"mánuð":"mánuði");case"y":return b||d?"ár":"ári";case"yy":return Md(a)?e+(b||d?"ár":"árum"):e+(b||d?"ár":"ári")}}
//! moment.js locale configuration
//! locale : Luxembourgish [lb]
//! author : mweimerskirch : https://github.com/mweimerskirch
//! author : David Raison : https://github.com/kwisatz
function Od(a,b,c,d){var e={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return b?e[c][0]:e[c][1]}function Pd(a){var b=a.substr(0,a.indexOf(" "));return Rd(b)?"a "+a:"an "+a}function Qd(a){var b=a.substr(0,a.indexOf(" "));return Rd(b)?"viru "+a:"virun "+a}function Rd(a){if(a=parseInt(a,10),isNaN(a))return!1;if(a<0)return!0;if(a<10)return 4<=a&&a<=7;if(a<100){var b=a%10,c=a/10;return Rd(0===b?c:b)}if(a<1e4){for(;a>=10;)a/=10;return Rd(a)}return a/=1e3,Rd(a)}function Sd(a,b,c,d){return b?"kelios sekundės":d?"kelių sekundžių":"kelias sekundes"}function Td(a,b,c,d){return b?Vd(c)[0]:d?Vd(c)[1]:Vd(c)[2]}function Ud(a){return a%10===0||a>10&&a<20}function Vd(a){return nh[a].split("_")}function Wd(a,b,c,d){var e=a+" ";return 1===a?e+Td(a,b,c[0],d):b?e+(Ud(a)?Vd(c)[1]:Vd(c)[0]):d?e+Vd(c)[1]:e+(Ud(a)?Vd(c)[1]:Vd(c)[2])}function Xd(a,b,c){return c?b%10===1&&b%100!==11?a[2]:a[3]:b%10===1&&b%100!==11?a[0]:a[1]}function Yd(a,b,c){return a+" "+Xd(oh[c],a,b)}function Zd(a,b,c){return Xd(oh[c],a,b)}function $d(a,b){return b?"dažas sekundes":"dažām sekundēm"}function _d(a,b,c,d){var e="";if(b)switch(c){case"s":e="काही सेकंद";break;case"m":e="एक मिनिट";break;case"mm":e="%d मिनिटे";break;case"h":e="एक तास";break;case"hh":e="%d तास";break;case"d":e="एक दिवस";break;case"dd":e="%d दिवस";break;case"M":e="एक महिना";break;case"MM":e="%d महिने";break;case"y":e="एक वर्ष";break;case"yy":e="%d वर्षे"}else switch(c){case"s":e="काही सेकंदां";break;case"m":e="एका मिनिटा";break;case"mm":e="%d मिनिटां";break;case"h":e="एका तासा";break;case"hh":e="%d तासां";break;case"d":e="एका दिवसा";break;case"dd":e="%d दिवसां";break;case"M":e="एका महिन्या";break;case"MM":e="%d महिन्यां";break;case"y":e="एका वर्षा";break;case"yy":e="%d वर्षां"}return e.replace(/%d/i,a)}function ae(a){return a%10<5&&a%10>1&&~~(a/10)%10!==1}function be(a,b,c){var d=a+" ";switch(c){case"m":return b?"minuta":"minutę";case"mm":return d+(ae(a)?"minuty":"minut");case"h":return b?"godzina":"godzinę";case"hh":return d+(ae(a)?"godziny":"godzin");case"MM":return d+(ae(a)?"miesiące":"miesięcy");case"yy":return d+(ae(a)?"lata":"lat")}}
//! moment.js locale configuration
//! locale : Romanian [ro]
//! author : Vlad Gurdiga : https://github.com/gurdiga
//! author : Valentin Agachi : https://github.com/avaly
function ce(a,b,c){var d={mm:"minute",hh:"ore",dd:"zile",MM:"luni",yy:"ani"},e=" ";return(a%100>=20||a>=100&&a%100===0)&&(e=" de "),a+e+d[c]}
//! moment.js locale configuration
//! locale : Russian [ru]
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensúle : https://github.com/Oire
//! author : Коренберг Марк : https://github.com/socketpair
function de(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&b%10<=4&&(b%100<10||b%100>=20)?c[1]:c[2]}function ee(a,b,c){var d={mm:b?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"};return"m"===c?b?"минута":"минуту":a+" "+de(d[c],+a)}function fe(a){return a>1&&a<5}function ge(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"pár sekúnd":"pár sekundami";case"m":return b?"minúta":d?"minútu":"minútou";case"mm":return b||d?e+(fe(a)?"minúty":"minút"):e+"minútami";break;case"h":return b?"hodina":d?"hodinu":"hodinou";case"hh":return b||d?e+(fe(a)?"hodiny":"hodín"):e+"hodinami";break;case"d":return b||d?"deň":"dňom";case"dd":return b||d?e+(fe(a)?"dni":"dní"):e+"dňami";break;case"M":return b||d?"mesiac":"mesiacom";case"MM":return b||d?e+(fe(a)?"mesiace":"mesiacov"):e+"mesiacmi";break;case"y":return b||d?"rok":"rokom";case"yy":return b||d?e+(fe(a)?"roky":"rokov"):e+"rokmi"}}
//! moment.js locale configuration
//! locale : Slovenian [sl]
//! author : Robert Sedovšek : https://github.com/sedovsek
function he(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"nekaj sekund":"nekaj sekundami";case"m":return b?"ena minuta":"eno minuto";case"mm":return e+=1===a?b?"minuta":"minuto":2===a?b||d?"minuti":"minutama":a<5?b||d?"minute":"minutami":b||d?"minut":"minutami";case"h":return b?"ena ura":"eno uro";case"hh":return e+=1===a?b?"ura":"uro":2===a?b||d?"uri":"urama":a<5?b||d?"ure":"urami":b||d?"ur":"urami";case"d":return b||d?"en dan":"enim dnem";case"dd":return e+=1===a?b||d?"dan":"dnem":2===a?b||d?"dni":"dnevoma":b||d?"dni":"dnevi";case"M":return b||d?"en mesec":"enim mesecem";case"MM":return e+=1===a?b||d?"mesec":"mesecem":2===a?b||d?"meseca":"mesecema":a<5?b||d?"mesece":"meseci":b||d?"mesecev":"meseci";case"y":return b||d?"eno leto":"enim letom";case"yy":return e+=1===a?b||d?"leto":"letom":2===a?b||d?"leti":"letoma":a<5?b||d?"leta":"leti":b||d?"let":"leti"}}function ie(a){var b=a;return b=a.indexOf("jaj")!==-1?b.slice(0,-3)+"leS":a.indexOf("jar")!==-1?b.slice(0,-3)+"waQ":a.indexOf("DIS")!==-1?b.slice(0,-3)+"nem":b+" pIq"}function je(a){var b=a;return b=a.indexOf("jaj")!==-1?b.slice(0,-3)+"Hu’":a.indexOf("jar")!==-1?b.slice(0,-3)+"wen":a.indexOf("DIS")!==-1?b.slice(0,-3)+"ben":b+" ret"}function ke(a,b,c,d){var e=le(a);switch(c){case"mm":return e+" tup";case"hh":return e+" rep";case"dd":return e+" jaj";case"MM":return e+" jar";case"yy":return e+" DIS"}}function le(a){var b=Math.floor(a%1e3/100),c=Math.floor(a%100/10),d=a%10,e="";return b>0&&(e+=Rh[b]+"vatlh"),c>0&&(e+=(""!==e?" ":"")+Rh[c]+"maH"),d>0&&(e+=(""!==e?" ":"")+Rh[d]),""===e?"pagh":e}function me(a,b,c,d){var e={s:["viensas secunds","'iensas secunds"],m:["'n míut","'iens míut"],mm:[a+" míuts",""+a+" míuts"],h:["'n þora","'iensa þora"],hh:[a+" þoras",""+a+" þoras"],d:["'n ziua","'iensa ziua"],dd:[a+" ziuas",""+a+" ziuas"],M:["'n mes","'iens mes"],MM:[a+" mesen",""+a+" mesen"],y:["'n ar","'iens ar"],yy:[a+" ars",""+a+" ars"]};return d?e[c][0]:b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : Ukrainian [uk]
//! author : zemlanin : https://github.com/zemlanin
//! Author : Menelion Elensúle : https://github.com/Oire
function ne(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&b%10<=4&&(b%100<10||b%100>=20)?c[1]:c[2]}function oe(a,b,c){var d={mm:b?"хвилина_хвилини_хвилин":"хвилину_хвилини_хвилин",hh:b?"година_години_годин":"годину_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"};return"m"===c?b?"хвилина":"хвилину":"h"===c?b?"година":"годину":a+" "+ne(d[c],+a)}function pe(a,b){var c={nominative:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),accusative:"неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),genitive:"неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")};if(!a)return c.nominative;var d=/(\[[ВвУу]\]) ?dddd/.test(b)?"accusative":/\[?(?:минулої|наступної)? ?\] ?dddd/.test(b)?"genitive":"nominative";return c[d][a.day()]}function qe(a){return function(){return a+"о"+(11===this.hours()?"б":"")+"] LT"}}var re,se;se=Array.prototype.some?Array.prototype.some:function(a){for(var b=Object(this),c=b.length>>>0,d=0;d<c;d++)if(d in b&&a.call(this,b[d],d,b))return!0;return!1};var te=se,ue=a.momentProperties=[],ve=!1,we={};a.suppressDeprecationWarnings=!1,a.deprecationHandler=null;var xe;xe=Object.keys?Object.keys:function(a){var b,c=[];for(b in a)j(a,b)&&c.push(b);return c};var ye,ze=xe,Ae={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},Be={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},Ce="Invalid date",De="%d",Ee=/\d{1,2}/,Fe={future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},Ge={},He={},Ie=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,Je=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Ke={},Le={},Me=/\d/,Ne=/\d\d/,Oe=/\d{3}/,Pe=/\d{4}/,Qe=/[+-]?\d{6}/,Re=/\d\d?/,Se=/\d\d\d\d?/,Te=/\d\d\d\d\d\d?/,Ue=/\d{1,3}/,Ve=/\d{1,4}/,We=/[+-]?\d{1,6}/,Xe=/\d+/,Ye=/[+-]?\d+/,Ze=/Z|[+-]\d\d:?\d\d/gi,$e=/Z|[+-]\d\d(?::?\d\d)?/gi,_e=/[+-]?\d+(\.\d{1,3})?/,af=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,bf={},cf={},df=0,ef=1,ff=2,gf=3,hf=4,jf=5,kf=6,lf=7,mf=8;ye=Array.prototype.indexOf?Array.prototype.indexOf:function(a){var b;for(b=0;b<this.length;++b)if(this[b]===a)return b;return-1};var nf=ye;U("M",["MM",2],"Mo",function(){return this.month()+1}),U("MMM",0,0,function(a){return this.localeData().monthsShort(this,a)}),U("MMMM",0,0,function(a){return this.localeData().months(this,a)}),J("month","M"),M("month",8),Z("M",Re),Z("MM",Re,Ne),Z("MMM",function(a,b){return b.monthsShortRegex(a)}),Z("MMMM",function(a,b){return b.monthsRegex(a)}),ba(["M","MM"],function(a,b){b[ef]=u(a)-1}),ba(["MMM","MMMM"],function(a,b,c,d){var e=c._locale.monthsParse(a,d,c._strict);null!=e?b[ef]=e:n(c).invalidMonth=a});var of=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,pf="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),qf="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),rf=af,sf=af;U("Y",0,0,function(){var a=this.year();return a<=9999?""+a:"+"+a}),U(0,["YY",2],0,function(){return this.year()%100}),U(0,["YYYY",4],0,"year"),U(0,["YYYYY",5],0,"year"),U(0,["YYYYYY",6,!0],0,"year"),J("year","y"),M("year",1),Z("Y",Ye),Z("YY",Re,Ne),Z("YYYY",Ve,Pe),Z("YYYYY",We,Qe),Z("YYYYYY",We,Qe),ba(["YYYYY","YYYYYY"],df),ba("YYYY",function(b,c){c[df]=2===b.length?a.parseTwoDigitYear(b):u(b)}),ba("YY",function(b,c){c[df]=a.parseTwoDigitYear(b)}),ba("Y",function(a,b){b[df]=parseInt(a,10)}),a.parseTwoDigitYear=function(a){return u(a)+(u(a)>68?1900:2e3)};var tf=O("FullYear",!0);U("w",["ww",2],"wo","week"),U("W",["WW",2],"Wo","isoWeek"),J("week","w"),J("isoWeek","W"),M("week",5),M("isoWeek",5),Z("w",Re),Z("ww",Re,Ne),Z("W",Re),Z("WW",Re,Ne),ca(["w","ww","W","WW"],function(a,b,c,d){b[d.substr(0,1)]=u(a)});var uf={dow:0,doy:6};U("d",0,"do","day"),U("dd",0,0,function(a){return this.localeData().weekdaysMin(this,a)}),U("ddd",0,0,function(a){return this.localeData().weekdaysShort(this,a)}),U("dddd",0,0,function(a){return this.localeData().weekdays(this,a)}),U("e",0,0,"weekday"),U("E",0,0,"isoWeekday"),J("day","d"),J("weekday","e"),J("isoWeekday","E"),M("day",11),M("weekday",11),M("isoWeekday",11),Z("d",Re),Z("e",Re),Z("E",Re),Z("dd",function(a,b){return b.weekdaysMinRegex(a)}),Z("ddd",function(a,b){return b.weekdaysShortRegex(a)}),Z("dddd",function(a,b){return b.weekdaysRegex(a)}),ca(["dd","ddd","dddd"],function(a,b,c,d){var e=c._locale.weekdaysParse(a,d,c._strict);null!=e?b.d=e:n(c).invalidWeekday=a}),ca(["d","e","E"],function(a,b,c,d){b[d]=u(a)});var vf="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),wf="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),xf="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),yf=af,zf=af,Af=af;U("H",["HH",2],0,"hour"),U("h",["hh",2],0,Ra),U("k",["kk",2],0,Sa),U("hmm",0,0,function(){return""+Ra.apply(this)+T(this.minutes(),2)}),U("hmmss",0,0,function(){return""+Ra.apply(this)+T(this.minutes(),2)+T(this.seconds(),2)}),U("Hmm",0,0,function(){return""+this.hours()+T(this.minutes(),2)}),U("Hmmss",0,0,function(){return""+this.hours()+T(this.minutes(),2)+T(this.seconds(),2)}),Ta("a",!0),Ta("A",!1),J("hour","h"),M("hour",13),Z("a",Ua),Z("A",Ua),Z("H",Re),Z("h",Re),Z("k",Re),Z("HH",Re,Ne),Z("hh",Re,Ne),Z("kk",Re,Ne),Z("hmm",Se),Z("hmmss",Te),Z("Hmm",Se),Z("Hmmss",Te),ba(["H","HH"],gf),ba(["k","kk"],function(a,b,c){var d=u(a);b[gf]=24===d?0:d}),ba(["a","A"],function(a,b,c){c._isPm=c._locale.isPM(a),c._meridiem=a}),ba(["h","hh"],function(a,b,c){b[gf]=u(a),n(c).bigHour=!0}),ba("hmm",function(a,b,c){var d=a.length-2;b[gf]=u(a.substr(0,d)),b[hf]=u(a.substr(d)),n(c).bigHour=!0}),ba("hmmss",function(a,b,c){var d=a.length-4,e=a.length-2;b[gf]=u(a.substr(0,d)),b[hf]=u(a.substr(d,2)),b[jf]=u(a.substr(e)),n(c).bigHour=!0}),ba("Hmm",function(a,b,c){var d=a.length-2;b[gf]=u(a.substr(0,d)),b[hf]=u(a.substr(d))}),ba("Hmmss",function(a,b,c){var d=a.length-4,e=a.length-2;b[gf]=u(a.substr(0,d)),b[hf]=u(a.substr(d,2)),b[jf]=u(a.substr(e))});var Bf,Cf=/[ap]\.?m?\.?/i,Df=O("Hours",!0),Ef={calendar:Ae,longDateFormat:Be,invalidDate:Ce,ordinal:De,dayOfMonthOrdinalParse:Ee,relativeTime:Fe,months:pf,monthsShort:qf,week:uf,weekdays:vf,weekdaysMin:xf,weekdaysShort:wf,meridiemParse:Cf},Ff={},Gf={},Hf=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,If=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,Jf=/Z|[+-]\d\d(?::?\d\d)?/,Kf=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],Lf=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],Mf=/^\/?Date\((\-?\d+)/i,Nf=/^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;a.createFromInputFallback=x("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),a.ISO_8601=function(){},a.RFC_2822=function(){};var Of=x("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var a=tb.apply(null,arguments);return this.isValid()&&a.isValid()?a<this?this:a:p()}),Pf=x("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var a=tb.apply(null,arguments);return this.isValid()&&a.isValid()?a>this?this:a:p()}),Qf=function(){return Date.now?Date.now():+new Date},Rf=["year","quarter","month","week","day","hour","minute","second","millisecond"];Db("Z",":"),Db("ZZ",""),Z("Z",$e),Z("ZZ",$e),ba(["Z","ZZ"],function(a,b,c){c._useUTC=!0,c._tzm=Eb($e,a)});var Sf=/([\+\-]|\d\d)/gi;a.updateOffset=function(){};var Tf=/^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,Uf=/^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;Sb.fn=Ab.prototype,Sb.invalid=zb;var Vf=Wb(1,"add"),Wf=Wb(-1,"subtract");a.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",a.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var Xf=x("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(a){return void 0===a?this.localeData():this.locale(a)});U(0,["gg",2],0,function(){return this.weekYear()%100}),U(0,["GG",2],0,function(){return this.isoWeekYear()%100}),Dc("gggg","weekYear"),Dc("ggggg","weekYear"),Dc("GGGG","isoWeekYear"),Dc("GGGGG","isoWeekYear"),J("weekYear","gg"),J("isoWeekYear","GG"),M("weekYear",1),M("isoWeekYear",1),Z("G",Ye),Z("g",Ye),Z("GG",Re,Ne),Z("gg",Re,Ne),Z("GGGG",Ve,Pe),Z("gggg",Ve,Pe),Z("GGGGG",We,Qe),Z("ggggg",We,Qe),ca(["gggg","ggggg","GGGG","GGGGG"],function(a,b,c,d){b[d.substr(0,2)]=u(a)}),ca(["gg","GG"],function(b,c,d,e){c[e]=a.parseTwoDigitYear(b)}),U("Q",0,"Qo","quarter"),J("quarter","Q"),M("quarter",7),Z("Q",Me),ba("Q",function(a,b){b[ef]=3*(u(a)-1)}),U("D",["DD",2],"Do","date"),J("date","D"),M("date",9),Z("D",Re),Z("DD",Re,Ne),Z("Do",function(a,b){return a?b._dayOfMonthOrdinalParse||b._ordinalParse:b._dayOfMonthOrdinalParseLenient}),ba(["D","DD"],ff),ba("Do",function(a,b){b[ff]=u(a.match(Re)[0],10)});var Yf=O("Date",!0);U("DDD",["DDDD",3],"DDDo","dayOfYear"),J("dayOfYear","DDD"),M("dayOfYear",4),Z("DDD",Ue),Z("DDDD",Oe),ba(["DDD","DDDD"],function(a,b,c){c._dayOfYear=u(a)}),U("m",["mm",2],0,"minute"),J("minute","m"),M("minute",14),Z("m",Re),Z("mm",Re,Ne),ba(["m","mm"],hf);var Zf=O("Minutes",!1);U("s",["ss",2],0,"second"),J("second","s"),M("second",15),Z("s",Re),Z("ss",Re,Ne),ba(["s","ss"],jf);var $f=O("Seconds",!1);U("S",0,0,function(){return~~(this.millisecond()/100)}),U(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),U(0,["SSS",3],0,"millisecond"),U(0,["SSSS",4],0,function(){return 10*this.millisecond()}),U(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),U(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),U(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),U(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),U(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),J("millisecond","ms"),M("millisecond",16),Z("S",Ue,Me),Z("SS",Ue,Ne),Z("SSS",Ue,Oe);var _f;for(_f="SSSS";_f.length<=9;_f+="S")Z(_f,Xe);for(_f="S";_f.length<=9;_f+="S")ba(_f,Mc);var ag=O("Milliseconds",!1);U("z",0,0,"zoneAbbr"),U("zz",0,0,"zoneName");var bg=r.prototype;bg.add=Vf,bg.calendar=Zb,bg.clone=$b,bg.diff=fc,bg.endOf=sc,bg.format=kc,bg.from=lc,bg.fromNow=mc,bg.to=nc,bg.toNow=oc,bg.get=R,bg.invalidAt=Bc,bg.isAfter=_b,bg.isBefore=ac,bg.isBetween=bc,bg.isSame=cc,bg.isSameOrAfter=dc,bg.isSameOrBefore=ec,bg.isValid=zc,bg.lang=Xf,bg.locale=pc,bg.localeData=qc,bg.max=Pf,bg.min=Of,bg.parsingFlags=Ac,bg.set=S,bg.startOf=rc,bg.subtract=Wf,bg.toArray=wc,bg.toObject=xc,bg.toDate=vc,bg.toISOString=ic,bg.inspect=jc,bg.toJSON=yc,bg.toString=hc,bg.unix=uc,bg.valueOf=tc,bg.creationData=Cc,bg.year=tf,bg.isLeapYear=ra,bg.weekYear=Ec,bg.isoWeekYear=Fc,bg.quarter=bg.quarters=Kc,bg.month=ka,bg.daysInMonth=la,bg.week=bg.weeks=Ba,bg.isoWeek=bg.isoWeeks=Ca,bg.weeksInYear=Hc,bg.isoWeeksInYear=Gc,bg.date=Yf,bg.day=bg.days=Ka,bg.weekday=La,bg.isoWeekday=Ma,bg.dayOfYear=Lc,bg.hour=bg.hours=Df,bg.minute=bg.minutes=Zf,bg.second=bg.seconds=$f,bg.millisecond=bg.milliseconds=ag,bg.utcOffset=Hb,bg.utc=Jb,bg.local=Kb,bg.parseZone=Lb,bg.hasAlignedHourOffset=Mb,bg.isDST=Nb,bg.isLocal=Pb,bg.isUtcOffset=Qb,bg.isUtc=Rb,bg.isUTC=Rb,bg.zoneAbbr=Nc,bg.zoneName=Oc,bg.dates=x("dates accessor is deprecated. Use date instead.",Yf),bg.months=x("months accessor is deprecated. Use month instead",ka),bg.years=x("years accessor is deprecated. Use year instead",tf),bg.zone=x("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",Ib),bg.isDSTShifted=x("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",Ob);var cg=C.prototype;cg.calendar=D,cg.longDateFormat=E,cg.invalidDate=F,cg.ordinal=G,cg.preparse=Rc,cg.postformat=Rc,cg.relativeTime=H,cg.pastFuture=I,cg.set=A,cg.months=fa,cg.monthsShort=ga,cg.monthsParse=ia,cg.monthsRegex=na,cg.monthsShortRegex=ma,cg.week=ya,cg.firstDayOfYear=Aa,cg.firstDayOfWeek=za,cg.weekdays=Fa,cg.weekdaysMin=Ha,cg.weekdaysShort=Ga,cg.weekdaysParse=Ja,cg.weekdaysRegex=Na,cg.weekdaysShortRegex=Oa,cg.weekdaysMinRegex=Pa,cg.isPM=Va,cg.meridiem=Wa,$a("en",{dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===u(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),a.lang=x("moment.lang is deprecated. Use moment.locale instead.",$a),a.langData=x("moment.langData is deprecated. Use moment.localeData instead.",bb);var dg=Math.abs,eg=id("ms"),fg=id("s"),gg=id("m"),hg=id("h"),ig=id("d"),jg=id("w"),kg=id("M"),lg=id("y"),mg=kd("milliseconds"),ng=kd("seconds"),og=kd("minutes"),pg=kd("hours"),qg=kd("days"),rg=kd("months"),sg=kd("years"),tg=Math.round,ug={ss:44,s:45,m:45,h:22,d:26,M:11},vg=Math.abs,wg=Ab.prototype;wg.isValid=yb,wg.abs=$c,wg.add=ad,wg.subtract=bd,wg.as=gd,wg.asMilliseconds=eg,wg.asSeconds=fg,wg.asMinutes=gg,wg.asHours=hg,wg.asDays=ig,wg.asWeeks=jg,wg.asMonths=kg,wg.asYears=lg,wg.valueOf=hd,wg._bubble=dd,wg.get=jd,wg.milliseconds=mg,wg.seconds=ng,wg.minutes=og,wg.hours=pg,wg.days=qg,wg.weeks=ld,wg.months=rg,wg.years=sg,wg.humanize=qd,wg.toISOString=rd,wg.toString=rd,wg.toJSON=rd,wg.locale=pc,wg.localeData=qc,wg.toIsoString=x("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",rd),wg.lang=Xf,U("X",0,0,"unix"),U("x",0,0,"valueOf"),Z("x",Ye),Z("X",_e),ba("X",function(a,b,c){c._d=new Date(1e3*parseFloat(a,10))}),ba("x",function(a,b,c){c._d=new Date(u(a))}),
//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
a.version="2.18.1",b(tb),a.fn=bg,a.min=vb,a.max=wb,a.now=Qf,a.utc=l,a.unix=Pc,a.months=Vc,a.isDate=h,a.locale=$a,a.invalid=p,a.duration=Sb,a.isMoment=s,a.weekdays=Xc,a.parseZone=Qc,a.localeData=bb,a.isDuration=Bb,a.monthsShort=Wc,a.weekdaysMin=Zc,a.defineLocale=_a,a.updateLocale=ab,a.locales=cb,a.weekdaysShort=Yc,a.normalizeUnits=K,a.relativeTimeRounding=od,a.relativeTimeThreshold=pd,a.calendarFormat=Yb,a.prototype=bg,
//! moment.js locale configuration
//! locale : Afrikaans [af]
//! author : Werner Mollentze : https://github.com/wernerm
a.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(a){return/^nm$/i.test(a)},meridiem:function(a,b,c){return a<12?c?"vm":"VM":c?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[Môre om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Arabic (Algeria) [ar-dz]
//! author : Noureddine LOUAHEDJ : https://github.com/noureddineme
a.defineLocale("ar-dz",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"أح_إث_ثلا_أر_خم_جم_سب".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:0,doy:4}}),
//! moment.js locale configuration
//! locale : Arabic (Kuwait) [ar-kw]
//! author : Nusret Parlak: https://github.com/nusretparlak
a.defineLocale("ar-kw",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:0,doy:12}});
//! moment.js locale configuration
//! locale : Arabic (Lybia) [ar-ly]
//! author : Ali Hmer: https://github.com/kikoanis
var xg={1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",0:"0"},yg=function(a){return 0===a?0:1===a?1:2===a?2:a%100>=3&&a%100<=10?3:a%100>=11?4:5},zg={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},Ag=function(a){return function(b,c,d,e){var f=yg(b),g=zg[a][yg(b)];return 2===f&&(g=g[c?0:1]),g.replace(/%d/i,b)}},Bg=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];a.defineLocale("ar-ly",{months:Bg,monthsShort:Bg,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return a<12?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:Ag("s"),m:Ag("m"),mm:Ag("m"),h:Ag("h"),hh:Ag("h"),d:Ag("d"),dd:Ag("d"),M:Ag("M"),MM:Ag("M"),y:Ag("y"),yy:Ag("y")},preparse:function(a){return a.replace(/\u200f/g,"").replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return xg[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}}),
//! moment.js locale configuration
//! locale : Arabic (Morocco) [ar-ma]
//! author : ElFadili Yassine : https://github.com/ElFadiliY
//! author : Abdel Said : https://github.com/abdelsaid
a.defineLocale("ar-ma",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:6,doy:12}});
//! moment.js locale configuration
//! locale : Arabic (Saudi Arabia) [ar-sa]
//! author : Suhail Alkowaileet : https://github.com/xsoh
var Cg={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},Dg={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"};a.defineLocale("ar-sa",{months:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return a<12?"ص":"م"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},preparse:function(a){return a.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return Dg[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return Cg[a]}).replace(/,/g,"،")},week:{dow:0,doy:6}}),
//! moment.js locale configuration
//! locale  :  Arabic (Tunisia) [ar-tn]
//! author : Nader Toukabri : https://github.com/naderio
a.defineLocale("ar-tn",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Arabic [ar]
//! author : Abdel Said: https://github.com/abdelsaid
//! author : Ahmed Elkhatib
//! author : forabi https://github.com/forabi
var Eg={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},Fg={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},Gg=function(a){return 0===a?0:1===a?1:2===a?2:a%100>=3&&a%100<=10?3:a%100>=11?4:5},Hg={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},Ig=function(a){return function(b,c,d,e){var f=Gg(b),g=Hg[a][Gg(b)];return 2===f&&(g=g[c?0:1]),g.replace(/%d/i,b)}},Jg=["كانون الثاني يناير","شباط فبراير","آذار مارس","نيسان أبريل","أيار مايو","حزيران يونيو","تموز يوليو","آب أغسطس","أيلول سبتمبر","تشرين الأول أكتوبر","تشرين الثاني نوفمبر","كانون الأول ديسمبر"];a.defineLocale("ar",{months:Jg,monthsShort:Jg,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return a<12?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:Ig("s"),m:Ig("m"),mm:Ig("m"),h:Ig("h"),hh:Ig("h"),d:Ig("d"),dd:Ig("d"),M:Ig("M"),MM:Ig("M"),y:Ig("y"),yy:Ig("y")},preparse:function(a){return a.replace(/\u200f/g,"").replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return Fg[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return Eg[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}});
//! moment.js locale configuration
//! locale : Azerbaijani [az]
//! author : topchiyev : https://github.com/topchiyev
var Kg={1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-üncü",4:"-üncü",100:"-üncü",6:"-ncı",9:"-uncu",10:"-uncu",30:"-uncu",60:"-ıncı",90:"-ıncı"};a.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),weekdaysShort:"Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),weekdaysMin:"Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gələn həftə] dddd [saat] LT",lastDay:"[dünən] LT",lastWeek:"[keçən həftə] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s əvvəl",s:"birneçə saniyyə",m:"bir dəqiqə",mm:"%d dəqiqə",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecə|səhər|gündüz|axşam/,isPM:function(a){return/^(gündüz|axşam)$/.test(a)},meridiem:function(a,b,c){return a<4?"gecə":a<12?"səhər":a<17?"gündüz":"axşam"},dayOfMonthOrdinalParse:/\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,ordinal:function(a){if(0===a)return a+"-ıncı";var b=a%10,c=a%100-b,d=a>=100?100:null;return a+(Kg[b]||Kg[c]||Kg[d])},week:{dow:1,doy:7}}),a.defineLocale("be",{months:{format:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_"),standalone:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_")},monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:{format:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_"),standalone:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),isFormat:/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/},weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:td,mm:td,h:td,hh:td,d:"дзень",dd:td,M:"месяц",MM:td,y:"год",yy:td},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(a){return/^(дня|вечара)$/.test(a)},meridiem:function(a,b,c){return a<4?"ночы":a<12?"раніцы":a<17?"дня":"вечара"},dayOfMonthOrdinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a%10!==2&&a%10!==3||a%100===12||a%100===13?a+"-ы":a+"-і";case"D":return a+"-га";default:return a}},week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Bulgarian [bg]
//! author : Krasen Borisov : https://github.com/kraz
a.defineLocale("bg",{months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},dayOfMonthOrdinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&c<20?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}});
//! moment.js locale configuration
//! locale : Bengali [bn]
//! author : Kaushik Gandhi : https://github.com/kaushikgandhi
var Lg={1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",0:"০"},Mg={"১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9","০":"0"};a.defineLocale("bn",{months:"জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),monthsShort:"জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে".split("_"),weekdays:"রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার".split("_"),weekdaysShort:"রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি".split("_"),weekdaysMin:"রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি".split("_"),longDateFormat:{LT:"A h:mm সময়",LTS:"A h:mm:ss সময়",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm সময়",LLLL:"dddd, D MMMM YYYY, A h:mm সময়"},calendar:{sameDay:"[আজ] LT",nextDay:"[আগামীকাল] LT",nextWeek:"dddd, LT",lastDay:"[গতকাল] LT",lastWeek:"[গত] dddd, LT",sameElse:"L"},relativeTime:{future:"%s পরে",past:"%s আগে",s:"কয়েক সেকেন্ড",m:"এক মিনিট",mm:"%d মিনিট",h:"এক ঘন্টা",hh:"%d ঘন্টা",d:"এক দিন",dd:"%d দিন",M:"এক মাস",MM:"%d মাস",y:"এক বছর",yy:"%d বছর"},preparse:function(a){return a.replace(/[১২৩৪৫৬৭৮৯০]/g,function(a){return Mg[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Lg[a]})},meridiemParse:/রাত|সকাল|দুপুর|বিকাল|রাত/,meridiemHour:function(a,b){return 12===a&&(a=0),"রাত"===b&&a>=4||"দুপুর"===b&&a<5||"বিকাল"===b?a+12:a},meridiem:function(a,b,c){return a<4?"রাত":a<10?"সকাল":a<17?"দুপুর":a<20?"বিকাল":"রাত"},week:{dow:0,doy:6}});
//! moment.js locale configuration
//! locale : Tibetan [bo]
//! author : Thupten N. Chakrishar : https://github.com/vajradog
var Ng={1:"༡",2:"༢",3:"༣",4:"༤",5:"༥",6:"༦",7:"༧",8:"༨",9:"༩",0:"༠"},Og={"༡":"1","༢":"2","༣":"3","༤":"4","༥":"5","༦":"6","༧":"7","༨":"8","༩":"9","༠":"0"};a.defineLocale("bo",{months:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),monthsShort:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),weekdays:"གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),weekdaysShort:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),weekdaysMin:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[དི་རིང] LT",nextDay:"[སང་ཉིན] LT",nextWeek:"[བདུན་ཕྲག་རྗེས་མ], LT",lastDay:"[ཁ་སང] LT",lastWeek:"[བདུན་ཕྲག་མཐའ་མ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ལ་",past:"%s སྔན་ལ",s:"ལམ་སང",m:"སྐར་མ་གཅིག",mm:"%d སྐར་མ",h:"ཆུ་ཚོད་གཅིག",hh:"%d ཆུ་ཚོད",d:"ཉིན་གཅིག",dd:"%d ཉིན་",M:"ཟླ་བ་གཅིག",MM:"%d ཟླ་བ",y:"ལོ་གཅིག",yy:"%d ལོ"},preparse:function(a){return a.replace(/[༡༢༣༤༥༦༧༨༩༠]/g,function(a){return Og[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Ng[a]})},meridiemParse:/མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,meridiemHour:function(a,b){return 12===a&&(a=0),"མཚན་མོ"===b&&a>=4||"ཉིན་གུང"===b&&a<5||"དགོང་དག"===b?a+12:a},meridiem:function(a,b,c){return a<4?"མཚན་མོ":a<10?"ཞོགས་ཀས":a<17?"ཉིན་གུང":a<20?"དགོང་དག":"མཚན་མོ"},week:{dow:0,doy:6}}),a.defineLocale("br",{months:"Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h[e]mm A",LTS:"h[e]mm:ss A",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY h[e]mm A",LLLL:"dddd, D [a viz] MMMM YYYY h[e]mm A"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[Warc'hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[Dec'h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s 'zo",s:"un nebeud segondennoù",m:"ur vunutenn",mm:ud,h:"un eur",hh:"%d eur",d:"un devezh",dd:ud,M:"ur miz",MM:ud,y:"ur bloaz",yy:vd},dayOfMonthOrdinalParse:/\d{1,2}(añ|vet)/,ordinal:function(a){var b=1===a?"añ":"vet";return a+b},week:{dow:1,doy:4}}),a.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:zd,mm:zd,h:zd,hh:zd,d:"dan",dd:zd,M:"mjesec",MM:zd,y:"godinu",yy:zd},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Catalan [ca]
//! author : Juan G. Hurtado : https://github.com/juanghurtado
a.defineLocale("ca",{months:{standalone:"gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),format:"de gener_de febrer_de març_d'abril_de maig_de juny_de juliol_d'agost_de setembre_d'octubre_de novembre_de desembre".split("_"),isFormat:/D[oD]?(\s)+MMMM/},monthsShort:"gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.".split("_"),monthsParseExact:!0,weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"[el] D MMMM [de] YYYY",ll:"D MMM YYYY",LLL:"[el] D MMMM [de] YYYY [a les] H:mm",lll:"D MMM YYYY, H:mm",LLLL:"[el] dddd D MMMM [de] YYYY [a les] H:mm",llll:"ddd D MMM YYYY, H:mm"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"},nextDay:function(){return"[demà a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"d'aquí %s",past:"fa %s",s:"uns segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},dayOfMonthOrdinalParse:/\d{1,2}(r|n|t|è|a)/,ordinal:function(a,b){var c=1===a?"r":2===a?"n":3===a?"r":4===a?"t":"è";return"w"!==b&&"W"!==b||(c="a"),a+c},week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Czech [cs]
//! author : petrbela : https://github.com/petrbela
var Pg="leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),Qg="led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");a.defineLocale("cs",{months:Pg,monthsShort:Qg,monthsParse:function(a,b){var c,d=[];for(c=0;c<12;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(Pg,Qg),shortMonthsParse:function(a){var b,c=[];for(b=0;b<12;b++)c[b]=new RegExp("^"+a[b]+"$","i");return c}(Qg),longMonthsParse:function(a){var b,c=[];for(b=0;b<12;b++)c[b]=new RegExp("^"+a[b]+"$","i");return c}(Pg),weekdays:"neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),weekdaysShort:"ne_po_út_st_čt_pá_so".split("_"),weekdaysMin:"ne_po_út_st_čt_pá_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm",l:"D. M. YYYY"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zítra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v neděli v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve středu v] LT";case 4:return"[ve čtvrtek v] LT";case 5:return"[v pátek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[včera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou neděli v] LT";case 1:case 2:return"[minulé] dddd [v] LT";case 3:return"[minulou středu v] LT";case 4:case 5:return"[minulý] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"před %s",s:Bd,m:Bd,mm:Bd,h:Bd,hh:Bd,d:Bd,dd:Bd,M:Bd,MM:Bd,y:Bd,yy:Bd},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Chuvash [cv]
//! author : Anatoly Mironov : https://github.com/mirontoli
a.defineLocale("cv",{months:"кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split("_"),monthsShort:"кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кҫ_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",LLL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm",LLLL:"dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ӗнер] LT [сехетре]",nextWeek:"[Ҫитес] dddd LT [сехетре]",lastWeek:"[Иртнӗ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:function(a){var b=/сехет$/i.exec(a)?"рен":/ҫул$/i.exec(a)?"тан":"ран";return a+b},past:"%s каялла",s:"пӗр-ик ҫеккунт",m:"пӗр минут",mm:"%d минут",h:"пӗр сехет",hh:"%d сехет",d:"пӗр кун",dd:"%d кун",M:"пӗр уйӑх",MM:"%d уйӑх",y:"пӗр ҫул",yy:"%d ҫул"},dayOfMonthOrdinalParse:/\d{1,2}-мӗш/,ordinal:"%d-мӗш",week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Welsh [cy]
//! author : Robert Allen : https://github.com/robgallen
//! author : https://github.com/ryangreaves
a.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},dayOfMonthOrdinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,ordinal:function(a){var b=a,c="",d=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed","eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"];return b>20?c=40===b||50===b||60===b||80===b||100===b?"fed":"ain":b>0&&(c=d[b]),a+c},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Danish [da]
//! author : Ulrik Nielsen : https://github.com/mrbase
a.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd [d.] D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"på dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[i] dddd[s kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en måned",MM:"%d måneder",y:"et år",yy:"%d år"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("de-at",{months:"Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:Cd,mm:"%d Minuten",h:Cd,hh:"%d Stunden",d:Cd,dd:Cd,M:Cd,MM:Cd,y:Cd,yy:Cd},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("de-ch",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._März_April_Mai_Juni_Juli_Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH.mm",LLLL:"dddd, D. MMMM YYYY HH.mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:Dd,mm:"%d Minuten",h:Dd,hh:"%d Stunden",d:Dd,dd:Dd,M:Dd,MM:Dd,y:Dd,yy:Dd},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:Ed,mm:"%d Minuten",h:Ed,hh:"%d Stunden",d:Ed,dd:Ed,M:Ed,MM:Ed,y:Ed,yy:Ed},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Maldivian [dv]
//! author : Jawish Hameed : https://github.com/jawish
var Rg=["ޖެނުއަރީ","ފެބްރުއަރީ","މާރިޗު","އޭޕްރީލު","މޭ","ޖޫން","ޖުލައި","އޯގަސްޓު","ސެޕްޓެމްބަރު","އޮކްޓޯބަރު","ނޮވެމްބަރު","ޑިސެމްބަރު"],Sg=["އާދިއްތަ","ހޯމަ","އަންގާރަ","ބުދަ","ބުރާސްފަތި","ހުކުރު","ހޮނިހިރު"];a.defineLocale("dv",{months:Rg,monthsShort:Rg,weekdays:Sg,weekdaysShort:Sg,weekdaysMin:"އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/M/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/މކ|މފ/,isPM:function(a){return"މފ"===a},meridiem:function(a,b,c){return a<12?"މކ":"މފ"},calendar:{sameDay:"[މިއަދު] LT",nextDay:"[މާދަމާ] LT",nextWeek:"dddd LT",lastDay:"[އިއްޔެ] LT",lastWeek:"[ފާއިތުވި] dddd LT",sameElse:"L"},relativeTime:{future:"ތެރޭގައި %s",past:"ކުރިން %s",s:"ސިކުންތުކޮޅެއް",m:"މިނިޓެއް",mm:"މިނިޓު %d",h:"ގަޑިއިރެއް",hh:"ގަޑިއިރު %d",d:"ދުވަހެއް",dd:"ދުވަސް %d",M:"މަހެއް",MM:"މަސް %d",y:"އަހަރެއް",yy:"އަހަރު %d"},preparse:function(a){return a.replace(/،/g,",")},postformat:function(a){return a.replace(/,/g,"،")},week:{dow:7,doy:12}}),
//! moment.js locale configuration
//! locale : Greek [el]
//! author : Aggelos Karalias : https://github.com/mehiel
a.defineLocale("el",{monthsNominativeEl:"Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),monthsGenitiveEl:"Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),months:function(a,b){return a?/D/.test(b.substring(0,b.indexOf("MMMM")))?this._monthsGenitiveEl[a.month()]:this._monthsNominativeEl[a.month()]:this._monthsNominativeEl},monthsShort:"Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),weekdays:"Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),weekdaysShort:"Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),weekdaysMin:"Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),meridiem:function(a,b,c){return a>11?c?"μμ":"ΜΜ":c?"πμ":"ΠΜ"},isPM:function(a){return"μ"===(a+"").toLowerCase()[0]},meridiemParse:/[ΠΜ]\.?Μ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendarEl:{sameDay:"[Σήμερα {}] LT",nextDay:"[Αύριο {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Χθες {}] LT",lastWeek:function(){switch(this.day()){case 6:return"[το προηγούμενο] dddd [{}] LT";default:return"[την προηγούμενη] dddd [{}] LT"}},sameElse:"L"},calendar:function(a,b){var c=this._calendarEl[a],d=b&&b.hours();return z(c)&&(c=c.apply(b)),c.replace("{}",d%12===1?"στη":"στις")},relativeTime:{future:"σε %s",past:"%s πριν",s:"λίγα δευτερόλεπτα",m:"ένα λεπτό",mm:"%d λεπτά",h:"μία ώρα",hh:"%d ώρες",d:"μία μέρα",dd:"%d μέρες",M:"ένας μήνας",MM:"%d μήνες",y:"ένας χρόνος",yy:"%d χρόνια"},dayOfMonthOrdinalParse:/\d{1,2}η/,ordinal:"%dη",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : English (Australia) [en-au]
//! author : Jared Morse : https://github.com/jarcoal
a.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : English (Canada) [en-ca]
//! author : Jonathan Abourbih : https://github.com/jonbca
a.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),
//! moment.js locale configuration
//! locale : English (United Kingdom) [en-gb]
//! author : Chris Gedrim : https://github.com/chrisgedrim
a.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : English (Ireland) [en-ie]
//! author : Chris Cartlidge : https://github.com/chriscartlidge
a.defineLocale("en-ie",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : English (New Zealand) [en-nz]
//! author : Luke McGregor : https://github.com/lukemcgregor
a.defineLocale("en-nz",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Esperanto [eo]
//! author : Colin Dean : https://github.com/colindean
//! author : Mia Nordentoft Imperatori : https://github.com/miestasmia
//! comment : miestasmia corrected the translation by colindean
a.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),weekdays:"dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato".split("_"),weekdaysShort:"dim_lun_mard_merk_ĵaŭ_ven_sab".split("_"),weekdaysMin:"di_lu_ma_me_ĵa_ve_sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D[-a de] MMMM, YYYY",LLL:"D[-a de] MMMM, YYYY HH:mm",LLLL:"dddd, [la] D[-a de] MMMM, YYYY HH:mm"},meridiemParse:/[ap]\.t\.m/i,isPM:function(a){return"p"===a.charAt(0).toLowerCase()},meridiem:function(a,b,c){return a>11?c?"p.t.m.":"P.T.M.":c?"a.t.m.":"A.T.M."},calendar:{sameDay:"[Hodiaŭ je] LT",nextDay:"[Morgaŭ je] LT",nextWeek:"dddd [je] LT",lastDay:"[Hieraŭ je] LT",lastWeek:"[pasinta] dddd [je] LT",sameElse:"L"},relativeTime:{future:"post %s",past:"antaŭ %s",s:"sekundoj",m:"minuto",mm:"%d minutoj",h:"horo",hh:"%d horoj",d:"tago",dd:"%d tagoj",M:"monato",MM:"%d monatoj",y:"jaro",yy:"%d jaroj"},dayOfMonthOrdinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,doy:7}});
//! moment.js locale configuration
//! locale : Spanish (Dominican Republic) [es-do]
var Tg="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),Ug="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_");a.defineLocale("es-do",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(a,b){return a?/-MMM-/.test(b)?Ug[a.month()]:Tg[a.month()]:Tg},monthsParseExact:!0,weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY h:mm A",LLLL:"dddd, D [de] MMMM [de] YYYY h:mm A"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Spanish [es]
//! author : Julio Napurí : https://github.com/julionc
var Vg="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),Wg="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_");a.defineLocale("es",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(a,b){return a?/-MMM-/.test(b)?Wg[a.month()]:Vg[a.month()]:Vg},monthsParseExact:!0,weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),a.defineLocale("et",{months:"jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[Täna,] LT",nextDay:"[Homme,] LT",nextWeek:"[Järgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pärast",past:"%s tagasi",s:Fd,m:Fd,mm:Fd,h:Fd,hh:Fd,d:Fd,dd:"%d päeva",M:Fd,MM:Fd,y:Fd,yy:Fd},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Basque [eu]
//! author : Eneko Illarramendi : https://github.com/eillarra
a.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),monthsParseExact:!0,weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] HH:mm",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] HH:mm",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] HH:mm",llll:"ddd, YYYY[ko] MMM D[a] HH:mm"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});
//! moment.js locale configuration
//! locale : Persian [fa]
//! author : Ebrahim Byagowi : https://github.com/ebraminio
var Xg={1:"۱",2:"۲",3:"۳",4:"۴",5:"۵",6:"۶",7:"۷",8:"۸",9:"۹",0:"۰"},Yg={"۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","۰":"0"};a.defineLocale("fa",{months:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),monthsShort:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),weekdays:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysShort:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysMin:"ی_د_س_چ_پ_ج_ش".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/قبل از ظهر|بعد از ظهر/,isPM:function(a){return/بعد از ظهر/.test(a)},meridiem:function(a,b,c){return a<12?"قبل از ظهر":"بعد از ظهر"},calendar:{sameDay:"[امروز ساعت] LT",nextDay:"[فردا ساعت] LT",nextWeek:"dddd [ساعت] LT",lastDay:"[دیروز ساعت] LT",lastWeek:"dddd [پیش] [ساعت] LT",sameElse:"L"},relativeTime:{future:"در %s",past:"%s پیش",s:"چند ثانیه",m:"یک دقیقه",mm:"%d دقیقه",h:"یک ساعت",hh:"%d ساعت",d:"یک روز",dd:"%d روز",M:"یک ماه",MM:"%d ماه",y:"یک سال",yy:"%d سال"},preparse:function(a){return a.replace(/[۰-۹]/g,function(a){return Yg[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return Xg[a]}).replace(/,/g,"،")},dayOfMonthOrdinalParse:/\d{1,2}م/,ordinal:"%dم",week:{dow:6,doy:12}});
//! moment.js locale configuration
//! locale : Finnish [fi]
//! author : Tarmo Aidantausta : https://github.com/bleadof
var Zg="nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" "),$g=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",Zg[7],Zg[8],Zg[9]];a.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] HH.mm",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] HH.mm",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] HH.mm",llll:"ddd, Do MMM YYYY, [klo] HH.mm"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:Gd,m:Gd,mm:Gd,h:Gd,hh:Gd,d:Gd,dd:Gd,M:Gd,MM:Gd,y:Gd,yy:Gd},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Faroese [fo]
//! author : Ragnar Johannesen : https://github.com/ragnar123
a.defineLocale("fo",{months:"januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mán_týs_mik_hós_frí_ley".split("_"),weekdaysMin:"su_má_tý_mi_hó_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D. MMMM, YYYY HH:mm"},calendar:{sameDay:"[Í dag kl.] LT",nextDay:"[Í morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Í gjár kl.] LT",lastWeek:"[síðstu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s síðani",s:"fá sekund",m:"ein minutt",mm:"%d minuttir",h:"ein tími",hh:"%d tímar",d:"ein dagur",dd:"%d dagar",M:"ein mánaði",MM:"%d mánaðir",y:"eitt ár",yy:"%d ár"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : French (Canada) [fr-ca]
//! author : Jonathan Abourbih : https://github.com/jonbca
a.defineLocale("fr-ca",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd’hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},dayOfMonthOrdinalParse:/\d{1,2}(er|e)/,ordinal:function(a,b){switch(b){default:case"M":case"Q":case"D":case"DDD":case"d":return a+(1===a?"er":"e");case"w":case"W":return a+(1===a?"re":"e")}}}),
//! moment.js locale configuration
//! locale : French (Switzerland) [fr-ch]
//! author : Gaspard Bucher : https://github.com/gaspard
a.defineLocale("fr-ch",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd’hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},dayOfMonthOrdinalParse:/\d{1,2}(er|e)/,ordinal:function(a,b){switch(b){default:case"M":case"Q":case"D":case"DDD":case"d":return a+(1===a?"er":"e");case"w":case"W":return a+(1===a?"re":"e")}},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : French [fr]
//! author : John Fischer : https://github.com/jfroffice
a.defineLocale("fr",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd’hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},dayOfMonthOrdinalParse:/\d{1,2}(er|)/,ordinal:function(a,b){switch(b){case"D":return a+(1===a?"er":"");default:case"M":case"Q":case"DDD":case"d":return a+(1===a?"er":"e");case"w":case"W":return a+(1===a?"re":"e")}},week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Frisian [fy]
//! author : Robin van der Vliet : https://github.com/robin0van0der0v
var _g="jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_"),ah="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_");a.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(a,b){return a?/-MMM-/.test(b)?ah[a.month()]:_g[a.month()]:_g},monthsParseExact:!0,weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[ôfrûne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",m:"ien minút",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Scottish Gaelic [gd]
//! author : Jon Ashdown : https://github.com/jonashdown
var bh=["Am Faoilleach","An Gearran","Am Màrt","An Giblean","An Cèitean","An t-Ògmhios","An t-Iuchar","An Lùnastal","An t-Sultain","An Dàmhair","An t-Samhain","An Dùbhlachd"],ch=["Faoi","Gear","Màrt","Gibl","Cèit","Ògmh","Iuch","Lùn","Sult","Dàmh","Samh","Dùbh"],dh=["Didòmhnaich","Diluain","Dimàirt","Diciadain","Diardaoin","Dihaoine","Disathairne"],eh=["Did","Dil","Dim","Dic","Dia","Dih","Dis"],fh=["Dò","Lu","Mà","Ci","Ar","Ha","Sa"];a.defineLocale("gd",{months:bh,monthsShort:ch,monthsParseExact:!0,weekdays:dh,weekdaysShort:eh,weekdaysMin:fh,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[An-diugh aig] LT",nextDay:"[A-màireach aig] LT",nextWeek:"dddd [aig] LT",lastDay:"[An-dè aig] LT",lastWeek:"dddd [seo chaidh] [aig] LT",sameElse:"L"},relativeTime:{future:"ann an %s",past:"bho chionn %s",s:"beagan diogan",m:"mionaid",mm:"%d mionaidean",h:"uair",hh:"%d uairean",d:"latha",dd:"%d latha",M:"mìos",MM:"%d mìosan",y:"bliadhna",yy:"%d bliadhna"},dayOfMonthOrdinalParse:/\d{1,2}(d|na|mh)/,ordinal:function(a){var b=1===a?"d":a%10===2?"na":"mh";return a+b},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Galician [gl]
//! author : Juan G. Hurtado : https://github.com/juanghurtado
a.defineLocale("gl",{months:"xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro".split("_"),monthsShort:"xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"domingo_luns_martes_mércores_xoves_venres_sábado".split("_"),weekdaysShort:"dom._lun._mar._mér._xov._ven._sáb.".split("_"),weekdaysMin:"do_lu_ma_mé_xo_ve_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"ás":"á")+"] LT"},nextDay:function(){return"[mañá "+(1!==this.hours()?"ás":"á")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(a){return 0===a.indexOf("un")?"n"+a:"en "+a},past:"hai %s",s:"uns segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),a.defineLocale("gom-latn",{months:"Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr".split("_"),monthsShort:"Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Aitar_Somar_Mongllar_Budvar_Brestar_Sukrar_Son'var".split("_"),weekdaysShort:"Ait._Som._Mon._Bud._Bre._Suk._Son.".split("_"),weekdaysMin:"Ai_Sm_Mo_Bu_Br_Su_Sn".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"A h:mm [vazta]",LTS:"A h:mm:ss [vazta]",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY A h:mm [vazta]",LLLL:"dddd, MMMM[achea] Do, YYYY, A h:mm [vazta]",llll:"ddd, D MMM YYYY, A h:mm [vazta]"},calendar:{sameDay:"[Aiz] LT",nextDay:"[Faleam] LT",nextWeek:"[Ieta to] dddd[,] LT",lastDay:"[Kal] LT",lastWeek:"[Fatlo] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%s",past:"%s adim",s:Id,m:Id,mm:Id,h:Id,hh:Id,d:Id,dd:Id,M:Id,MM:Id,y:Id,yy:Id},dayOfMonthOrdinalParse:/\d{1,2}(er)/,ordinal:function(a,b){switch(b){case"D":return a+"er";default:case"M":case"Q":case"DDD":case"d":case"w":case"W":return a}},week:{dow:1,doy:4},meridiemParse:/rati|sokalli|donparam|sanje/,meridiemHour:function(a,b){return 12===a&&(a=0),"rati"===b?a<4?a:a+12:"sokalli"===b?a:"donparam"===b?a>12?a:a+12:"sanje"===b?a+12:void 0},meridiem:function(a,b,c){return a<4?"rati":a<12?"sokalli":a<16?"donparam":a<20?"sanje":"rati"}}),
//! moment.js locale configuration
//! locale : Hebrew [he]
//! author : Tomer Cohen : https://github.com/tomer
//! author : Moshe Simantov : https://github.com/DevelopmentIL
//! author : Tal Ater : https://github.com/TalAter
a.defineLocale("he",{months:"ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),monthsShort:"ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),weekdays:"ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),weekdaysShort:"א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),weekdaysMin:"א_ב_ג_ד_ה_ו_ש".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [ב]MMMM YYYY",LLL:"D [ב]MMMM YYYY HH:mm",LLLL:"dddd, D [ב]MMMM YYYY HH:mm",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[היום ב־]LT",nextDay:"[מחר ב־]LT",nextWeek:"dddd [בשעה] LT",lastDay:"[אתמול ב־]LT",lastWeek:"[ביום] dddd [האחרון בשעה] LT",sameElse:"L"},relativeTime:{future:"בעוד %s",past:"לפני %s",s:"מספר שניות",m:"דקה",mm:"%d דקות",h:"שעה",hh:function(a){return 2===a?"שעתיים":a+" שעות"},d:"יום",dd:function(a){return 2===a?"יומיים":a+" ימים"},M:"חודש",MM:function(a){return 2===a?"חודשיים":a+" חודשים"},y:"שנה",yy:function(a){return 2===a?"שנתיים":a%10===0&&10!==a?a+" שנה":a+" שנים"}},meridiemParse:/אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,isPM:function(a){return/^(אחה"צ|אחרי הצהריים|בערב)$/.test(a)},meridiem:function(a,b,c){return a<5?"לפנות בוקר":a<10?"בבוקר":a<12?c?'לפנה"צ':"לפני הצהריים":a<18?c?'אחה"צ':"אחרי הצהריים":"בערב"}});
//! moment.js locale configuration
//! locale : Hindi [hi]
//! author : Mayank Singhal : https://github.com/mayanksinghal
var gh={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},hh={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};a.defineLocale("hi",{months:"जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),monthsShort:"जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),monthsParseExact:!0,weekdays:"रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm बजे",LTS:"A h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm बजे",LLLL:"dddd, D MMMM YYYY, A h:mm बजे"},calendar:{sameDay:"[आज] LT",nextDay:"[कल] LT",nextWeek:"dddd, LT",lastDay:"[कल] LT",lastWeek:"[पिछले] dddd, LT",sameElse:"L"},relativeTime:{future:"%s में",past:"%s पहले",s:"कुछ ही क्षण",m:"एक मिनट",mm:"%d मिनट",h:"एक घंटा",hh:"%d घंटे",d:"एक दिन",dd:"%d दिन",M:"एक महीने",MM:"%d महीने",y:"एक वर्ष",yy:"%d वर्ष"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return hh[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return gh[a]})},meridiemParse:/रात|सुबह|दोपहर|शाम/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात"===b?a<4?a:a+12:"सुबह"===b?a:"दोपहर"===b?a>=10?a:a+12:"शाम"===b?a+12:void 0},meridiem:function(a,b,c){return a<4?"रात":a<10?"सुबह":a<17?"दोपहर":a<20?"शाम":"रात"},week:{dow:0,doy:6}}),a.defineLocale("hr",{months:{format:"siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca".split("_"),standalone:"siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_")},monthsShort:"sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:Jd,mm:Jd,h:Jd,hh:Jd,d:"dan",dd:Jd,M:"mjesec",MM:Jd,y:"godinu",yy:Jd},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});
//! moment.js locale configuration
//! locale : Hungarian [hu]
//! author : Adam Brunner : https://github.com/adambrunner
var ih="vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ");a.defineLocale("hu",{months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D. H:mm",LLLL:"YYYY. MMMM D., dddd H:mm"},meridiemParse:/de|du/i,isPM:function(a){return"u"===a.charAt(1).toLowerCase()},meridiem:function(a,b,c){return a<12?c===!0?"de":"DE":c===!0?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return Ld.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return Ld.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:Kd,m:Kd,mm:Kd,h:Kd,hh:Kd,d:Kd,dd:Kd,M:Kd,MM:Kd,y:Kd,yy:Kd},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Armenian [hy-am]
//! author : Armendarabyan : https://github.com/armendarabyan
a.defineLocale("hy-am",{months:{format:"հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_"),standalone:"հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_")},monthsShort:"հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_"),weekdays:"կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_"),weekdaysShort:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),weekdaysMin:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY թ.",LLL:"D MMMM YYYY թ., HH:mm",LLLL:"dddd, D MMMM YYYY թ., HH:mm"},calendar:{sameDay:"[այսօր] LT",nextDay:"[վաղը] LT",lastDay:"[երեկ] LT",nextWeek:function(){return"dddd [օրը ժամը] LT"},lastWeek:function(){return"[անցած] dddd [օրը ժամը] LT"},sameElse:"L"},relativeTime:{future:"%s հետո",past:"%s առաջ",s:"մի քանի վայրկյան",m:"րոպե",mm:"%d րոպե",h:"ժամ",hh:"%d ժամ",d:"օր",dd:"%d օր",M:"ամիս",MM:"%d ամիս",y:"տարի",yy:"%d տարի"},meridiemParse:/գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,isPM:function(a){return/^(ցերեկվա|երեկոյան)$/.test(a)},meridiem:function(a){return a<4?"գիշերվա":a<12?"առավոտվա":a<17?"ցերեկվա":"երեկոյան"},dayOfMonthOrdinalParse:/\d{1,2}|\d{1,2}-(ին|րդ)/,ordinal:function(a,b){switch(b){case"DDD":case"w":case"W":case"DDDo":return 1===a?a+"-ին":a+"-րդ";default:return a}},week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Indonesian [id]
//! author : Mohammad Satrio Utomo : https://github.com/tyok
//! reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan
a.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"siang"===b?a>=11?a:a+12:"sore"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return a<11?"pagi":a<15?"siang":a<19?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),a.defineLocale("is",{months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd, D. MMMM YYYY [kl.] H:mm"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:Nd,m:Nd,mm:Nd,h:"klukkustund",hh:Nd,d:Nd,dd:Nd,M:Nd,MM:Nd,y:Nd,yy:Nd},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Italian [it]
//! author : Lorenzo : https://github.com/aliem
//! author: Mattia Larentis: https://github.com/nostalgiaz
a.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato".split("_"),weekdaysShort:"dom_lun_mar_mer_gio_ven_sab".split("_"),weekdaysMin:"do_lu_ma_me_gi_ve_sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(a){return(/^[0-9].+$/.test(a)?"tra":"in")+" "+a},past:"%s fa",s:"alcuni secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Japanese [ja]
//! author : LI Long : https://github.com/baryon
a.defineLocale("ja",{months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日 HH:mm",LLLL:"YYYY年M月D日 HH:mm dddd",l:"YYYY/MM/DD",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日 HH:mm dddd"},meridiemParse:/午前|午後/i,isPM:function(a){return"午後"===a},meridiem:function(a,b,c){return a<12?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}日/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";default:return a}},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"}}),
//! moment.js locale configuration
//! locale : Javanese [jv]
//! author : Rony Lantip : https://github.com/lantip
//! reference: http://jv.wikipedia.org/wiki/Basa_Jawa
a.defineLocale("jv",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),weekdays:"Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),weekdaysShort:"Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/enjing|siyang|sonten|ndalu/,meridiemHour:function(a,b){return 12===a&&(a=0),"enjing"===b?a:"siyang"===b?a>=11?a:a+12:"sonten"===b||"ndalu"===b?a+12:void 0},meridiem:function(a,b,c){return a<11?"enjing":a<15?"siyang":a<19?"sonten":"ndalu"},calendar:{sameDay:"[Dinten puniko pukul] LT",nextDay:"[Mbenjang pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kala wingi pukul] LT",lastWeek:"dddd [kepengker pukul] LT",sameElse:"L"},relativeTime:{future:"wonten ing %s",past:"%s ingkang kepengker",s:"sawetawis detik",m:"setunggal menit",mm:"%d menit",h:"setunggal jam",hh:"%d jam",d:"sedinten",dd:"%d dinten",M:"sewulan",MM:"%d wulan",y:"setaun",yy:"%d taun"},week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Georgian [ka]
//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili
a.defineLocale("ka",{months:{standalone:"იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),format:"იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")},monthsShort:"იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),weekdays:{standalone:"კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),format:"კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_"),isFormat:/(წინა|შემდეგ)/},weekdaysShort:"კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),weekdaysMin:"კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[დღეს] LT[-ზე]",nextDay:"[ხვალ] LT[-ზე]",lastDay:"[გუშინ] LT[-ზე]",nextWeek:"[შემდეგ] dddd LT[-ზე]",lastWeek:"[წინა] dddd LT-ზე",sameElse:"L"},relativeTime:{future:function(a){return/(წამი|წუთი|საათი|წელი)/.test(a)?a.replace(/ი$/,"ში"):a+"ში"},past:function(a){return/(წამი|წუთი|საათი|დღე|თვე)/.test(a)?a.replace(/(ი|ე)$/,"ის უკან"):/წელი/.test(a)?a.replace(/წელი$/,"წლის უკან"):void 0},s:"რამდენიმე წამი",m:"წუთი",mm:"%d წუთი",h:"საათი",hh:"%d საათი",d:"დღე",dd:"%d დღე",M:"თვე",MM:"%d თვე",y:"წელი",yy:"%d წელი"},dayOfMonthOrdinalParse:/0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,ordinal:function(a){return 0===a?a:1===a?a+"-ლი":a<20||a<=100&&a%20===0||a%100===0?"მე-"+a:a+"-ე"},week:{dow:1,doy:7}});
//! moment.js locale configuration
//! locale : Kazakh [kk]
//! authors : Nurlan Rakhimzhanov : https://github.com/nurlan
var jh={0:"-ші",1:"-ші",2:"-ші",3:"-ші",4:"-ші",5:"-ші",6:"-шы",7:"-ші",8:"-ші",9:"-шы",10:"-шы",20:"-шы",30:"-шы",40:"-шы",50:"-ші",60:"-шы",70:"-ші",80:"-ші",90:"-шы",100:"-ші"};a.defineLocale("kk",{months:"қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан".split("_"),monthsShort:"қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел".split("_"),weekdays:"жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі".split("_"),weekdaysShort:"жек_дүй_сей_сәр_бей_жұм_сен".split("_"),weekdaysMin:"жк_дй_сй_ср_бй_жм_сн".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Бүгін сағат] LT",nextDay:"[Ертең сағат] LT",nextWeek:"dddd [сағат] LT",lastDay:"[Кеше сағат] LT",lastWeek:"[Өткен аптаның] dddd [сағат] LT",sameElse:"L"},relativeTime:{future:"%s ішінде",past:"%s бұрын",s:"бірнеше секунд",m:"бір минут",mm:"%d минут",h:"бір сағат",hh:"%d сағат",d:"бір күн",dd:"%d күн",M:"бір ай",MM:"%d ай",y:"бір жыл",yy:"%d жыл"},dayOfMonthOrdinalParse:/\d{1,2}-(ші|шы)/,ordinal:function(a){var b=a%10,c=a>=100?100:null;return a+(jh[a]||jh[b]||jh[c])},week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Cambodian [km]
//! author : Kruy Vanna : https://github.com/kruyvanna
a.defineLocale("km",{months:"មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),monthsShort:"មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),weekdays:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysShort:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysMin:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[ថ្ងៃនេះ ម៉ោង] LT",nextDay:"[ស្អែក ម៉ោង] LT",nextWeek:"dddd [ម៉ោង] LT",lastDay:"[ម្សិលមិញ ម៉ោង] LT",lastWeek:"dddd [សប្តាហ៍មុន] [ម៉ោង] LT",sameElse:"L"},relativeTime:{future:"%sទៀត",past:"%sមុន",s:"ប៉ុន្មានវិនាទី",m:"មួយនាទី",mm:"%d នាទី",h:"មួយម៉ោង",hh:"%d ម៉ោង",d:"មួយថ្ងៃ",dd:"%d ថ្ងៃ",M:"មួយខែ",MM:"%d ខែ",y:"មួយឆ្នាំ",yy:"%d ឆ្នាំ"},week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Kannada [kn]
//! author : Rajeev Naik : https://github.com/rajeevnaikte
var kh={1:"೧",2:"೨",3:"೩",4:"೪",5:"೫",6:"೬",7:"೭",8:"೮",9:"೯",0:"೦"},lh={"೧":"1","೨":"2","೩":"3","೪":"4","೫":"5","೬":"6","೭":"7","೮":"8","೯":"9","೦":"0"};a.defineLocale("kn",{months:"ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್".split("_"),monthsShort:"ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬ_ಅಕ್ಟೋಬ_ನವೆಂಬ_ಡಿಸೆಂಬ".split("_"),monthsParseExact:!0,weekdays:"ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ".split("_"),weekdaysShort:"ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ".split("_"),weekdaysMin:"ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[ಇಂದು] LT",nextDay:"[ನಾಳೆ] LT",nextWeek:"dddd, LT",lastDay:"[ನಿನ್ನೆ] LT",lastWeek:"[ಕೊನೆಯ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ನಂತರ",past:"%s ಹಿಂದೆ",s:"ಕೆಲವು ಕ್ಷಣಗಳು",m:"ಒಂದು ನಿಮಿಷ",mm:"%d ನಿಮಿಷ",h:"ಒಂದು ಗಂಟೆ",hh:"%d ಗಂಟೆ",d:"ಒಂದು ದಿನ",dd:"%d ದಿನ",M:"ಒಂದು ತಿಂಗಳು",MM:"%d ತಿಂಗಳು",y:"ಒಂದು ವರ್ಷ",yy:"%d ವರ್ಷ"},preparse:function(a){return a.replace(/[೧೨೩೪೫೬೭೮೯೦]/g,function(a){return lh[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return kh[a]})},meridiemParse:/ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,meridiemHour:function(a,b){return 12===a&&(a=0),"ರಾತ್ರಿ"===b?a<4?a:a+12:"ಬೆಳಿಗ್ಗೆ"===b?a:"ಮಧ್ಯಾಹ್ನ"===b?a>=10?a:a+12:"ಸಂಜೆ"===b?a+12:void 0},meridiem:function(a,b,c){return a<4?"ರಾತ್ರಿ":a<10?"ಬೆಳಿಗ್ಗೆ":a<17?"ಮಧ್ಯಾಹ್ನ":a<20?"ಸಂಜೆ":"ರಾತ್ರಿ"},dayOfMonthOrdinalParse:/\d{1,2}(ನೇ)/,ordinal:function(a){return a+"ನೇ"},week:{dow:0,doy:6}}),
//! moment.js locale configuration
//! locale : Korean [ko]
//! author : Kyungwook, Park : https://github.com/kyungw00k
//! author : Jeeeyul Lee <jeeeyul@gmail.com>
a.defineLocale("ko",{months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 A h:mm",LLLL:"YYYY년 MMMM D일 dddd A h:mm",l:"YYYY.MM.DD",ll:"YYYY년 MMMM D일",lll:"YYYY년 MMMM D일 A h:mm",llll:"YYYY년 MMMM D일 dddd A h:mm"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇 초",ss:"%d초",m:"1분",mm:"%d분",h:"한 시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한 달",MM:"%d달",y:"일 년",yy:"%d년"},dayOfMonthOrdinalParse:/\d{1,2}일/,ordinal:"%d일",meridiemParse:/오전|오후/,isPM:function(a){return"오후"===a},meridiem:function(a,b,c){return a<12?"오전":"오후"}});
//! moment.js locale configuration
//! locale : Kyrgyz [ky]
//! author : Chyngyz Arystan uulu : https://github.com/chyngyz
var mh={0:"-чү",1:"-чи",2:"-чи",3:"-чү",4:"-чү",5:"-чи",6:"-чы",7:"-чи",8:"-чи",9:"-чу",10:"-чу",20:"-чы",30:"-чу",40:"-чы",50:"-чү",60:"-чы",70:"-чи",80:"-чи",90:"-чу",100:"-чү"};a.defineLocale("ky",{months:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),monthsShort:"янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),weekdays:"Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби".split("_"),weekdaysShort:"Жек_Дүй_Шей_Шар_Бей_Жум_Ише".split("_"),weekdaysMin:"Жк_Дй_Шй_Шр_Бй_Жм_Иш".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Бүгүн саат] LT",nextDay:"[Эртең саат] LT",nextWeek:"dddd [саат] LT",lastDay:"[Кече саат] LT",lastWeek:"[Өткен аптанын] dddd [күнү] [саат] LT",sameElse:"L"},relativeTime:{future:"%s ичинде",past:"%s мурун",s:"бирнече секунд",m:"бир мүнөт",mm:"%d мүнөт",h:"бир саат",hh:"%d саат",d:"бир күн",dd:"%d күн",M:"бир ай",MM:"%d ай",y:"бир жыл",yy:"%d жыл"},dayOfMonthOrdinalParse:/\d{1,2}-(чи|чы|чү|чу)/,ordinal:function(a){var b=a%10,c=a>=100?100:null;return a+(mh[a]||mh[b]||mh[c])},week:{dow:1,doy:7}}),a.defineLocale("lb",{months:"Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mé_Dë_Më_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm [Auer]",LLLL:"dddd, D. MMMM YYYY H:mm [Auer]"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gëschter um] LT",lastWeek:function(){switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:Pd,past:Qd,s:"e puer Sekonnen",m:Od,mm:"%d Minutten",h:Od,hh:"%d Stonnen",d:Od,dd:"%d Deeg",M:Od,MM:"%d Méint",y:Od,yy:"%d Joer"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Lao [lo]
//! author : Ryan Hart : https://github.com/ryanhart2
a.defineLocale("lo",{months:"ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split("_"),monthsShort:"ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split("_"),weekdays:"ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),weekdaysShort:"ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),weekdaysMin:"ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"ວັນdddd D MMMM YYYY HH:mm"},meridiemParse:/ຕອນເຊົ້າ|ຕອນແລງ/,isPM:function(a){return"ຕອນແລງ"===a},meridiem:function(a,b,c){return a<12?"ຕອນເຊົ້າ":"ຕອນແລງ"},calendar:{sameDay:"[ມື້ນີ້ເວລາ] LT",nextDay:"[ມື້ອື່ນເວລາ] LT",nextWeek:"[ວັນ]dddd[ໜ້າເວລາ] LT",lastDay:"[ມື້ວານນີ້ເວລາ] LT",lastWeek:"[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT",sameElse:"L"},relativeTime:{future:"ອີກ %s",past:"%sຜ່ານມາ",s:"ບໍ່ເທົ່າໃດວິນາທີ",m:"1 ນາທີ",mm:"%d ນາທີ",h:"1 ຊົ່ວໂມງ",hh:"%d ຊົ່ວໂມງ",d:"1 ມື້",dd:"%d ມື້",M:"1 ເດືອນ",MM:"%d ເດືອນ",y:"1 ປີ",yy:"%d ປີ"},dayOfMonthOrdinalParse:/(ທີ່)\d{1,2}/,ordinal:function(a){return"ທີ່"+a}});
//! moment.js locale configuration
//! locale : Lithuanian [lt]
//! author : Mindaugas Mozūras : https://github.com/mmozuras
var nh={m:"minutė_minutės_minutę",mm:"minutės_minučių_minutes",h:"valanda_valandos_valandą",hh:"valandos_valandų_valandas",d:"diena_dienos_dieną",dd:"dienos_dienų_dienas",M:"mėnuo_mėnesio_mėnesį",MM:"mėnesiai_mėnesių_mėnesius",y:"metai_metų_metus",yy:"metai_metų_metus"};a.defineLocale("lt",{months:{format:"sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),standalone:"sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis".split("_"),isFormat:/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/},monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:{format:"sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį".split("_"),standalone:"sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_"),isFormat:/dddd HH:mm/},weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Š".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], HH:mm [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], HH:mm [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]"},calendar:{sameDay:"[Šiandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[Praėjusį] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieš %s",s:Sd,m:Td,mm:Wd,h:Td,hh:Wd,d:Td,dd:Wd,M:Td,MM:Wd,y:Td,yy:Wd},dayOfMonthOrdinalParse:/\d{1,2}-oji/,ordinal:function(a){return a+"-oji"},week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Latvian [lv]
//! author : Kristaps Karlsons : https://github.com/skakri
//! author : Jānis Elmeris : https://github.com/JanisE
var oh={m:"minūtes_minūtēm_minūte_minūtes".split("_"),mm:"minūtes_minūtēm_minūte_minūtes".split("_"),h:"stundas_stundām_stunda_stundas".split("_"),hh:"stundas_stundām_stunda_stundas".split("_"),d:"dienas_dienām_diena_dienas".split("_"),dd:"dienas_dienām_diena_dienas".split("_"),M:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),MM:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),y:"gada_gadiem_gads_gadi".split("_"),yy:"gada_gadiem_gads_gadi".split("_")};a.defineLocale("lv",{months:"janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),weekdays:"svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY.",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, HH:mm",LLLL:"YYYY. [gada] D. MMMM, dddd, HH:mm"},calendar:{sameDay:"[Šodien pulksten] LT",nextDay:"[Rīt pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[Pagājušā] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"pēc %s",past:"pirms %s",s:$d,m:Zd,mm:Yd,h:Zd,hh:Yd,d:Zd,dd:Yd,M:Zd,MM:Yd,y:Zd,yy:Yd},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Montenegrin [me]
//! author : Miodrag Nikač <miodrag@restartit.me> : https://github.com/miodragnikac
var ph={words:{m:["jedan minut","jednog minuta"],mm:["minut","minuta","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mjesec","mjeseca","mjeseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&a<=4?b[1]:b[2]},translate:function(a,b,c){var d=ph.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+ph.correctGrammaticalCase(a,d)}};a.defineLocale("me",{months:"januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sjutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedjelje] [u] LT","[prošlog] [ponedjeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srijede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"nekoliko sekundi",m:ph.translate,mm:ph.translate,h:ph.translate,hh:ph.translate,d:"dan",dd:ph.translate,M:"mjesec",MM:ph.translate,y:"godinu",yy:ph.translate},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Maori [mi]
//! author : John Corrigan <robbiecloset@gmail.com> : https://github.com/johnideal
a.defineLocale("mi",{months:"Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea".split("_"),monthsShort:"Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki".split("_"),monthsRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsStrictRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsShortRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsShortStrictRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,weekdays:"Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei".split("_"),weekdaysShort:"Ta_Ma_Tū_We_Tāi_Pa_Hā".split("_"),weekdaysMin:"Ta_Ma_Tū_We_Tāi_Pa_Hā".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [i] HH:mm",LLLL:"dddd, D MMMM YYYY [i] HH:mm"},calendar:{sameDay:"[i teie mahana, i] LT",nextDay:"[apopo i] LT",nextWeek:"dddd [i] LT",lastDay:"[inanahi i] LT",lastWeek:"dddd [whakamutunga i] LT",sameElse:"L"},relativeTime:{future:"i roto i %s",past:"%s i mua",s:"te hēkona ruarua",m:"he meneti",mm:"%d meneti",h:"te haora",hh:"%d haora",d:"he ra",dd:"%d ra",M:"he marama",MM:"%d marama",y:"he tau",yy:"%d tau"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Macedonian [mk]
//! author : Borislav Mickov : https://github.com/B0k0
a.defineLocale("mk",{months:"јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),monthsShort:"јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),weekdays:"недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),weekdaysShort:"нед_пон_вто_сре_чет_пет_саб".split("_"),weekdaysMin:"нe_пo_вт_ср_че_пе_сa".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Денес во] LT",nextDay:"[Утре во] LT",nextWeek:"[Во] dddd [во] LT",lastDay:"[Вчера во] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Изминатата] dddd [во] LT";case 1:case 2:case 4:case 5:return"[Изминатиот] dddd [во] LT"}},sameElse:"L"},relativeTime:{future:"после %s",past:"пред %s",s:"неколку секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дена",M:"месец",MM:"%d месеци",y:"година",yy:"%d години"},dayOfMonthOrdinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&c<20?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Malayalam [ml]
//! author : Floyd Pink : https://github.com/floydpink
a.defineLocale("ml",{months:"ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),monthsShort:"ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),monthsParseExact:!0,weekdays:"ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),weekdaysShort:"ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),weekdaysMin:"ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),longDateFormat:{LT:"A h:mm -നു",LTS:"A h:mm:ss -നു",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm -നു",LLLL:"dddd, D MMMM YYYY, A h:mm -നു"},calendar:{sameDay:"[ഇന്ന്] LT",nextDay:"[നാളെ] LT",nextWeek:"dddd, LT",lastDay:"[ഇന്നലെ] LT",lastWeek:"[കഴിഞ്ഞ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s കഴിഞ്ഞ്",past:"%s മുൻപ്",s:"അൽപ നിമിഷങ്ങൾ",m:"ഒരു മിനിറ്റ്",mm:"%d മിനിറ്റ്",h:"ഒരു മണിക്കൂർ",hh:"%d മണിക്കൂർ",d:"ഒരു ദിവസം",dd:"%d ദിവസം",M:"ഒരു മാസം",MM:"%d മാസം",y:"ഒരു വർഷം",yy:"%d വർഷം"},meridiemParse:/രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,meridiemHour:function(a,b){return 12===a&&(a=0),"രാത്രി"===b&&a>=4||"ഉച്ച കഴിഞ്ഞ്"===b||"വൈകുന്നേരം"===b?a+12:a},meridiem:function(a,b,c){return a<4?"രാത്രി":a<12?"രാവിലെ":a<17?"ഉച്ച കഴിഞ്ഞ്":a<20?"വൈകുന്നേരം":"രാത്രി"}});
//! moment.js locale configuration
//! locale : Marathi [mr]
//! author : Harshad Kale : https://github.com/kalehv
//! author : Vivek Athalye : https://github.com/vnathalye
var qh={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},rh={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};a.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),monthsParseExact:!0,weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm वाजता",LLLL:"dddd, D MMMM YYYY, A h:mm वाजता"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%sमध्ये",past:"%sपूर्वी",s:_d,m:_d,mm:_d,h:_d,hh:_d,d:_d,dd:_d,M:_d,MM:_d,y:_d,yy:_d},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return rh[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return qh[a]})},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात्री"===b?a<4?a:a+12:"सकाळी"===b?a:"दुपारी"===b?a>=10?a:a+12:"सायंकाळी"===b?a+12:void 0},meridiem:function(a,b,c){return a<4?"रात्री":a<10?"सकाळी":a<17?"दुपारी":a<20?"सायंकाळी":"रात्री"},week:{dow:0,doy:6}}),
//! moment.js locale configuration
//! locale : Malay [ms-my]
//! note : DEPRECATED, the correct one is [ms]
//! author : Weldan Jamili : https://github.com/weldan
a.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"tengahari"===b?a>=11?a:a+12:"petang"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return a<11?"pagi":a<15?"tengahari":a<19?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Malay [ms]
//! author : Weldan Jamili : https://github.com/weldan
a.defineLocale("ms",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"tengahari"===b?a>=11?a:a+12:"petang"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return a<11?"pagi":a<15?"tengahari":a<19?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}});
//! moment.js locale configuration
//! locale : Burmese [my]
//! author : Squar team, mysquar.com
//! author : David Rossellat : https://github.com/gholadr
//! author : Tin Aung Lin : https://github.com/thanyawzinmin
var sh={1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",0:"၀"},th={"၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","၀":"0"};a.defineLocale("my",{months:"ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),monthsShort:"ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),weekdays:"တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),weekdaysShort:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),weekdaysMin:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ယနေ.] LT [မှာ]",nextDay:"[မနက်ဖြန်] LT [မှာ]",nextWeek:"dddd LT [မှာ]",lastDay:"[မနေ.က] LT [မှာ]",lastWeek:"[ပြီးခဲ့သော] dddd LT [မှာ]",sameElse:"L"},relativeTime:{future:"လာမည့် %s မှာ",past:"လွန်ခဲ့သော %s က",s:"စက္ကန်.အနည်းငယ်",m:"တစ်မိနစ်",mm:"%d မိနစ်",h:"တစ်နာရီ",hh:"%d နာရီ",d:"တစ်ရက်",dd:"%d ရက်",M:"တစ်လ",MM:"%d လ",y:"တစ်နှစ်",yy:"%d နှစ်"},preparse:function(a){return a.replace(/[၁၂၃၄၅၆၇၈၉၀]/g,function(a){return th[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return sh[a]})},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Norwegian Bokmål [nb]
//! authors : Espen Hovlandsdal : https://github.com/rexxars
//!           Sigurd Gartmann : https://github.com/sigurdga
a.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.".split("_"),monthsParseExact:!0,weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"sø._ma._ti._on._to._fr._lø.".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] HH:mm",LLLL:"dddd D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"noen sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Nepalese [ne]
//! author : suvash : https://github.com/suvash
var uh={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},vh={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};a.defineLocale("ne",{months:"जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),monthsShort:"जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),monthsParseExact:!0,weekdays:"आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),weekdaysShort:"आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),weekdaysMin:"आ._सो._मं._बु._बि._शु._श.".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"Aको h:mm बजे",LTS:"Aको h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, Aको h:mm बजे",LLLL:"dddd, D MMMM YYYY, Aको h:mm बजे"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return vh[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return uh[a]})},meridiemParse:/राति|बिहान|दिउँसो|साँझ/,meridiemHour:function(a,b){return 12===a&&(a=0),"राति"===b?a<4?a:a+12:"बिहान"===b?a:"दिउँसो"===b?a>=10?a:a+12:"साँझ"===b?a+12:void 0},meridiem:function(a,b,c){return a<3?"राति":a<12?"बिहान":a<16?"दिउँसो":a<20?"साँझ":"राति"},calendar:{sameDay:"[आज] LT",nextDay:"[भोलि] LT",nextWeek:"[आउँदो] dddd[,] LT",lastDay:"[हिजो] LT",lastWeek:"[गएको] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sमा",past:"%s अगाडि",s:"केही क्षण",m:"एक मिनेट",mm:"%d मिनेट",h:"एक घण्टा",hh:"%d घण्टा",d:"एक दिन",dd:"%d दिन",M:"एक महिना",MM:"%d महिना",y:"एक बर्ष",yy:"%d बर्ष"},week:{dow:0,doy:6}});
//! moment.js locale configuration
//! locale : Dutch (Belgium) [nl-be]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj
var wh="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),xh="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),yh=[/^jan/i,/^feb/i,/^maart|mrt.?$/i,/^apr/i,/^mei$/i,/^jun[i.]?$/i,/^jul[i.]?$/i,/^aug/i,/^sep/i,/^okt/i,/^nov/i,/^dec/i],zh=/^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;a.defineLocale("nl-be",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(a,b){return a?/-MMM-/.test(b)?xh[a.month()]:wh[a.month()]:wh},monthsRegex:zh,monthsShortRegex:zh,monthsStrictRegex:/^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,monthsShortStrictRegex:/^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,monthsParse:yh,longMonthsParse:yh,shortMonthsParse:yh,weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Dutch [nl]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj
var Ah="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),Bh="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),Ch=[/^jan/i,/^feb/i,/^maart|mrt.?$/i,/^apr/i,/^mei$/i,/^jun[i.]?$/i,/^jul[i.]?$/i,/^aug/i,/^sep/i,/^okt/i,/^nov/i,/^dec/i],Dh=/^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;a.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(a,b){return a?/-MMM-/.test(b)?Bh[a.month()]:Ah[a.month()]:Ah},monthsRegex:Dh,monthsShortRegex:Dh,monthsStrictRegex:/^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,monthsShortStrictRegex:/^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,monthsParse:Ch,longMonthsParse:Ch,shortMonthsParse:Ch,weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Nynorsk [nn]
//! author : https://github.com/mechuwind
a.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"sun_mån_tys_ons_tor_fre_lau".split("_"),weekdaysMin:"su_må_ty_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I går klokka] LT",lastWeek:"[Føregåande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s sidan",s:"nokre sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",M:"ein månad",MM:"%d månader",y:"eit år",yy:"%d år"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Punjabi (India) [pa-in]
//! author : Harpreet Singh : https://github.com/harpreetkhalsagtbit
var Eh={1:"੧",2:"੨",3:"੩",4:"੪",5:"੫",6:"੬",7:"੭",8:"੮",9:"੯",0:"੦"},Fh={"੧":"1","੨":"2","੩":"3","੪":"4","੫":"5","੬":"6","੭":"7","੮":"8","੯":"9","੦":"0"};a.defineLocale("pa-in",{months:"ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split("_"),monthsShort:"ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split("_"),weekdays:"ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ".split("_"),weekdaysShort:"ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),weekdaysMin:"ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),longDateFormat:{LT:"A h:mm ਵਜੇ",LTS:"A h:mm:ss ਵਜੇ",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm ਵਜੇ",LLLL:"dddd, D MMMM YYYY, A h:mm ਵਜੇ"},calendar:{sameDay:"[ਅਜ] LT",nextDay:"[ਕਲ] LT",nextWeek:"dddd, LT",lastDay:"[ਕਲ] LT",lastWeek:"[ਪਿਛਲੇ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ਵਿੱਚ",past:"%s ਪਿਛਲੇ",s:"ਕੁਝ ਸਕਿੰਟ",m:"ਇਕ ਮਿੰਟ",mm:"%d ਮਿੰਟ",h:"ਇੱਕ ਘੰਟਾ",hh:"%d ਘੰਟੇ",d:"ਇੱਕ ਦਿਨ",dd:"%d ਦਿਨ",M:"ਇੱਕ ਮਹੀਨਾ",MM:"%d ਮਹੀਨੇ",y:"ਇੱਕ ਸਾਲ",yy:"%d ਸਾਲ"},preparse:function(a){return a.replace(/[੧੨੩੪੫੬੭੮੯੦]/g,function(a){return Fh[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Eh[a]})},meridiemParse:/ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,meridiemHour:function(a,b){return 12===a&&(a=0),"ਰਾਤ"===b?a<4?a:a+12:"ਸਵੇਰ"===b?a:"ਦੁਪਹਿਰ"===b?a>=10?a:a+12:"ਸ਼ਾਮ"===b?a+12:void 0},meridiem:function(a,b,c){return a<4?"ਰਾਤ":a<10?"ਸਵੇਰ":a<17?"ਦੁਪਹਿਰ":a<20?"ਸ਼ਾਮ":"ਰਾਤ"},week:{dow:0,doy:6}});
//! moment.js locale configuration
//! locale : Polish [pl]
//! author : Rafal Hirsz : https://github.com/evoL
var Gh="styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),Hh="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_");a.defineLocale("pl",{months:function(a,b){return a?""===b?"("+Hh[a.month()]+"|"+Gh[a.month()]+")":/D MMMM/.test(b)?Hh[a.month()]:Gh[a.month()]:Gh},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"ndz_pon_wt_śr_czw_pt_sob".split("_"),weekdaysMin:"Nd_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:"[W] dddd [o] LT",lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszłą niedzielę o] LT";case 3:return"[W zeszłą środę o] LT";case 6:return"[W zeszłą sobotę o] LT";default:return"[W zeszły] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:be,mm:be,h:be,hh:be,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:be,y:"rok",yy:be},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Portuguese (Brazil) [pt-br]
//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira
a.defineLocale("pt-br",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Do_2ª_3ª_4ª_5ª_6ª_Sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [às] HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY [às] HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"poucos segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº"}),
//! moment.js locale configuration
//! locale : Portuguese [pt]
//! author : Jefferson : https://github.com/jalex79
a.defineLocale("pt",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Do_2ª_3ª_4ª_5ª_6ª_Sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),a.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mâine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s în urmă",s:"câteva secunde",m:"un minut",mm:ce,h:"o oră",hh:ce,d:"o zi",dd:ce,M:"o lună",MM:ce,y:"un an",yy:ce},week:{dow:1,doy:7}});var Ih=[/^янв/i,/^фев/i,/^мар/i,/^апр/i,/^ма[йя]/i,/^июн/i,/^июл/i,/^авг/i,/^сен/i,/^окт/i,/^ноя/i,/^дек/i];a.defineLocale("ru",{months:{format:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_"),standalone:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_")},monthsShort:{format:"янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split("_"),standalone:"янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split("_")},weekdays:{standalone:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),format:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_"),isFormat:/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/},weekdaysShort:"вс_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),monthsParse:Ih,longMonthsParse:Ih,shortMonthsParse:Ih,monthsRegex:/^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,monthsShortRegex:/^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,monthsStrictRegex:/^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,monthsShortStrictRegex:/^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сегодня в] LT",nextDay:"[Завтра в] LT",lastDay:"[Вчера в] LT",nextWeek:function(a){if(a.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В следующее] dddd [в] LT";case 1:case 2:case 4:return"[В следующий] dddd [в] LT";case 3:case 5:case 6:return"[В следующую] dddd [в] LT"}},lastWeek:function(a){if(a.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В прошлое] dddd [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:ee,mm:ee,h:"час",hh:ee,d:"день",dd:ee,M:"месяц",MM:ee,y:"год",yy:ee},meridiemParse:/ночи|утра|дня|вечера/i,isPM:function(a){return/^(дня|вечера)$/.test(a)},meridiem:function(a,b,c){return a<4?"ночи":a<12?"утра":a<17?"дня":"вечера"},dayOfMonthOrdinalParse:/\d{1,2}-(й|го|я)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":return a+"-й";case"D":return a+"-го";case"w":case"W":return a+"-я";default:return a}},week:{dow:1,doy:7}});
//! moment.js locale configuration
//! locale : Sindhi [sd]
//! author : Narain Sagar : https://github.com/narainsagar
var Jh=["جنوري","فيبروري","مارچ","اپريل","مئي","جون","جولاءِ","آگسٽ","سيپٽمبر","آڪٽوبر","نومبر","ڊسمبر"],Kh=["آچر","سومر","اڱارو","اربع","خميس","جمع","ڇنڇر"];a.defineLocale("sd",{months:Jh,monthsShort:Jh,weekdays:Kh,weekdaysShort:Kh,weekdaysMin:Kh,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd، D MMMM YYYY HH:mm"},meridiemParse:/صبح|شام/,isPM:function(a){return"شام"===a},meridiem:function(a,b,c){return a<12?"صبح":"شام"},calendar:{sameDay:"[اڄ] LT",nextDay:"[سڀاڻي] LT",nextWeek:"dddd [اڳين هفتي تي] LT",lastDay:"[ڪالهه] LT",lastWeek:"[گزريل هفتي] dddd [تي] LT",sameElse:"L"},relativeTime:{future:"%s پوء",past:"%s اڳ",s:"چند سيڪنڊ",m:"هڪ منٽ",mm:"%d منٽ",h:"هڪ ڪلاڪ",hh:"%d ڪلاڪ",d:"هڪ ڏينهن",dd:"%d ڏينهن",M:"هڪ مهينو",MM:"%d مهينا",y:"هڪ سال",yy:"%d سال"},preparse:function(a){return a.replace(/،/g,",")},postformat:function(a){return a.replace(/,/g,"،")},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Northern Sami [se]
//! authors : Bård Rolstad Henriksen : https://github.com/karamell
a.defineLocale("se",{months:"ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu".split("_"),monthsShort:"ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov".split("_"),weekdays:"sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat".split("_"),weekdaysShort:"sotn_vuos_maŋ_gask_duor_bear_láv".split("_"),weekdaysMin:"s_v_m_g_d_b_L".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"MMMM D. [b.] YYYY",LLL:"MMMM D. [b.] YYYY [ti.] HH:mm",LLLL:"dddd, MMMM D. [b.] YYYY [ti.] HH:mm"},calendar:{sameDay:"[otne ti] LT",nextDay:"[ihttin ti] LT",nextWeek:"dddd [ti] LT",lastDay:"[ikte ti] LT",lastWeek:"[ovddit] dddd [ti] LT",sameElse:"L"},relativeTime:{future:"%s geažes",past:"maŋit %s",s:"moadde sekunddat",m:"okta minuhta",mm:"%d minuhtat",h:"okta diimmu",hh:"%d diimmut",d:"okta beaivi",dd:"%d beaivvit",M:"okta mánnu",MM:"%d mánut",y:"okta jahki",yy:"%d jagit"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Sinhalese [si]
//! author : Sampath Sitinamaluwa : https://github.com/sampathsris
a.defineLocale("si",{months:"ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split("_"),monthsShort:"ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split("_"),weekdays:"ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split("_"),weekdaysShort:"ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),weekdaysMin:"ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"a h:mm",LTS:"a h:mm:ss",L:"YYYY/MM/DD",LL:"YYYY MMMM D",LLL:"YYYY MMMM D, a h:mm",LLLL:"YYYY MMMM D [වැනි] dddd, a h:mm:ss"},calendar:{sameDay:"[අද] LT[ට]",nextDay:"[හෙට] LT[ට]",nextWeek:"dddd LT[ට]",lastDay:"[ඊයේ] LT[ට]",lastWeek:"[පසුගිය] dddd LT[ට]",sameElse:"L"},relativeTime:{future:"%sකින්",past:"%sකට පෙර",s:"තත්පර කිහිපය",m:"මිනිත්තුව",mm:"මිනිත්තු %d",h:"පැය",hh:"පැය %d",d:"දිනය",dd:"දින %d",M:"මාසය",MM:"මාස %d",y:"වසර",yy:"වසර %d"},dayOfMonthOrdinalParse:/\d{1,2} වැනි/,ordinal:function(a){return a+" වැනි"},meridiemParse:/පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,isPM:function(a){return"ප.ව."===a||"පස් වරු"===a},meridiem:function(a,b,c){return a>11?c?"ප.ව.":"පස් වරු":c?"පෙ.ව.":"පෙර වරු"}});
//! moment.js locale configuration
//! locale : Slovak [sk]
//! author : Martin Minka : https://github.com/k2s
//! based on work of petrbela : https://github.com/petrbela
var Lh="január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"),Mh="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");a.defineLocale("sk",{months:Lh,monthsShort:Mh,weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:ge,m:ge,mm:ge,h:ge,hh:ge,d:ge,dd:ge,M:ge,MM:ge,y:ge,yy:ge},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._čet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_če_pe_so".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[včeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:return"[prejšnjo] [nedeljo] [ob] LT";case 3:return"[prejšnjo] [sredo] [ob] LT";case 6:return"[prejšnjo] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[prejšnji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"čez %s",past:"pred %s",s:he,m:he,mm:he,h:he,hh:he,d:he,dd:he,M:he,MM:he,y:he,yy:he},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Albanian [sq]
//! author : Flakërim Ismani : https://github.com/flakerimi
//! author : Menelion Elensúle : https://github.com/Oire
//! author : Oerd Cukalla : https://github.com/oerd
a.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),weekdays:"E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),weekdaysShort:"Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_Më_E_P_Sh".split("_"),weekdaysParseExact:!0,meridiemParse:/PD|MD/,isPM:function(a){return"M"===a.charAt(0)},meridiem:function(a,b,c){return a<12?"PD":"MD"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Sot në] LT",nextDay:"[Nesër në] LT",nextWeek:"dddd [në] LT",lastDay:"[Dje në] LT",lastWeek:"dddd [e kaluar në] LT",sameElse:"L"},relativeTime:{future:"në %s",past:"%s më parë",s:"disa sekonda",m:"një minutë",mm:"%d minuta",h:"një orë",hh:"%d orë",d:"një ditë",dd:"%d ditë",M:"një muaj",MM:"%d muaj",y:"një vit",yy:"%d vite"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Serbian Cyrillic [sr-cyrl]
//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j
var Nh={words:{m:["један минут","једне минуте"],mm:["минут","минуте","минута"],h:["један сат","једног сата"],hh:["сат","сата","сати"],dd:["дан","дана","дана"],MM:["месец","месеца","месеци"],yy:["година","године","година"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&a<=4?b[1]:b[2]},translate:function(a,b,c){var d=Nh.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+Nh.correctGrammaticalCase(a,d)}};a.defineLocale("sr-cyrl",{months:"јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар".split("_"),monthsShort:"јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.".split("_"),monthsParseExact:!0,weekdays:"недеља_понедељак_уторак_среда_четвртак_петак_субота".split("_"),weekdaysShort:"нед._пон._уто._сре._чет._пет._суб.".split("_"),weekdaysMin:"не_по_ут_ср_че_пе_су".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[данас у] LT",nextDay:"[сутра у] LT",nextWeek:function(){switch(this.day()){case 0:return"[у] [недељу] [у] LT";case 3:return"[у] [среду] [у] LT";case 6:return"[у] [суботу] [у] LT";case 1:case 2:case 4:case 5:return"[у] dddd [у] LT"}},lastDay:"[јуче у] LT",lastWeek:function(){var a=["[прошле] [недеље] [у] LT","[прошлог] [понедељка] [у] LT","[прошлог] [уторка] [у] LT","[прошле] [среде] [у] LT","[прошлог] [четвртка] [у] LT","[прошлог] [петка] [у] LT","[прошле] [суботе] [у] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"за %s",past:"пре %s",s:"неколико секунди",m:Nh.translate,mm:Nh.translate,h:Nh.translate,hh:Nh.translate,d:"дан",dd:Nh.translate,M:"месец",MM:Nh.translate,y:"годину",yy:Nh.translate},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});
//! moment.js locale configuration
//! locale : Serbian [sr]
//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j
var Oh={words:{m:["jedan minut","jedne minute"],mm:["minut","minute","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mesec","meseca","meseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&a<=4?b[1]:b[2]},translate:function(a,b,c){var d=Oh.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+Oh.correctGrammaticalCase(a,d)}};a.defineLocale("sr",{months:"januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sre._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedelje] [u] LT","[prošlog] [ponedeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",m:Oh.translate,mm:Oh.translate,h:Oh.translate,hh:Oh.translate,d:"dan",dd:Oh.translate,M:"mesec",MM:Oh.translate,y:"godinu",yy:Oh.translate},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : siSwati [ss]
//! author : Nicolai Davies<mail@nicolai.io> : https://github.com/nicolaidavies
a.defineLocale("ss",{months:"Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split("_"),monthsShort:"Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo".split("_"),weekdays:"Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo".split("_"),weekdaysShort:"Lis_Umb_Lsb_Les_Lsi_Lsh_Umg".split("_"),weekdaysMin:"Li_Us_Lb_Lt_Ls_Lh_Ug".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Namuhla nga] LT",nextDay:"[Kusasa nga] LT",nextWeek:"dddd [nga] LT",lastDay:"[Itolo nga] LT",lastWeek:"dddd [leliphelile] [nga] LT",sameElse:"L"},relativeTime:{future:"nga %s",past:"wenteka nga %s",s:"emizuzwana lomcane",m:"umzuzu",mm:"%d emizuzu",h:"lihora",hh:"%d emahora",d:"lilanga",dd:"%d emalanga",M:"inyanga",MM:"%d tinyanga",y:"umnyaka",yy:"%d iminyaka"},meridiemParse:/ekuseni|emini|entsambama|ebusuku/,meridiem:function(a,b,c){return a<11?"ekuseni":a<15?"emini":a<19?"entsambama":"ebusuku"},meridiemHour:function(a,b){return 12===a&&(a=0),"ekuseni"===b?a:"emini"===b?a>=11?a:a+12:"entsambama"===b||"ebusuku"===b?0===a?0:a+12:void 0},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:"%d",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Swedish [sv]
//! author : Jens Alm : https://github.com/ulmus
a.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [kl.] HH:mm",LLLL:"dddd D MMMM YYYY [kl.] HH:mm",lll:"D MMM YYYY HH:mm",llll:"ddd D MMM YYYY HH:mm"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[Igår] LT",nextWeek:"[På] dddd LT",lastWeek:"[I] dddd[s] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sedan",s:"några sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},dayOfMonthOrdinalParse:/\d{1,2}(e|a)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"e":1===b?"a":2===b?"a":"e";return a+c},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Swahili [sw]
//! author : Fahad Kassim : https://github.com/fadsel
a.defineLocale("sw",{months:"Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des".split("_"),weekdays:"Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi".split("_"),weekdaysShort:"Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos".split("_"),weekdaysMin:"J2_J3_J4_J5_Al_Ij_J1".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[leo saa] LT",nextDay:"[kesho saa] LT",nextWeek:"[wiki ijayo] dddd [saat] LT",lastDay:"[jana] LT",lastWeek:"[wiki iliyopita] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s baadaye",past:"tokea %s",s:"hivi punde",m:"dakika moja",mm:"dakika %d",h:"saa limoja",hh:"masaa %d",d:"siku moja",dd:"masiku %d",M:"mwezi mmoja",MM:"miezi %d",y:"mwaka mmoja",yy:"miaka %d"},week:{dow:1,doy:7}});
//! moment.js locale configuration
//! locale : Tamil [ta]
//! author : Arjunkumar Krishnamoorthy : https://github.com/tk120404
var Ph={1:"௧",2:"௨",3:"௩",4:"௪",5:"௫",6:"௬",7:"௭",8:"௮",9:"௯",0:"௦"},Qh={"௧":"1","௨":"2","௩":"3","௪":"4","௫":"5","௬":"6","௭":"7","௮":"8","௯":"9","௦":"0"};a.defineLocale("ta",{months:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),monthsShort:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),weekdays:"ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),weekdaysShort:"ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),weekdaysMin:"ஞா_தி_செ_பு_வி_வெ_ச".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, HH:mm",LLLL:"dddd, D MMMM YYYY, HH:mm"},calendar:{sameDay:"[இன்று] LT",nextDay:"[நாளை] LT",nextWeek:"dddd, LT",lastDay:"[நேற்று] LT",lastWeek:"[கடந்த வாரம்] dddd, LT",sameElse:"L"},relativeTime:{future:"%s இல்",past:"%s முன்",s:"ஒரு சில விநாடிகள்",m:"ஒரு நிமிடம்",mm:"%d நிமிடங்கள்",h:"ஒரு மணி நேரம்",hh:"%d மணி நேரம்",d:"ஒரு நாள்",dd:"%d நாட்கள்",M:"ஒரு மாதம்",MM:"%d மாதங்கள்",y:"ஒரு வருடம்",yy:"%d ஆண்டுகள்"},dayOfMonthOrdinalParse:/\d{1,2}வது/,ordinal:function(a){return a+"வது"},preparse:function(a){return a.replace(/[௧௨௩௪௫௬௭௮௯௦]/g,function(a){return Qh[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Ph[a]})},meridiemParse:/யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,meridiem:function(a,b,c){return a<2?" யாமம்":a<6?" வைகறை":a<10?" காலை":a<14?" நண்பகல்":a<18?" எற்பாடு":a<22?" மாலை":" யாமம்"},meridiemHour:function(a,b){return 12===a&&(a=0),"யாமம்"===b?a<2?a:a+12:"வைகறை"===b||"காலை"===b?a:"நண்பகல்"===b&&a>=10?a:a+12},week:{dow:0,doy:6}}),
//! moment.js locale configuration
//! locale : Telugu [te]
//! author : Krishna Chaitanya Thota : https://github.com/kcthota
a.defineLocale("te",{months:"జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జూలై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్".split("_"),monthsShort:"జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జూలై_ఆగ._సెప్._అక్టో._నవ._డిసె.".split("_"),monthsParseExact:!0,weekdays:"ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం".split("_"),weekdaysShort:"ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని".split("_"),weekdaysMin:"ఆ_సో_మం_బు_గు_శు_శ".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[నేడు] LT",nextDay:"[రేపు] LT",nextWeek:"dddd, LT",lastDay:"[నిన్న] LT",lastWeek:"[గత] dddd, LT",sameElse:"L"},relativeTime:{future:"%s లో",past:"%s క్రితం",s:"కొన్ని క్షణాలు",m:"ఒక నిమిషం",mm:"%d నిమిషాలు",h:"ఒక గంట",hh:"%d గంటలు",d:"ఒక రోజు",dd:"%d రోజులు",M:"ఒక నెల",MM:"%d నెలలు",y:"ఒక సంవత్సరం",yy:"%d సంవత్సరాలు"},dayOfMonthOrdinalParse:/\d{1,2}వ/,ordinal:"%dవ",meridiemParse:/రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,meridiemHour:function(a,b){return 12===a&&(a=0),"రాత్రి"===b?a<4?a:a+12:"ఉదయం"===b?a:"మధ్యాహ్నం"===b?a>=10?a:a+12:"సాయంత్రం"===b?a+12:void 0},meridiem:function(a,b,c){return a<4?"రాత్రి":a<10?"ఉదయం":a<17?"మధ్యాహ్నం":a<20?"సాయంత్రం":"రాత్రి"},week:{dow:0,doy:6}}),
//! moment.js locale configuration
//! locale : Tetun Dili (East Timor) [tet]
//! author : Joshua Brooks : https://github.com/joshbrooks
//! author : Onorio De J. Afonso : https://github.com/marobo
a.defineLocale("tet",{months:"Janeiru_Fevereiru_Marsu_Abril_Maiu_Juniu_Juliu_Augustu_Setembru_Outubru_Novembru_Dezembru".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Aug_Set_Out_Nov_Dez".split("_"),weekdays:"Domingu_Segunda_Tersa_Kuarta_Kinta_Sexta_Sabadu".split("_"),weekdaysShort:"Dom_Seg_Ters_Kua_Kint_Sext_Sab".split("_"),weekdaysMin:"Do_Seg_Te_Ku_Ki_Sex_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Ohin iha] LT",nextDay:"[Aban iha] LT",nextWeek:"dddd [iha] LT",lastDay:"[Horiseik iha] LT",lastWeek:"dddd [semana kotuk] [iha] LT",sameElse:"L"},relativeTime:{future:"iha %s",past:"%s liuba",s:"minutu balun",m:"minutu ida",mm:"minutus %d",h:"horas ida",hh:"horas %d",d:"loron ida",dd:"loron %d",M:"fulan ida",MM:"fulan %d",y:"tinan ida",yy:"tinan %d"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Thai [th]
//! author : Kridsada Thanabulpong : https://github.com/sirn
a.defineLocale("th",{months:"มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),monthsShort:"ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.".split("_"),monthsParseExact:!0,weekdays:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),weekdaysShort:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),weekdaysMin:"อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY เวลา H:mm",LLLL:"วันddddที่ D MMMM YYYY เวลา H:mm"},meridiemParse:/ก่อนเที่ยง|หลังเที่ยง/,isPM:function(a){return"หลังเที่ยง"===a},meridiem:function(a,b,c){return a<12?"ก่อนเที่ยง":"หลังเที่ยง"},calendar:{sameDay:"[วันนี้ เวลา] LT",nextDay:"[พรุ่งนี้ เวลา] LT",nextWeek:"dddd[หน้า เวลา] LT",lastDay:"[เมื่อวานนี้ เวลา] LT",lastWeek:"[วัน]dddd[ที่แล้ว เวลา] LT",sameElse:"L"},relativeTime:{future:"อีก %s",past:"%sที่แล้ว",s:"ไม่กี่วินาที",m:"1 นาที",mm:"%d นาที",h:"1 ชั่วโมง",hh:"%d ชั่วโมง",d:"1 วัน",dd:"%d วัน",M:"1 เดือน",MM:"%d เดือน",y:"1 ปี",yy:"%d ปี"}}),
//! moment.js locale configuration
//! locale : Tagalog (Philippines) [tl-ph]
//! author : Dan Hagman : https://github.com/hagmandan
a.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY HH:mm",LLLL:"dddd, MMMM DD, YYYY HH:mm"},calendar:{sameDay:"LT [ngayong araw]",nextDay:"[Bukas ng] LT",nextWeek:"LT [sa susunod na] dddd",lastDay:"LT [kahapon]",lastWeek:"LT [noong nakaraang] dddd",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Klingon [tlh]
//! author : Dominika Kruk : https://github.com/amaranthrose
var Rh="pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut".split("_");a.defineLocale("tlh",{months:"tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’".split("_"),monthsShort:"jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’".split("_"),monthsParseExact:!0,weekdays:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),weekdaysShort:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),weekdaysMin:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[DaHjaj] LT",nextDay:"[wa’leS] LT",nextWeek:"LLL",lastDay:"[wa’Hu’] LT",lastWeek:"LLL",sameElse:"L"},relativeTime:{future:ie,past:je,s:"puS lup",m:"wa’ tup",mm:ke,h:"wa’ rep",hh:ke,d:"wa’ jaj",dd:ke,M:"wa’ jar",MM:ke,y:"wa’ DIS",yy:ke},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});
//! moment.js locale configuration
//! locale : Turkish [tr]
//! authors : Erhan Gundogan : https://github.com/erhangundogan,
//!           Burak Yiğit Kaya: https://github.com/BYK
var Sh={1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"};a.defineLocale("tr",{months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[haftaya] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen hafta] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},dayOfMonthOrdinalParse:/\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,ordinal:function(a){if(0===a)return a+"'ıncı";var b=a%10,c=a%100-b,d=a>=100?100:null;return a+(Sh[b]||Sh[c]||Sh[d])},week:{dow:1,doy:7}}),
//! moment.js locale configuration
//! locale : Talossan [tzl]
//! author : Robin van der Vliet : https://github.com/robin0van0der0v
//! author : Iustì Canun
a.defineLocale("tzl",{months:"Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar".split("_"),monthsShort:"Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec".split("_"),weekdays:"Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi".split("_"),weekdaysShort:"Súl_Lún_Mai_Már_Xhú_Vié_Sát".split("_"),weekdaysMin:"Sú_Lú_Ma_Má_Xh_Vi_Sá".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"D. MMMM [dallas] YYYY",LLL:"D. MMMM [dallas] YYYY HH.mm",LLLL:"dddd, [li] D. MMMM [dallas] YYYY HH.mm"},meridiemParse:/d\'o|d\'a/i,isPM:function(a){return"d'o"===a.toLowerCase()},meridiem:function(a,b,c){return a>11?c?"d'o":"D'O":c?"d'a":"D'A"},calendar:{sameDay:"[oxhi à] LT",nextDay:"[demà à] LT",nextWeek:"dddd [à] LT",lastDay:"[ieiri à] LT",lastWeek:"[sür el] dddd [lasteu à] LT",sameElse:"L"},relativeTime:{future:"osprei %s",past:"ja%s",s:me,m:me,mm:me,h:me,hh:me,d:me,dd:me,M:me,MM:me,y:me,yy:me},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),
//! moment.js locale configuration
//! locale : Central Atlas Tamazight Latin [tzm-latn]
//! author : Abdel Said : https://github.com/abdelsaid
a.defineLocale("tzm-latn",{months:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",m:"minuḍ",mm:"%d minuḍ",h:"saɛa",hh:"%d tassaɛin",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,doy:12}}),
//! moment.js locale configuration
//! locale : Central Atlas Tamazight [tzm]
//! author : Abdel Said : https://github.com/abdelsaid
a.defineLocale("tzm",{months:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),monthsShort:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),weekdays:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysShort:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysMin:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ⴰⵙⴷⵅ ⴴ] LT",nextDay:"[ⴰⵙⴽⴰ ⴴ] LT",nextWeek:"dddd [ⴴ] LT",lastDay:"[ⴰⵚⴰⵏⵜ ⴴ] LT",lastWeek:"dddd [ⴴ] LT",sameElse:"L"},relativeTime:{future:"ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",past:"ⵢⴰⵏ %s",s:"ⵉⵎⵉⴽ",m:"ⵎⵉⵏⵓⴺ",mm:"%d ⵎⵉⵏⵓⴺ",h:"ⵙⴰⵄⴰ",hh:"%d ⵜⴰⵙⵙⴰⵄⵉⵏ",d:"ⴰⵙⵙ",dd:"%d oⵙⵙⴰⵏ",M:"ⴰⵢoⵓⵔ",MM:"%d ⵉⵢⵢⵉⵔⵏ",y:"ⴰⵙⴳⴰⵙ",yy:"%d ⵉⵙⴳⴰⵙⵏ"},week:{dow:6,doy:12}}),a.defineLocale("uk",{months:{format:"січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_"),standalone:"січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_")},monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekdays:pe,weekdaysShort:"нд_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., HH:mm",LLLL:"dddd, D MMMM YYYY р., HH:mm"},calendar:{sameDay:qe("[Сьогодні "),nextDay:qe("[Завтра "),lastDay:qe("[Вчора "),nextWeek:qe("[У] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return qe("[Минулої] dddd [").call(this);case 1:case 2:case 4:return qe("[Минулого] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:oe,mm:oe,h:"годину",hh:oe,d:"день",dd:oe,M:"місяць",MM:oe,y:"рік",yy:oe},meridiemParse:/ночі|ранку|дня|вечора/,isPM:function(a){return/^(дня|вечора)$/.test(a)},meridiem:function(a,b,c){return a<4?"ночі":a<12?"ранку":a<17?"дня":"вечора"},dayOfMonthOrdinalParse:/\d{1,2}-(й|го)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a+"-й";case"D":return a+"-го";default:return a}},week:{dow:1,doy:7}});
//! moment.js locale configuration
//! locale : Urdu [ur]
//! author : Sawood Alam : https://github.com/ibnesayeed
//! author : Zack : https://github.com/ZackVision
var Th=["جنوری","فروری","مارچ","اپریل","مئی","جون","جولائی","اگست","ستمبر","اکتوبر","نومبر","دسمبر"],Uh=["اتوار","پیر","منگل","بدھ","جمعرات","جمعہ","ہفتہ"];
//! moment.js locale configuration
//! locale : Uzbek Latin [uz-latn]
//! author : Rasulbek Mirzayev : github.com/Rasulbeeek
//! moment.js locale configuration
//! locale : Uzbek [uz]
//! author : Sardor Muminov : https://github.com/muminoff
//! moment.js locale configuration
//! locale : Vietnamese [vi]
//! author : Bang Nguyen : https://github.com/bangnk
//! moment.js locale configuration
//! locale : Pseudo [x-pseudo]
//! author : Andrew Hood : https://github.com/andrewhood125
//! moment.js locale configuration
//! locale : Yoruba Nigeria [yo]
//! author : Atolagbe Abisoye : https://github.com/andela-batolagbe
//! moment.js locale configuration
//! locale : Chinese (China) [zh-cn]
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng
//! moment.js locale configuration
//! locale : Chinese (Hong Kong) [zh-hk]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris
//! author : Konstantin : https://github.com/skfd
//! moment.js locale configuration
//! locale : Chinese (Taiwan) [zh-tw]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris
return a.defineLocale("ur",{months:Th,monthsShort:Th,weekdays:Uh,weekdaysShort:Uh,weekdaysMin:Uh,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd، D MMMM YYYY HH:mm"},meridiemParse:/صبح|شام/,isPM:function(a){return"شام"===a},meridiem:function(a,b,c){return a<12?"صبح":"شام"},calendar:{sameDay:"[آج بوقت] LT",nextDay:"[کل بوقت] LT",nextWeek:"dddd [بوقت] LT",lastDay:"[گذشتہ روز بوقت] LT",lastWeek:"[گذشتہ] dddd [بوقت] LT",sameElse:"L"},relativeTime:{future:"%s بعد",past:"%s قبل",s:"چند سیکنڈ",m:"ایک منٹ",mm:"%d منٹ",h:"ایک گھنٹہ",hh:"%d گھنٹے",d:"ایک دن",dd:"%d دن",M:"ایک ماہ",MM:"%d ماہ",y:"ایک سال",yy:"%d سال"},preparse:function(a){return a.replace(/،/g,",")},postformat:function(a){return a.replace(/,/g,"،")},week:{dow:1,doy:4}}),a.defineLocale("uz-latn",{months:"Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr".split("_"),monthsShort:"Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek".split("_"),weekdays:"Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba".split("_"),weekdaysShort:"Yak_Dush_Sesh_Chor_Pay_Jum_Shan".split("_"),weekdaysMin:"Ya_Du_Se_Cho_Pa_Ju_Sha".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},calendar:{sameDay:"[Bugun soat] LT [da]",nextDay:"[Ertaga] LT [da]",nextWeek:"dddd [kuni soat] LT [da]",lastDay:"[Kecha soat] LT [da]",lastWeek:"[O'tgan] dddd [kuni soat] LT [da]",sameElse:"L"},relativeTime:{future:"Yaqin %s ichida",past:"Bir necha %s oldin",s:"soniya",m:"bir daqiqa",mm:"%d daqiqa",h:"bir soat",hh:"%d soat",d:"bir kun",dd:"%d kun",M:"bir oy",MM:"%d oy",y:"bir yil",yy:"%d yil"},week:{dow:1,doy:7}}),a.defineLocale("uz",{months:"январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),weekdaysShort:"Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),weekdaysMin:"Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},calendar:{sameDay:"[Бугун соат] LT [да]",nextDay:"[Эртага] LT [да]",nextWeek:"dddd [куни соат] LT [да]",lastDay:"[Кеча соат] LT [да]",lastWeek:"[Утган] dddd [куни соат] LT [да]",sameElse:"L"},relativeTime:{future:"Якин %s ичида",past:"Бир неча %s олдин",s:"фурсат",m:"бир дакика",mm:"%d дакика",h:"бир соат",hh:"%d соат",d:"бир кун",dd:"%d кун",M:"бир ой",MM:"%d ой",y:"бир йил",yy:"%d йил"},week:{dow:1,doy:7}}),a.defineLocale("vi",{months:"tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),monthsShort:"Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),monthsParseExact:!0,weekdays:"chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysParseExact:!0,meridiemParse:/sa|ch/i,isPM:function(a){return/^ch$/i.test(a)},meridiem:function(a,b,c){return a<12?c?"sa":"SA":c?"ch":"CH"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM [năm] YYYY",LLL:"D MMMM [năm] YYYY HH:mm",LLLL:"dddd, D MMMM [năm] YYYY HH:mm",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[Hôm nay lúc] LT",nextDay:"[Ngày mai lúc] LT",nextWeek:"dddd [tuần tới lúc] LT",lastDay:"[Hôm qua lúc] LT",lastWeek:"dddd [tuần rồi lúc] LT",sameElse:"L"},relativeTime:{future:"%s tới",past:"%s trước",s:"vài giây",m:"một phút",mm:"%d phút",h:"một giờ",hh:"%d giờ",d:"một ngày",dd:"%d ngày",M:"một tháng",MM:"%d tháng",y:"một năm",yy:"%d năm"},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}}),a.defineLocale("x-pseudo",{months:"J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér".split("_"),monthsShort:"J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc".split("_"),monthsParseExact:!0,weekdays:"S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý".split("_"),weekdaysShort:"S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát".split("_"),weekdaysMin:"S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[T~ódá~ý át] LT",nextDay:"[T~ómó~rró~w át] LT",nextWeek:"dddd [át] LT",lastDay:"[Ý~ést~érdá~ý át] LT",lastWeek:"[L~ást] dddd [át] LT",sameElse:"L"},relativeTime:{future:"í~ñ %s",past:"%s á~gó",s:"á ~féw ~sécó~ñds",m:"á ~míñ~úté",mm:"%d m~íñú~tés",h:"á~ñ hó~úr",hh:"%d h~óúrs",d:"á ~dáý",dd:"%d d~áýs",M:"á ~móñ~th",MM:"%d m~óñt~hs",y:"á ~ýéár",yy:"%d ý~éárs"},dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),a.defineLocale("yo",{months:"Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀".split("_"),monthsShort:"Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀".split("_"),weekdays:"Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta".split("_"),weekdaysShort:"Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá".split("_"),weekdaysMin:"Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Ònì ni] LT",nextDay:"[Ọ̀la ni] LT",nextWeek:"dddd [Ọsẹ̀ tón'bọ] [ni] LT",lastDay:"[Àna ni] LT",lastWeek:"dddd [Ọsẹ̀ tólọ́] [ni] LT",sameElse:"L"},relativeTime:{future:"ní %s",past:"%s kọjá",s:"ìsẹjú aayá die",m:"ìsẹjú kan",mm:"ìsẹjú %d",h:"wákati kan",hh:"wákati %d",d:"ọjọ́ kan",dd:"ọjọ́ %d",M:"osù kan",MM:"osù %d",y:"ọdún kan",yy:"ọdún %d"},dayOfMonthOrdinalParse:/ọjọ́\s\d{1,2}/,ordinal:"ọjọ́ %d",week:{dow:1,doy:4}}),a.defineLocale("zh-cn",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日Ah点mm分",LLLL:"YYYY年MMMD日ddddAh点mm分",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日 HH:mm",llll:"YYYY年MMMD日dddd HH:mm"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"凌晨"===b||"早上"===b||"上午"===b?a:"下午"===b||"晚上"===b?a+12:a>=11?a:a+12},meridiem:function(a,b,c){var d=100*a+b;return d<600?"凌晨":d<900?"早上":d<1130?"上午":d<1230?"中午":d<1800?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}(日|月|周)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"周";default:return a}},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},week:{dow:1,doy:4}}),a.defineLocale("zh-hk",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日 HH:mm",LLLL:"YYYY年MMMD日dddd HH:mm",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日 HH:mm",llll:"YYYY年MMMD日dddd HH:mm"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"凌晨"===b||"早上"===b||"上午"===b?a:"中午"===b?a>=11?a:a+12:"下午"===b||"晚上"===b?a+12:void 0},meridiem:function(a,b,c){var d=100*a+b;return d<600?"凌晨":d<900?"早上":d<1130?"上午":d<1230?"中午":d<1800?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}(日|月|週)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"週";default:return a}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"1 分鐘",mm:"%d 分鐘",h:"1 小時",hh:"%d 小時",d:"1 天",dd:"%d 天",M:"1 個月",MM:"%d 個月",y:"1 年",yy:"%d 年"}}),a.defineLocale("zh-tw",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日 HH:mm",LLLL:"YYYY年MMMD日dddd HH:mm",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日 HH:mm",llll:"YYYY年MMMD日dddd HH:mm"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"凌晨"===b||"早上"===b||"上午"===b?a:"中午"===b?a>=11?a:a+12:"下午"===b||"晚上"===b?a+12:void 0},meridiem:function(a,b,c){var d=100*a+b;return d<600?"凌晨":d<900?"早上":d<1130?"上午":d<1230?"中午":d<1800?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}(日|月|週)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"週";default:return a}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"1 分鐘",mm:"%d 分鐘",h:"1 小時",hh:"%d 小時",d:"1 天",dd:"%d 天",M:"1 個月",MM:"%d 個月",y:"1 年",yy:"%d 年"}}),a.locale("en"),a});

});

__exports('datetime/moment-timezone', function() {
//! moment-timezone.js
//! version : 0.5.13
//! Copyright (c) JS Foundation and other contributors
//! license : MIT
//! github.com/moment/moment-timezone
!function(a,b){"use strict";"function"==typeof define&&define.amd?define(["moment"],b):"object"==typeof module&&module.exports?module.exports=b(require("moment")):b(a.moment)}(this,function(a){"use strict";function b(a){return a>96?a-87:a>64?a-29:a-48}function c(a){var c,d=0,e=a.split("."),f=e[0],g=e[1]||"",h=1,i=0,j=1;for(45===a.charCodeAt(0)&&(d=1,j=-1),d;d<f.length;d++)c=b(f.charCodeAt(d)),i=60*i+c;for(d=0;d<g.length;d++)h/=60,c=b(g.charCodeAt(d)),i+=c*h;return i*j}function d(a){for(var b=0;b<a.length;b++)a[b]=c(a[b])}function e(a,b){for(var c=0;c<b;c++)a[c]=Math.round((a[c-1]||0)+6e4*a[c]);a[b-1]=1/0}function f(a,b){var c,d=[];for(c=0;c<b.length;c++)d[c]=a[b[c]];return d}function g(a){var b=a.split("|"),c=b[2].split(" "),g=b[3].split(""),h=b[4].split(" ");return d(c),d(g),d(h),e(h,g.length),{name:b[0],abbrs:f(b[1].split(" "),g),offsets:f(c,g),untils:h,population:0|b[5]}}function h(a){a&&this._set(g(a))}function i(a){var b=a.toTimeString(),c=b.match(/\([a-z ]+\)/i);c&&c[0]?(c=c[0].match(/[A-Z]/g),c=c?c.join(""):void 0):(c=b.match(/[A-Z]{3,5}/g),c=c?c[0]:void 0),"GMT"===c&&(c=void 0),this.at=+a,this.abbr=c,this.offset=a.getTimezoneOffset()}function j(a){this.zone=a,this.offsetScore=0,this.abbrScore=0}function k(a,b){for(var c,d;d=6e4*((b.at-a.at)/12e4|0);)c=new i(new Date(a.at+d)),c.offset===a.offset?a=c:b=c;return a}function l(){var a,b,c,d=(new Date).getFullYear()-2,e=new i(new Date(d,0,1)),f=[e];for(c=1;c<48;c++)b=new i(new Date(d,c,1)),b.offset!==e.offset&&(a=k(e,b),f.push(a),f.push(new i(new Date(a.at+6e4)))),e=b;for(c=0;c<4;c++)f.push(new i(new Date(d+c,0,1))),f.push(new i(new Date(d+c,6,1)));return f}function m(a,b){return a.offsetScore!==b.offsetScore?a.offsetScore-b.offsetScore:a.abbrScore!==b.abbrScore?a.abbrScore-b.abbrScore:b.zone.population-a.zone.population}function n(a,b){var c,e;for(d(b),c=0;c<b.length;c++)e=b[c],I[e]=I[e]||{},I[e][a]=!0}function o(a){var b,c,d,e=a.length,f={},g=[];for(b=0;b<e;b++){d=I[a[b].offset]||{};for(c in d)d.hasOwnProperty(c)&&(f[c]=!0)}for(b in f)f.hasOwnProperty(b)&&g.push(H[b]);return g}function p(){try{var a=Intl.DateTimeFormat().resolvedOptions().timeZone;if(a){var b=H[r(a)];if(b)return b;z("Moment Timezone found "+a+" from the Intl api, but did not have that data loaded.")}}catch(c){}var d,e,f,g=l(),h=g.length,i=o(g),k=[];for(e=0;e<i.length;e++){for(d=new j(t(i[e]),h),f=0;f<h;f++)d.scoreOffsetAt(g[f]);k.push(d)}return k.sort(m),k.length>0?k[0].zone.name:void 0}function q(a){return D&&!a||(D=p()),D}function r(a){return(a||"").toLowerCase().replace(/\//g,"_")}function s(a){var b,c,d,e;for("string"==typeof a&&(a=[a]),b=0;b<a.length;b++)d=a[b].split("|"),c=d[0],e=r(c),F[e]=a[b],H[e]=c,d[5]&&n(e,d[2].split(" "))}function t(a,b){a=r(a);var c,d=F[a];return d instanceof h?d:"string"==typeof d?(d=new h(d),F[a]=d,d):G[a]&&b!==t&&(c=t(G[a],t))?(d=F[a]=new h,d._set(c),d.name=H[a],d):null}function u(){var a,b=[];for(a in H)H.hasOwnProperty(a)&&(F[a]||F[G[a]])&&H[a]&&b.push(H[a]);return b.sort()}function v(a){var b,c,d,e;for("string"==typeof a&&(a=[a]),b=0;b<a.length;b++)c=a[b].split("|"),d=r(c[0]),e=r(c[1]),G[d]=e,H[d]=c[0],G[e]=d,H[e]=c[1]}function w(a){s(a.zones),v(a.links),A.dataVersion=a.version}function x(a){return x.didShowError||(x.didShowError=!0,z("moment.tz.zoneExists('"+a+"') has been deprecated in favor of !moment.tz.zone('"+a+"')")),!!t(a)}function y(a){return!(!a._a||void 0!==a._tzm)}function z(a){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(a)}function A(b){var c=Array.prototype.slice.call(arguments,0,-1),d=arguments[arguments.length-1],e=t(d),f=a.utc.apply(null,c);return e&&!a.isMoment(b)&&y(f)&&f.add(e.parse(f),"minutes"),f.tz(d),f}function B(a){return function(){return this._z?this._z.abbr(this):a.call(this)}}function C(a){return function(){return this._z=null,a.apply(this,arguments)}}var D,E="0.5.13",F={},G={},H={},I={},J=a.version.split("."),K=+J[0],L=+J[1];(K<2||2===K&&L<6)&&z("Moment Timezone requires Moment.js >= 2.6.0. You are using Moment.js "+a.version+". See momentjs.com"),h.prototype={_set:function(a){this.name=a.name,this.abbrs=a.abbrs,this.untils=a.untils,this.offsets=a.offsets,this.population=a.population},_index:function(a){var b,c=+a,d=this.untils;for(b=0;b<d.length;b++)if(c<d[b])return b},parse:function(a){var b,c,d,e,f=+a,g=this.offsets,h=this.untils,i=h.length-1;for(e=0;e<i;e++)if(b=g[e],c=g[e+1],d=g[e?e-1:e],b<c&&A.moveAmbiguousForward?b=c:b>d&&A.moveInvalidForward&&(b=d),f<h[e]-6e4*b)return g[e];return g[i]},abbr:function(a){return this.abbrs[this._index(a)]},offset:function(a){return this.offsets[this._index(a)]}},j.prototype.scoreOffsetAt=function(a){this.offsetScore+=Math.abs(this.zone.offset(a.at)-a.offset),this.zone.abbr(a.at).replace(/[^A-Z]/g,"")!==a.abbr&&this.abbrScore++},A.version=E,A.dataVersion="",A._zones=F,A._links=G,A._names=H,A.add=s,A.link=v,A.load=w,A.zone=t,A.zoneExists=x,A.guess=q,A.names=u,A.Zone=h,A.unpack=g,A.unpackBase60=c,A.needsOffset=y,A.moveInvalidForward=!0,A.moveAmbiguousForward=!1;var M=a.fn;a.tz=A,a.defaultZone=null,a.updateOffset=function(b,c){var d,e=a.defaultZone;void 0===b._z&&(e&&y(b)&&!b._isUTC&&(b._d=a.utc(b._a)._d,b.utc().add(e.parse(b),"minutes")),b._z=e),b._z&&(d=b._z.offset(b),Math.abs(d)<16&&(d/=60),void 0!==b.utcOffset?b.utcOffset(-d,c):b.zone(d,c))},M.tz=function(b){return b?(this._z=t(b),this._z?a.updateOffset(this):z("Moment Timezone has no data for "+b+". See http://momentjs.com/timezone/docs/#/data-loading/."),this):this._z?this._z.name:void 0},M.zoneName=B(M.zoneName),M.zoneAbbr=B(M.zoneAbbr),M.utc=C(M.utc),a.tz.setDefault=function(b){return(K<2||2===K&&L<9)&&z("Moment Timezone setDefault() requires Moment.js >= 2.9.0. You are using Moment.js "+a.version+"."),a.defaultZone=b?t(b):null,a};var N=a.momentProperties;return"[object Array]"===Object.prototype.toString.call(N)?(N.push("_z"),N.push("_a")):N&&(N._z=null),w({version:"2017b",zones:["Africa/Abidjan|LMT GMT|g.8 0|01|-2ldXH.Q|48e5","Africa/Accra|LMT GMT +0020|.Q 0 -k|012121212121212121212121212121212121212121212121|-26BbX.8 6tzX.8 MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE|41e5","Africa/Nairobi|LMT EAT +0230 +0245|-2r.g -30 -2u -2J|01231|-1F3Cr.g 3Dzr.g okMu MFXJ|47e5","Africa/Algiers|PMT WET WEST CET CEST|-9.l 0 -10 -10 -20|0121212121212121343431312123431213|-2nco9.l cNb9.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 DA0 Imo0 rd0 De0 9Xz0 1fb0 1ap0 16K0 2yo0 mEp0 hwL0 jxA0 11A0 dDd0 17b0 11B0 1cN0 2Dy0 1cN0 1fB0 1cL0|26e5","Africa/Lagos|LMT WAT|-d.A -10|01|-22y0d.A|17e6","Africa/Bissau|LMT -01 GMT|12.k 10 0|012|-2ldWV.E 2xonV.E|39e4","Africa/Maputo|LMT CAT|-2a.k -20|01|-2GJea.k|26e5","Africa/Cairo|EET EEST|-20 -30|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-1bIO0 vb0 1ip0 11z0 1iN0 1nz0 12p0 1pz0 10N0 1pz0 16p0 1jz0 s3d0 Vz0 1oN0 11b0 1oO0 10N0 1pz0 10N0 1pb0 10N0 1pb0 10N0 1pb0 10N0 1pz0 10N0 1pb0 10N0 1pb0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1WL0 rd0 1Rz0 wp0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1qL0 Xd0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1ny0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 WL0 1qN0 Rb0 1wp0 On0 1zd0 Lz0 1EN0 Fb0 c10 8n0 8Nd0 gL0 e10 mn0|15e6","Africa/Casablanca|LMT WET WEST CET|u.k 0 -10 -10|0121212121212121213121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2gMnt.E 130Lt.E rb0 Dd0 dVb0 b6p0 TX0 EoB0 LL0 gnd0 rz0 43d0 AL0 1Nd0 XX0 1Cp0 pz0 dEp0 4mn0 SyN0 AL0 1Nd0 wn0 1FB0 Db0 1zd0 Lz0 1Nf0 wM0 co0 go0 1o00 s00 dA0 vc0 11A0 A00 e00 y00 11A0 uM0 e00 Dc0 11A0 s00 e00 IM0 WM0 mo0 gM0 LA0 WM0 jA0 e00 Rc0 11A0 e00 e00 U00 11A0 8o0 e00 11A0 11A0 5A0 e00 17c0 1fA0 1a00 1a00 1fA0 17c0 1io0 14o0 1lc0 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1lc0 14o0 1fA0|32e5","Africa/Ceuta|WET WEST CET CEST|0 -10 -10 -20|010101010101010101010232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-25KN0 11z0 drd0 18p0 3HX0 17d0 1fz0 1a10 1io0 1a00 1y7o0 LL0 gnd0 rz0 43d0 AL0 1Nd0 XX0 1Cp0 pz0 dEp0 4VB0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|85e3","Africa/El_Aaiun|LMT -01 WET WEST|Q.M 10 0 -10|01232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1rDz7.c 1GVA7.c 6L0 AL0 1Nd0 XX0 1Cp0 pz0 1cBB0 AL0 1Nd0 wn0 1FB0 Db0 1zd0 Lz0 1Nf0 wM0 co0 go0 1o00 s00 dA0 vc0 11A0 A00 e00 y00 11A0 uM0 e00 Dc0 11A0 s00 e00 IM0 WM0 mo0 gM0 LA0 WM0 jA0 e00 Rc0 11A0 e00 e00 U00 11A0 8o0 e00 11A0 11A0 5A0 e00 17c0 1fA0 1a00 1a00 1fA0 17c0 1io0 14o0 1lc0 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1lc0 14o0 1fA0|20e4","Africa/Johannesburg|SAST SAST SAST|-1u -20 -30|012121|-2GJdu 1Ajdu 1cL0 1cN0 1cL0|84e5","Africa/Khartoum|LMT CAT CAST EAT|-2a.8 -20 -30 -30|01212121212121212121212121212121213|-1yW2a.8 1zK0a.8 16L0 1iN0 17b0 1jd0 17b0 1ip0 17z0 1i10 17X0 1hB0 18n0 1hd0 19b0 1gp0 19z0 1iN0 17b0 1ip0 17z0 1i10 18n0 1hd0 18L0 1gN0 19b0 1gp0 19z0 1iN0 17z0 1i10 17X0 yGd0|51e5","Africa/Monrovia|MMT MMT GMT|H.8 I.u 0|012|-23Lzg.Q 28G01.m|11e5","Africa/Ndjamena|LMT WAT WAST|-10.c -10 -20|0121|-2le10.c 2J3c0.c Wn0|13e5","Africa/Tripoli|LMT CET CEST EET|-Q.I -10 -20 -20|012121213121212121212121213123123|-21JcQ.I 1hnBQ.I vx0 4iP0 xx0 4eN0 Bb0 7ip0 U0n0 A10 1db0 1cN0 1db0 1dd0 1db0 1eN0 1bb0 1e10 1cL0 1c10 1db0 1dd0 1db0 1cN0 1db0 1q10 fAn0 1ep0 1db0 AKq0 TA0 1o00|11e5","Africa/Tunis|PMT CET CEST|-9.l -10 -20|0121212121212121212121212121212121|-2nco9.l 18pa9.l 1qM0 DA0 3Tc0 11B0 1ze0 WM0 7z0 3d0 14L0 1cN0 1f90 1ar0 16J0 1gXB0 WM0 1rA0 11c0 nwo0 Ko0 1cM0 1cM0 1rA0 10M0 zuM0 10N0 1aN0 1qM0 WM0 1qM0 11A0 1o00|20e5","Africa/Windhoek|+0130 SAST SAST CAT WAT WAST|-1u -20 -30 -20 -10 -20|012134545454545454545454545454545454545454545454545454545454545454545454545454545454545454545|-2GJdu 1Ajdu 1cL0 1SqL0 9NA0 11D0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 11B0 1nX0 11B0|32e4","America/Adak|NST NWT NPT BST BDT AHST HST HDT|b0 a0 a0 b0 a0 a0 a0 90|012034343434343434343434343434343456767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17SX0 8wW0 iB0 Qlb0 52O0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cm0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|326","America/Anchorage|AST AWT APT AHST AHDT YST AKST AKDT|a0 90 90 a0 90 90 90 80|012034343434343434343434343434343456767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17T00 8wX0 iA0 Qlb0 52O0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cm0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|30e4","America/Port_of_Spain|LMT AST|46.4 40|01|-2kNvR.U|43e3","America/Araguaina|LMT -03 -02|3c.M 30 20|0121212121212121212121212121212121212121212121212121|-2glwL.c HdKL.c 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 dMN0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 ny10 Lz0|14e4","America/Argentina/Buenos_Aires|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232323232323232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wp0 Rb0 1wp0 TX0 A4p0 uL0 1qN0 WL0","America/Argentina/Catamarca|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232323132321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 rlB0 7B0 8zb0 uL0","America/Argentina/Cordoba|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232323132323232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 A4p0 uL0 1qN0 WL0","America/Argentina/Jujuy|CMT -04 -03 -02|4g.M 40 30 20|012121212121212121212121212121212121212121232323121323232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1ze0 TX0 1ld0 WK0 1wp0 TX0 A4p0 uL0","America/Argentina/La_Rioja|CMT -04 -03 -02|4g.M 40 30 20|012121212121212121212121212121212121212121232323231232321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Qn0 qO0 16n0 Rb0 1wp0 TX0 rlB0 7B0 8zb0 uL0","America/Argentina/Mendoza|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232312121321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1u20 SL0 1vd0 Tb0 1wp0 TW0 ri10 Op0 7TX0 uL0","America/Argentina/Rio_Gallegos|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232323232321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wp0 Rb0 1wp0 TX0 rlB0 7B0 8zb0 uL0","America/Argentina/Salta|CMT -04 -03 -02|4g.M 40 30 20|012121212121212121212121212121212121212121232323231323232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 A4p0 uL0","America/Argentina/San_Juan|CMT -04 -03 -02|4g.M 40 30 20|012121212121212121212121212121212121212121232323231232321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Qn0 qO0 16n0 Rb0 1wp0 TX0 rld0 m10 8lb0 uL0","America/Argentina/San_Luis|CMT -04 -03 -02|4g.M 40 30 20|012121212121212121212121212121212121212121232323121212321212|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 XX0 1q20 SL0 AN0 vDb0 m10 8lb0 8L0 jd0 1qN0 WL0 1qN0","America/Argentina/Tucuman|CMT -04 -03 -02|4g.M 40 30 20|0121212121212121212121212121212121212121212323232313232123232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 rlB0 4N0 8BX0 uL0 1qN0 WL0","America/Argentina/Ushuaia|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232323232321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wp0 Rb0 1wp0 TX0 rkN0 8p0 8zb0 uL0","America/Curacao|LMT -0430 AST|4z.L 4u 40|012|-2kV7o.d 28KLS.d|15e4","America/Asuncion|AMT -04 -03|3O.E 40 30|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-1x589.k 1DKM9.k 3CL0 3Dd0 10L0 1pB0 10n0 1pB0 10n0 1pB0 1cL0 1dd0 1db0 1dd0 1cL0 1dd0 1cL0 1dd0 1cL0 1dd0 1db0 1dd0 1cL0 1dd0 1cL0 1dd0 1cL0 1dd0 1db0 1dd0 1cL0 1lB0 14n0 1dd0 1cL0 1fd0 WL0 1rd0 1aL0 1dB0 Xz0 1qp0 Xb0 1qN0 10L0 1rB0 TX0 1tB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 1cL0 WN0 1qL0 11B0 1nX0 1ip0 WL0 1qN0 WL0 1qN0 WL0 1tB0 TX0 1tB0 TX0 1tB0 19X0 1a10 1fz0 1a10 1fz0 1cN0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0|28e5","America/Atikokan|CST CDT CWT CPT EST|60 50 50 50 50|0101234|-25TQ0 1in0 Rnb0 3je0 8x30 iw0|28e2","America/Bahia|LMT -03 -02|2y.4 30 20|01212121212121212121212121212121212121212121212121212121212121|-2glxp.U HdLp.U 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 l5B0 Rb0|27e5","America/Bahia_Banderas|LMT MST CST PST MDT CDT|71 70 60 80 60 50|0121212131414141414141414141414141414152525252525252525252525252525252525252525252525252525252|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 otX0 gmN0 P2N0 13Vd0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nW0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|84e3","America/Barbados|LMT BMT AST ADT|3W.t 3W.t 40 30|01232323232|-1Q0I1.v jsM0 1ODC1.v IL0 1ip0 17b0 1ip0 17b0 1ld0 13b0|28e4","America/Belem|LMT -03 -02|3d.U 30 20|012121212121212121212121212121|-2glwK.4 HdKK.4 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0|20e5","America/Belize|LMT CST -0530 CDT|5Q.M 60 5u 50|01212121212121212121212121212121212121212121212121213131|-2kBu7.c fPA7.c Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1f0Mu qn0 lxB0 mn0|57e3","America/Blanc-Sablon|AST ADT AWT APT|40 30 30 30|010230|-25TS0 1in0 UGp0 8x50 iu0|11e2","America/Boa_Vista|LMT -04 -03|42.E 40 30|0121212121212121212121212121212121|-2glvV.k HdKV.k 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 smp0 WL0 1tB0 2L0|62e2","America/Bogota|BMT -05 -04|4U.g 50 40|0121|-2eb73.I 38yo3.I 2en0|90e5","America/Boise|PST PDT MST MWT MPT MDT|80 70 70 60 60 60|0101023425252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252|-261q0 1nX0 11B0 1nX0 8C10 JCL0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 Dd0 1Kn0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|21e4","America/Cambridge_Bay|-00 MST MWT MPT MDDT MDT CST CDT EST|0 70 60 60 50 60 60 50 50|0123141515151515151515151515151515151515151515678651515151515151515151515151515151515151515151515151515151515151515151515151|-21Jc0 RO90 8x20 ix0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11A0 1nX0 2K0 WQ0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|15e2","America/Campo_Grande|LMT -04 -03|3C.s 40 30|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-2glwl.w HdLl.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 1C10 Lz0 1Ip0 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0|77e4","America/Cancun|LMT CST EST EDT CDT|5L.4 60 50 40 50|0123232341414141414141414141414141414141412|-1UQG0 2q2o0 yLB0 1lb0 14p0 1lb0 14p0 Lz0 xB0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 Dd0|63e4","America/Caracas|CMT -0430 -04|4r.E 4u 40|01212|-2kV7w.k 28KM2.k 1IwOu kqo0|29e5","America/Cayenne|LMT -04 -03|3t.k 40 30|012|-2mrwu.E 2gWou.E|58e3","America/Panama|CMT EST|5j.A 50|01|-2uduE.o|15e5","America/Chicago|CST CDT EST CWT CPT|60 50 50 50 50|01010101010101010101010101010101010102010101010103401010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 1wp0 TX0 WN0 1qL0 1cN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 11B0 1Hz0 14p0 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|92e5","America/Chihuahua|LMT MST CST CDT MDT|74.k 70 60 50 60|0121212323241414141414141414141414141414141414141414141414141414141414141414141414141414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 2zQN0 1lb0 14p0 1lb0 14q0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|81e4","America/Costa_Rica|SJMT CST CDT|5A.d 60 50|0121212121|-1Xd6n.L 2lu0n.L Db0 1Kp0 Db0 pRB0 15b0 1kp0 mL0|12e5","America/Creston|MST PST|70 80|010|-29DR0 43B0|53e2","America/Cuiaba|LMT -04 -03|3I.k 40 30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-2glwf.E HdLf.E 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 4a10 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0|54e4","America/Danmarkshavn|LMT -03 -02 GMT|1e.E 30 20 0|01212121212121212121212121212121213|-2a5WJ.k 2z5fJ.k 19U0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 DC0|8","America/Dawson|YST YDT YWT YPT YDDT PST PDT|90 80 80 80 70 80 70|0101023040565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565|-25TN0 1in0 1o10 13V0 Ser0 8x00 iz0 LCL0 1fA0 jrA0 fNd0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|13e2","America/Dawson_Creek|PST PDT PWT PPT MST|80 70 70 70 70|0102301010101010101010101010101010101010101010101010101014|-25TO0 1in0 UGp0 8x10 iy0 3NB0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 ML0|12e3","America/Denver|MST MDT MWT MPT|70 60 60 60|01010101023010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261r0 1nX0 11B0 1nX0 11B0 1qL0 WN0 mn0 Ord0 8x20 ix0 LCN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|26e5","America/Detroit|LMT CST EST EWT EPT EDT|5w.b 60 50 40 40 40|01234252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252|-2Cgir.N peqr.N 156L0 8x40 iv0 6fd0 11z0 Jy10 SL0 dnB0 1cL0 s10 1Vz0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|37e5","America/Edmonton|LMT MST MDT MWT MPT|7x.Q 70 60 60 60|01212121212121341212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2yd4q.8 shdq.8 1in0 17d0 hz0 2dB0 1fz0 1a10 11z0 1qN0 WL0 1qN0 11z0 IGN0 8x20 ix0 3NB0 11z0 LFB0 1cL0 3Cp0 1cL0 66N0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|10e5","America/Eirunepe|LMT -05 -04|4D.s 50 40|0121212121212121212121212121212121|-2glvk.w HdLk.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 dPB0 On0 yTd0 d5X0|31e3","America/El_Salvador|LMT CST CDT|5U.M 60 50|012121|-1XiG3.c 2Fvc3.c WL0 1qN0 WL0|11e5","America/Tijuana|LMT MST PST PDT PWT PPT|7M.4 70 80 70 70 70|012123245232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1UQE0 4PX0 8mM0 8lc0 SN0 1cL0 pHB0 83r0 zI0 5O10 1Rz0 cOO0 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 BUp0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 U10 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|20e5","America/Fort_Nelson|PST PDT PWT PPT MST|80 70 70 70 70|01023010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010104|-25TO0 1in0 UGp0 8x10 iy0 3NB0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0|39e2","America/Fort_Wayne|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|010101023010101010101010101040454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 QI10 Db0 RB0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 5Tz0 1o10 qLb0 1cL0 1cN0 1cL0 1qhd0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/Fortaleza|LMT -03 -02|2y 30 20|0121212121212121212121212121212121212121|-2glxq HdLq 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 nsp0 WL0 1tB0 5z0 2mN0 On0|34e5","America/Glace_Bay|LMT AST ADT AWT APT|3X.M 40 30 30 30|012134121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2IsI0.c CwO0.c 1in0 UGp0 8x50 iu0 iq10 11z0 Jg10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|19e3","America/Godthab|LMT -03 -02|3q.U 30 20|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2a5Ux.4 2z5dx.4 19U0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|17e3","America/Goose_Bay|NST NDT NST NDT NWT NPT AST ADT ADDT|3u.Q 2u.Q 3u 2u 2u 2u 40 30 20|010232323232323245232323232323232323232323232323232323232326767676767676767676767676767676767676767676768676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-25TSt.8 1in0 DXb0 2HbX.8 WL0 1qN0 WL0 1qN0 WL0 1tB0 TX0 1tB0 WL0 1qN0 WL0 1qN0 7UHu itu 1tB0 WL0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1tB0 WL0 1ld0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 S10 g0u 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14n1 1lb0 14p0 1nW0 11C0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|76e2","America/Grand_Turk|KMT EST EDT AST|57.b 50 40 40|0121212121212121212121212121212121212121212121212121212121212121212121212123|-2l1uQ.N 2HHBQ.N 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|37e2","America/Guatemala|LMT CST CDT|62.4 60 50|0121212121|-24KhV.U 2efXV.U An0 mtd0 Nz0 ifB0 17b0 zDB0 11z0|13e5","America/Guayaquil|QMT -05 -04|5e 50 40|0121|-1yVSK 2uILK rz0|27e5","America/Guyana|LMT -0345 -03 -04|3Q.E 3J 30 40|0123|-2dvU7.k 2r6LQ.k Bxbf|80e4","America/Halifax|LMT AST ADT AWT APT|4e.o 40 30 30 30|0121212121212121212121212121212121212121212121212134121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2IsHJ.A xzzJ.A 1db0 3I30 1in0 3HX0 IL0 1E10 ML0 1yN0 Pb0 1Bd0 Mn0 1Bd0 Rz0 1w10 Xb0 1w10 LX0 1w10 Xb0 1w10 Lz0 1C10 Jz0 1E10 OL0 1yN0 Un0 1qp0 Xb0 1qp0 11X0 1w10 Lz0 1HB0 LX0 1C10 FX0 1w10 Xb0 1qp0 Xb0 1BB0 LX0 1td0 Xb0 1qp0 Xb0 Rf0 8x50 iu0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 3Qp0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 3Qp0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 6i10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|39e4","America/Havana|HMT CST CDT|5t.A 50 40|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1Meuu.o 72zu.o ML0 sld0 An0 1Nd0 Db0 1Nd0 An0 6Ep0 An0 1Nd0 An0 JDd0 Mn0 1Ap0 On0 1fd0 11X0 1qN0 WL0 1wp0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 14n0 1ld0 14L0 1kN0 15b0 1kp0 1cL0 1cN0 1fz0 1a10 1fz0 1fB0 11z0 14p0 1nX0 11B0 1nX0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 14n0 1ld0 14n0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 1a10 1in0 1a10 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 17c0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 11A0 6i00 Rc0 1wo0 U00 1tA0 Rc0 1wo0 U00 1wo0 U00 1zc0 U00 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0|21e5","America/Hermosillo|LMT MST CST PST MDT|7n.Q 70 60 80 60|0121212131414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 otX0 gmN0 P2N0 13Vd0 1lb0 14p0 1lb0 14p0 1lb0|64e4","America/Indiana/Knox|CST CDT CWT CPT EST|60 50 50 50 50|0101023010101010101010101010101010101040101010101010101010101010101010101010101010101010141010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 3NB0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 11z0 1o10 11z0 1o10 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 3Cn0 8wp0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 z8o0 1o00 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/Indiana/Marengo|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|0101023010101010101010104545454545414545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 dyN0 11z0 6fd0 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 jrz0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1VA0 LA0 1BX0 1e6p0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/Indiana/Petersburg|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010104010101010101010101010141014545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 njX0 WN0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 3Fb0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 19co0 1o00 Rd0 1zb0 Oo0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/Indiana/Tell_City|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010101010454541010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 g0p0 11z0 1o10 11z0 1qL0 WN0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 caL0 1cL0 1cN0 1cL0 1qhd0 1o00 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/Indiana/Vevay|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|010102304545454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 kPB0 Awn0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1lnd0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/Indiana/Vincennes|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010101010454541014545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 g0p0 11z0 1o10 11z0 1qL0 WN0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 caL0 1cL0 1cN0 1cL0 1qhd0 1o00 Rd0 1zb0 Oo0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/Indiana/Winamac|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010101010101010454541054545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 jrz0 1cL0 1cN0 1cL0 1qhd0 1o00 Rd0 1za0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/Inuvik|-00 PST PDDT MST MDT|0 80 60 70 60|0121343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-FnA0 tWU0 1fA0 wPe0 2pz0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|35e2","America/Iqaluit|-00 EWT EPT EST EDDT EDT CST CDT|0 40 40 50 30 40 60 50|01234353535353535353535353535353535353535353567353535353535353535353535353535353535353535353535353535353535353535353535353|-16K00 7nX0 iv0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11C0 1nX0 11A0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|67e2","America/Jamaica|KMT EST EDT|57.b 50 40|0121212121212121212121|-2l1uQ.N 2uM1Q.N 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0|94e4","America/Juneau|PST PWT PPT PDT YDT YST AKST AKDT|80 70 70 70 80 90 90 80|01203030303030303030303030403030356767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17T20 8x10 iy0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cM0 1cM0 1cL0 1cN0 1fz0 1a10 1fz0 co0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|33e3","America/Kentucky/Louisville|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|0101010102301010101010101010101010101454545454545414545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 3Fd0 Nb0 LPd0 11z0 RB0 8x30 iw0 Bb0 10N0 2bB0 8in0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 xz0 gso0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1VA0 LA0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/Kentucky/Monticello|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|0101023010101010101010101010101010101010101010101010101010101010101010101454545454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 SWp0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11A0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/La_Paz|CMT BOST -04|4w.A 3w.A 40|012|-1x37r.o 13b0|19e5","America/Lima|LMT -05 -04|58.A 50 40|0121212121212121|-2tyGP.o 1bDzP.o zX0 1aN0 1cL0 1cN0 1cL0 1PrB0 zX0 1O10 zX0 6Gp0 zX0 98p0 zX0|11e6","America/Los_Angeles|PST PDT PWT PPT|80 70 70 70|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261q0 1nX0 11B0 1nX0 SgN0 8x10 iy0 5Wp1 1VaX 3dA0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|15e6","America/Maceio|LMT -03 -02|2m.Q 30 20|012121212121212121212121212121212121212121|-2glxB.8 HdLB.8 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 dMN0 Lz0 8Q10 WL0 1tB0 5z0 2mN0 On0|93e4","America/Managua|MMT CST EST CDT|5J.c 60 50 50|0121313121213131|-1quie.M 1yAMe.M 4mn0 9Up0 Dz0 1K10 Dz0 s3F0 1KH0 DB0 9In0 k8p0 19X0 1o30 11y0|22e5","America/Manaus|LMT -04 -03|40.4 40 30|01212121212121212121212121212121|-2glvX.U HdKX.U 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 dPB0 On0|19e5","America/Martinique|FFMT AST ADT|44.k 40 30|0121|-2mPTT.E 2LPbT.E 19X0|39e4","America/Matamoros|LMT CST CDT|6E 60 50|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1UQG0 2FjC0 1nX0 i6p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 U10 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|45e4","America/Mazatlan|LMT MST CST PST MDT|75.E 70 60 80 60|0121212131414141414141414141414141414141414141414141414141414141414141414141414141414141414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 otX0 gmN0 P2N0 13Vd0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|44e4","America/Menominee|CST CDT CWT CPT EST|60 50 50 50 50|01010230101041010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 LCN0 1fz0 6410 9Jb0 1cM0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|85e2","America/Merida|LMT CST EST CDT|5W.s 60 50 50|0121313131313131313131313131313131313131313131313131313131313131313131313131313131313131|-1UQG0 2q2o0 2hz0 wu30 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|11e5","America/Metlakatla|PST PWT PPT PDT AKST AKDT|80 70 70 70 90 80|0120303030303030303030303030303030454545454545454545454545454545454545454545454|-17T20 8x10 iy0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1hU10 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|14e2","America/Mexico_City|LMT MST CST CDT CWT|6A.A 70 60 50 50|012121232324232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 gEn0 TX0 3xd0 Jb0 6zB0 SL0 e5d0 17b0 1Pff0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|20e6","America/Miquelon|LMT AST -03 -02|3I.E 40 30 20|012323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-2mKkf.k 2LTAf.k gQ10 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|61e2","America/Moncton|EST AST ADT AWT APT|50 40 30 30 30|012121212121212121212134121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2IsH0 CwN0 1in0 zAo0 An0 1Nd0 An0 1Nd0 An0 1Nd0 An0 1Nd0 An0 1Nd0 An0 1K10 Lz0 1zB0 NX0 1u10 Wn0 S20 8x50 iu0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 3Cp0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14n1 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 ReX 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|64e3","America/Monterrey|LMT CST CDT|6F.g 60 50|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1UQG0 2FjC0 1nX0 i6p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|41e5","America/Montevideo|MMT -0330 -03 -02 -0230|3I.I 3u 30 20 2u|012121212121212121212121213232323232324242423243232323232323232323232323232323232323232|-20UIf.g 8jzJ.g 1cLu 1dcu 1cLu 1dcu 1cLu ircu 11zu 1o0u 11zu 1o0u 11zu 1qMu WLu 1qMu WLu 1qMu WLu 1qMu 11zu 1o0u 11zu NAu 11bu 2iMu zWu Dq10 19X0 pd0 jz0 cm10 19X0 1fB0 1on0 11d0 1oL0 1nB0 1fzu 1aou 1fzu 1aou 1fzu 3nAu Jb0 3MN0 1SLu 4jzu 2PB0 Lb0 3Dd0 1pb0 ixd0 An0 1MN0 An0 1wp0 On0 1wp0 Rb0 1zd0 On0 1wp0 Rb0 s8p0 1fB0 1ip0 11z0 1ld0 14n0 1o10 11z0 1o10 11z0 1o10 14n0 1ld0 14n0 1ld0 14n0 1o10 11z0 1o10 11z0 1o10 11z0|17e5","America/Toronto|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101012301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TR0 1in0 11Wu 1nzu 1fD0 WJ0 1wr0 Nb0 1Ap0 On0 1zd0 On0 1wp0 TX0 1tB0 TX0 1tB0 TX0 1tB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 4kM0 8x40 iv0 1o10 11z0 1nX0 11z0 1o10 11z0 1o10 1qL0 11D0 1nX0 11B0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|65e5","America/Nassau|LMT EST EDT|59.u 50 40|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2kNuO.u 26XdO.u 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|24e4","America/New_York|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261t0 1nX0 11B0 1nX0 11B0 1qL0 1a10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x40 iv0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|21e6","America/Nipigon|EST EDT EWT EPT|50 40 40 40|010123010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TR0 1in0 Rnb0 3je0 8x40 iv0 19yN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|16e2","America/Nome|NST NWT NPT BST BDT YST AKST AKDT|b0 a0 a0 b0 a0 90 90 80|012034343434343434343434343434343456767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17SX0 8wW0 iB0 Qlb0 52O0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cl0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|38e2","America/Noronha|LMT -02 -01|29.E 20 10|0121212121212121212121212121212121212121|-2glxO.k HdKO.k 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 nsp0 WL0 1tB0 2L0 2pB0 On0|30e2","America/North_Dakota/Beulah|MST MDT MWT MPT CST CDT|70 60 60 60 60 50|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101014545454545454545454545454545454545454545454545454545454|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Oo0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/North_Dakota/Center|MST MDT MWT MPT CST CDT|70 60 60 60 60 50|010102301010101010101010101010101010101010101010101010101014545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14o0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/North_Dakota/New_Salem|MST MDT MWT MPT CST CDT|70 60 60 60 60 50|010102301010101010101010101010101010101010101010101010101010101010101010101010101454545454545454545454545454545454545454545454545454545454545454545454|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14o0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","America/Ojinaga|LMT MST CST CDT MDT|6V.E 70 60 50 60|0121212323241414141414141414141414141414141414141414141414141414141414141414141414141414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 2zQN0 1lb0 14p0 1lb0 14q0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 U10 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e3","America/Pangnirtung|-00 AST AWT APT ADDT ADT EDT EST CST CDT|0 40 30 30 20 30 40 50 60 50|012314151515151515151515151515151515167676767689767676767676767676767676767676767676767676767676767676767676767676767676767|-1XiM0 PnG0 8x50 iu0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1o00 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11C0 1nX0 11A0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|14e2","America/Paramaribo|LMT PMT PMT -0330 -03|3E.E 3E.Q 3E.A 3u 30|01234|-2nDUj.k Wqo0.c qanX.I 1yVXN.o|24e4","America/Phoenix|MST MDT MWT|70 60 60|01010202010|-261r0 1nX0 11B0 1nX0 SgN0 4Al1 Ap0 1db0 SWqX 1cL0|42e5","America/Port-au-Prince|PPMT EST EDT|4N 50 40|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-28RHb 2FnMb 19X0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14q0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 i6n0 1nX0 11B0 1nX0 d430 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 3iN0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e5","America/Rio_Branco|LMT -05 -04|4v.c 50 40|01212121212121212121212121212121|-2glvs.M HdLs.M 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 NBd0 d5X0|31e4","America/Porto_Velho|LMT -04 -03|4f.A 40 30|012121212121212121212121212121|-2glvI.o HdKI.o 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0|37e4","America/Puerto_Rico|AST AWT APT|40 30 30|0120|-17lU0 7XT0 iu0|24e5","America/Punta_Arenas|SMT -05 -04 -03|4G.K 50 40 30|0102021212121212121232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323|-2q2jh.e fJAh.e 5knG.K 1Vzh.e jRAG.K 1pbh.e 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 nHX0 op0 blz0 ko0 Qeo0 WL0 1zd0 On0 1ip0 11z0 1o10 11z0 1qN0 WL0 1ld0 14n0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0","America/Rainy_River|CST CDT CWT CPT|60 50 50 50|010123010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TQ0 1in0 Rnb0 3je0 8x30 iw0 19yN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|842","America/Rankin_Inlet|-00 CST CDDT CDT EST|0 60 40 50 50|012131313131313131313131313131313131313131313431313131313131313131313131313131313131313131313131313131313131313131313131|-vDc0 keu0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|26e2","America/Recife|LMT -03 -02|2j.A 30 20|0121212121212121212121212121212121212121|-2glxE.o HdLE.o 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 nsp0 WL0 1tB0 2L0 2pB0 On0|33e5","America/Regina|LMT MST MDT MWT MPT CST|6W.A 70 60 60 60 60|012121212121212121212121341212121212121212121212121215|-2AD51.o uHe1.o 1in0 s2L0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 66N0 1cL0 1cN0 19X0 1fB0 1cL0 1fB0 1cL0 1cN0 1cL0 M30 8x20 ix0 1ip0 1cL0 1ip0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 3NB0 1cL0 1cN0|19e4","America/Resolute|-00 CST CDDT CDT EST|0 60 40 50 50|012131313131313131313131313131313131313131313431313131313431313131313131313131313131313131313131313131313131313131313131|-SnA0 GWS0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|229","America/Santarem|LMT -04 -03|3C.M 40 30|0121212121212121212121212121212|-2glwl.c HdLl.c 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 NBd0|21e4","America/Santiago|SMT -05 -04 -03|4G.K 50 40 30|010202121212121212321232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323|-2q2jh.e fJAh.e 5knG.K 1Vzh.e jRAG.K 1pbh.e 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 nHX0 op0 9Bz0 jb0 1oN0 ko0 Qeo0 WL0 1zd0 On0 1ip0 11z0 1o10 11z0 1qN0 WL0 1ld0 14n0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0|62e5","America/Santo_Domingo|SDMT EST EDT -0430 AST|4E 50 40 4u 40|01213131313131414|-1ttjk 1lJMk Mn0 6sp0 Lbu 1Cou yLu 1RAu wLu 1QMu xzu 1Q0u xXu 1PAu 13jB0 e00|29e5","America/Sao_Paulo|LMT -03 -02|36.s 30 20|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-2glwR.w HdKR.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 pTd0 PX0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 1C10 Lz0 1Ip0 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0|20e6","America/Scoresbysund|LMT -02 -01 +00|1r.Q 20 10 0|0121323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-2a5Ww.8 2z5ew.8 1a00 1cK0 1cL0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|452","America/Sitka|PST PWT PPT PDT YST AKST AKDT|80 70 70 70 90 90 80|01203030303030303030303030303030345656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565|-17T20 8x10 iy0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 co0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|90e2","America/St_Johns|NST NDT NST NDT NWT NPT NDDT|3u.Q 2u.Q 3u 2u 2u 2u 1u|01010101010101010101010101010101010102323232323232324523232323232323232323232323232323232323232323232323232323232323232323232323232323232326232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-28oit.8 14L0 1nB0 1in0 1gm0 Dz0 1JB0 1cL0 1cN0 1cL0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 1cL0 1cN0 1cL0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 1cL0 1fB0 19X0 1fB0 19X0 10O0 eKX.8 19X0 1iq0 WL0 1qN0 WL0 1qN0 WL0 1tB0 TX0 1tB0 WL0 1qN0 WL0 1qN0 7UHu itu 1tB0 WL0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1tB0 WL0 1ld0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14n1 1lb0 14p0 1nW0 11C0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|11e4","America/Swift_Current|LMT MST MDT MWT MPT CST|7b.k 70 60 60 60 60|012134121212121212121215|-2AD4M.E uHdM.E 1in0 UGp0 8x20 ix0 1o10 17b0 1ip0 11z0 1o10 11z0 1o10 11z0 isN0 1cL0 3Cp0 1cL0 1cN0 11z0 1qN0 WL0 pMp0|16e3","America/Tegucigalpa|LMT CST CDT|5M.Q 60 50|01212121|-1WGGb.8 2ETcb.8 WL0 1qN0 WL0 GRd0 AL0|11e5","America/Thule|LMT AST ADT|4z.8 40 30|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2a5To.Q 31NBo.Q 1cL0 1cN0 1cL0 1fB0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|656","America/Thunder_Bay|CST EST EWT EPT EDT|60 50 40 40 40|0123141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141|-2q5S0 1iaN0 8x40 iv0 XNB0 1cL0 1cN0 1fz0 1cN0 1cL0 3Cp0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|11e4","America/Vancouver|PST PDT PWT PPT|80 70 70 70|0102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TO0 1in0 UGp0 8x10 iy0 1o10 17b0 1ip0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e5","America/Whitehorse|YST YDT YWT YPT YDDT PST PDT|90 80 80 80 70 80 70|0101023040565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565|-25TN0 1in0 1o10 13V0 Ser0 8x00 iz0 LCL0 1fA0 3NA0 vrd0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e3","America/Winnipeg|CST CDT CWT CPT|60 50 50 50|010101023010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aIi0 WL0 3ND0 1in0 Jap0 Rb0 aCN0 8x30 iw0 1tB0 11z0 1ip0 11z0 1o10 11z0 1o10 11z0 1rd0 10L0 1op0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 1cL0 1cN0 11z0 6i10 WL0 6i10 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|66e4","America/Yakutat|YST YWT YPT YDT AKST AKDT|90 80 80 80 90 80|01203030303030303030303030303030304545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-17T10 8x00 iz0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cn0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|642","America/Yellowknife|-00 MST MWT MPT MDDT MDT|0 70 60 60 50 60|012314151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151|-1pdA0 hix0 8x20 ix0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|19e3","Antarctica/Casey|-00 +08 +11|0 -80 -b0|0121212|-2q00 1DjS0 T90 40P0 KL0 blz0|10","Antarctica/Davis|-00 +07 +05|0 -70 -50|01012121|-vyo0 iXt0 alj0 1D7v0 VB0 3Wn0 KN0|70","Antarctica/DumontDUrville|-00 +10|0 -a0|0101|-U0o0 cfq0 bFm0|80","Antarctica/Macquarie|AEST AEDT -00 +11|-a0 -b0 0 -b0|0102010101010101010101010101010101010101010101010101010101010101010101010101010101010101013|-29E80 19X0 4SL0 1ayy0 Lvs0 1cM0 1o00 Rc0 1wo0 Rc0 1wo0 U00 1wo0 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1qM0 WM0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1wo0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 11A0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 11A0 1o00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1cM0 1cM0 1cM0|1","Antarctica/Mawson|-00 +06 +05|0 -60 -50|012|-CEo0 2fyk0|60","Pacific/Auckland|NZMT NZST NZST NZDT|-bu -cu -c0 -d0|01020202020202020202020202023232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323|-1GCVu Lz0 1tB0 11zu 1o0u 11zu 1o0u 11zu 1o0u 14nu 1lcu 14nu 1lcu 1lbu 11Au 1nXu 11Au 1nXu 11Au 1nXu 11Au 1nXu 11Au 1qLu WMu 1qLu 11Au 1n1bu IM0 1C00 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1qM0 14o0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1io0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|14e5","Antarctica/Palmer|-00 -03 -04 -02|0 30 40 20|0121212121213121212121212121212121212121212121212121212121212121212121212121212121|-cao0 nD0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 jsN0 14N0 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0|40","Antarctica/Rothera|-00 -03|0 30|01|gOo0|130","Antarctica/Syowa|-00 +03|0 -30|01|-vs00|20","Antarctica/Troll|-00 +00 +02|0 0 -20|01212121212121212121212121212121212121212121212121212121212121212121|1puo0 hd0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|40","Antarctica/Vostok|-00 +06|0 -60|01|-tjA0|25","Europe/Oslo|CET CEST|-10 -20|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2awM0 Qm0 W6o0 5pf0 WM0 1fA0 1cM0 1cM0 1cM0 1cM0 wJc0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1qM0 WM0 zpc0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|62e4","Asia/Riyadh|LMT +03|-36.Q -30|01|-TvD6.Q|57e5","Asia/Almaty|LMT +05 +06 +07|-57.M -50 -60 -70|012323232323232323232321232323232323232323232323232|-1Pc57.M eUo7.M 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0|15e5","Asia/Amman|LMT EET EEST|-2n.I -20 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1yW2n.I 1HiMn.I KL0 1oN0 11b0 1oN0 11b0 1pd0 1dz0 1cp0 11b0 1op0 11b0 fO10 1db0 1e10 1cL0 1cN0 1cL0 1cN0 1fz0 1pd0 10n0 1ld0 14n0 1hB0 15b0 1ip0 19X0 1cN0 1cL0 1cN0 17b0 1ld0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1So0 y00 1fc0 1dc0 1co0 1dc0 1cM0 1cM0 1cM0 1o00 11A0 1lc0 17c0 1cM0 1cM0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 4bX0 Dd0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|25e5","Asia/Anadyr|LMT +12 +13 +14 +11|-bN.U -c0 -d0 -e0 -b0|01232121212121212121214121212121212121212121212121212121212141|-1PcbN.U eUnN.U 23CL0 1db0 2q10 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|13e3","Asia/Aqtau|LMT +04 +05 +06|-3l.4 -40 -50 -60|012323232323232323232123232312121212121212121212|-1Pc3l.4 eUnl.4 24PX0 2pX0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0|15e4","Asia/Aqtobe|LMT +04 +05 +06|-3M.E -40 -50 -60|0123232323232323232321232323232323232323232323232|-1Pc3M.E eUnM.E 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0|27e4","Asia/Ashgabat|LMT +04 +05 +06|-3R.w -40 -50 -60|0123232323232323232323212|-1Pc3R.w eUnR.w 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0|41e4","Asia/Atyrau|LMT +03 +05 +06 +04|-3r.I -30 -50 -60 -40|01232323232323232323242323232323232324242424242|-1Pc3r.I eUor.I 24PW0 2pX0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 2sp0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0","Asia/Baghdad|BMT +03 +04|-2V.A -30 -40|012121212121212121212121212121212121212121212121212121|-26BeV.A 2ACnV.A 11b0 1cp0 1dz0 1dd0 1db0 1cN0 1cp0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1de0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0|66e5","Asia/Qatar|LMT +04 +03|-3q.8 -40 -30|012|-21Jfq.8 27BXq.8|96e4","Asia/Baku|LMT +03 +04 +05|-3j.o -30 -40 -50|01232323232323232323232123232323232323232323232323232323232323232|-1Pc3j.o 1jUoj.o WCL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 1cM0 9Je0 1o00 11z0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00|27e5","Asia/Bangkok|BMT +07|-6G.4 -70|01|-218SG.4|15e6","Asia/Barnaul|LMT +06 +07 +08|-5z -60 -70 -80|0123232323232323232323212323232321212121212121212121212121212121212|-21S5z pCnz 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 p90 LE0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0","Asia/Beirut|EET EEST|-20 -30|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-21aq0 1on0 1410 1db0 19B0 1in0 1ip0 WL0 1lQp0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 11b0 q6N0 En0 1oN0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 11b0 1op0 11b0 dA10 17b0 1iN0 17b0 1iN0 17b0 1iN0 17b0 1vB0 SL0 1mp0 13z0 1iN0 17b0 1iN0 17b0 1jd0 12n0 1a10 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0|22e5","Asia/Bishkek|LMT +05 +06 +07|-4W.o -50 -60 -70|012323232323232323232321212121212121212121212121212|-1Pc4W.o eUnW.o 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2e00 1tX0 17b0 1ip0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1cPu 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0|87e4","Asia/Brunei|LMT +0730 +08|-7D.E -7u -80|012|-1KITD.E gDc9.E|42e4","Asia/Kolkata|HMT +0630 IST|-5R.k -6u -5u|01212|-18LFR.k 1unn.k HB0 7zX0|15e6","Asia/Chita|LMT +08 +09 +10|-7x.Q -80 -90 -a0|012323232323232323232321232323232323232323232323232323232323232312|-21Q7x.Q pAnx.Q 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3re0|33e4","Asia/Choibalsan|LMT +07 +08 +10 +09|-7C -70 -80 -a0 -90|0123434343434343434343434343434343434343434343424242|-2APHC 2UkoC cKn0 1da0 1dd0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 6hD0 11z0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 3Db0 h1f0 1cJ0 1cP0 1cJ0|38e3","Asia/Shanghai|CST CDT|-80 -90|01010101010101010|-1c1I0 LX0 16p0 1jz0 1Myp0 Rb0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0|23e6","Asia/Colombo|MMT +0530 +06 +0630|-5j.w -5u -60 -6u|01231321|-2zOtj.w 1rFbN.w 1zzu 7Apu 23dz0 11zu n3cu|22e5","Asia/Dhaka|HMT +0630 +0530 +06 +07|-5R.k -6u -5u -60 -70|0121343|-18LFR.k 1unn.k HB0 m6n0 2kxbu 1i00|16e6","Asia/Damascus|LMT EET EEST|-2p.c -20 -30|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-21Jep.c Hep.c 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1xRB0 11X0 1oN0 10L0 1pB0 11b0 1oN0 10L0 1mp0 13X0 1oN0 11b0 1pd0 11b0 1oN0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 Nb0 1AN0 Nb0 bcp0 19X0 1gp0 19X0 3ld0 1xX0 Vd0 1Bz0 Sp0 1vX0 10p0 1dz0 1cN0 1cL0 1db0 1db0 1g10 1an0 1ap0 1db0 1fd0 1db0 1cN0 1db0 1dd0 1db0 1cp0 1dz0 1c10 1dX0 1cN0 1db0 1dd0 1db0 1cN0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1db0 1cN0 1db0 1cN0 19z0 1fB0 1qL0 11B0 1on0 Wp0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0|26e5","Asia/Dili|LMT +08 +09|-8m.k -80 -90|01212|-2le8m.k 1dnXm.k 1nfA0 Xld0|19e4","Asia/Dubai|LMT +04|-3F.c -40|01|-21JfF.c|39e5","Asia/Dushanbe|LMT +05 +06 +07|-4z.c -50 -60 -70|012323232323232323232321|-1Pc4z.c eUnz.c 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2hB0|76e4","Asia/Famagusta|LMT EET EEST +03|-2f.M -20 -30 -30|01212121212121212121212121212121212121212121212121212121212121212121212121212121212123|-1Vc2f.M 2a3cf.M 1cL0 1qp0 Xz0 19B0 19X0 1fB0 1db0 1cp0 1cL0 1fB0 19X0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1o30 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 15U0","Asia/Gaza|EET EEST IST IDT|-20 -30 -20 -30|010101010101010101010101010101012323232323232323232323232320101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-1c2q0 5Rb0 10r0 1px0 10N0 1pz0 16p0 1jB0 16p0 1jx0 pBd0 Vz0 1oN0 11b0 1oO0 10N0 1pz0 10N0 1pb0 10N0 1pb0 10N0 1pb0 10N0 1pz0 10N0 1pb0 10N0 1pb0 11d0 1oL0 dW0 hfB0 Db0 1fB0 Rb0 npB0 11z0 1C10 IL0 1s10 10n0 1o10 WL0 1zd0 On0 1ld0 11z0 1o10 14n0 1o10 14n0 1nd0 12n0 1nd0 Xz0 1q10 12n0 M10 C00 17c0 1io0 17c0 1io0 17c0 1o00 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 17c0 1io0 18N0 1bz0 19z0 1gp0 1610 1iL0 11z0 1o10 14o0 1lA1 SKX 1xd1 MKX 1AN0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nz0 1220 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0|18e5","Asia/Hebron|EET EEST IST IDT|-20 -30 -20 -30|01010101010101010101010101010101232323232323232323232323232010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-1c2q0 5Rb0 10r0 1px0 10N0 1pz0 16p0 1jB0 16p0 1jx0 pBd0 Vz0 1oN0 11b0 1oO0 10N0 1pz0 10N0 1pb0 10N0 1pb0 10N0 1pb0 10N0 1pz0 10N0 1pb0 10N0 1pb0 11d0 1oL0 dW0 hfB0 Db0 1fB0 Rb0 npB0 11z0 1C10 IL0 1s10 10n0 1o10 WL0 1zd0 On0 1ld0 11z0 1o10 14n0 1o10 14n0 1nd0 12n0 1nd0 Xz0 1q10 12n0 M10 C00 17c0 1io0 17c0 1io0 17c0 1o00 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 17c0 1io0 18N0 1bz0 19z0 1gp0 1610 1iL0 12L0 1mN0 14o0 1lc0 Tb0 1xd1 MKX bB0 cn0 1cN0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nz0 1220 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0|25e4","Asia/Ho_Chi_Minh|LMT PLMT +07 +08 +09|-76.E -76.u -70 -80 -90|0123423232|-2yC76.E bK00.a 1h7b6.u 5lz0 18o0 3Oq0 k5b0 aW00 BAM0|90e5","Asia/Hong_Kong|LMT HKT HKST JST|-7A.G -80 -90 -90|0121312121212121212121212121212121212121212121212121212121212121212121|-2CFHA.G 1sEP6.G 1cL0 ylu 93X0 1qQu 1tX0 Rd0 1In0 NB0 1cL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1kL0 14N0 1nX0 U10 1tz0 U10 1wn0 Rd0 1wn0 U10 1tz0 U10 1tz0 U10 1tz0 U10 1wn0 Rd0 1wn0 Rd0 1wn0 U10 1tz0 U10 1tz0 17d0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 s10 1Vz0 1cN0 1cL0 1cN0 1cL0 6fd0 14n0|73e5","Asia/Hovd|LMT +06 +07 +08|-66.A -60 -70 -80|012323232323232323232323232323232323232323232323232|-2APG6.A 2Uko6.A cKn0 1db0 1dd0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 6hD0 11z0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 kEp0 1cJ0 1cP0 1cJ0|81e3","Asia/Irkutsk|IMT +07 +08 +09|-6V.5 -70 -80 -90|01232323232323232323232123232323232323232323232323232323232323232|-21zGV.5 pjXV.5 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|60e4","Europe/Istanbul|IMT EET EEST +04 +03|-1U.U -20 -30 -40 -30|012121212121212121212121212121212121212121212121212121234343434342121212121212121212121212121212121212121212121212121212121212124|-2ogNU.U dzzU.U 11b0 8tB0 1on0 1410 1db0 19B0 1in0 3Rd0 Un0 1oN0 11b0 zSp0 CL0 mN0 1Vz0 1gN0 1pz0 5Rd0 1fz0 1yp0 ML0 1kp0 17b0 1ip0 17b0 1fB0 19X0 1jB0 18L0 1ip0 17z0 qdd0 xX0 3S10 Tz0 dA10 11z0 1o10 11z0 1qN0 11z0 1ze0 11B0 WM0 1qO0 WI0 1nX0 1rB0 10L0 11B0 1in0 17d0 1in0 2pX0 19E0 1fU0 16Q0 1iI0 16Q0 1iI0 1Vd0 pb0 3Kp0 14o0 1de0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1a00 1fA0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WO0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 Xc0 1qo0 WM0 1qM0 11A0 1o00 1200 1nA0 11A0 1tA0 U00 15w0|13e6","Asia/Jakarta|BMT +0720 +0730 +09 +08 WIB|-77.c -7k -7u -90 -80 -70|01232425|-1Q0Tk luM0 mPzO 8vWu 6kpu 4PXu xhcu|31e6","Asia/Jayapura|LMT +09 +0930 WIT|-9m.M -90 -9u -90|0123|-1uu9m.M sMMm.M L4nu|26e4","Asia/Jerusalem|JMT IST IDT IDDT|-2k.E -20 -30 -40|01212121212132121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-26Bek.E SyMk.E 5Rb0 10r0 1px0 10N0 1pz0 16p0 1jB0 16p0 1jx0 3LB0 Em0 or0 1cn0 1dB0 16n0 10O0 1ja0 1tC0 14o0 1cM0 1a00 11A0 1Na0 An0 1MP0 AJ0 1Kp0 LC0 1oo0 Wl0 EQN0 Db0 1fB0 Rb0 npB0 11z0 1C10 IL0 1s10 10n0 1o10 WL0 1zd0 On0 1ld0 11z0 1o10 14n0 1o10 14n0 1nd0 12n0 1nd0 Xz0 1q10 12n0 1hB0 1dX0 1ep0 1aL0 1eN0 17X0 1nf0 11z0 1tB0 19W0 1e10 17b0 1ep0 1gL0 18N0 1fz0 1eN0 17b0 1gq0 1gn0 19d0 1dz0 1c10 17X0 1hB0 1gn0 19d0 1dz0 1c10 17X0 1kp0 1dz0 1c10 1aL0 1eN0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0|81e4","Asia/Kabul|+04 +0430|-40 -4u|01|-10Qs0|46e5","Asia/Kamchatka|LMT +11 +12 +13|-ay.A -b0 -c0 -d0|012323232323232323232321232323232323232323232323232323232323212|-1SLKy.A ivXy.A 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|18e4","Asia/Karachi|LMT +0530 +0630 +05 PKT PKST|-4s.c -5u -6u -50 -50 -60|012134545454|-2xoss.c 1qOKW.c 7zX0 eup0 LqMu 1fy00 1cL0 dK10 11b0 1610 1jX0|24e6","Asia/Urumqi|LMT +06|-5O.k -60|01|-1GgtO.k|32e5","Asia/Kathmandu|LMT +0530 +0545|-5F.g -5u -5J|012|-21JhF.g 2EGMb.g|12e5","Asia/Khandyga|LMT +08 +09 +10 +11|-92.d -80 -90 -a0 -b0|0123232323232323232323212323232323232323232323232343434343434343432|-21Q92.d pAp2.d 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 qK0 yN0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 17V0 7zD0|66e2","Asia/Krasnoyarsk|LMT +06 +07 +08|-6b.q -60 -70 -80|01232323232323232323232123232323232323232323232323232323232323232|-21Hib.q prAb.q 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|10e5","Asia/Kuala_Lumpur|SMT +07 +0720 +0730 +09 +08|-6T.p -70 -7k -7u -90 -80|0123435|-2Bg6T.p 17anT.p l5XE 17bO 8Fyu 1so1u|71e5","Asia/Kuching|LMT +0730 +08 +0820 +09|-7l.k -7u -80 -8k -90|0123232323232323242|-1KITl.k gDbP.k 6ynu AnE 1O0k AnE 1NAk AnE 1NAk AnE 1NAk AnE 1O0k AnE 1NAk AnE pAk 8Fz0|13e4","Asia/Macau|LMT CST CDT|-7y.k -80 -90|012121212121212121212121212121212121212121|-2le7y.k 1XO34.k 1wn0 Rd0 1wn0 R9u 1wqu U10 1tz0 TVu 1tz0 17gu 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cJu 1cL0 1cN0 1fz0 1cN0 1cOu 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cJu 1cL0 1cN0 1fz0 1cN0 1cL0|57e4","Asia/Magadan|LMT +10 +11 +12|-a3.c -a0 -b0 -c0|012323232323232323232321232323232323232323232323232323232323232312|-1Pca3.c eUo3.c 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3Cq0|95e3","Asia/Makassar|LMT MMT +08 +09 WITA|-7V.A -7V.A -80 -90 -80|01234|-21JjV.A vfc0 myLV.A 8ML0|15e5","Asia/Manila|+08 +09|-80 -90|010101010|-1kJI0 AL0 cK10 65X0 mXB0 vX0 VK10 1db0|24e6","Asia/Nicosia|LMT EET EEST|-2d.s -20 -30|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1Vc2d.s 2a3cd.s 1cL0 1qp0 Xz0 19B0 19X0 1fB0 1db0 1cp0 1cL0 1fB0 19X0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1o30 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|32e4","Asia/Novokuznetsk|LMT +06 +07 +08|-5M.M -60 -70 -80|012323232323232323232321232323232323232323232323232323232323212|-1PctM.M eULM.M 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|55e4","Asia/Novosibirsk|LMT +06 +07 +08|-5v.E -60 -70 -80|0123232323232323232323212323212121212121212121212121212121212121212|-21Qnv.E pAFv.E 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 ml0 Os0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 4eN0|15e5","Asia/Omsk|LMT +05 +06 +07|-4R.u -50 -60 -70|01232323232323232323232123232323232323232323232323232323232323232|-224sR.u pMLR.u 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|12e5","Asia/Oral|LMT +03 +05 +06 +04|-3p.o -30 -50 -60 -40|01232323232323232424242424242424242424242424242|-1Pc3p.o eUop.o 23CK0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 1cM0 1cM0 IM0 1EM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0|27e4","Asia/Pontianak|LMT PMT +0730 +09 +08 WITA WIB|-7h.k -7h.k -7u -90 -80 -80 -70|012324256|-2ua7h.k XE00 munL.k 8Rau 6kpu 4PXu xhcu Wqnu|23e4","Asia/Pyongyang|LMT KST JST KST|-8n -8u -90 -90|01231|-2um8n 97XR 1lTzu 2Onc0|29e5","Asia/Qyzylorda|LMT +04 +05 +06|-4l.Q -40 -50 -60|0123232323232323232323232323232323232323232323|-1Pc4l.Q eUol.Q 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 3ao0 1EM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0|73e4","Asia/Rangoon|RMT +0630 +09|-6o.E -6u -90|0121|-21Jio.E SmnS.E 7j9u|48e5","Asia/Sakhalin|LMT +09 +11 +12 +10|-9u.M -90 -b0 -c0 -a0|01232323232323232323232423232323232424242424242424242424242424242|-2AGVu.M 1BoMu.M 1qFa0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 2pB0 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0|58e4","Asia/Samarkand|LMT +04 +05 +06|-4r.R -40 -50 -60|01232323232323232323232|-1Pc4r.R eUor.R 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0|36e4","Asia/Seoul|LMT KST JST KST KDT KDT|-8r.Q -8u -90 -90 -9u -a0|0123141414141414135353|-2um8r.Q 97XV.Q 1m1zu kKo0 2I0u OL0 1FB0 Rb0 1qN0 TX0 1tB0 TX0 1tB0 TX0 1tB0 TX0 2ap0 12FBu 11A0 1o00 11A0|23e6","Asia/Srednekolymsk|LMT +10 +11 +12|-ae.Q -a0 -b0 -c0|01232323232323232323232123232323232323232323232323232323232323232|-1Pcae.Q eUoe.Q 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|35e2","Asia/Taipei|CST JST CDT|-80 -90 -90|01020202020202020202020202020202020202020|-1iw80 joM0 1yo0 Tz0 1ip0 1jX0 1cN0 11b0 1oN0 11b0 1oN0 11b0 1oN0 11b0 10N0 1BX0 10p0 1pz0 10p0 1pz0 10p0 1db0 1dd0 1db0 1cN0 1db0 1cN0 1db0 1cN0 1db0 1BB0 ML0 1Bd0 ML0 uq10 1db0 1cN0 1db0 97B0 AL0|74e5","Asia/Tashkent|LMT +05 +06 +07|-4B.b -50 -60 -70|012323232323232323232321|-1Pc4B.b eUnB.b 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0|23e5","Asia/Tbilisi|TBMT +03 +04 +05|-2X.b -30 -40 -50|0123232323232323232323212121232323232323232323212|-1Pc2X.b 1jUnX.b WCL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 1cK0 1cL0 1cN0 1cL0 1cN0 2pz0 1cL0 1fB0 3Nz0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 An0 Os0 WM0|11e5","Asia/Tehran|LMT TMT +0330 +04 +05 +0430|-3p.I -3p.I -3u -40 -50 -4u|01234325252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252|-2btDp.I 1d3c0 1huLT.I TXu 1pz0 sN0 vAu 1cL0 1dB0 1en0 pNB0 UL0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 64p0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0|14e6","Asia/Thimphu|LMT +0530 +06|-5W.A -5u -60|012|-Su5W.A 1BGMs.A|79e3","Asia/Tokyo|JST JDT|-90 -a0|010101010|-QJH0 QL0 1lB0 13X0 1zB0 NX0 1zB0 NX0|38e6","Asia/Tomsk|LMT +06 +07 +08|-5D.P -60 -70 -80|0123232323232323232323212323232323232323232323212121212121212121212|-21NhD.P pxzD.P 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 co0 1bB0 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3Qp0|10e5","Asia/Ulaanbaatar|LMT +07 +08 +09|-77.w -70 -80 -90|012323232323232323232323232323232323232323232323232|-2APH7.w 2Uko7.w cKn0 1db0 1dd0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 6hD0 11z0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 kEp0 1cJ0 1cP0 1cJ0|12e5","Asia/Ust-Nera|LMT +08 +09 +12 +11 +10|-9w.S -80 -90 -c0 -b0 -a0|012343434343434343434345434343434343434343434343434343434343434345|-21Q9w.S pApw.S 23CL0 1d90 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 17V0 7zD0|65e2","Asia/Vladivostok|LMT +09 +10 +11|-8L.v -90 -a0 -b0|01232323232323232323232123232323232323232323232323232323232323232|-1SJIL.v itXL.v 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|60e4","Asia/Yakutsk|LMT +08 +09 +10|-8C.W -80 -90 -a0|01232323232323232323232123232323232323232323232323232323232323232|-21Q8C.W pAoC.W 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|28e4","Asia/Yekaterinburg|LMT PMT +04 +05 +06|-42.x -3J.5 -40 -50 -60|012343434343434343434343234343434343434343434343434343434343434343|-2ag42.x 7mQh.s qBvJ.5 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|14e5","Asia/Yerevan|LMT +03 +04 +05|-2W -30 -40 -50|0123232323232323232323212121212323232323232323232323232323232|-1Pc2W 1jUnW WCL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 4RX0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|13e5","Atlantic/Azores|HMT -02 -01 +00 WET|1S.w 20 10 0 0|01212121212121212121212121212121212121212121232123212321232121212121212121212121212121212121212121232323232323232323232323232323234323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-2ldW5.s aPX5.s Sp0 LX0 1vc0 Tc0 1uM0 SM0 1vc0 Tc0 1vc0 SM0 1vc0 6600 1co0 3E00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 3I00 17c0 1cM0 1cM0 3Fc0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 1tA0 1cM0 1dc0 1400 gL0 IM0 s10 U00 dX0 Rc0 pd0 Rc0 gL0 Oo0 pd0 Rc0 gL0 Oo0 pd0 14o0 1cM0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 3Co0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 qIl0 1cM0 1fA0 1cM0 1cM0 1cN0 1cL0 1cN0 1cM0 1cM0 1cM0 1cM0 1cN0 1cL0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cL0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|25e4","Atlantic/Bermuda|LMT AST ADT|4j.i 40 30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1BnRE.G 1LTbE.G 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|65e3","Atlantic/Canary|LMT -01 WET WEST|11.A 10 0 -10|01232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1UtaW.o XPAW.o 1lAK0 1a10 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|54e4","Atlantic/Cape_Verde|LMT -02 -01|1y.4 20 10|01212|-2xomp.U 1qOMp.U 7zX0 1djf0|50e4","Atlantic/Faroe|LMT WET WEST|r.4 0 -10|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2uSnw.U 2Wgow.U 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|49e3","Atlantic/Madeira|FMT -01 +00 +01 WET WEST|17.A 10 0 -10 0 -10|01212121212121212121212121212121212121212121232123212321232121212121212121212121212121212121212121454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-2ldWQ.o aPWQ.o Sp0 LX0 1vc0 Tc0 1uM0 SM0 1vc0 Tc0 1vc0 SM0 1vc0 6600 1co0 3E00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 3I00 17c0 1cM0 1cM0 3Fc0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 1tA0 1cM0 1dc0 1400 gL0 IM0 s10 U00 dX0 Rc0 pd0 Rc0 gL0 Oo0 pd0 Rc0 gL0 Oo0 pd0 14o0 1cM0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 3Co0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 qIl0 1cM0 1fA0 1cM0 1cM0 1cN0 1cL0 1cN0 1cM0 1cM0 1cM0 1cM0 1cN0 1cL0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|27e4","Atlantic/Reykjavik|LMT -01 +00 GMT|1s 10 0 0|012121212121212121212121212121212121212121212121212121212121212121213|-2uWmw mfaw 1Bd0 ML0 1LB0 Cn0 1LB0 3fX0 C10 HrX0 1cO0 LB0 1EL0 LA0 1C00 Oo0 1wo0 Rc0 1wo0 Rc0 1wo0 Rc0 1zc0 Oo0 1zc0 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1lc0 14o0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 14o0|12e4","Atlantic/South_Georgia|-02|20|0||30","Atlantic/Stanley|SMT -04 -03 -02|3P.o 40 30 20|012121212121212323212121212121212121212121212121212121212121212121212|-2kJw8.A 12bA8.A 19X0 1fB0 19X0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1fB0 Cn0 1Cc10 WL0 1qL0 U10 1tz0 2mN0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1tz0 U10 1tz0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1tz0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qN0 U10 1wn0 Rd0 1wn0 U10 1tz0 U10 1tz0 U10 1tz0 U10 1tz0 U10 1wn0 U10 1tz0 U10 1tz0 U10|21e2","Australia/Sydney|AEST AEDT|-a0 -b0|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 14o0 1o00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1tA0 WM0 1tA0 U00 1tA0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 11A0 1o00 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|40e5","Australia/Adelaide|ACST ACDT|-9u -au|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lt xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 Oo0 1zc0 WM0 1qM0 Rc0 1zc0 U00 1tA0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|11e5","Australia/Brisbane|AEST AEDT|-a0 -b0|01010101010101010|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 H1A0 Oo0 1zc0 Oo0 1zc0 Oo0|20e5","Australia/Broken_Hill|ACST ACDT|-9u -au|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lt xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 14o0 1o00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1tA0 WM0 1tA0 U00 1tA0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|18e3","Australia/Currie|AEST AEDT|-a0 -b0|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-29E80 19X0 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1qM0 WM0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1wo0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 11A0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 11A0 1o00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|746","Australia/Darwin|ACST ACDT|-9u -au|010101010|-293lt xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0|12e4","Australia/Eucla|+0845 +0945|-8J -9J|0101010101010101010|-293kI xcX 10jd0 yL0 1cN0 1cL0 1gSp0 Oo0 l5A0 Oo0 iJA0 G00 zU00 IM0 1qM0 11A0 1o00 11A0|368","Australia/Hobart|AEST AEDT|-a0 -b0|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-29E80 19X0 10jd0 yL0 1cN0 1cL0 1fB0 19X0 VfB0 1cM0 1o00 Rc0 1wo0 Rc0 1wo0 U00 1wo0 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1qM0 WM0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1wo0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 11A0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 11A0 1o00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|21e4","Australia/Lord_Howe|AEST +1030 +1130 +11|-a0 -au -bu -b0|0121212121313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313|raC0 1zdu Rb0 1zd0 On0 1zd0 On0 1zd0 On0 1zd0 TXu 1qMu WLu 1tAu WLu 1tAu TXu 1tAu Onu 1zcu Onu 1zcu Onu 1zcu Rbu 1zcu Onu 1zcu Onu 1zcu 11zu 1o0u 11zu 1o0u 11zu 1o0u 11zu 1qMu WLu 11Au 1nXu 1qMu 11zu 1o0u 11zu 1o0u 11zu 1qMu WLu 1qMu 11zu 1o0u WLu 1qMu 14nu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1fzu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu|347","Australia/Lindeman|AEST AEDT|-a0 -b0|010101010101010101010|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 H1A0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0|10","Australia/Melbourne|AEST AEDT|-a0 -b0|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1qM0 11A0 1tA0 U00 1tA0 U00 1tA0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 11A0 1o00 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|39e5","Australia/Perth|AWST AWDT|-80 -90|0101010101010101010|-293jX xcX 10jd0 yL0 1cN0 1cL0 1gSp0 Oo0 l5A0 Oo0 iJA0 G00 zU00 IM0 1qM0 11A0 1o00 11A0|18e5","CET|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 16M0 1gMM0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00","CST6CDT|CST CDT CWT CPT|60 50 50 50|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","Pacific/Easter|EMT -07 -06 -05|7h.s 70 60 50|012121212121212121212121212123232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323|-1uSgG.w 1s4IG.w WL0 1zd0 On0 1ip0 11z0 1o10 11z0 1qN0 WL0 1ld0 14n0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 2pA0 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0|30e2","EET|EET EEST|-20 -30|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|hDB0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00","EST|EST|50|0|","EST5EDT|EST EDT EWT EPT|50 40 40 40|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261t0 1nX0 11B0 1nX0 SgN0 8x40 iv0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","Europe/Dublin|DMT IST GMT BST IST|p.l -y.D 0 -10 -10|01232323232324242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242|-2ax9y.D Rc0 1fzy.D 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 g5X0 14p0 1wn0 17d0 1io0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1a00 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1tA0 IM0 90o0 U00 1tA0 U00 1tA0 U00 1tA0 U00 1tA0 WM0 1qM0 WM0 1qM0 WM0 1tA0 U00 1tA0 U00 1tA0 11z0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5","Etc/GMT+0|GMT|0|0|","Etc/GMT+1|-01|10|0|","Etc/GMT+10|-10|a0|0|","Etc/GMT+11|-11|b0|0|","Etc/GMT+12|-12|c0|0|","Etc/GMT+3|-03|30|0|","Etc/GMT+4|-04|40|0|","Etc/GMT+5|-05|50|0|","Etc/GMT+6|-06|60|0|","Etc/GMT+7|-07|70|0|","Etc/GMT+8|-08|80|0|","Etc/GMT+9|-09|90|0|","Etc/GMT-1|+01|-10|0|","Pacific/Port_Moresby|+10|-a0|0||25e4","Pacific/Pohnpei|+11|-b0|0||34e3","Pacific/Tarawa|+12|-c0|0||29e3","Etc/GMT-13|+13|-d0|0|","Etc/GMT-14|+14|-e0|0|","Etc/GMT-2|+02|-20|0|","Etc/GMT-3|+03|-30|0|","Etc/GMT-4|+04|-40|0|","Etc/GMT-5|+05|-50|0|","Etc/GMT-6|+06|-60|0|","Indian/Christmas|+07|-70|0||21e2","Etc/GMT-8|+08|-80|0|","Pacific/Palau|+09|-90|0||21e3","Etc/UCT|UCT|0|0|","Etc/UTC|UTC|0|0|","Europe/Amsterdam|AMT NST +0120 +0020 CEST CET|-j.w -1j.w -1k -k -20 -10|010101010101010101010101010101010101010101012323234545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545|-2aFcj.w 11b0 1iP0 11A0 1io0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1co0 1io0 1yo0 Pc0 1a00 1fA0 1Bc0 Mo0 1tc0 Uo0 1tA0 U00 1uo0 W00 1s00 VA0 1so0 Vc0 1sM0 UM0 1wo0 Rc0 1u00 Wo0 1rA0 W00 1s00 VA0 1sM0 UM0 1w00 fV0 BCX.w 1tA0 U00 1u00 Wo0 1sm0 601k WM0 1fA0 1cM0 1cM0 1cM0 16M0 1gMM0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|16e5","Europe/Andorra|WET CET CEST|0 -10 -20|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-UBA0 1xIN0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|79e3","Europe/Astrakhan|LMT +03 +04 +05|-3c.c -30 -40 -50|012323232323232323212121212121212121212121212121212121212121212|-1Pcrc.c eUMc.c 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0","Europe/Athens|AMT EET EEST CEST CET|-1y.Q -20 -30 -20 -10|012123434121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2a61x.Q CNbx.Q mn0 kU10 9b0 3Es0 Xa0 1fb0 1dd0 k3X0 Nz0 SCp0 1vc0 SO0 1cM0 1a00 1ao0 1fc0 1a10 1fG0 1cg0 1dX0 1bX0 1cQ0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|35e5","Europe/London|GMT BST BDST|0 -10 -20|0101010101010101010101010101010101010101010101010121212121210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2axa0 Rc0 1fA0 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 2Rz0 Dc0 1zc0 Oo0 1zc0 Rc0 1wo0 17c0 1iM0 FA0 xB0 1fA0 1a00 14o0 bb0 LA0 xB0 Rc0 1wo0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1a00 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1tA0 IM0 90o0 U00 1tA0 U00 1tA0 U00 1tA0 U00 1tA0 WM0 1qM0 WM0 1qM0 WM0 1tA0 U00 1tA0 U00 1tA0 11z0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|10e6","Europe/Belgrade|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-19RC0 3IP0 WM0 1fA0 1cM0 1cM0 1rc0 Qo0 1vmo0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5","Europe/Berlin|CET CEST CEMT|-10 -20 -30|01010101010101210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 kL0 Nc0 m10 WM0 1ao0 1cp0 dX0 jz0 Dd0 1io0 17c0 1fA0 1a00 1ehA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|41e5","Europe/Prague|CET CEST|-10 -20|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 16M0 1lc0 1tA0 17A0 11c0 1io0 17c0 1io0 17c0 1fc0 1ao0 1bNc0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|13e5","Europe/Brussels|WET CET CEST WEST|0 -10 -20 -10|0121212103030303030303030303030303030303030303030303212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2ehc0 3zX0 11c0 1iO0 11A0 1o00 11A0 my0 Ic0 1qM0 Rc0 1EM0 UM0 1u00 10o0 1io0 1io0 17c0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a30 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 y00 5Wn0 WM0 1fA0 1cM0 16M0 1iM0 16M0 1C00 Uo0 1eeo0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|21e5","Europe/Bucharest|BMT EET EEST|-1I.o -20 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1xApI.o 20LI.o RA0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1Axc0 On0 1fA0 1a10 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cK0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cL0 1cN0 1cL0 1fB0 1nX0 11E0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|19e5","Europe/Budapest|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1ip0 17b0 1op0 1tb0 Q2m0 3Ne0 WM0 1fA0 1cM0 1cM0 1oJ0 1dc0 1030 1fA0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1iM0 1fA0 8Ha0 Rb0 1wN0 Rb0 1BB0 Lz0 1C20 LB0 SNX0 1a10 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|17e5","Europe/Zurich|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-19Lc0 11A0 1o00 11A0 1xG10 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|38e4","Europe/Chisinau|CMT BMT EET EEST CEST CET MSK MSD|-1T -1I.o -20 -30 -20 -10 -30 -40|012323232323232323234545467676767676767676767323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-26jdT wGMa.A 20LI.o RA0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 27A0 2en0 39g0 WM0 1fA0 1cM0 V90 1t7z0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 gL0 WO0 1cM0 1cM0 1cK0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1nX0 11D0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|67e4","Europe/Copenhagen|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2azC0 Tz0 VuO0 60q0 WM0 1fA0 1cM0 1cM0 1cM0 S00 1HA0 Nc0 1C00 Dc0 1Nc0 Ao0 1h5A0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5","Europe/Gibraltar|GMT BST BDST CET CEST|0 -10 -20 -10 -20|010101010101010101010101010101010101010101010101012121212121010121010101010101010101034343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-2axa0 Rc0 1fA0 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 2Rz0 Dc0 1zc0 Oo0 1zc0 Rc0 1wo0 17c0 1iM0 FA0 xB0 1fA0 1a00 14o0 bb0 LA0 xB0 Rc0 1wo0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 10Jz0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|30e3","Europe/Helsinki|HMT EET EEST|-1D.N -20 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1WuND.N OULD.N 1dA0 1xGq0 1cM0 1cM0 1cM0 1cN0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5","Europe/Kaliningrad|CET CEST CET CEST MSK MSD EEST EET +03|-10 -20 -20 -30 -30 -40 -30 -20 -30|0101010101010232454545454545454546767676767676767676767676767676767676767676787|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 Am0 Lb0 1en0 op0 1pNz0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|44e4","Europe/Kiev|KMT EET MSK CEST CET MSD EEST|-22.4 -20 -30 -20 -10 -40 -30|0123434252525252525252525256161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161|-1Pc22.4 eUo2.4 rnz0 2Hg0 WM0 1fA0 da0 1v4m0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 Db0 3220 1cK0 1cL0 1cN0 1cL0 1cN0 1cL0 1cQ0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|34e5","Europe/Kirov|LMT +03 +04 +05|-3i.M -30 -40 -50|01232323232323232321212121212121212121212121212121212121212121|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|48e4","Europe/Lisbon|LMT WET WEST WEMT CET CEST|A.J 0 -10 -20 -10 -20|012121212121212121212121212121212121212121212321232123212321212121212121212121212121212121212121214121212121212121212121212121212124545454212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2ldXn.f aPWn.f Sp0 LX0 1vc0 Tc0 1uM0 SM0 1vc0 Tc0 1vc0 SM0 1vc0 6600 1co0 3E00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 3I00 17c0 1cM0 1cM0 3Fc0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 1tA0 1cM0 1dc0 1400 gL0 IM0 s10 U00 dX0 Rc0 pd0 Rc0 gL0 Oo0 pd0 Rc0 gL0 Oo0 pd0 14o0 1cM0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 3Co0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 pvy0 1cM0 1cM0 1fA0 1cM0 1cM0 1cN0 1cL0 1cN0 1cM0 1cM0 1cM0 1cM0 1cN0 1cL0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|27e5","Europe/Luxembourg|LMT CET CEST WET WEST WEST WET|-o.A -10 -20 0 -10 -20 -10|0121212134343434343434343434343434343434343434343434565651212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2DG0o.A t6mo.A TB0 1nX0 Up0 1o20 11A0 rW0 CM0 1qP0 R90 1EO0 UK0 1u20 10m0 1ip0 1in0 17e0 19W0 1fB0 1db0 1cp0 1in0 17d0 1fz0 1a10 1in0 1a10 1in0 17f0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 vA0 60L0 WM0 1fA0 1cM0 17c0 1io0 16M0 1C00 Uo0 1eeo0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|54e4","Europe/Madrid|WET WEST WEMT CET CEST|0 -10 -20 -10 -20|010101010101010101210343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-25Td0 19B0 1cL0 1dd0 b1z0 18p0 3HX0 17d0 1fz0 1a10 1io0 1a00 1in0 17d0 iIn0 Hd0 1cL0 bb0 1200 2s20 14n0 5aL0 Mp0 1vz0 17d0 1in0 17d0 1in0 17d0 1in0 17d0 6hX0 11B0 XHX0 1a10 1fz0 1a10 19X0 1cN0 1fz0 1a10 1fC0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|62e5","Europe/Malta|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2arB0 Lz0 1cN0 1db0 1410 1on0 Wp0 1qL0 17d0 1cL0 M3B0 5M20 WM0 1fA0 1co0 17c0 1iM0 16m0 1de0 1lc0 14m0 1lc0 WO0 1qM0 GTW0 On0 1C10 LA0 1C00 LA0 1EM0 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1co0 1cM0 1lA0 Xc0 1qq0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1iN0 19z0 1fB0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|42e4","Europe/Minsk|MMT EET MSK CEST CET MSD EEST +03|-1O -20 -30 -20 -10 -40 -30 -30|01234343252525252525252525261616161616161616161616161616161616161617|-1Pc1O eUnO qNX0 3gQ0 WM0 1fA0 1cM0 Al0 1tsn0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 3Fc0 1cN0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0|19e5","Europe/Monaco|PMT WET WEST WEMT CET CEST|-9.l 0 -10 -20 -10 -20|01212121212121212121212121212121212121212121212121232323232345454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-2nco9.l cNb9.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 1u00 10o0 1io0 1wo0 Rc0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Df0 2RV0 11z0 11B0 1ze0 WM0 1fA0 1cM0 1fa0 1aq0 16M0 1ekn0 1cL0 1fC0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|38e3","Europe/Moscow|MMT MMT MST MDST MSD MSK +05 EET EEST MSK|-2u.h -2v.j -3v.j -4v.j -40 -30 -50 -20 -30 -40|012132345464575454545454545454545458754545454545454545454545454545454545454595|-2ag2u.h 2pyW.W 1bA0 11X0 GN0 1Hb0 c4v.j ik0 3DA0 dz0 15A0 c10 2q10 iM10 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cN0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|16e6","Europe/Paris|PMT WET WEST CEST CET WEMT|-9.l 0 -10 -20 -10 -20|0121212121212121212121212121212121212121212121212123434352543434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434|-2nco8.l cNb8.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 1u00 10o0 1io0 1wo0 Rc0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Df0 Ik0 5M30 WM0 1fA0 1cM0 Vx0 hB0 1aq0 16M0 1ekn0 1cL0 1fC0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|11e6","Europe/Riga|RMT LST EET MSK CEST CET MSD EEST|-1A.y -2A.y -20 -30 -20 -10 -40 -30|010102345454536363636363636363727272727272727272727272727272727272727272727272727272727272727272727272727272727272727272727272|-25TzA.y 11A0 1iM0 ko0 gWm0 yDXA.y 2bX0 3fE0 WM0 1fA0 1cM0 1cM0 4m0 1sLy0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cN0 1o00 11A0 1o00 11A0 1qM0 3oo0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|64e4","Europe/Rome|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2arB0 Lz0 1cN0 1db0 1410 1on0 Wp0 1qL0 17d0 1cL0 M3B0 5M20 WM0 1fA0 1cM0 16M0 1iM0 16m0 1de0 1lc0 14m0 1lc0 WO0 1qM0 GTW0 On0 1C10 LA0 1C00 LA0 1EM0 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1C00 LA0 1zc0 Oo0 1C00 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1zc0 Oo0 1fC0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|39e5","Europe/Samara|LMT +03 +04 +05|-3k.k -30 -40 -50|0123232323232323232121232323232323232323232323232323232323212|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 2y10 14m0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|12e5","Europe/Saratov|LMT +03 +04 +05|-34.i -30 -40 -50|012323232323232321212121212121212121212121212121212121212121212|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1cM0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 5810","Europe/Simferopol|SMT EET MSK CEST CET MSD EEST MSK|-2g -20 -30 -20 -10 -40 -30 -40|012343432525252525252525252161616525252616161616161616161616161616161616172|-1Pc2g eUog rEn0 2qs0 WM0 1fA0 1cM0 3V0 1u0L0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1Q00 4eL0 1cL0 1cN0 1cL0 1cN0 dX0 WL0 1cN0 1cL0 1fB0 1o30 11B0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11z0 1nW0|33e4","Europe/Sofia|EET CET CEST EEST|-20 -10 -20 -30|01212103030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030|-168L0 WM0 1fA0 1cM0 1cM0 1cN0 1mKH0 1dd0 1fb0 1ap0 1fb0 1a20 1fy0 1a30 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cK0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1nX0 11E0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5","Europe/Stockholm|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2azC0 TB0 2yDe0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|15e5","Europe/Tallinn|TMT CET CEST EET MSK MSD EEST|-1D -10 -20 -20 -30 -40 -30|012103421212454545454545454546363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363|-26oND teD 11A0 1Ta0 4rXl KSLD 2FX0 2Jg0 WM0 1fA0 1cM0 18J0 1sTX0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o10 11A0 1qM0 5QM0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|41e4","Europe/Tirane|LMT CET CEST|-1j.k -10 -20|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2glBj.k 14pcj.k 5LC0 WM0 4M0 1fCK0 10n0 1op0 11z0 1pd0 11z0 1qN0 WL0 1qp0 Xb0 1qp0 Xb0 1qp0 11z0 1lB0 11z0 1qN0 11z0 1iN0 16n0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|42e4","Europe/Ulyanovsk|LMT +03 +04 +05 +02|-3d.A -30 -40 -50 -20|01232323232323232321214121212121212121212121212121212121212121212|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0","Europe/Uzhgorod|CET CEST MSK MSD EET EEST|-10 -20 -30 -40 -20 -30|010101023232323232323232320454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-1cqL0 6i00 WM0 1fA0 1cM0 1ml0 1Cp0 1r3W0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1Q00 1Nf0 2pw0 1cL0 1cN0 1cL0 1cN0 1cL0 1cQ0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|11e4","Europe/Vienna|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 3KM0 14o0 LA00 6i00 WM0 1fA0 1cM0 1cM0 1cM0 400 2qM0 1a00 1cM0 1cM0 1io0 17c0 1gHa0 19X0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|18e5","Europe/Vilnius|WMT KMT CET EET MSK CEST MSD EEST|-1o -1z.A -10 -20 -30 -20 -40 -30|012324525254646464646464646473737373737373737352537373737373737373737373737373737373737373737373737373737373737373737373|-293do 6ILM.o 1Ooz.A zz0 Mfd0 29W0 3is0 WM0 1fA0 1cM0 LV0 1tgL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11B0 1o00 11A0 1qM0 8io0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|54e4","Europe/Volgograd|LMT +03 +04 +05|-2V.E -30 -40 -50|01232323232323232121212121212121212121212121212121212121212121|-21IqV.E psLV.E 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1cM0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|10e5","Europe/Warsaw|WMT CET CEST EET EEST|-1o -10 -20 -20 -30|012121234312121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2ctdo 1LXo 11d0 1iO0 11A0 1o00 11A0 1on0 11A0 6zy0 HWP0 5IM0 WM0 1fA0 1cM0 1dz0 1mL0 1en0 15B0 1aq0 1nA0 11A0 1io0 17c0 1fA0 1a00 iDX0 LA0 1cM0 1cM0 1C00 Oo0 1cM0 1cM0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1C00 LA0 uso0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|17e5","Europe/Zaporozhye|+0220 EET MSK CEST CET MSD EEST|-2k -20 -30 -20 -10 -40 -30|01234342525252525252525252526161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161|-1Pc2k eUok rdb0 2RE0 WM0 1fA0 8m0 1v9a0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cK0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cQ0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|77e4","HST|HST|a0|0|","Indian/Chagos|LMT +05 +06|-4N.E -50 -60|012|-2xosN.E 3AGLN.E|30e2","Indian/Cocos|+0630|-6u|0||596","Indian/Kerguelen|-00 +05|0 -50|01|-MG00|130","Indian/Mahe|LMT +04|-3F.M -40|01|-2yO3F.M|79e3","Indian/Maldives|MMT +05|-4S -50|01|-olgS|35e4","Indian/Mauritius|LMT +04 +05|-3O -40 -50|012121|-2xorO 34unO 14L0 12kr0 11z0|15e4","Indian/Reunion|LMT +04|-3F.Q -40|01|-2mDDF.Q|84e4","Pacific/Kwajalein|+11 -12 +12|-b0 c0 -c0|012|-AX0 W9X0|14e3","MET|MET MEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 16M0 1gMM0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00","MST|MST|70|0|","MST7MDT|MST MDT MWT MPT|70 60 60 60|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","Pacific/Chatham|+1215 +1245 +1345|-cf -cJ -dJ|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-WqAf 1adef IM0 1C00 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1qM0 14o0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1io0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|600","PST8PDT|PST PDT PWT PPT|80 70 70 70|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261q0 1nX0 11B0 1nX0 SgN0 8x10 iy0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","Pacific/Apia|LMT -1130 -11 -10 +14 +13|bq.U bu b0 a0 -e0 -d0|01232345454545454545454545454545454545454545454545454545454|-2nDMx.4 1yW03.4 2rRbu 1ff0 1a00 CI0 AQ0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|37e3","Pacific/Bougainville|+10 +09 +11|-a0 -90 -b0|0102|-16Wy0 7CN0 2MQp0|18e4","Pacific/Efate|LMT +11 +12|-bd.g -b0 -c0|0121212121212121212121|-2l9nd.g 2Szcd.g 1cL0 1oN0 10L0 1fB0 19X0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 Lz0 1Nd0 An0|66e3","Pacific/Enderbury|-12 -11 +13|c0 b0 -d0|012|nIc0 B8n0|1","Pacific/Fakaofo|-11 +13|b0 -d0|01|1Gfn0|483","Pacific/Fiji|LMT +12 +13|-bT.I -c0 -d0|0121212121212121212121212121212121212121212121212121212121212121|-2bUzT.I 3m8NT.I LA0 1EM0 IM0 nJc0 LA0 1o00 Rc0 1wo0 Ao0 1Nc0 Ao0 1Q00 xz0 1SN0 uM0 1SM0 uM0 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0|88e4","Pacific/Galapagos|LMT -05 -06|5W.o 50 60|01212|-1yVS1.A 2dTz1.A gNd0 rz0|25e3","Pacific/Gambier|LMT -09|8X.M 90|01|-2jof0.c|125","Pacific/Guadalcanal|LMT +11|-aD.M -b0|01|-2joyD.M|11e4","Pacific/Guam|GST ChST|-a0 -a0|01|1fpq0|17e4","Pacific/Honolulu|HST HDT HST|au 9u a0|010102|-1thLu 8x0 lef0 8Pz0 46p0|37e4","Pacific/Kiritimati|-1040 -10 +14|aE a0 -e0|012|nIaE B8nk|51e2","Pacific/Kosrae|+11 +12|-b0 -c0|010|-AX0 1bdz0|66e2","Pacific/Majuro|+11 +12|-b0 -c0|01|-AX0|28e3","Pacific/Marquesas|LMT -0930|9i 9u|01|-2joeG|86e2","Pacific/Pago_Pago|LMT SST|bm.M b0|01|-2nDMB.c|37e2","Pacific/Nauru|LMT +1130 +09 +12|-b7.E -bu -90 -c0|01213|-1Xdn7.E PvzB.E 5RCu 1ouJu|10e3","Pacific/Niue|-1120 -1130 -11|bk bu b0|012|-KfME 17y0a|12e2","Pacific/Norfolk|+1112 +1130 +1230 +11|-bc -bu -cu -b0|01213|-Kgbc W01G On0 1COp0|25e4","Pacific/Noumea|LMT +11 +12|-b5.M -b0 -c0|01212121|-2l9n5.M 2EqM5.M xX0 1PB0 yn0 HeP0 Ao0|98e3","Pacific/Pitcairn|-0830 -08|8u 80|01|18Vku|56","Pacific/Rarotonga|-1030 -0930 -10|au 9u a0|012121212121212121212121212|lyWu IL0 1zcu Onu 1zcu Onu 1zcu Rbu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Rbu 1zcu Onu 1zcu Onu 1zcu Onu|13e3","Pacific/Tahiti|LMT -10|9W.g a0|01|-2joe1.I|18e4","Pacific/Tongatapu|+1220 +13 +14|-ck -d0 -e0|0121212121212121212121212121212121212121212121212121|-1aB0k 2n5dk 15A0 1wo0 xz0 1Q10 xz0 zWN0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0|75e3","WET|WET WEST|0 -10|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|hDB0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00"],
links:["Africa/Abidjan|Africa/Bamako","Africa/Abidjan|Africa/Banjul","Africa/Abidjan|Africa/Conakry","Africa/Abidjan|Africa/Dakar","Africa/Abidjan|Africa/Freetown","Africa/Abidjan|Africa/Lome","Africa/Abidjan|Africa/Nouakchott","Africa/Abidjan|Africa/Ouagadougou","Africa/Abidjan|Africa/Sao_Tome","Africa/Abidjan|Africa/Timbuktu","Africa/Abidjan|Atlantic/St_Helena","Africa/Cairo|Egypt","Africa/Johannesburg|Africa/Maseru","Africa/Johannesburg|Africa/Mbabane","Africa/Khartoum|Africa/Juba","Africa/Lagos|Africa/Bangui","Africa/Lagos|Africa/Brazzaville","Africa/Lagos|Africa/Douala","Africa/Lagos|Africa/Kinshasa","Africa/Lagos|Africa/Libreville","Africa/Lagos|Africa/Luanda","Africa/Lagos|Africa/Malabo","Africa/Lagos|Africa/Niamey","Africa/Lagos|Africa/Porto-Novo","Africa/Maputo|Africa/Blantyre","Africa/Maputo|Africa/Bujumbura","Africa/Maputo|Africa/Gaborone","Africa/Maputo|Africa/Harare","Africa/Maputo|Africa/Kigali","Africa/Maputo|Africa/Lubumbashi","Africa/Maputo|Africa/Lusaka","Africa/Nairobi|Africa/Addis_Ababa","Africa/Nairobi|Africa/Asmara","Africa/Nairobi|Africa/Asmera","Africa/Nairobi|Africa/Dar_es_Salaam","Africa/Nairobi|Africa/Djibouti","Africa/Nairobi|Africa/Kampala","Africa/Nairobi|Africa/Mogadishu","Africa/Nairobi|Indian/Antananarivo","Africa/Nairobi|Indian/Comoro","Africa/Nairobi|Indian/Mayotte","Africa/Tripoli|Libya","America/Adak|America/Atka","America/Adak|US/Aleutian","America/Anchorage|US/Alaska","America/Argentina/Buenos_Aires|America/Buenos_Aires","America/Argentina/Catamarca|America/Argentina/ComodRivadavia","America/Argentina/Catamarca|America/Catamarca","America/Argentina/Cordoba|America/Cordoba","America/Argentina/Cordoba|America/Rosario","America/Argentina/Jujuy|America/Jujuy","America/Argentina/Mendoza|America/Mendoza","America/Atikokan|America/Coral_Harbour","America/Chicago|US/Central","America/Curacao|America/Aruba","America/Curacao|America/Kralendijk","America/Curacao|America/Lower_Princes","America/Denver|America/Shiprock","America/Denver|Navajo","America/Denver|US/Mountain","America/Detroit|US/Michigan","America/Edmonton|Canada/Mountain","America/Fort_Wayne|America/Indiana/Indianapolis","America/Fort_Wayne|America/Indianapolis","America/Fort_Wayne|US/East-Indiana","America/Halifax|Canada/Atlantic","America/Havana|Cuba","America/Indiana/Knox|America/Knox_IN","America/Indiana/Knox|US/Indiana-Starke","America/Jamaica|Jamaica","America/Kentucky/Louisville|America/Louisville","America/Los_Angeles|US/Pacific","America/Los_Angeles|US/Pacific-New","America/Manaus|Brazil/West","America/Mazatlan|Mexico/BajaSur","America/Mexico_City|Mexico/General","America/New_York|US/Eastern","America/Noronha|Brazil/DeNoronha","America/Panama|America/Cayman","America/Phoenix|US/Arizona","America/Port_of_Spain|America/Anguilla","America/Port_of_Spain|America/Antigua","America/Port_of_Spain|America/Dominica","America/Port_of_Spain|America/Grenada","America/Port_of_Spain|America/Guadeloupe","America/Port_of_Spain|America/Marigot","America/Port_of_Spain|America/Montserrat","America/Port_of_Spain|America/St_Barthelemy","America/Port_of_Spain|America/St_Kitts","America/Port_of_Spain|America/St_Lucia","America/Port_of_Spain|America/St_Thomas","America/Port_of_Spain|America/St_Vincent","America/Port_of_Spain|America/Tortola","America/Port_of_Spain|America/Virgin","America/Regina|Canada/East-Saskatchewan","America/Regina|Canada/Saskatchewan","America/Rio_Branco|America/Porto_Acre","America/Rio_Branco|Brazil/Acre","America/Santiago|Chile/Continental","America/Sao_Paulo|Brazil/East","America/St_Johns|Canada/Newfoundland","America/Tijuana|America/Ensenada","America/Tijuana|America/Santa_Isabel","America/Tijuana|Mexico/BajaNorte","America/Toronto|America/Montreal","America/Toronto|Canada/Eastern","America/Vancouver|Canada/Pacific","America/Whitehorse|Canada/Yukon","America/Winnipeg|Canada/Central","Asia/Ashgabat|Asia/Ashkhabad","Asia/Bangkok|Asia/Phnom_Penh","Asia/Bangkok|Asia/Vientiane","Asia/Dhaka|Asia/Dacca","Asia/Dubai|Asia/Muscat","Asia/Ho_Chi_Minh|Asia/Saigon","Asia/Hong_Kong|Hongkong","Asia/Jerusalem|Asia/Tel_Aviv","Asia/Jerusalem|Israel","Asia/Kathmandu|Asia/Katmandu","Asia/Kolkata|Asia/Calcutta","Asia/Kuala_Lumpur|Asia/Singapore","Asia/Kuala_Lumpur|Singapore","Asia/Macau|Asia/Macao","Asia/Makassar|Asia/Ujung_Pandang","Asia/Nicosia|Europe/Nicosia","Asia/Qatar|Asia/Bahrain","Asia/Rangoon|Asia/Yangon","Asia/Riyadh|Asia/Aden","Asia/Riyadh|Asia/Kuwait","Asia/Seoul|ROK","Asia/Shanghai|Asia/Chongqing","Asia/Shanghai|Asia/Chungking","Asia/Shanghai|Asia/Harbin","Asia/Shanghai|PRC","Asia/Taipei|ROC","Asia/Tehran|Iran","Asia/Thimphu|Asia/Thimbu","Asia/Tokyo|Japan","Asia/Ulaanbaatar|Asia/Ulan_Bator","Asia/Urumqi|Asia/Kashgar","Atlantic/Faroe|Atlantic/Faeroe","Atlantic/Reykjavik|Iceland","Atlantic/South_Georgia|Etc/GMT+2","Australia/Adelaide|Australia/South","Australia/Brisbane|Australia/Queensland","Australia/Broken_Hill|Australia/Yancowinna","Australia/Darwin|Australia/North","Australia/Hobart|Australia/Tasmania","Australia/Lord_Howe|Australia/LHI","Australia/Melbourne|Australia/Victoria","Australia/Perth|Australia/West","Australia/Sydney|Australia/ACT","Australia/Sydney|Australia/Canberra","Australia/Sydney|Australia/NSW","Etc/GMT+0|Etc/GMT","Etc/GMT+0|Etc/GMT-0","Etc/GMT+0|Etc/GMT0","Etc/GMT+0|Etc/Greenwich","Etc/GMT+0|GMT","Etc/GMT+0|GMT+0","Etc/GMT+0|GMT-0","Etc/GMT+0|GMT0","Etc/GMT+0|Greenwich","Etc/UCT|UCT","Etc/UTC|Etc/Universal","Etc/UTC|Etc/Zulu","Etc/UTC|UTC","Etc/UTC|Universal","Etc/UTC|Zulu","Europe/Belgrade|Europe/Ljubljana","Europe/Belgrade|Europe/Podgorica","Europe/Belgrade|Europe/Sarajevo","Europe/Belgrade|Europe/Skopje","Europe/Belgrade|Europe/Zagreb","Europe/Chisinau|Europe/Tiraspol","Europe/Dublin|Eire","Europe/Helsinki|Europe/Mariehamn","Europe/Istanbul|Asia/Istanbul","Europe/Istanbul|Turkey","Europe/Lisbon|Portugal","Europe/London|Europe/Belfast","Europe/London|Europe/Guernsey","Europe/London|Europe/Isle_of_Man","Europe/London|Europe/Jersey","Europe/London|GB","Europe/London|GB-Eire","Europe/Moscow|W-SU","Europe/Oslo|Arctic/Longyearbyen","Europe/Oslo|Atlantic/Jan_Mayen","Europe/Prague|Europe/Bratislava","Europe/Rome|Europe/San_Marino","Europe/Rome|Europe/Vatican","Europe/Warsaw|Poland","Europe/Zurich|Europe/Busingen","Europe/Zurich|Europe/Vaduz","Indian/Christmas|Etc/GMT-7","Pacific/Auckland|Antarctica/McMurdo","Pacific/Auckland|Antarctica/South_Pole","Pacific/Auckland|NZ","Pacific/Chatham|NZ-CHAT","Pacific/Easter|Chile/EasterIsland","Pacific/Guam|Pacific/Saipan","Pacific/Honolulu|Pacific/Johnston","Pacific/Honolulu|US/Hawaii","Pacific/Kwajalein|Kwajalein","Pacific/Pago_Pago|Pacific/Midway","Pacific/Pago_Pago|Pacific/Samoa","Pacific/Pago_Pago|US/Samoa","Pacific/Palau|Etc/GMT-9","Pacific/Pohnpei|Etc/GMT-11","Pacific/Pohnpei|Pacific/Ponape","Pacific/Port_Moresby|Etc/GMT-10","Pacific/Port_Moresby|Pacific/Chuuk","Pacific/Port_Moresby|Pacific/Truk","Pacific/Port_Moresby|Pacific/Yap","Pacific/Tarawa|Etc/GMT-12","Pacific/Tarawa|Pacific/Funafuti","Pacific/Tarawa|Pacific/Wake","Pacific/Tarawa|Pacific/Wallis"]}),a});

});

__exports('foundation', function() {

module.exports = {
  HApplication: require('foundation/application'),
  HControl: require('foundation/control'),
  EVENT: require('foundation/eventmanager'),
  HEventResponder: require('foundation/eventresponder'),
  JSONRenderer: require('foundation/json_renderer'),
  HLocale: require('foundation/locale'),
  HSystem: require('foundation/system'),
  HThemeManager: require('foundation/thememanager'),
  HValue: require('foundation/value'),
  HDummyValue: require('foundation/value/dummyvalue'),
  HPullValue: require('foundation/value/pullvalue'),
  HPushValue: require('foundation/value/pushvalue'),
  HValueAction: require('foundation/valueaction'),
  HValueResponder: require('foundation/valueresponder'),
  HView: require('foundation/view'),
};

});

})();
