const HClass = require('core/class');

/** = Description
 ** A HDummyValue is just a placeholder for HValue values. HDummyValue
 ** is a light-weight alternative that doesn't implement any actual HValue
 ** functionality, but implements the essential methods and keeps the HControl
 ** content when an actual HValue instance isn't bound.
 ** It's the default valueObj type for components not bound to real HValue instances.
**/
class HDummyValue extends HClass {

  /* = Description
  * HDummyValue is initialized just like a real HValue.
  *
  * = Parameters
  * +_id+::    Any string or integer, just a placeholder for HValue.id
  * +_value+:: Any valid js object, just as for HValue.value
  *
  **/
  constructor(_id, _value) {
    super();
    if (typeof _id === 'undefined') {
      _id = null;
    }
    if (typeof _value === 'undefined') {
      _value = null;
    }
    this.id = _id;
    this.value = _value;
  }

  /* Sets a new instance payload value.
  **/
  set(_value) {
    this.value = _value;
  }

  /* Returns the instance payload value.
  **/
  get() {
    return this.value;
  }

  bind(_responder) {
    console.warn('HDummyValue#bind is deprecated; use #bindResponder instead!');
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
  }

  unbind(_responder) {
    console.warn('HDummyValue#unbind is deprecated; use #releaseResponder instead!');
    return this.releaseResponder(_responder);
  }

  release(_responder) {
    console.warn('HDummyValue#release is deprecated; use #releaseResponder instead!');
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
  }
}

module.exports = HDummyValue;
