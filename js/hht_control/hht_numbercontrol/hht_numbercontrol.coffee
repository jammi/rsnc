HHTNumberControl = HHTTextControl.extend

  fieldType: 'number'

  extDraw: ->
    ELEM.setStyle( @markupElemIds.help, 'right', '30px' )

  getNumber: ->
    _value = parseInt( @value )
    if isNaN( _value )
      return 0
    else
      return _value
