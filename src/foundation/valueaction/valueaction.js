const HClass = require('core/class');
const HView = require('foundation/view');
const HApplication = require('foundation/application');
const UtilMethods = require('util/util_methods');
const HValueResponder = require('foundation/valueresponder');
const HSystem = require('foundation/system');

class HValueAction extends HValueResponder {
  constructor(_rect, _parent, _options) {
    super();
    if (this.isUndefined(_options) && this.isClass(_rect.constructor) && this.isClass(_parent.constructor) &&
      this.isFunction(_rect.hasAncestor) && (_rect.hasAncestor(HView) || _rect.hasAncestor(HApplication))) {
      _options = _parent;
      _parent = _rect;
    }
    else {
      console.warn(
        'Warning: the rect constructor argument of HValueAction is deprecated:',
        _rect);
    }
    this.parent = _parent;
    this.options = _options;
    if (_options.value) {
      this.value = _options.value;
    }
    if (_options && this.isntNullOrUndefined(_options.bind)) {
      let _valueObj = _options.bind;
      if (this.isString(_valueObj)) {
        _valueObj = this.getValueById(_valueObj);
      }
      _valueObj.bindResponder(this);
    }
    else if (_options.valueObj) {
      _options.valueObj.bindResponder(this);
    }
    if (this.isFunction(this.parent.addView)) {
      this.viewId = this.parent.addView(this);
    }
    this.inited = true;
  }

  remove() {
    if (this.parent) {
      const _viewZIdx = this.parent.viewsZOrder.indexOf(this.viewId);
      const _viewPIdx = this.parent.views.indexOf(this.viewId);
      this.parent.views.splice(_viewPIdx, 1);
      HSystem.delView(this.viewId);
      this.parent.viewsZOrder.splice(_viewZIdx, 1);
      const _sysUpdateZIndexOfChildrenBufferIndex = HSystem
        ._updateZIndexOfChildrenBuffer
        .indexOf(this.viewId);
      if (_sysUpdateZIndexOfChildrenBufferIndex !== -1) {
        HSystem
          ._updateZIndexOfChildrenBuffer
          .splice(_sysUpdateZIndexOfChildrenBufferIndex, 1);
      }
      this.parent = null;
      this.parents = [];
    }
    return this;
  }

  die() {
    if (this.isFunction(this.parent.removeView)) {
      this.parent.removeView(this.viewId);
    }
    if (this.isntNullOrUndefined(this.valueObj)) {
      this.valueObj.releaseResponder(this);
    }
    super.die();
    this.value = null;
    this.viewId = null;
  }

  refresh() {
    if (this.options.skipFirstRefresh && !this.inited) {
      return false;
    }
    else {
      if (this.options.refreshAction || this.options.action) {
        const _refreshAction = this.options.refreshAction ?
          this.options.refreshAction :
          this.options.action;
        if (this.isObject(this.parent) &&
            this.isFunction(this.parent[_refreshAction])
        ) {
          this.parent[_refreshAction](this.value);
        }
        else if (this.isObject(this.parent)) {
          this.parent[_refreshAction] = this.value;
        }
      }
      return true;
    }
  }
}

module.exports = HValueAction;
