HHTLabel = HValueView.extend
  componentName: 'hht_label'
  markupElemNames: [ 'value' ]

  controlDefaults: HControlDefaults.extend
    textSelectable: false
    valueKey: false
    prefix: ''
    suffix: ''
    color: null
    fontSize: null
    textAlign: null

  constructor: (_rect, _parent, _options) ->
    @base( _rect, _parent, _options )
    if _options.style?
      ELEM.setStyles( @markupElemIds.value, _options.style )
    if _options.color?
      ELEM.setStyle( @markupElemIds.value, 'color', _options.color )
    if _options.fontSize?
      ELEM.setStyle( @markupElemIds.value, 'font-size', _options.fontSize + 'px' )
    if _options.textAlign?
      ELEM.setStyle( @markupElemIds.value, 'text-align', _options.textAlign )

  adjustWidth: ->
    _width = @stringWidth( ELEM.getHTML( @markupElemIds.value ), null, @markupElemIds.value ) + 5
    @rect.setWidth( _width )
    @drawRect()
    _width

  refreshValue: ->
    if @markupElemIds?
      _value = @value
      if @options.valueKey?
        if @typeChr( _value ) == 'h'
          _value = _value[@options.valueKey]
        else
          _value = ''
      unless @typeChr( _value ) in [ 'n', 's' ]
        _value = ''
      if @options.prefix
        _value = @options.prefix + _value
      if @options.suffix
        _value = _value + @options.suffix
      ELEM.setHTML( @markupElemIds.value, _value )
    true