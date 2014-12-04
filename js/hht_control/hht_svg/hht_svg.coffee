HHTSvg = HValueView.extend
  refreshValue: ->
    _value = @value
    unless @typeChr( _value ) == 's'
      _value = ''
    ELEM.setHTML( @elemId, _value )
