const LOAD = require('core/load');
const ELEM = require('core/elem');
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
    this.windowFocusMode = [0, 1].includes(options.windowFocusMode) ? options.windowFocusMode : 1;
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
    if ([0, 1].includes(mode)) {
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

  /** Return list of views which are in root level of document sorted by z-inde **/
  getZOrder() {
    return this.views
      .filter(_view => {
        return _view && _view.parent.elemId !== 0;
      })
      .map((_view, index) => {
        let zIndex = ELEM.getStyle(_view.elemId, 'z-index', true);
        if (zIndex !== 'auto') {
          zIndex = parseInt(zIndex, 10);
          if (!isFinite(zIndex)) {
            zIndex = 'auto';
          }
        }
        return {
          index,
          viewId: _view.viewId,
          zIndex
        };
      })
      .sort((a, b) => {
        if (a.zIndex === b.zIndex) {
          return a.index - b.index;
        }
        else if (a.zIndex === 'auto') {
          return -1;
        }
        else if (b.zIndex === 'auto') {
          return 1;
        }
        else {
          return a.zIndex - b.zIndex;
        }
      })
      .map(({viewId}) => {
        return viewId;
      });
  }

 /* Flushes the z-indexes. This is a fairly expensive operation,
  * thas's why the info is buffered.
  **/
  _flushUpdateZIndexOfChilden() {
    const _this = this;
    // Iterate over a clone:
    const _buffer = this.cloneObject(this._updateZIndexOfChildrenBuffer);
    this._updateZIndexOfChildrenBuffer = [];
    _buffer
      .map(_viewId => {
        const _view = _this.__views[_viewId];
        const _isRootView = _viewId === null;
        const _viewOrder = _isRootView ? _this.__viewsZOrder : _view.viewsZOrder;
        if (_viewOrder instanceof Array) {
          return _viewOrder;
        }
        else {
          return null;
        }
      })
      .filter(_viewOrder => {
        return _viewOrder !== null;
      })
      .map(_viewOrder => {
        let _zIndex = -1;
        return _viewOrder
          .map(_viewId => {
            const _view = _this.__views[_viewId];
            const _elemId = _view.elemId;
            if (_elemId) {
              _zIndex += 1;
              return [_elemId, _zIndex];
            }
            else {
              return null;
            }
          })
          .filter(_item => {
            return _item !== null;
          });
      })
      .forEach(_elemZIndexes => {
        _elemZIndexes.forEach(([_elemId, _zIndex]) => {
          ELEM.setStyle(_elemId, 'z-index', _zIndex, true);
        });
      });
  }
})();

module.exports = HSystem;
