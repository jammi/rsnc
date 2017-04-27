const HDummyValue = require('foundation/value/dummyvalue');
const HValueResponder = require('foundation/valueresponder');
const HView = require('foundation/view');

class HValueView extends HView.mixin(HValueResponder, {
  refreshOnValueChange: true
}) {
  constructor(_rect, _parent, _options) {
    if (this.isNullOrUndefined(_options)) {
      _options = {};
    }
    _options = this.viewDefaults.extend(_options).new(this);
    if (this.isntNullOrUndefined(_options.valueObj)) {
      _options.valueObj.bind(this);
    }
    if (_options.bind) {
      if (this.isString(_options.bind)) {
        const _valueId = _options.bind;
        const _valueObj = this.getValueById(_valueId);
        if (_valueObj) {
          _valueObj.bind(this);
        }
      }
      else {
        _options.bind.bind(this);
      }
    }

    if (this.isNullOrUndefined(this.valueObj)) {
      this.valueObj = new HDummyValue();
    }

    if (this.isNullOrUndefined(this.value) && this.isntNullOrUndefined(_options.value)) {
      this.setValue(_options.value);
    }
    super(_rect, _parent, _options);
  }

  refresh() {
    if (this.drawn && this.refreshOnValueChange) {
      this.refreshValue();
    }
    return this;
  }

  refreshValue() {
    return true;
  }
}

module.exports = HValueView;
