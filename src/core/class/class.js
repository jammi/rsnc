
const isClass = obj => {
  return typeof obj === 'function' && obj.prototype.constructor === obj;
};

const mixin = function(Parent/* , ...mixins */) {
  class Mixed extends Parent {}
  Array
    .prototype
    .slice
    .call(arguments, 1)
    .forEach(_item => {
      if (isClass(_item)) {
        Object.assign(Mixed.prototype, _item.prototype);
      }
      else {
        Object.assign(Mixed.prototype, _item);
      }
    });
  return Mixed;
};

const copyGuess = (fromObjects, toObject) => {
  let copyTarget = toObject;
  if (isClass(toObject)) {
    copyTarget = toObject.prototype;
  }
  fromObjects
    .forEach(copySource => {
      if (isClass(copySource)) {
        copySource = copySource.prototype;
      }
      Object.assign(copyTarget, copySource);
    });
  return toObject;
};

// Includes some extras than plain classes don't have,
// some of these are for backwards-compatibility and
// deprecation warnings for legacy code.
class HClass {

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

  extend() {
    return copyGuess(Array
      .prototype
      .slice
      .call(arguments, 0), this);
  }

  static new() {
    return new this(...arguments);
  }

  static nu() {
    console.warn('Using .nu() as an constructor is deprecated; use .new() instead!');
    return new this(...arguments);
  }

  static implement() {
    return copyGuess(Array
      .prototype
      .slice
      .call(arguments, 0), this);
  }

  static extend() {
    return mixin(this, ...Array
      .prototype
      .slice
      .call(arguments, 0)
    );
  }

  static mixin() {
    return mixin(this, ...Array
      .prototype
      .slice
      .call(arguments, 0)
    );
  }
}

module.exports = HClass;
