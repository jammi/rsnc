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

// Does browser version checks and starts the document loaded check poll
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
BROWSER_TYPE.lang_fi = BROWSER_TYPE.lang.includes('fi');
BROWSER_TYPE.lang_en = !BROWSER_TYPE.lang_fi;

// TODO: Handle this in some other way:
try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get: () => {
      BROWSER_TYPE.passiveEvents = true;
    }
  }));
}
catch (e) {
  BROWSER_TYPE.passiveEvents = false;
}

module.exports = BROWSER_TYPE;
