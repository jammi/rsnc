HHTSymbolPicker = HControl.extend
  componentName: 'hht_symbol_picker'

  defaultEvents:
    click: true

  controlDefaults: HControlDefaults.extend
    symbols: [ 'dot', 'rect', 'star', 'competition', 'studies', 'work', 'travel', 'running', 'ball', 'strength' ]

  click: ( x, y ) ->
    return unless @enabled
    for _item, i in @_items
      if @inElem( _item, x, y )
        @setValue( @options.symbols[i] )
    true

  _makeItem: ( _symbol, _left ) ->
    ELEM.make( @elemId, 'div',
      html: HHT_ICONS.get( _symbol )
      classes: [ 'item' ]
      styles:
        left: _left + 'px'
    )

  refreshValue: ->
    _index = @options.symbols.indexOf( @value )
    for _elemId, i in @_items
      _selected = ( i == _index )
      @toggleCSSClass( _elemId, 'selected', _selected )

  drawSubviews: ->
    @_items = []
    _left = 0
    for _symbol in @options.symbols
      @_items.push @_makeItem( _symbol, _left )
      _left += 30
    unless @value in @options.symbols
      @setValue( @options.symbols[0] ) 
    true