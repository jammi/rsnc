
const UtilMethods = require('util/util_methods');
const HValue = require('foundation/value');
const HPushValue = require('foundation/value/pushvalue');
const HPullValue = require('foundation/value/pullvalue');
const HDummyValue = require('foundation/value/dummyvalue');
const Transporter = require('comm/transporter');
const Session = require('comm/session');

/** = Description
 ** Manages data value synchronization.
 **
 ** Keeps track of all +HValue+ instances present.
**/
class ValueManager extends UtilMethods {

/** No constructor, singleton class.
  **/
  constructor() {
    super();
    /** An +Object+ containing all values by key.
      **/
    this.values = {};
    /** A list of value keys whose value has changed. To be synchronized asap.
      **/
    this.tosync = [];
  }

  /* = Description
  * Creates a new +HValue+ instance. Its main purpose is to act as the main
  * client-side value creation interface for the server representation of
  * +HValue+.
  *
  * = Parameters
  * +_id+::     The unique id of the +HValue+ instance (set by the server)
  * +_data::    The initial data of the +HValue+ instance (set by the server)
  * +_type::    The value type: 0=HValue, 1=HPushValue, 2=HPullValue
  *
  **/
  create(_id, _data, _type) {
    if (!_type) {
      HValue.new(_id, _data);
    }
    else if (_type === 1) {
      HPushValue.new(_id, _data);
    }
    else if (_type === 2) {
      HPullValue.new(_id, _data);
    }
    else {
      console.warn(`Unknown value type: ${_type}`);
    }
  }

  /* = Description
  * Binds a +HValue+ instance created externally to +self.values+.
  * Called from +HValue+ upon construction.
  *
  * = Parameters
  * +_id+::     The unique id of the +HValue+ instance (set by the server)
  * +_value+::  The +HValue+ instance itself.
  *
  **/
  add(_id, _value) {
    this.values[_id] = _value;
  }

  /* = Description
  * Sets the data of the +HValue+ instance by +_Id+.
  *
  * = Parameters
  * +_id+::     The unique id of the +HValue+ instance (set by the server)
  * +_data+::   The new data, any Object type supported by JSON.
  *
  **/
  set(_id, _data) {
    this.values[_id].set(_data);
  }

  /* = Description
  * Sets and decodes the +_data+. Main value setter interface
  * for the server representation of +HValue+.
  *
  * = Parameters
  * +_id+::     The unique id of the +HValue+ instance (set by the server)
  * +_data+::   The new data from the server, to be decoded.
  *
  **/
  s(_id, _data) {
    _data = this.decode(_data);
    this.values[_id].s(_data);
  }

  /* = Description
  * Deletes a +HValue+ instance by +_id+.
  *
  * = Parameters
  * +_id+::     The unique id of the +HValue+ instance (set by the server)
  *
  **/
  del(_id) {
    const _value = this.values[_id];
    _value.views.forEach(_view => {
      _view.valueObj = HDummyValue.new(0, _value.value);
    });
    _value.views = [];
    delete this.values[_id];
  }

  /* = Description
  * Marks the +HValue+ instance as changed and tries to send it
  * immediately, unless COMM.Transporter has an ongoing transfer.
  * Usually called by the +HValue+ instance internally.
  *
  * = Parameters
  * +_value+::     The +HValue+ instanche that changed.
  *
  **/
  changed(_value) {
    if (!this.tosync.includes(_value.id)) {
      this.tosync.push(_value.id);
      if (!Transporter.busy) {
        Transporter.sync();
      }
    }
  }

  /* = Description
  * Use this method to detect the type of the object given.
  *
  * Returns the type of the object given as a character code. Returns false,
  * if unknown or unsupported objcet type.
  *
  * = Returns
  * _One of the following:_
  * - 'a': Array
  * - 'h': Hash (Generic Object)
  * - 'd': Date
  * - 'b': Boolean (true/false)
  * - 'n': Number (integers and floats)
  * - 's': String
  * - '~': Null
  * - '-': Undefined
  *
  **/
  type(_obj) {
    return this.typeChr(_obj);
  }

  /* = Description
  * Returns an URI-encoded string representation of all the changed values to
  * synchronize to the server.
  *
  * = Returns
  * An encoded string representation of values to synchronize.
  **/
  sync() {
    const _response = [Session.sesKey, {}, []];
    const _error = Transporter._clientEvalError;

    if (_error) {
      _response[2].push({'err_msg': _error});
    }

    // new implementation, symmetric with the server response format
    if (this.tosync.length > 0) {
      _response[1].set = [];
      const _syncValues = _response[1].set;
      const _values = this.values;
      const _tosync = this.tosync;
      let i = _tosync.length;
      while (i--) {
        const _id = _tosync.shift();
        const _value = _values[_id].toSync();
        _syncValues.push([_id, _value]);
      }
    }
    return this.encodeObject(_response);
  }

  encode(_obj) {
    return this.encodeObject(_obj);
  }

  decode(_obj) {
    return this.decodeObject(_obj);
  }

  clone(_obj) {
    return this.cloneObject(_obj);
  }

}

module.exports = new ValueManager();
