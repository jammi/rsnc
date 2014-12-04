HHTColorPicker = HControl.extend
  componentName: 'hht_color_picker'

  defaultEvents:
    click: true

  controlDefaults: HControlDefaults.extend
    colors: [ 10, 0, 13, 5, 14, 11, 9, 15, 16, 6, 17 ]

  click: ( x, y ) ->
    return unless @enabled
    for _item, i in @_items
      if @inElem( _item, x, y )
        @toggleCSSClass( _item, 'selected', true )
        @setValue( @options.colors[i] )
      else
        @toggleCSSClass( _item, 'selected', false )
    true

  _makeItem: ( _color, _left ) ->
    ELEM.make( @elemId, 'div',
      classes: [ 'item' ]
      styles:
        left: _left + 'px'
        backgroundColor: _color
    )

  refreshValue: ->
    if @_selItem?
      ELEM.del( @_selItem )
      @_selItem = null
    _index = @options.colors.indexOf( @value )
    if _index > -1
      @_selItem = ELEM.make( @_items[_index], 'div',
        classes: [ 'check' ]
        html: HHT_ICONS.get( 'correct' )
      )

  drawSubviews: ->
    @_items = []
    _left = 0
    for _color in @options.colors
      @_items.push @_makeItem( HHT_COLORS.get( _color ), _left )
      _left += 30
    unless @value >= 0
      @setValue( 0 ) 
    true