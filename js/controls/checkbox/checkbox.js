
/*** = Description
  ** Simple checkbox component, toggles the value of
  ** itself between true and false.
  ***/
var//RSence.Controls
HCheckbox = HButton.extend({

  componentName: 'checkbox',

/** Toggles the value checked / unchecked.
  **/
  click: function(){
    this.setValue(!this.value);
  },
/** SetStyle function for HCheckBox
  **/
  setStyle: function(_name,_value,_bypass){
    if(_bypass || !this.markupElemIds.label){
      this.base(_name,_value,_bypass);
    }
    else {
      this.setStyleOfPart('label',_name,_value);
    }
  },

/**Toggles the checked/unchecked css-class status
  according to the trueness of the value.**/
  refreshValue: function(){
    if(this.markupElemIds.control){
      !this.isProduction && console.log('Please update your theme of ',this.componentName,' to current checkbox/radiobutton mode: the cell should be the checked element, not the control part.');
      if(this.value){
        this.setCSSClass('control','checked');
        this.unsetCSSClass('control','unchecked');
      }
      else{
        this.setCSSClass('control','unchecked');
        this.unsetCSSClass('control','checked');
      }
    }
    else{
      if(this.value){this.setCSSClass('checked');}
      else{this.unsetCSSClass('checked');}
    }
  }
});
//-- Alias for some users:++
var//RSence.Controls
HCheckBox = HCheckbox;
