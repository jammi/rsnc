
const isClass = obj => {
  return typeof obj === 'function' && obj.prototype.constructor === obj;
};

const mixin = function(Parent, ...mixins) {
  class Mixed extends Parent {}
  mixins.forEach(_item => {
    if (isClass(_item)) {
      _item = _item.prototype;
    }
    Reflect.ownKeys(_item).forEach(_key => {
      Mixed.prototype[_key] = _item[_key];
    });
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
      Reflect.ownKeys(copySource).forEach(_key => {
        copyTarget[_key] = copySource[_key];
      });
    });
  return toObject;
};

// Includes some extras than plain classes don't have,
// some of these are for backwards-compatibility and
// deprecation warnings for legacy code.
class HClass {

  get isProduction() {
    // this function is found in the package header:
    return isProductionBuild();
  }

  base() {
    throw new Error('HClass#base() error; Use super() rather than this.base()');
  }

  get mixin() {
    return mixin;
  }

  get ancestors() {
    const _arr = [];
    let _target = this;
    while (_target) {
      _arr.push(_target);
      _target = _target.__proto__;
    }
    return _arr;
  }

  hasAncestor(_obj) {
    return this.ancestors.includes(_obj.prototype);
  }

  extend(...items) {
    return copyGuess(items, this);
  }

  static new() {
    return new this(...arguments);
  }

  static nu() {
    console.warn('Using .nu() as an constructor is deprecated; use .new() instead!');
    return new this(...arguments);
  }

  static implement(...items) {
    return copyGuess(items, this);
  }

  static extend(...items) {
    return mixin(this, ...items);
  }

  static mixin(...items) {
    return mixin(this, ...items);
  }
}

module.exports = HClass;
