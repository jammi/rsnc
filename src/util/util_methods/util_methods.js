
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
        // console.warn(
        //   'typeChr encountered an unknown object type, which was substituted by an "o":',
        //   _obj
        // );
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
  if (['-', '~', 'o', '>', 'h'].includes(_tc)) {
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
    if (_itemType === typeChr(_dst[i]) || ['~', '-'].includes(typeChr(_dst[i]))) {
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

  isStringOrNumber(_item) {
    return this.isString(_item) || this.isNumber(_item);
  }

  isntStringOrNumber(_item) {
    return !this.isStringOrNumber(_item);
  }

  isNumberOrString(_item) {
    return this.isStringOrNumber(_item);
  }

  isntNumberOrString(_item) {
    return this.isntStringOrNumber(_item);
  }

  isArray(_item) {
    return typeChr(_item) === 'a';
  }

  isntArray(_item) {
    return !this.isArray(_item);
  }

  isObject(_item) {
    return ['h', 'o'].includes(typeChr(_item));
  }

  isntObject(_item) {
    return !this.isObject(_item);
  }

  isObjectOrArray(_item) {
    return ['a', 'h', 'o'].includes(typeChr(_item));
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

  isClass(_item) {
    return this.isFunction(_item) && _item.prototype.constructor === _item;
  }

  instClass(_item) {
    return !this.isClass(_item);
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
