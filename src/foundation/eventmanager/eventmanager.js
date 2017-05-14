
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
        _status.crsrY = y;
      }
      setCrsr(x, y) {
        this.crsrX = x;
        this.crsrY = y;
      }
      get keysDown() {
        return _status.keysDown.slice(0);
      }
      hasKeyDown(k) {
        return _status.keysDown.includes(k);
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
  _eventMethods: {
    resize: {
      passive: false,
      capture: false
    },
    keyUp: {
      passive: false,
      capture: false
    },
    keyDown: {
      passive: false,
      capture: false
    },
    keyPress: {
      passive: false,
      capture: false
    },
    doubleClick: {
      passive: false,
      capture: false
    },
    contextMenu: {
      passive: false,
      capture: false
    },
    click: {
      passive: false,
      capture: false
    },
    mouseUp: {
      passive: false,
      capture: false
    },
    mouseDown: {
      passive: false,
      capture: false
    },
    mouseWheel: {
      passive: true,
      capture: false
    },
    mouseMove: {
      passive: false,
      capture: false
    },
    touchStart: {
      passive: false,
      capture: false
    },
    touchMove: {
      passive: true,
      capture: false
    },
    touchEnd: {
      passive: false,
      capture: false
    },
  },
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
  observe(_elem, _eventName, _targetMethodName, _targetObj, _capture, _passive) {
    if (this.isntObject(_targetObj)) {
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
    Event.observe(_elem, _eventName, _anonFn, _capture, _passive);
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

  filterEventMethods() {
    return Object.entries(this._eventMethods)
      .map(([_methodName, _options]) => {
        if (BROWSER_TYPE.safari && _methodName === 'keyPress') {
          return null;
        }
        const _eventName = _methodName === 'doubleClick' ?
          'dblClick' : _methodName.toLowerCase();
        return [_methodName, _methodName.toLowerCase(), _options];
      })
      .filter(_item => {
        return _item !== null;
      });
  }

  // Starts EventManager
  start() {
    this._views = HSystem.views; // shortcut to system views
    this.filterEventMethods().forEach(([_methodName, _eventName, _options]) => {
      this.observe(window, _eventName, _methodName, null, _options.capture, _options.passive);
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
    this.filterEventMethods().forEach(([_methodName, _eventName, _options]) => {
      this.stopObserving(window, _eventName, _methodName, null, _options.capture, _options.passive);
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
      console.Warn(
        `EventManager#${_warnMethodName} => Not a HClass: `, _ctrl);
      return false;
    }
    else if (this.isFunction(_ctrl.hasAncestor) && _ctrl.hasAncestor(HView) && _ctrl.isCtrl) {
      return true;
    }
    else {
      console.warn(
        `EventManager#${_warnMethodName} => Not a HControl: `, _ctrl, _ctrl.isCtrl, _ctrl.hasAncestor(HView));
      return false;
    }
  }

  // Ensure valid eventOptions
  _ensureValidEventOptions(_eventOptions, _warnMethodName) {
    if (this.isNullOrUndefined(_warnMethodName)) {
      _warnMethodName = '_ensureValidEventOptions';
    }
    if (this.isntObject(_eventOptions)) {
      console.warn(`EventManager#${_warnMethodName} => Invalid eventOptions: `, _eventOptions);
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
      let _viewIdx = this._listeners[_statusItem].indexOf(_viewId);
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
        console.warn(
          `EventManager#${_warnMethodName} => The element doesn't have an 'view_id' attribute.`);
        return false;
      }
      else {
        const _viewId = parseInt(_elem.view_id, 10);
        if (this.isNullOrUndefined(this._views[_viewId])) {
          console.warn(
            `EventManager#${_warnMethodName} => The viewId:${_viewId} doesn't have a view.`);
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
        console.warn(
          `EventManager#focus => The viewId:${_viewId} doesn't have a 'focus' method.`);
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
        console.warn(
          `EventManager#blur => The viewId:${_viewId} doesn't have a 'blur' method.`);
        return false;
      }
      else {
        return _ctrl.blur();
      }
    }
  }

  _debugHighlight() {
    if (!this.isProduction || BROWSER_TYPE.mobile) {
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
    const matchIds = this._findTopmostEnabled(HPoint.new(x, y), 'contains', null);
    const focused = this._listeners.focused;
    this._filterViewIdToValidView(focused, _viewId => {
      return !matchIds.includes(_viewId);
    }).forEach(_ctrl => {
      this.blur(_ctrl);
    });
    this._filterViewIdToValidView(matchIds, _viewId => {
      return !focused.includes(_viewId);
    }).forEach(_ctrl => {
      this.focus(_ctrl);
    });
    return true;
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
    const dragItems = this._listeners.dragged;
    if (dragItems.length === 0) {
      return false;
    }
    else {
      let _isDragged = false;
      this._filterViewIdToValidView(dragItems)
        .forEach(_ctrl => {
          if (_ctrl.drag(x, y) && !_isDragged) {
            _isDragged = true;
          }
          this._delegateHover(_ctrl, x, y);
        });
      return _isDragged;
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
        if (this.isObject(_ctrl) && this.isFunction(_ctrl.mouseMove) && _ctrl.mouseMove(x, y)) {
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

  _isValidViewFilter(_this) {
    return _view => {
      return (
        _this.isntNullOrUndefined(_view) &&
        _this.isFunction(_view.hasAncestor) &&
        _view.hasAncestor(HView)
      );
    };
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
        `HEventManager#_findTopmostOf error; unknown _matchMethodName: ${_matchMethodName}`);
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
        // TODO: combine this with the map/filter above via reduce:
        for (const [_viewId, _view] of _subviews) {
          // recursive search for matching geometry
          if (_matchMethod(_view)) {
            const _foundId = _search(_view.getZOrder().reverse());
            if (_arrOfIds.includes(_viewId)) {
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
      const _foundId = _search(HSystem.getZOrder().reverse());
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
    if (this._listeners.byEvent.droppable.length === 0) {
      return [];
    }
    else {
      return this._findTopmostOf(this._listeners.byEvent.droppable, _area, _matchMethod, _selfId);
    }
  }

  // Finds the topmost enabled target within the area specified by area
  _findTopmostEnabled(_area, _matchMethod, _selfId) {
    if (this._listeners.enabled.length === 0) {
      return [];
    }
    else {
      return this._findTopmostOf(this._listeners.enabled, _area, _matchMethod, _selfId);
    }
  }

  // Finds all drop/hover targets within the area specified by rectHover
  _findAllDroppable(_area, _matchMethod, _selfId) {
    const _views = this._views;
    const _droppable = this._listeners.byEvent.droppable;
    if (_droppable.length === 0) {
      return [];
    }
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
          _search(_view.getZOrder().reverse());
        });
    };
    _search(HSystem.getZOrder().reverse());
    return _foundIds;
  }

  _validateActiveListeners() {
    this._listeners.active = this._listeners.active.filter(_viewId => {
      if (_viewId === null) {
        console.warn(
          'EventManager#_validateActiveListeners warning; encountered null viewId in active listeners!');
        return false;
      }
      else if (!this._isValidView(this._views[_viewId])) {
        console.warn(
          'EventManager#_validateActiveListeners warning; encountered invalid viewId in active listeners!');
        return false;
      }
      else if (this._views[_viewId].isDead) {
        console.warn(
          'EventManager#_validateActiveListeners warning; encountered a dead control: ',
          this._views[_viewId]);
        return false;
      }
      else {
        return true;
      }
    });
    if (this._listeners.active.length > 1) {
      console.warn(
        'EventManager#_validateActiveListeners warning; too many active items: ', this._listeners.active);
      // TODO: should probably make this an error and throw something; see delActiveControl as well about the situation
    }
  }

  _viewIdToCtrl(_views) {
    return _viewId => {
      return _views[_viewId];
    };
  }

  _delegateEndHoverAndDrop(_ctrl) {
    this._listeners.hovered
      .map(this._viewIdToCtrl(this._views))
      .filter(this._isValidViewFilter(this))
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
      .map(this._viewIdToCtrl(this._views))
      .filter(this._isValidViewFilter(this));
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
      }
    }
  }

  // Sets the active control
  changeActiveControl(_ctrl) {
    const _prevActiveControl = this._views[this._listeners.active[0]];
    if (this._isValidView(_ctrl) && _ctrl === _prevActiveControl) {
      return null;
    }
    else if (_ctrl === null ||
      this.isFunction(_ctrl.allowActiveStatus) &&
      _ctrl.allowActiveStatus(_prevActiveControl)
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
    this.status.button1 = _leftClick;
    this.status.button2 = !_leftClick;
    return this.handleMouseDown(e);
  }

  handleMouseDown(e) {
    const [x, y] = this.status.crsr;
    this.status.setMouseDownPos(x, y);
    this._findNewFocus(x, y);
    const {focused, active, dragged} = this._listeners;
    // newly activated views:
    this._filterViewIdToValidView(focused, _viewId => {
      return !active.includes(_viewId);
    }).forEach(_ctrl => {
      this.changeActiveControl(_ctrl);
    });
    const _leftClick = this.status.button1;
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
    this._handleMouseMove(x, y);
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

  touchStart(e) {
    return this.mouseDown(e);
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
    this.status.button1 = _leftClick;
    this.status.button2 = !_leftClick;
    return this.handleMouseUp(e);
  }

  handleMouseUp(e) {
    const _leftClick = this.status.button1;
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
    if (e.type && e.type === 'touchend') {
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

  touchEnd(e) {
    return this.mouseUp(e);
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
    if (this._handleMouseMove(x, y)) {
      Event.stop(e);
      return true;
    }
    else {
      return false;
    }
  }

  touchMove(e) {
    return this.mouseMove(e);
  }

  // Handles mouse button clicks
  // It's different from mouseUp/mouseDown, because it's a different event,
  // and is supported by touch screen devices
  click(e) {
    this._modifiers(e);
    const _leftClick = Event.isLeftClick(e);
    this.status.button1 = _leftClick;
    this.status.button2 = !_leftClick;
    const [xd, yd] = this.status.mouseDownDiff;
    if (xd > 20 || yd > 20) {
      return true;
    }
    else {
      return this.handleClick(e);
    }
  }

  handleClick(e) {
    const _leftClick = this.status.button1;
    // Focus check here
    const {focused, active} = this._listeners;
    const _clickable = this._listeners.byEvent.click;
    const _doubleClickable = this._listeners.byEvent.doubleClick;
    const _wantsToStopTheEvent = [];
    const [x, y] = this.status.crsr;
    this._handleMouseMove(x, y);
    let _clickWasStopped = false;
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
    this.status.button1 = _leftClick;
    this.status.button2 = !_leftClick;
    this.handleDoubleClick(e);
  }

  handleDoubleClick(e) {
    const _leftClick = this.status.button1;
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
    this.status.button1 = false;
    this.status.button2 = true;
    this.handleMouseUp(e);
    this.handleClick(e);
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
    this.status.button2 = false;
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
      return !_testedIds.includes(_viewId);
    });
    for (let _viewId of _ctrl.parent.views) {
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
    const enabled = this._listeners.enabled;
    const _keyDowners = this._listeners.byEvent.keyDown;
    const _keyRepeaters = this._listeners.byEvent.keyRepeat;
    const _repeating = this._lastKeyDown === _keyCode && this.status.hasKeyDown(_keyCode);
    this.status.addKeyDown(_keyCode);
    const _filterMethod = _repeating ? _viewId => {
      return _keyRepeaters.includes(_viewId) && _keyDowners.includes(_viewId);
    } : _viewId => {
      return _keyDowners.includes(_viewId);
    };
    this._filterViewIdToValidView(enabled, _filterMethod).filter(_ctrl => {
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
    const enabled = this._listeners.enabled;
    const _keyUppers = this._listeners.byEvent.keyUp;
    // delegation of textEnter events is via iterating the
    // byEvent array first, because it's shorter than the
    // list of enabled views
    const _textEnterers = this._listeners.byEvent.textEnter;
    this._filterViewIdToValidView(_textEnterers, _viewId => {
      return enabled.includes(_viewId);
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
      this._filterViewIdToValidView(enabled, _viewId => {
        return _keyUppers.includes(_viewId);
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
