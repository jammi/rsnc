HHTVertical = HControl.extend
  componentName: 'hht_vertical'
  defaultEvents:
    resize: true
  controlDefaults: HControlDefaults.extend
    adjustHeight: true

  constructor: ( _rect, _parent, _opts ) ->
    @items = []
    @itemCount = 0
    @itemsHeight = 0
    @base( _rect, _parent, _opts )
    if @options.adjustHeight
      @setStyle( 'overflow-y', 'auto' )
    true

  resize: ->
    return true if @options.adjustHeight == true
    @itemsHeight = 0
    for _item, i in @items
      _item.setRect( @_calcRect( i ) )
      _item.drawRect()
      @itemsHeight += _item.rect.height
    true

  _calcRect: ( _index ) ->
    _height = ELEM.getSize( @elemId )[1]
    _itemHeight = Math.floor( _height / @itemCount )
    [ 0, @itemsHeight, null, _itemHeight, 0, null ]

  adjustHeight: ->
    ELEM.flush()
    @itemsHeight = 0
    for _item in @items
      if @options.adjustHeight == true and _item.adjustHeight instanceof Function
        _item.rect.top = @itemsHeight
        _item.adjustHeight()
      @itemsHeight += _item.rect.height
    ELEM.flush()
    HSystem._updateFlexibleRects()
    @itemsHeight

  addItem: ( _class, _opts, _w, _h ) ->
    _index = @items.length + 1
    @itemCount += 1
    _item = _class.new( @_calcRect( _index ), @, _opts )
    if @options.adjustHeight == true and _item.adjustHeight instanceof Function
      _item.adjustHeight()
    @itemsHeight += _item.rect.height
    @items.push( _item )
    @resize()
