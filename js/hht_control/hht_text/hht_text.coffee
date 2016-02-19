HHTText = HControl.extend
  componentName: 'hht_text'

  controlDefaults: HControlDefaults.extend
    textSelectable: true
    valueKey: false

  constructor: ( _rect, _parent, _options ) ->
    @base( _rect, _parent, _options )
    @setStyle( 'overflow-y', 'auto' )

  refreshValue: ->
    if @markupElemIds?
      _value = @value
      if @options.valueKey? and @typeChr( _value ) == 'h'
        _value = _value[@options.valueKey]
      if @typeChr( _value ) in [ '~', '-' ]
        _value = ''
      else
      ELEM.setHTML( @elemId, _value )
    true