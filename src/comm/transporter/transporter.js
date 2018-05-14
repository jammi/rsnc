
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
    if (this.isntString(_resp)) {
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
      if (this.isArray(_values.new)) {
        _values.new.forEach(([_valueId, _valueData, _valueType]) => {
          if (this.isUndefined(_valueType)) {
            _valueType = 0;
          }
          Values.create(_valueId, _valueData, _valueType);
        });
      }
      if (this.isArray(_values.set)) {
        _values.set.forEach(([_valueId, _valueData]) => {
          Values.s(_valueId, _valueData);
        });
      }
      if (this.isArray(_values.del)) {
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
      else if (_sesKey === Session.oldKey) {
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
    if (!this._serverInterruptView) {
      this._serverInterruptView = ServerInterruptView.new([0, 0, 200, 20, 0, null], this);
      if (this.isntString(_customMessage)) {
        this._serverInterruptView._setFailedResp(_customMessage);
      }
    }
    if (this.isString(_customMessage)) {
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
