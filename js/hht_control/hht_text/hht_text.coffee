HHTText = HValueView.extend
  componentName: 'hht_text'

  viewDefaults: HViewDefaults.extend
    textSelectable: true
    valueKey: false
    convertLineBreaks: false

  constructor: ( _rect, _parent, _options ) ->
    @base( _rect, _parent, _options )
    @setStyle( 'overflow-y', 'auto' )
    if @options.fontSize?
      @setStyle( 'font-size', @options.fontSize + 'px' )
      @setStyle( 'line-height', ( @options.fontSize + 7 ) + 'px' )
    if @options.textAlign?
      @setStyle( 'text-align', @options.textAlign )
    true

  refreshValue: ->
    if @markupElemIds?
      _value = @value
      if @options.valueKey? and @typeChr( _value ) == 'h'
        _value = _value[@options.valueKey]
      if @typeChr( _value ) == 'a'
        _value = _value.join( "\n" )
      if @typeChr( _value ) != 's'
        _value = ''
      if @options.convertLineBreaks
        ELEM.setHTML( @elemId, _value.split( "\n" ).join( "<br/>" ) )
      else
        ELEM.setHTML( @elemId, _value )
    true