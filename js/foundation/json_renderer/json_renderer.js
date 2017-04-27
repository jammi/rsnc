
const UtilMethods = require('util/util_methods');

const HApplication = require('foundation/application');
const HView = require('foundation/view');
const HValue = require('foundation/value');

/* Constructs nodes from JSON structures as GUI
 * tree structures. Lowers the learning curve of GUI
 * development, because Javascript knowledge is not
 * required to define user interfaces.
 * The main purpose is to ease the development of
 * user interfaces by defining them as data on the
 * server, converting the data to JSON GUI trees and
 * letting the client handle the rest. The end result
 * is the same as defining the structures in
 * JavaScript code.
 *
 * This class is still in development, so expect more
 * features and documentation as it matures.
*/
class JSONRenderer extends UtilMethods {

  get version() {
    return 1.1;
  }

  _validateTypeAndVersion(_data) {
    return _data.type === 'GUITree' && this.version >= _data.version;
  }

  /* = Description
  * Renders JSON structured data, see some of the demos for usage examples.
  *
  * = Parameters:
  * +_data+:   The data structure used for building.
  * +_parent+: The parent view (or app) (Optional)
  **/
  constructor(_data, _parent) {
    super();
    if (this._validateTypeAndVersion(_data)) {
      this.data = _data;
      this.parent = _parent;
      this.byId = {};
      this.byName = {};
      this.render();
      if (this.view.hasAncestor(HApplication)) {
        this.view.getViewById = _id => {
          return this.getViewById(_id);
        };
        this.view.getViewsByName = _id => {
          return this.getViewsByName(_id);
        };
      }
      else if (this.view.hasAncestor(HView)) {
        this.view.app.getViewById = _id => {
          return this.getViewById(_id);
        };
        this.view.app.getViewsByName = _id => {
          return this.getViewsByName(_id);
        };
      }
    }
    else {
      throw new Error(`JSONRenderer: Only GUITree version ${this.version} or older data can be handled.`);
    }
  }

  getViewById(_id) {
    if (this.typeChr(this.byId[_id]) !== '-') {
      return this.byId[_id];
    }
    else {
      console.error(`JSONRenderer; no such view Id: ${_id}`);
      return null;
    }
  }

  addViewId(_id, _view) {
    if (this.typeChr(this.byId[_id]) !== '-') {
      console.warn(`JSONRenderer; already has id: ${_id} (replacing)`);
    }
    this.byId[_id] = _view;
  }

  getViewsByName(_name) {
    if (this.typeChr(this.byName[_name]) !== '-') {
      return this.byName[_name];
    }
    console.log(`JSONRenderer; no views named: ${_name}`);
    return [];
  }

  addViewName(_name, _view) {
    if (this.typeChr(this.byName[_name]) === '-') {
      this.byName[_name] = [];
    }
    this.byName[_name].push(_view);
  }

  render() {
    this.scopes = [window];
    this.scopeDepth = 0;
    this.view = this.renderNode(this.data, this.parent);
  }

  die() {
    this.view.die();
  }

  get _reservedScopeKeys() {
    return ['class', 'extend', 'implement'];
  }

  defineInScope(_definition) {
    const _defType = this.typeChr(_definition);
    if (_defType !== 'h') {
      console.error(`JSONRenderer; definition must be an Object, got: "${_defType}": `, _definition);
    }
    else {
      const _extension = {};
      const _reserved = this._reservedScopeKeys;
      const _className = _definition[_reserved[0]];
      const _extendName = _definition[_reserved[1]];
      const _implementName = _definition[_reserved[2]];
      const _extend = _extendName ? this.findInScope(_extendName) : false;
      const _implement = _implementName ? this.findInScope(_implementName) : false;
      const _scope = this.scopes[this.scopeDepth];
      if (this.typeChr(_className) === '-') {
        console.error(`JSONRenderer; class name "${_className}" missing in definition scope.`);
      }
      else {
        if (!_extend) {
          _extend = class {};
        }
        Object.entries(_definition).forEach(([_key, _value]) => {
          if (!_reserved.includes(_key)) {
            if (this.typeChr(_value) === 's') {
              _value = this.extEval(_value);
            }
            _extension[_key] = _value;
          }
        });
        _scope[_className] = _extend.extend(_extension);
        if (_implement) {
          this.updateObject(_implement, _scope[_className]);
        }
      }
    }
  }

  undefineInScope() {}

  findInScope(_className) {
    if (this.typeChr(_className) === '-') {
      return false;
    }
    else {
      if (_className.includes('.')) {
        const _splitClass = _className.split('.');
        let j = 1;
        let _classPart = _splitClass[0];
        let _classFull = this.findInScope(_classPart);
        if (!_classFull) {
          return false;
        }
        for (; j < _splitClass.length; j++) {
          _classPart = _splitClass[j];
          _classFull = _classFull[_classPart];
          if (!_classFull) {
            return false;
          }
        }
        return _classFull;
      }
      let i = this.scopes.length - 1;
      let _scope;
      for (; i > -1; i--) {
        _scope = this.scopes[i];
        if (this.typeChr(_scope[_className]) !== '-') {
          return _scope[_className];
        }
      }
      return false;
    }
  }

  extEval(_block) {
    if (_block.indexOf('function(') === 0) {
      console.warning('JSONRenderer.extEval; evaluation of functions is deprecated!');
      eval(`_block = ${_block}`);
    }
    return _block;
  }

  initStraight(_class, _args) {
    if (this.typeChr(_args) === 'a') {
      return new _class(..._args);
    }
    else {
      return new _class(_args);
    }
  }

  _handleCall(_instance, _call) {
    if (this.typeChr(_call) === 'h') {
      Object.entries(_call).forEach(([_methodName, _args]) => {
        const _method = _instance[_methodName];
        if (this.typeChr(_method) === '>') {
          _method.apply(_instance, _args);
        }
        else {
          console.error(`JSONRenderer handleCall error; method '${_methodName}' is not a function: `, _method);
        }
      });
    }
    else {
      console.error('JSONRenderer handleCall error, unable to handle call format: ', _call);
    }
  }

  get _reservedNodeKeys() {
    return [
      'type', 'args', 'version', 'class', 'rect',
      'bind', 'extend', 'options', 'subviews', 'define'
    ];
  }

  get _autoOptionItems() {
    return [
      'label', 'style', 'visible', 'theme', 'html',
      'value', 'enabled', 'events', 'active', 'minValue',
      'maxValue'
    ];
  }

  _parseRenderNode(_dataNode) {
    const _retVal = (() => {
      // The class name is found and given, just use it:
      if (_dataNode.class && this.typeChr(_dataNode.class) === 's') {
        const _className = _dataNode.class;
        return {
          _className,
          _class: this.findInScope(_className),
          _origNode: null,
          _dataNode,
          _straightParams: false
        };
      }
      // Find the actual dataNode:
      else {
        const _reserved = this._reservedNodeKeys;
        for (const _nodeKey in _dataNode) {
          // Use the first match:
          if (!_reserved.includes(_nodeKey)) {
            const _className = _nodeKey;
            const _class = this.findInScope(_className);
            if (_class) {
              return {
                _className,
                _class,
                _origNode: _dataNode,
                _dataNode: _dataNode[_nodeKey],
                _straightParams: this.typeChr(_dataNode[_nodeKey]) === 'a'
              };
            }
          }
        }
        return {
          _dataNode
        };
      }
    })();
    if (_retVal._dataNode) {
      if (this.typeChr(_retVal._dataNode.id) === 's') {
        _retVal._id = _retVal._dataNode.id;
      }
      if (this.typeChr(_retVal._dataNode.name) === 's') {
        _retVal._name = _retVal._dataNode.name;
      }
    }
    return _retVal;
  }

  _guessClassConstructorType(_class) {
    if (this.typeChr(_class.hasAncestor) !== '-') {
      if (_class.hasAncestor(HApplication)) {
        return 'HApplication';
      }
      else if (_class.hasAncestor(HView)) {
        return 'HView';
      }
      else {
        console.warn('JSONRenderer._guessClassConstructorType warning; guessing this class is a function:', _class);
        return 'function';
      }
    }
    else {
      return 'function';
    }
  }

  _initStraightInstance({_straightParams, _class, _dataNode, _origNode}) {
    if (_straightParams) {
      return this.initStraight(_class, _dataNode);
    }
    else if (this.typeChr(_dataNode.args) !== '-') {
      return this.initStraight(_class, _dataNode.args);
    }
    else if (_origNode && this.typeChr(_origNode.args) !== '-') {
      return this.initStraight(_class, _origNode.args);
    }
    else {
      return null;
    }
  }

  _findRectInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _rectType = this.typeChr(_node.rect);
      const _hasRect = ['a', 's', 'h'].includes(_rectType);
      if (_hasRect) {
        const _rect = _node.rect;
        // TODO: additional validation
        if (_rectType === 'h') {
          return [_rect.left, _rect.top, _rect.width, _rect.height, _rect.right, _rect.bottom];
        }
        else {
          return _rect;
        }
      }
    }
    return null;
  }

  _findSubviewsInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _subviewType = this.typeChr(_node.subviews);
      if (_subviewType !== '-') {
        // TODO: additional validation
        return _node.subviews;
      }
    }
    return null;
  }

  _findOptionsInDataNodes(_dataNodes) {
    let _hasOptions = false;
    const _options = (() => {
      for (const _node of _dataNodes) {
        const _optionsType = this.typeChr(_node.options);
        if (_optionsType !== '-') {
          // TODO: additional validation
          _hasOptions = true;
          return _node.options;
        }
      }
      return {};
    })();
    _dataNodes.some(_node => {
      return this
        ._autoOptionItems
        .map(_optName => {
          const _optValue = _node[_optName];
          const _optValueType = this.typeChr(_optValue);
          if (_optValueType !== '-') {
            _hasOptions = true;
            _options[_optName] = _optValue;
            return _optName;
          }
          else {
            return null;
          }
        })
        .some(_test => {
          return !!_test;
        });
    });
    if (_hasOptions) {
      return _options;
    }
    else {
      return null;
    }
  }

  _findExtensionsInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _extendType = this.typeChr(_node.extend);
      if (_extendType === 'h') {
        const _extBlock = {};
        Object.entries(_node.extend).forEach(([_name, _block]) => {
          if (this.typeChr(_block) === 's') {
            _block = this.extEval(_block);
          }
          _extBlock[_name] = _block;
        });
        return _extBlock;
      }
      else if (_extendType !== '-') {
        console.error(
          `JSONRenderer error; invalid extension block type: '${_extendType
          }; should be Object, extension: `, _node.extend);
        return null;
      }
    }
    return null;
  }

  _findValueBindingInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _bindType = this.typeChr(_node.bind);
      if (_bindType !== '-') {
        let _bind = _node.bind;
        if (_bindType === 's' || _bindType === 'n') {
          _bind = this.getValueById(_bind);
        }
        if (this.typeChr(_bind.hasAncestor) === '>' && _bind.hasAncestor(HValue)) {
          return _bind;
        }
        else {
          console.error(
            'JSONRenderer _findValueBindingInDataNodes error; invalid bind:', _bind);
          return null;
        }
      }
    }
    return null;
  }

  _findFunctionCallInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _callType = this.typeChr(_node.call);
      if (_callType !== '-') {
        // TODO: additional validation
        return _node.call;
      }
    }
    return null;
  }

  _findDefinitionsInDataNodes(_dataNodes) {
    for (const _node of _dataNodes) {
      const _defineType = this.typeChr(_node.define);
      if (_defineType === 'a') {
        return _node.define;
      }
      else if (!['~', '-'].includes(_defineType)) {
        console.warn(
          `JSONRenderer warning; invalid define type: '${_defineType
          }'; should be Array, define: `, _node.define);
      }
    }
    return null;
  }

  renderNode(_rawDataNode, _parent) {
    const _parsedNode = this._parseRenderNode(_rawDataNode);
    const {
      _className, _origNode, _dataNode, _straightParams,
      _id, _name
    } = _parsedNode;
    if (_origNode || _dataNode) {
      let {_class} = _parsedNode;
      const _classConstructorType = this._guessClassConstructorType(_class);
      let _instance = this._initStraightInstance({_straightParams, _class, _dataNode, _origNode});
      if (_instance) {
        _id && this.addViewId(_id, _instance);
        _name && this.addViewName(_name, _instance);
        return _instance;
      }
      else {
        const _rect = this._findRectInDataNodes([_dataNode, _origNode]);
        if (_classConstructorType !== 'HView' && _rect) {
          console.warn(
            `JSONRenderer.renderNode warning; className: '${_className
            }' is not a HView, but is supplied with rect: `, _rect);
        }
        else if (_classConstructorType === 'HView' && !_rect) {
          console.warn(
            `JSONRenderer.renderNode warning; className: '${_className
            }' is a HView, but is not supplied with rect: `, _rect);
        }
        const _subviews = this._findSubviewsInDataNodes([_dataNode, _origNode]);
        const _options = this._findOptionsInDataNodes([_dataNode, _origNode]);
        const _extension = this._findExtensionsInDataNodes([_dataNode, _origNode]);
        const _valueBinding = this._findValueBindingInDataNodes([_dataNode, _origNode]);
        const _functionCall = this._findFunctionCallInDataNodes([_dataNode, _origNode]);
        const _definitions = this._findDefinitionsInDataNodes([_dataNode, _origNode]);
        this.scopeDepth += 1;
        this.scopes.push({});
        if (_definitions) {
          _definitions.forEach(_definition => {
            this.defineInScope(_definition);
          });
        }
        if (_class) {
          if (_extension) {
            _class = _class.extend(_extension);
          }
          if (_options && _valueBinding) {
            _options.valueObj = _valueBinding;
          }
          else if (_options && !_valueBinding && this.typeChr(_options.valueObjId) in ['s', 'n']) {
            const _valueIdBinding = this.getValueById(_options.valueObjId);
            if (_valueIdBinding.hasAncestor && _valueIdBinding.hasAncestor(HValue)) {
              _options.valueObj = _valueIdBinding;
            }
            else {
              console.error('JSONRenderer.renderNode error; invalid valueObjId:', _options.valueObjId);
            }
          }
          if (_classConstructorType === 'HApplication') {
            if (_options) {
              _instance = _class.new(_options);
            }
            else {
              _instance = _class.new();
            }
          }
          else if (_classConstructorType === 'HView') {
            _instance = _class.new(_rect, _parent, _options);
          }
          else if (_rect && _options) {
            _instance = _class.new(_rect, _parent, _options);
          }
          else if (_rect && !_options) {
            _instance = _class.new(_rect, _parent);
          }
          else if (_options) {
            _instance = _class.new(_parent, _options);
          }
          else {
            _instance = _class.new(_parent);
          }
          if (_instance && !_options && _valueBinding) {
            _valueBinding.bind(_instance);
          }
        }
        else if (!_subviews) {
          // NOT _class:
          console.error(
            `JSONRenderer.renderNode error; not a class: '${_className
            }', and has no subviews; node: `, _rawDataNode);
        }
        if (!_instance) {
          _instance = _parent;
        }
        _id && this.addViewId(_id, _instance);
        _name && this.addViewName(_name, _instance);
        _functionCall && this._handleCall(_instance, _functionCall);

        // Iterates recursively through all subviews, if specified.
        if (_subviews) {
          _subviews.forEach(_subview => {
            this.renderNode(_subview, _instance);
          });
        }
        this.scopes.pop();
        this.scopeDepth -= 1;
        return _instance;
      }
    }
    else {
      console.error('JSONRenderer.renderNode error; invalid node:', _rawDataNode);
      return null;
    }
  }
}

module.exports = JSONRenderer;
