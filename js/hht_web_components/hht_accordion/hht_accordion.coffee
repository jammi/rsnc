HHTAccordion = HControl.extend
  componentName: 'hht_accordion'
  controlDefaults: HControlDefaults.extend
    itemHeight: 40
    value: 0
  defaultEvents:
    resize: true
    
  constructor: (_rect, _parent, _options) ->
    @items = []
    @itemsWidth = 0
    @tabs = []
    @tabOpts = []
    @base( _rect, _parent, _options )
  
  setTitle: ( _index, _title, _color ) ->
    @items[_index].setTitle( _title, _color )

  showButton: ( _index ) ->
    @items[_index].showButton()

  hideButton: ( _index ) ->
    @items[_index].hideButton()

  itemRect: ( _index ) ->
    _height = @options.itemHeight
    if _index <= @value
      [ 0, _index * _height, null, _height, 0, null ]
    else
      [ 0, null, null, _height, 0, (@items.length - _index - 1) * _height ]

  tabRect: ->
    _itemHeight = @options.itemHeight
    _top = (@value + 1) * _itemHeight
    _bottom = ( @items.length - @value - 1 ) * _itemHeight
    [ 0, _top, null, null, 0, _bottom ]
    
  addTab: ( _label, _itemOpts, _class, _tabOpts ) ->
    _itemClass = @options.itemClass
    _itemClass = HHTAccordionItem unless _itemClass?
    _class = HControl unless _class?
    _index = @items.length
    _itemOpts = {} unless _itemOpts?
    _itemOpts['label'] = _label
    _itemOpts['index'] = _index
    @items.push( _itemClass.new( @itemRect( _index ), @, _itemOpts ) )
    @tabs.push( _class )
    _tabOpts = {} unless _tabOpts?
    @tabOpts.push( _tabOpts )
    @setValue( @value )
    true

  setValue: ( _value ) ->
    _oldIndex = @value
    @base( _value )
    _itemHeight = @options.itemHeight
    _contentHeight = ELEM.getSize( @elemId )[1] - @items.length * _itemHeight
    for _item, i in @items
      @toggleCSSClass( _item.elemId, 'selected', ( i == _value ) )
      _item.setRect( @itemRect( i ) )
    #Delete old
    if @tab?
      @tab.die()
      @tab = null
    if _value >= 0 and _value < @tabs.length
      @tab = @tabs[_value].new( @tabRect(), @, @tabOpts[_value] )
    # _top = (_index + 1) * _itemHeight
    # _bottom = ( @items.length - _index - 1 ) * _height
    # @tab = @tabs[_index].new( [ 0, _top, null, null, 0, _bottom ], @, @tabOpts )
    # HSystem._updateFlexibleRects()
    # ELEM.flush()
    true
