
/** = Description
 ** A HDummyValue is just a placeholder for HValue values. HDummyValue
 ** is a light-weight alternative that doesn't implement any actual HValue
 ** functionality, but implements the essential methods and keeps the HControl
 ** content when an actual HValue instance isn't bound.
 ** It's the default valueObj type for components not bound to real HValue instances.
**/
class HDummyValue {

  /* = Description
  * HDummyValue is initialized just like a real HValue.
  *
  * = Parameters
  * +_id+::    Any string or integer, just a placeholder for HValue.id
  * +_value+:: Any valid js object, just as for HValue.value
  *
  **/
  constructor(_id, _value) {
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

  /* Binds HControl, does actually nothing.
  **/
  bind(_theObj) {

  }

  /* Unbinds (releases) HControl, does actually nothing.
  **/
  unbind(_theObj) {

  }
}

module.exports = HDummyValue;
