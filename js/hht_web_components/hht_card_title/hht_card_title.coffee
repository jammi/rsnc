HHTCardTitle = HControl.extend
  componentName: 'hht_card_title'

  controlDefaults: HControlDefaults.extend
    textSelectable: false
    valueKey: false
    prefix: ""
    suffix = ""

  die: ->
    @_delItems()
    @base()

  _delItems: ->
    if @_items?
      for _item in @_items
        ELEM.del( _item )
    @_items = []

  _createLabel: ( _label )->
    ELEM.make( @elemId, 'div', { html: _label, classes: [ 'label' ] } )

  _createIcon: ->
    ELEM.make( @elemId, 'div', { html: HHT_ICONS.get( 'arrow_right' ), classes: [ 'icon' ] } )

  refreshValue: ->
    @_delItems()
    if @markupElemIds?
      _value = @value
      if @options.valueKey? and @typeChr( _value ) == 'h'
        _value = _value[@options.valueKey]
      if @typeChr( _value ) == 'a'
        for _label, i in _value
          @_items.push @_createIcon() if i > 0
          @_items.push @_createLabel( _label )
      else    
        if @options.valueKey? and @typeChr( _value ) == 'h'
          _value = _value[@options.valueKey]
        if @typeChr( _value ) in [ '~', '-' ]
          _value = ''
        if @options.prefix
          _value = @options.prefix + _value
        if @options.suffix
          _value = _value + @options.suffix
        @_items.push @_createLabel( _value )
    true
