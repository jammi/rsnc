HHTRating = HControl.extend
  componentName: 'hht_rating'
  markupElemNames: [ 'rate1', 'rate2', 'rate3', 'rate4', 'rate5' ]

  controlDefaults: HControlDefaults.extend
    icon: 'energy'
    valueKey: false

  die: ->
    for _item in @_clickItems
      Event.observe( _item[0], 'click', _item[1] )
    @base()

  constructor: ( _rect, _parent, _options ) ->
    @base( _rect, _parent, _options )
    @setEnabled( false ) if @options.valueKey
    @_clickItems = []
    if @enabled
      @_clickItems = [
        [ @markupElemIds.rate1, => @_clickValue( 1 ) ]
        [ @markupElemIds.rate2, => @_clickValue( 2 ) ]
        [ @markupElemIds.rate3, => @_clickValue( 3 ) ]
        [ @markupElemIds.rate4, => @_clickValue( 4 ) ]
        [ @markupElemIds.rate5, => @_clickValue( 5 ) ]
      ]
      for _item in @_clickItems
        Event.observe( _item[0], 'click', _item[1] )

  _clickValue: ( _value ) ->
    if _value == @value
      @setValue( 0 )
    else
      @setValue( _value )

  refreshValue: ->
    _value = @value
    if @options.valueKey? and @typeChr( _value ) == 'h'
      _value = _value[@options.valueKey]
    @toggleCSSClass( @markupElemIds.rate1, 'selected', ( _value >= 1 ) )
    @toggleCSSClass( @markupElemIds.rate2, 'selected', ( _value >= 2 ) )
    @toggleCSSClass( @markupElemIds.rate3, 'selected', ( _value >= 3 ) )
    @toggleCSSClass( @markupElemIds.rate4, 'selected', ( _value >= 4 ) )
    @toggleCSSClass( @markupElemIds.rate5, 'selected', ( _value >= 5 ) )

  _formatIcon: ->
    HHT_ICONS.get( @options.icon )
