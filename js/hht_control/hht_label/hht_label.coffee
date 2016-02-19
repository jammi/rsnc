HHTLabel = HControl.extend
  componentName: 'hht_label'
  markupElemNames: [ 'value' ]

  controlDefaults: HControlDefaults.extend
    textSelectable: false
    valueKey: false
    prefix: ""
    suffix = ""

  constructor: (_rect, _parent, _options) ->
    @base( _rect, _parent, _options )
    if _options.style?
      ELEM.setStyles( @markupElemIds.value, _options.style )

  adjustWidth: ->
    _width = @stringWidth( ELEM.getHTML( @markupElemIds.value ), null, @markupElemIds.value ) + 5
    @rect.setWidth( _width )
    @drawRect()
    _width

  refreshValue: ->
    if @markupElemIds?
      _value = @value
      if @options.valueKey? and @typeChr( _value ) == 'h'
        _value = _value[@options.valueKey]
      if @typeChr( _value ) in [ '~', '-' ]
        _value = ''
      else
      if @options.prefix
        _value = @options.prefix + _value
      if @options.suffix
        _value = _value + @options.suffix
      ELEM.setHTML( @markupElemIds.value, _value )
    true