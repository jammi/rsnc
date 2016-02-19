HHTSearchField = HHTTextControl.extend
  componentName: 'hht_searchfield'
  markupElemNames: [ 'value', 'help', 'icon' ]

  controlDefaults: HHTTextControl.prototype.controlDefaults.extend
    showIcon: true

  escKey: ->
    @setValue( '' )
    @setTextFieldValue( @value, true )
    @refreshValue()
    true

  formatIcon: ->
    if @options.showIcon == true
      HHT_ICONS.get( 'search' )
    else
      ''
