const HClass = require('core/class');

/** = Description
  * Define default HView setting here. Will be used, when no or invalid constructor
  * options are supplied.
  **/
class HViewDefaults extends HClass.mixin({
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
  value: 0,
  /**  Use utc time as default
  **/
  useUTC: false
}) {}

module.exports = HViewDefaults;
