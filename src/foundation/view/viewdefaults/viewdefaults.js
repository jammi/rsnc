const HValueResponderDefaults = require('foundation/valueresponder/valueresponderdefaults');

/** = Description
  * Define default HView setting here. Will be used, when no or invalid constructor
  * options are supplied.
  **/
class HViewDefaults extends HValueResponderDefaults.extend({
  /* Whether or not to draw when constructed.
  */
  autoDraw: true,
  /** The default label. A label is the "visual value" of a component that
  * operates on a "hidden" value.
  **/
  label: '',
  /** The default initial visibility of the component.
  **/
  visible: true,
  /** The default value of the component
  **/
  value: null,
  /* The default initial minimum value of the component.
  **/
  minValue: -2147483648,
  /* The default initial maximum value of the component.
  **/
  maxValue: 2147483648,
  /**  Use utc time as default
  **/
  useUTC: false
}) {}

module.exports = HViewDefaults;
