HSearchField = HTextControl.extend
  componentName: 'searchfield'
  markupElemNames: ['help'].concat( HTextControl.prototype.markupElemNames )
  controlDefaults: HTextControl.prototype.controlDefaults.extend
    helpText: 'Search...'

  textFocus: ->
    @setStyleOfPart( 'help', 'visibility', 'hidden' )
    @base()

  refreshValue: ->
    if @typeChr( @value ) == 's' and @value.length > 0
      @setStyleOfPart( 'help', 'visibility', 'hidden' )
    @base()
