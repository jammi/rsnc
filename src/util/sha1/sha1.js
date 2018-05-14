
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
