
const HValue = require('foundation/value');

// Opposite of HPushValue (Server -> Client push)
class HPullValue extends HValue {
  s(_values) {
    _values.forEach(_value => {
      this.value = _value;
      this.refresh();
    });
  }
}

module.exports = HPullValue;
