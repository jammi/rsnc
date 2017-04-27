const HClass = require('core/class');
const Values = require('comm/values');
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

