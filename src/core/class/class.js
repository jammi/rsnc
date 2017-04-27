
const mixin = function(Parent/* , ...mixins */) {
  class Mixed extends Parent {}
  Array
    .prototype
    .slice
    .call(arguments, 1)
    .forEach(_item => {
      Object
        .entries(_item)
        .forEach(([_key, _value]) => {
          Mixed.prototype[_key] = _value;
        });
    });
  return Mixed;
};

// Includes some extras than plain classes don't have,
// some of these are for backwards-compatibility and
// deprecation warnings for legacy code.
class HClass {

  constructor() {}

  base() {
    throw new Error('HClass#base() error; Use super() rather than this.base()');
  }

  get mixin() {
    return mixin;
  }

  get ancestors() {
    throw new Error('HClass#ancestors[] error; Use #hasAncestor() to test ancestry');
  }

  hasAncestor(_obj) {
    return _obj.isPrototypeOf(this.constructor);
  }

  static new() {
    return new this(...arguments);
  }

  static nu() {
    console.warn('Using .nu() as an constructor is deprecated; use .new() instead!');
    return new this(...arguments);
  }

  extend() {
    const _klass = this;
    Array
      .prototype
      .slice
      .call(arguments, 1)
      .forEach(_item => {
        Object
          .entries(_item)
          .forEach(([_key, _value]) => {
            _klass.prototype[_key] = _value;
          });
      });
    return _klass;
  }

  static extend() {
    return mixin(this, ...Array
      .prototype
      .slice
      .call(arguments, 1)
    );
  }

  static implement() {
    const _klass = this;
    Array
      .prototype
      .slice
      .call(arguments, 1)
      .forEach(_item => {
        Object
          .entries(_item)
          .forEach(([_key, _value]) => {
            _klass.prototype[_key] = _value;
          });
      });
    return _klass;
  }
}

module.exports = HClass;
