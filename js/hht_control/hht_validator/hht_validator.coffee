HHTValidator = HValueView.extend
  componentName: 'hht_validator'
  markupElemNames: [ 'icon' ]
  
  _formatCorrectIcon: ->
    HHT_ICONS.get( 'correct' )

  _formatErrorIcon: ->
    HHT_ICONS.get( 'error' )
  
  refreshValue: ->
    if @markupElemIds?
      if @value in [ 1, true ]
        ELEM.delClassName( @elemId, 'error' )
        ELEM.addClassName( @elemId, 'correct' )
        ELEM.setHTML( @markupElemIds.icon, @_formatCorrectIcon() )
      else if @value in [ 0, false ]
        ELEM.delClassName( @elemId, 'correct' )
        ELEM.addClassName( @elemId, 'error' )
        ELEM.setHTML( @markupElemIds.icon, @_formatErrorIcon() )
      else
        ELEM.delClassName( @elemId, 'correct' )
        ELEM.delClassName( @elemId, 'error' )
        ELEM.setHTML( @markupElemIds.icon, '' )
    true
