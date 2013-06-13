
/*** = Description
  ** HStringView is a view component that represents a non-editable line of text.
  ** Commonly, stringview is used as a label to control elements
  ** that do not have implicit labels (text fields, checkboxes and radio buttons, and menus).
  ** Some form controls automatically have labels associated with them (press buttons)
  ** while most do not have (text fields, checkboxes and radio buttons, and sliders etc.).
  **
  ** = Instance variables
  ** +type+::   '[HStringView]'
  ** +value+::  The string that this string view displays when drawn.
  ***/
var HStringView, HLabel;

(function(){
  var _HStringViewInterface = {

    componentName: "stringview",

    // allows text selection
    textSelectable: true,

    optimizeWidthOnRefresh: true,

  /** = Description
    * The refreshLabel of HStringView sets a tool tip.
    * Applied by the setLabel method and the label attribute of options.
    *
    **/
    refreshLabel: function() {
      if(this.markupElemIds && this.markupElemIds.value) {
        if( this.value !== undefined ){
          this.setAttr( 'title', this.label );
        }
        else {
          this.setHTML( this.label );
        }
      }
    },

    labelPadding: 0,
    optimizeWidth: function(){
      var _labelWidth = this.stringWidth((this.value || this.label));
      _labelWidth += this.labelPadding;
      if( this.rect.width !== _labelWidth ){
        this.rect.setWidth(_labelWidth);
        this.drawRect();
      }
    },

    extDraw: function(){
      this.markupElemIds.value = this.elemId;
      if(this.options.noWrap){this.setCSSClass( 'nowrap' );}
    }

  };

  HLabel = HView.extend( _HStringViewInterface );
  HStringView = HControl.extend( _HStringViewInterface ).extend({
    defaultEvents: {
      contextMenu: true
    },

  /** = Description
    * HStringView allows the default contextMenu action.
    *
    **/
    contextMenu: function(){
      return true;
    }
  });

})();
