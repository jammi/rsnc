
const UtilMethods = require('util/util_methods');

/** = Description
 ** Defines a minimal +HValue+ responder interface.
 ** It's implemented by default by +HControl+.
***/

class HValueResponder extends UtilMethods {
  /* = Description
  * Binds an HValue compatible instance to the component's valueObj. Also
  * calls +setValue+. It should not be called from user code, instead
  * use the +HValue+ instance method +bind+.
  *
  * = Parameter
  * +_aValueObj+:: The HValue instance object to bind.
  *
  * = Returns
  * +self+
  *
  **/
  setValueObj(_valueObj) {
    this.__valueObj = _valueObj;
    this.setValue(_valueObj.value);
  }

  set valueObj(_valueObj) {
    this.setValueObj(_valueObj);
  }

  get valueObj() {
    return this.__valueObj;
  }

  /* = Description
  * Checks, if the value given as parameter differs from +value+.
  *
  * = Parameters
  * +_value+:: The value to be tested.
  *
  * = Returns
  * A boolean true (different) or false (same).
  *
  **/
  valueDiffers(_value) {
    return this.encodeObject(_value) !== this.encodeObject(this.value);
  }

  /* = Description
  * Assigns the object a new value.
  * Extend it, if your component needs to do validation of the new value.
  * For +HControl+ instances, extend HControl#refreshValue to do something when
  * the +value+ has been set.
  *
  * = Parameter
  * +_value+::  The new value. Allowed values depend on the component type
  *             and other usage of the bound +HValue+ instance +self.valueObj+.
  *
  * = Returns
  * +self+
  *
  **/
  setValue(_value) {
    const _typeChr = this.typeChr(_value);
    if (_typeChr !== '-' && this.typeChr(this.valueObj) === 'o' && this.valueDiffers(_value)) {
      this.__value = _value;
      if (_typeChr in ['a', 'h', 'o']) {
        this.valueObj.set(this.cloneObject(_value));
      }
      else {
        this.valueObj.set(_value);
      }
      if (this.typeChr(this.refresh) === '>') {
        this.refresh();
      }
      else if (this.typeChr(this.refreshValue) === '>') {
        this.refreshValue();
      }
    }
  }

  set value(_value) {
    this.setValue(_value);
  }

  get value() {
    return this.__value;
  }
}

module.exports = HValueResponder;
