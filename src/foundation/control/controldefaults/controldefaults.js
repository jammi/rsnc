const HClass = require('core/class');

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

module.exports = HControlDefaults;
