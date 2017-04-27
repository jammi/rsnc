
const HClass = require('core/class');
const HView = require('foundation/view');
const HValueResponder = require('foundation/valueresponder');
const HEventResponder = require('foundation/eventresponder');
const HDummyValue = require('foundation/value/dummyvalue');
const EVENT = require('foundation/eventmanager');
const {ELEM} = require('core/elem');

/** = Description
  * Define default setting here. Will be used, when no or invalid constructor
  * options are supplied.
  **/
class HControlDefaults extends HClass.mixin({
  /* Whether or not to draw when constructed.
  */
  autoDraw: true,

  /* The default label. A label is the "visual value" of a component that
  * operates on a "hidden" value.
  **/
  label: '',

  /* The default initial visibility of the component.
  **/
  visible: true,

  /* The default initial event responders to register to a component.
  *  By default no events are enabled.
  **/
  events: null,

  /* The default initial value of the component.
  **/
  value: 0,

  /* The default initial enabled state of the component.
  **/
  enabled: true,

  /* The default initial active state of the component.
  **/
  active: false,

  /* The default initial minimum value of the component.
  **/
  minValue: -2147483648,

  /* The default initial maximum value of the component.
  **/
  maxValue: 2147483648,

  /* The default focus value of the component.
  **/
  focusOnCreate: false,

  /*  Use utc time as default
  **/
  useUTC: false

}) {
  constructor() {
    super();
    if (typeof this.events !== 'object') {
      this.events = {};
    }
  }
}

/** = Description
  * The foundation class for all active visual components that
  * implement events and values.
  *
  * Extend +HControl+ to suit your needs. See any component
  * for extension reference.
  *
  **/
class HControl extends HView.mixin(HValueResponder, HEventResponder, {

  isCtrl: true,

/** A flag: when true, calls the +refreshValue+ method whenever
  * +self.value+ is changed.
  **/
  refreshOnValueChange: true,

/** The event object structure that specifies which events to listen to.
  **/
  events: null,

/** The enabled/disabled flag. See setEnabled.
  **/
  enabled: null,

/** The current value of a component. See setValue.
  **/
  value: null,

/** The current HValue compatible object. Do not set directly.
  * Holds reference to the bound HValue instance.
  * Set with HValue.bind.
  **/
  valueObj: null,

/** The minimum numeric value allowed, when the component
  * utilizes value ranges. See setValueRange
  **/
  minValue: null,

/** The maximum allowed value, when the component
  * utilizes value ranges. See setValueRange
  **/
  maxValue: null,

/** A boolean value that shows whether this control is currently
  * active or not. Control gets active when the user clicks on it.
  **/
  active: null,

/** -- Use this object to specify class-specific default settings. ++
  * The controlDefaults is a HControlDefaults object that is extended
  * in the constructor with the options block given. The format of
  * it is an Object.
  **/
  controlDefaults: HControlDefaults
}) /* end of mixin, class begins */ {

/** = Description
  * The constructor of HControl implements the same model as HView,
  * but accepts a third parameter: the options object, that contain
  * optional properties, like the value and events.
  *
  * = Parameters
  * +_rect+::     An instance of +HRect+, defines the position and size of views.
  *               It can be also defined with an array, see below.
  * +_parent+::   The parent instance this instance will be contained within.
  *               A valid parent can be another HView compatible instance,
  *               an HApplication instance, a HControl or a similar extended
  *               HView instance. The origin of the +_rect+ is the same as the
  *               parent's offset. For HApplication instances, the web browser's
  *               window's left top corner is the origin.
  * +_options+:: Optional, all other parameters as object attributes.
  *              Defaults to an instance of +HControlDefaults+, see controlDefaults
  *
  * == The +_rect+ dimensions as arrays
  * Instead of an instance of +HRect+, dimensions can also be supplied as arrays.
  * The array length must be either 4 or 6. If the length is 4, the dimensions are
  * specified as follows: +[ x, y, width, height ]+. Note that this is different
  * from the construction parameters of +HRect+ that takes the coordinates as two
  * points, like: +( left, top, right, bottom )+.
  * Arrays with 6 items are a bit more complex (and powerful) as they can specify
  * the flexible offsets too.
  *
  * === The array indexes for a +_rect+ configured as an 4-item array:
  * Always left/top aligned, all items must be specified.
  * Index::            Description
  * +0+::              The X-coordinate (measured from the parent's left edge)
  * +1+::              The Y-coordinate (measured from the parent's top edge)
  * +2+::              The width.
  * +3+::              The height.
  *
  * === The array indexes a +_rect+ configured as an 6-item array:
  * Can be any configuration of left/top/right/bottom alignment and supports
  * flexible widths. At least 4 items must be specified.
  * Index::            Description
  * +0+::              The left-aligned X-coordinate or +null+ if the view is
  *                    right-aligned and using a right-aligned X-coordinate at
  *                    index +4+ as well as the width specified at index +2+.
  * +1+::              The top-aligned Y-coordinate or +null+ if the view is
  *                    bottom-aligned and using a right-aligned X-coordinate at
  *                    index +5+ as well as the height specified at index +3+.
  * +2+::              The width, if only one X-coordinate specifies the
  *                    position (at indexes +0+ or +4+).
  *                    If both X-coordinates (at indexes +0+ and +4+) are
  *                    specified, the width can be specified with a +null+ for
  *                    automatic (flexible) width. If the width is specified,
  *                    it's used as the minimum width.
  * +3+::              The height, if only one Y-coordinate specifies the
  *                    position (at indexes +1+ or +5+).
  *                    If both Y-coordinates (at indexes +1+ and +5+) are
  *                    specified, the height can be specified with a +null+ for
  *                    automatic (flexible) height. if the height is specified,
  *                    it's used as the minimum height.
  * +4+::              The right-aligned X-coordinate or +null+ if the view is
  *                    left-aligned and using a left-aligned X-coordinate at
  *                    index +0+ as well as the width specified at index +2+.
  * +5+::              The bottom-aligned Y-coordinate or +null+ if the view is
  *                    top-aligned and using a top-aligned X-coordinate at
  *                    index +1+ as well as the height specified at index +3+.
  * == Usage examples of +_rect+:
  * Specified as two instances of +HPoint+,
  * x: 23, y: 75, width: 200, height: 100:
  *  HRect.nu( HPoint.nu( 23, 75 ), HPoint.nu( 223, 175 ) )
  *
  * The same as above, but without +HPoint+ instances:
  *  HRect.nu( 23, 75, 223, 175 )
  *
  * The same as above, but with an array as the constructor
  * parameter for +HRect+:
  *  HRect.nu( [ 23, 75, 223, 175 ] )
  *
  * The same as above, but with an array instead of a +HRect+ instance:
  *  [ 23, 75, 200, 100 ]
  *
  * The same as above, but with a 6-item array:
  *  [ 23, 75, 200, 100, null, null ]
  *
  * The same as above, but aligned to the right instead of left:
  *  [ null, 75, 200, 100, 23, null ]
  *
  * The same as above, but aligned to the right/bottom edges:
  *  [ null, null, 200, 100, 23, 75 ]
  *
  * The same as above, but aligned to the left/bottom edges:
  *  [ 23, null, 200, 100, null, 75 ]
  *
  * Flexible width (based on the parent's dimensions):
  *  [ 23, 75, null, 100, 23, null ]
  *
  * Flexible height (based on the parent's dimensions):
  *  [ 23, 75, 200, null, null, 75 ]
  *
  * Flexible width and height (based on the parent's dimensions):
  *  [ 23, 75, null, null, 23, 75 ]
  *
  * Flexible width and height, but limited to a minimum width
  * of 200 and a minimum height of 100 (based on the parent's dimensions):
  *  [ 23, 75, 200, 100, 23, 75 ]
  *
  * == The +_options+ Object, all options are optional and default to what's
  * defined in +controlDefaults+.
  * Key::         Description
  * +value+::     The initial value of the component. It's type and meaning
  *               differs between components.
  * +valueObj+::  An HValue instance to bind immediately. The value of the
  *               HValue instance overrides the +value+ option.
  * +label+::     The label of the component. It's usually a text (or html)
  *               String. Its meaning differs between components.
  *               See +#setLabel+ and +#refreshLabel+
  * +visible+::   A Boolean value defining the initial visibility of the
  *               component. A true value means visible and false means
  *               hidden.
  * +events+::    An Object containing the events to listen to.
  *               See setEvents and EVENT
  * +enabled+::   A Boolean value defining the initial enabled -state
  *               of the component. Set to false to initially disable the
  *               component. See setEnabled
  * +active+::    A Boolean value defining the initial active (clicked
  *               or focused) state of the component.
  * +minValue+::  A Number for components utilizing value ranges.
  *               See setValueRange
  * +maxValue+::  A Number for components utilizing value ranges.
  *               See setValueRange
  *
  *
  **/
  constructor(_rect, _parent, _options) {
    if (!this.isntObject(_options)) {
      _options = {};
    }
    _options = new this.controlDefaults.mixin(_options)(this);
    if (this.isinherited) {
      super(_rect, _parent, _options);
    }
    else {
      this.isinherited = true;
      super(_rect, _parent, _options);
      this.isinherited = false;
    }

    const _isValueRange = (_options.minValue || _options.maxValue);
    const _events = _options.events;

    if (_isValueRange) {
      this.minValue = _options.minValue;
      this.maxValue = _options.maxValue;
    }

    this.setEvents(_events);
    this.setEnabled(_options.enabled);

    // The traditional HValue instance to pass in options to be bound:
    if (_options.valueObj) {
      _options.valueObj.bindResponder(this);
    }

    // The newer HValue instance to pass in options to be bound:
    // - Same as in guitree syntax, also allows it to be just a valueId
    if (_options.bind) {
      if (this.isString(_options.bind)) {
        const _valueId = _options.bind;
        const _valueObj = this.getValueById(_valueId);
        if (_valueObj) {
          _valueObj.bind(this);
        }
      }
      else if (this.isObject(_options.bind)) {
        _options.bind.bind(this);
      }
    }

    // If none of the above value bindings exist, use a lighter-weight
    // dummy valueObj instead
    if (this.isntObject(this.valueObj)) {
      this.valueObj = new HDummyValue();
    }

    if (this.isNullOrUndefined(this.value) && this.isntNullOrUndefined(_options.value)) {
      this.setValue(_options.value);
    }
    if (_isValueRange) {
      this.setValueRange(this.value, _options.minValue, _options.maxValue);
    }
    if (!this.isinherited && this.options.autoDraw) {
      this.draw();
    }
  }

/** = Description
  * The destructor of +HControl+ instances.
  * Releases events and values before passing through to the base HView.die.
  * Extend it, you you allocate new instance members that need to be
  * deallocated upon destruction.
  *
  **/
  die(_delay) {
    if (this.valueObj) {
      this.valueObj.releaseResponder(this);
      this.valueObj = null;
    }
    EVENT.unreg(this);
    super(_delay);
  }

/** = Description
  * Assigns the object a new value range. Used for sliders, steppers etc. Calls
  * setValue with the value given.
  *
  * = Parameters
  * +_value+::    The new value to be set to the component's
  *               HValue compatible instance.
  *
  * +_minValue+:: The new minimum value limit. See minValue.
  *
  * +_maxValue+:: The new maximum value limit. See maxValue.
  *
  * = Returns
  * +self+
  *
  **/
  setValueRange(_value, _minValue, _maxValue) {
    this.minValue = _minValue;
    this.maxValue = _maxValue;
    if (this.isNumber(_value)) {
      _value = (_value < _minValue) ? _minValue : _value;
      _value = (_value > _maxValue) ? _maxValue : _value;
      this.setValue(_value);
    }
    return this;
  }

/** = Description
  * Called when the +self.value+ has been changed. By default
  * tries to update the value element defined in the theme of
  * the component. Of course, the HControl itself doesn't
  * define a theme, so without a theme doesn't do anything.
  *
  * = Returns
  * +self+
  *
  **/
  refreshValue() {
    if (this.markupElemIds) {
      if (this.markupElemIds.value) {
        ELEM.setHTML(this.markupElemIds.value, this.value);
      }
    }
    return this;
  }

/** = Description
  * Called mostly internally whenever a property change requires usually visual
  * action. It's called by methods like setLabel and setValue.
  * Extends HView.refresh. The boolean properties refreshOnValueChange and
  * refreshOnLabelChange control whether refreshValue or refreshLabel
  * should be called. It's used as-is in most components. If you implement
  * your class extension with properties similar to value or label,
  * you are advised to extend the refresh method.
  *
  * = Returns
  * +self+
  *
  **/
  refresh() {
    super();
    if (this.drawn) {
      if (this.refreshOnValueChange) {
        this.refreshValue();
      }
    }
    return this;
  }
}
