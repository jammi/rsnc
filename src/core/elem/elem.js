
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
      for (let i = 0; i < _loopMaxL; i++) {
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
      for (let i = 0; i < _loopMaxL; i++) {
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
      return _elem.className.baseVal;
    }
    else {
      return _elem.className;
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
        for (let i = 0; i < _loopMaxP; i++) {
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
