HValueView = HView.extend

  refreshOnValueChange: true

  constructor: (_rect, _parent, _options) ->
    _options = {} unless _options?
    _options = @viewDefaults.extend( _options ).new( @ )

    if _options.valueObj?
      _options.valueObj.bind( @ )

    if _options.bind?
      if @typeChr( _options.bind ) == 's'
        _valueId = _options.bind
        _valueObj = @getValueById( _valueId )
        if _valueObj
          _valueObj.bind( @ )
      else
        _options.bind.bind( @ )

    unless @valueObj?
      @valueObj = HDummyValue.nu()

    if @typeChr( @value ) in [ '-', '~' ] and _options.value?
      @setValue( _options.value )
    @base( _rect, _parent, _options )

  refresh: ->
    @base()
    if @drawn and @refreshOnValueChange
      @refreshValue()
    @

  refreshValue: ->
    true

HValueView.implement( HValueResponder );