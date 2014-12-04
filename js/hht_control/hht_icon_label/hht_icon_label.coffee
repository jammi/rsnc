HHTIconLabel = HValueView.extend
  componentName: 'hht_icon_label'
  markupElemNames: [ 'icon', 'value' ]

  controlDefaults: HControlDefaults.extend
    textSelectable: false
    icon: false
    color: null
    textSelectable: false
    valueKey: false
    prefix: ''
    suffix: ''

  drawMarkup: ->
    @base()
    if @options.icon
      _data = HHT_ICONS.get( @options.icon, null, null, @options.color )
      ELEM.setHTML( @markupElemIds.icon, _data )
    if @typeChr( @options.style ) == 'h'
      ELEM.setStyles( @markupElemIds.value, @options.style )

  refreshValue: ->
    if @markupElemIds?
      _value = @value
      if @options.valueKey? and @typeChr( _value ) == 'h'
        _value = _value[@options.valueKey]
      if @typeChr( _value ) in [ '~', '-' ]
        _value = ''
      if @options.prefix
        _value = @options.prefix + _value
      if @options.suffix
        _value = _value + @options.suffix
      ELEM.setHTML( @markupElemIds.value, _value )
    true