HHTSvg = HControl.extend
  controlDefaults: HControlDefaults.extend
    value: ''

  refreshValue: ->
    ELEM.setHTML( @elemId, @value )
