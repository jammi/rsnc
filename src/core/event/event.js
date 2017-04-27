
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
