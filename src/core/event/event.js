const BROWSER_TYPE = require('core/browser_type');
const ELEM = require('core/elem');
const UtilMethods = require('util/util_methods');

/* = Description
** Abstracts the DOM Event differences between browsers.
**/
const Event = (class extends UtilMethods.extend({
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
  KEY_PAGEDOWN: 34,

  /* List of event observers
  **/
  observers: false,

}) {

  /* Returns the element of the event.
  */
  element(e) {
    return e.target || e.srcElement;
  }

  /* Returns the mouse cursor x -coordinate of the event.
  */
  pointerX(e) {
    if (/touch/.test(e.type)) {
      return e.changedTouches[0].pageX;
    }
    else {
      return (e.pageX || e.clientX);
    }
  }

  /* Returns the mouse cursor y -coordinate of the event.
  */
  pointerY(e) {
    if (/touch/.test(e.type)) {
      return e.changedTouches[0].pageY;
    }
    else {
      return (e.pageY || e.clientY);
    }
  }

  /* Stops event propagation
  */
  stop(e) {
    if (e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    else {
      e.returnValue = false;
      e.cancelBubble = true;
    }
  }

  /* Returns true if the left mouse butten was clicked.
  */
  isLeftClick(e) {
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
  }

  /* Implementation of observe */
  _observeAndCache(_elem, _name, _function, _useCapture, _usePassive) {
    if (this.isUndefinedOrNull(_name)) {
      return;
    }
    if (!Event.observers) {
      Event.observers = [];
    }
    let _opts = _useCapture;
    if (BROWSER_TYPE.passiveEvents) {
      _opts = {};
      _opts.passive = _usePassive === true;
      _opts.capture = _useCapture === true;
    }
    if (_elem && _elem.addEventListener) {
      this.observers.push([_elem, _name, _function, _opts]);
      _elem.addEventListener(_name, _function, _opts);
    }
    else if (_elem) {
      console.warn('element', _elem, 'doesn\'t have removeEventListener!');
    }
  }

  /* Flushes the event observer cache.
  **/
  unloadCache() {
    if (!Event.observers) {
      return;
    }
    const l = Event.observers.length;
    for (let i = 0; i < l; i++) {
      try {
        Event.stopObserving.apply(this, Event.observers[0]);
      }
      catch (e) {
        console.warn(e);
      }
    }
    Event.observers = false;
  }

  /* Starts observing the named event of the element and
  * specifies a callback function.
  **/
  observe(_elem, _name, _function, _useCapture, _usePassive) {
    _useCapture = _useCapture || false;
    _usePassive = _usePassive || false;
    if (this.isNumber(_elem)) {
      _elem = ELEM.get(_elem);
    }
    Event._observeAndCache(_elem, _name, _function, _useCapture, _usePassive);
    return _function;
  }

  /* Stops observing the named event of the element and
  * removes the callback function.
  **/
  stopObserving(_elem, _name, _function, _useCapture) {
    if (this.isUndefinedOrNull(_name)) {
      return;
    }
    if (this.isNumber(_elem)) {
      _elem = ELEM.get(_elem);
    }
    if (this.isUndefinedOrNull(_elem)) {
      // console.log('Warning Event.stopObserving of event name: "' + _name + '" called with an undefined elem!');
      return;
    }
    _useCapture = _useCapture || false;
    if (_elem.removeEventListener) {
      _elem.removeEventListener(_name, _function, _useCapture);
    }
    else {
      console.warn('element', _elem, 'doesn\'t have removeEventListener!');
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
  }

  hasTouch() {
    return (
      window.ontouchstart ||    // html5 browsers
      navigator.maxTouchPoints > 0  // MS EDGE?
    );
  }
}).new();

module.exports = Event;
