const HValueResponderDefaults = require('foundation/valueresponder/valueresponderdefaults');
const HDummyValue = require('foundation/value/dummyvalue');
const UtilMethods = require('util/util_methods');

/** = Description
 ** Defines a minimal +HValue+ responder interface.
 ** It's implemented by default by +HControl+.
***/
class HValueResponder extends UtilMethods {

  constructor(_options) {
    super();
    this.setOptions(_options);
  }

/** An reference to the options block given as the constructor
  * parameter _options.
  **/
  // options: null,
  get options() {
    return this.__options;
  }

  set options(_options) {
    if (this.isObject(_options)) {
      this.__options = _options;
    }
  }

  setOptions(_options) {
    if (this.isNullOrUndefined(_options)) {
      _options = {};
    }
    _options = this.defaultOptionsClass.extend(_options).new(this);
    this.options = _options;
    if (this.isObject(this.options.valueObj) && this.isFunction(this.options.valueObj.bindResponder)) {
      this.options.valueObj.bindResponder(this);
    }
    else if (this.isString(_options.bind)) {
      const _valueId = _options.bind;
      const _valueObj = this.getValueById(_valueId);
      if (_valueObj) {
        _valueObj.bindResponder(this);
      }
    }
    else if (this.isObject(this.options.bind) && this.isFunction(this.options.bind.bindResponder)) {
      _options.bind.bindResponder(this);
    }
    if (this.isntObject(this.valueObj)) {
      this.setValueObj(new HDummyValue(false, _options.value));
    }
    this.options = _options;
    return _options;
  }

  get defaultOptionsClass() {
    return this.__defaultOptionsClass || HValueResponderDefaults;
  }

  isValueObject(_valueObj) {
    return this.isObject(_valueObj) && this.isntUndefined(_valueObj.value) && this.isntUndefined(_valueObj.id);
  }

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
    if (this.isValueObject(_valueObj)) {
      this.__valueObj = _valueObj;
      this.setValue(_valueObj.value);
    }
  }

/** The current HValue compatible object. Do not set directly.
  * Holds reference to the bound HValue instance.
  * Set with HValue.bind.
  **/
  set valueObj(_valueObj) {
    this.setValueObj(_valueObj);
  }

  get valueObj() {
    return this.__valueObj || null;
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
    if (this.isntUndefined(_value) && this.isValueObject(this.valueObj) && this.valueDiffers(_value)) {
      this.__value = _value;
      if (this.isObjectOrArray(_value)) {
        this.valueObj.set(this.cloneObject(_value));
      }
      else {
        this.valueObj.set(_value);
      }
      if (this.isFunction(this.refresh)) {
        this.refresh();
      }
      else if (this.isFunction(this.refreshValue)) {
        this.refreshValue();
      }
    }
  }

  die() {
    if (this.valueObj) {
      this.valueObj.releaseResponder(this);
      this.__valueObj = null;
    }
  }

/** The current value of a component. See setValue.
  **/
  set value(_value) {
    this.setValue(_value);
  }

  get value() {
    if (this.isUndefined(this.__value)) {
      this.__value = null;
    }
    return this.__value;
  }
}

module.exports = HValueResponder;
