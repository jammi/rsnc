HHTValidator = HControl.extend
  componentName: 'hht_validator'
  markupElemNames: [ 'icon' ]
  
  formatCorrectIcon: ->
    HHT_ICONS.get( 'correct' )

  formatErrorIcon: ->
    HHT_ICONS.get( 'error' )
  
  refreshValue: ->
    if @markupElemIds?
      if @value in [ 1, true ]
        ELEM.delClassName( @elemId, 'error' )
        ELEM.addClassName( @elemId, 'correct' )
        ELEM.setHTML( @markupElemIds.icon, @formatCorrectIcon() )
      else if @value in [ 0, false ]
        ELEM.delClassName( @elemId, 'correct' )
        ELEM.addClassName( @elemId, 'error' )
        ELEM.setHTML( @markupElemIds.icon, @formatErrorIcon() )
      else
        ELEM.delClassName( @elemId, 'correct' )
        ELEM.delClassName( @elemId, 'error' )
        ELEM.setHTML( @markupElemIds.icon, '' )
      ELEM.setStyle( @markupElemIds.icon, 'left', ( ( @rect.width - 20 ) / 2 ) + 'px' )
      ELEM.setStyle( @markupElemIds.icon, 'top', ( ( @rect.height - 20 ) / 2 ) + 'px' )
    true
