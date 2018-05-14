
const HValue = require('foundation/value');
const LOAD = require('core/load');
let Values; LOAD(() => {Values = require('comm/values');});

/* Client -> Server push value buffer.
* Works like HValue, but only streams out changes
* instead of keeping only the last state.
* The nature of the buffer is volatile, so don't rely
* on re-transmission on failures.
* Ideal for event logging purposes.
*/
class HPushValue extends HValue {
  constructor(_id, _value) {
    super(_id, null);
    this.buffer = [];
  }

  toSync() {
    const _arr = [];
    const _histLen = this.buffer.length;
    for (let i = 0; i < _histLen; i++) {
      _arr.push(this.buffer.shift());
    }
    return _arr;
  }

  set(_value) {
    const _encoded = this.encodeObject(_value);
    for (let i = 0; i < this.buffer.length; i++) {
      const _val = this.buffer[i];
      if (this.encodeObject(_val) === _encoded) {
        this.buffer.splice(i, 1);
        break;
      }
    }
    this.buffer.push(_value);
    Values.changed(this);
    this.refresh();
  }

  die() {
    this.buffer = null;
    delete this.buffer;
    super.die();
  }
}

module.exports = HPushValue;
