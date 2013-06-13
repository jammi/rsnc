
/*** = Description
  ** HTextArea is a scrollable multi-line area that displays editable plain
  ** text.
  **
  ** = Instance variables
  ** +type+::   '[HTextArea]'
  ** +value+::  The string that is currently held by this object.
  ***/
var//RSence.Controls
HTextArea = HTextControl.extend({
  multiline: true,
  defaultKey: function(){return false;} // bypass handler for return presses
});
