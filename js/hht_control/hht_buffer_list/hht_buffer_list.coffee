HHTBufferList = HHTList.extend
  componentName: 'hht_buffer_list'
  controlDefaults: HControlDefaults.extend
    buffer: 10
    rowHeight: 60
    allowUnselect: true
    emptyText: ''
    emptyTextStyle:
      fontSize: '16px'
      textAlign: 'center'
    emptyTextAlign: 'top' #top, middle, bottom
  defaultEvents:
    resize: true
  
  resize: ->
    @base()
    @calculateScrollPosition()

  _listLength: ->
    @options.values.list_length.value

  changePosition: ( _value ) ->
    if @disableScrollUpdate
       @disableScrollUpdate = false
       return false
    unless _value instanceof Array
      return false 
    _firstRow = _value[0]
    if _firstRow != @calculatedFirstRow
      ELEM.get( @elemId ).scrollTop = _firstRow * @options.rowHeight
    
  calculateScrollPosition: ->
    _scrollTop = ELEM.getScrollPosition( @elemId )[1]
    _scrollHeight = ELEM.getScrollSize( @elemId )[1]
    _height = ELEM.getSize( @elemId )[1]
    _topRatio = _scrollTop / _scrollHeight
    _bottomRatio = ( _scrollTop + _height ) / _scrollHeight
    _rowsTotal = _scrollHeight / @options.rowHeight
    _firstRow = Math.round( _topRatio * _rowsTotal )
    _lastRow = Math.round( _bottomRatio * _rowsTotal )
    _rowsVisible = _lastRow - _firstRow
    @position = [ _firstRow, _lastRow, _rowsVisible ]
    @calculatedFirstRow = _firstRow
    if ( @minIndex > 0 and @position[0] < @minIndex + @options.buffer ) or 
       ( @maxIndex < @_listLength() - 1 and @position[1] > @maxIndex - @options.buffer + 1 )
      @options.values.list_scroll.set( @position )
    @drawItems()
    true
  
  setDate: (_value) ->
    @disableScrollUpdate = true
    if @options.dateValue?
      @options.dateValue.set( _value )

  removeItems: ( part ) ->
    _removeViews = []
    for _itemView in @listItems
      if _itemView.value.part == part
        _removeViews.push( _itemView )
    for _itemView in _removeViews
      @removeItemView( _itemView )
    _removeItems = []  
    for _item in @cache
      if _item.part == part
        _removeItems.push( _item )
    for _item in _removeItems
      @removeFromCache( _item )

  setItems: ( _itemsIn ) ->
    return unless @typeChr( _itemsIn ) == 'a' and _itemsIn.length == 2
    return if not @subviewsDrawn and _itemsIn[0] in @partReady

    @calculateScrollPosition() unless @position?

    @removeItems( _itemsIn[0] )
    for _item in _itemsIn[1]
      _item.part = _itemsIn[0]
      @cache.push( _item )
    @drawItems()
    @partReady.push( _itemsIn[0] )

  removeFromCache: ( rmItem ) ->
    _cache = @cache
    for item,i in @cache
      if item.index == rmItem.index
        return @cache.splice( i, 1 )
        
  drawItems: ->
    _removeViews = []
    _minIndex = @_listLength() - 1
    _maxIndex = -1
    for _itemView in @listItems
      if _itemView.value.index < @position[0] - @options.buffer * 4 or _itemView.value.index > @position[1] + @options.buffer * 4
        _removeViews.push( _itemView )
      _minIndex = Math.min( _minIndex, _itemView.value.index )
      _maxIndex = Math.max( _maxIndex, _itemView.value.index )
    for _itemView in _removeViews
      @cache.push( _itemView.value )
      @removeItemView( _itemView )

    _addItems = []  
    for _item in @cache
      if _item.index >= @position[0] - @options.buffer and _item.index <= @position[1] + @options.buffer
        _addItems.push( _item )
      _minIndex = Math.min( _minIndex, _item.index )
      _maxIndex = Math.max( _maxIndex, _item.index )
    for _item in _addItems
      @createItemView( _item )
      @removeFromCache( _item )
    if @_listLength() == 0 and not @emptyView?
      @emptyView = @drawEmptyView()
    if @_listLength() > 0 and @emptyView?
      @emptyView.die()
      @emptyView = null
    @minIndex = _minIndex
    @maxIndex = _maxIndex
    ELEM.flush()

  removeItemView: ( rmItemView ) ->
    for itemView, i in @listItems
      if itemView == rmItemView
        rmItemView.die()
        return @listItems.splice( i, 1 )

  createItemView: ( _item )->
    top = _item.index * @options.rowHeight
    height = @options.rowHeight
    _scrollTop = ELEM.get( @elemId ).scrollTop
    _itemId = _item.id

    if _itemId
      _itemView = @createItem( [ 0, top, null, height, 0, null], _item, _item.index )
    else
      _itemView = @createMetaItem( [ 0, top, null, height, 0, null], _item, _item.index )
    if @isSelected( _itemView )
      _itemView.setSelected( true )
      if @options.focusOnCreate == true
        @activeItem( _itemView )
    @listItems.push( _itemView )

  createItem: ( _rect, _value, _index ) ->
    @base( _rect, _value, _index )

  createMetaItem: ( _rect, _value, _index ) ->
    if @options.metaItemClass?
      _itemClass = @options.metaItemClass
      _itemOpts = @options.metaItemOpts
      _itemOpts = {} unless _itemOpts?
      _itemOpts['value'] = _value
      _itemOpts['theme'] = @theme
      _itemOpts['index'] = _index
      _itemClass.new( _rect, @, _itemOpts )
    else
      @createItem( _rect, _value, _index )

  getLength: ->
    @options.values.list_length.value

  drawSubviews: ->
    @base()
    @minIndex = -1
    @maxIndex = -1
    @subviewsDrawn = false
    @partReady = []
    @cache = []
    @setLength( @options.values.list_length.value )
    @changePosition( @options.values.list_scroll.value )

    HValueAction.new( @,
      valueObj: @options.values.list_length
      action: 'setLength'
    )
    HValueAction.new( @,
      valueObj: @options.values.list_scroll
      action: 'changePosition'
    )    
    HValueAction.new( @,
      valueObj: @options.values.list_items_1
      action: 'setItems'
    )
    HValueAction.new( @,
      valueObj: @options.values.list_items_2
      action: 'setItems'
    )
    HValueAction.new( @,
      valueObj: @options.values.list_items_3
      action: 'setItems'
    )
    @subviewsDrawn = true
