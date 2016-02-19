HHTList = HControl.extend
  componentName: 'hht_list'
  controlDefaults: HControlDefaults.extend
    buffer: 10
    rowHeight: 60
    itemClass: HHTListItem
    selectByReturn: false
    sortBy: false
    searchBy: false
    allowUnselect: true
    allowMulti: false
    emptyText: ''
    emptyTextStyle:
      fontSize: '16px'
      textAlign: 'center'
    emptyTextAlign: 'top' #top, middle, bottom
  defaultEvents:
    keyDown: true
    focus: true

  constructor: (_rect, _parent, _options ) ->
    @selectedIndex = false
    @listItems = []
    @base( _rect, _parent, _options )
    if @typeChr( @options.items ) == 'a'
      @setItems( @options.items )
    else if @options.items?
      HValueAction.new( @,
        bind: @options.items
        action: 'setItems'
      )
    @options.items = null

  customOptions: ( _options ) ->
    _options.itemOpts = {} unless _options.itemOpts?
    _options

  extDraw: ->
    @_scrollPosElem = ELEM.make( @elemId )
    ELEM.setCSS( @_scrollPosElem, 'position:absolute;left:0;top:-1px;width:1px;height:1px;' )
    @setStyle( 'overflow-y','auto' )
    ELEM.get( @elemId ).view = @
    Event.observe( @elemId, 'scroll', @scroll )
    true
      
  die: ->
    ELEM.del( @_scrollPosElem )
    _elem = ELEM.get( @elemId )
    delete _elem.view
    Event.stopObserving( _elem, 'scroll' , @scroll )
    @base()
  
  setLength: ( _length ) ->
    ELEM.setStyle( @_scrollPosElem, 'top', ( _length * @options.rowHeight ) + 'px', true )

  getLength: ->
    @items.length
       
  scroll: ( e ) -> # scroll event handler
    _elem = e.target || e.srcElement
    _this = _elem.view
    _this.calculateScrollPosition()
    true

  calculateScrollPosition: ->
    @drawItems()

  setValue: ( _value ) ->
    return false if @value == _value
    @base( _value )
    for _listItem, i in @listItems
      continue unless _listItem?
      _selected = @isSelected( _listItem )
      _listItem.setSelected( _selected )
      @activeItem( _listItem ) if _selected
    true

  keyDown: ( _key ) ->
    return false if @options.allowMulti
    _selectedItem = @getSelectedItem()
    if _selectedItem?
      return @itemKeyDown( _selectedItem, _key )
    else if _key == Event.KEY_UP
      @selLastItem()
      return true
    else if _key == Event.KEY_DOWN
      @selFirstItem()
      return true
    return false

  itemKeyUp: ( _item, _key ) ->
    return false

  itemKeyDown: ( _item, _key ) ->
    return false if @options.allowMulti
    if _key == Event.KEY_UP
      return @selPrevItem( _item )
    else if _key == Event.KEY_DOWN
      return @selNextItem( _item )
    else if _key == Event.KEY_RETURN
      return @setValue( _item.getId() )
    return false

  itemLostActiveStatus: ( _item, _newActive ) ->
    true

  itemGainedActiveStatus: ( _item, _lastActive ) ->
    true

  isSelected: ( _item ) ->
    if @options.isSelected instanceof Function
      return @options.isSelected( _item )
    else if @options.allowMulti and @typeChr( @value ) == 'a'
      for _id in @value
        return true if _item.idMatch( _id )
      return false
    else
      return _item.idMatch( @value )

  getSelectedItem: ->
    for _listItem in @listItems
      return _listItem if _listItem.selected
    return null

  unselectItem: ( _item ) ->
    return unless _item?
    if @options.allowMulti and @typeChr( @value ) == 'a'
      _ids = []
      for _id in @value
        _ids.push( _id ) unless _item.idMatch( _id )
      @setValue( _ids )
    else if _item.idMatch( @value )
      @setValue( 0 )
    true

  selectItem: ( _item ) ->
    return unless _item?
    _itemId = _item.getId()
    if @options.allowMulti
      if @typeChr( @value ) == 'a'
        @setValue( @value.concat( [ _itemId ] ) )
      else
        @setValue( [ @value, _itemId ] )
    else
      @setValue( _itemId )

    _scrollTop = ELEM.getScrollPosition( @elemId )[1]
    _scrollHeight = ELEM.getSize( @elemId )[1]
    _itemTop = ELEM.getPosition( _item.elemId )[1]
    _itemHeight = ELEM.getSize( _item.elemId )[1]
    if _itemTop < _scrollTop
      ELEM.get( @elemId ).scrollTop = _itemTop
    if _itemTop + _itemHeight > _scrollTop + _scrollHeight
      ELEM.get( @elemId ).scrollTop = _itemTop + _itemHeight - _scrollHeight
    true

  selectIndex: ( _index ) ->
    for _listItem in @listItems
      if _listItem.options.index == _index
        if @options.selectByReturn
          @activeItem( _listItem )
        else
          @selectItem( _listItem )
        return true
    return false

  activeItem: ( _item ) ->
    unless @options.disableFocus
      EVENT.changeActiveControl( _item )

  selFirstItem: ->
    return if @listItems.length == 0
    @selectItem( @listItems[0] ) unless @options.selectByReturn
    @activeItem( @listItems[0] )
    true

  selLastItem: ->
    return if @listItems.length == 0
    @selectItem( @listItems[@listItems.length - 1] ) unless @options.selectByReturn
    @activeItem( @listItems[@listItems.length - 1] )
    true

  selPrevItem: ( _last ) ->
    _lastIndex = _last.options.index
    return unless _lastIndex? and _lastIndex > 0
    @selectIndex( _lastIndex - 1 )
    true

  selNextItem:  ( _last ) ->
    _lastIndex = _last.options.index
    return unless _lastIndex? and _lastIndex < @getLength() - 1
    @selectIndex( _lastIndex + 1 )
    true

  drawEmptyView: ->
    return unless @options.emptyText?
    if @options.emptyTextAlign == 'middle'
      _top = @rect.height / 2 - 15
    else if @options.emptyTextAlign == 'bottom'
      _top = @rect.height - 40
    else
      _top = 3
    HHTLabel.new( [ 0, _top, null, 30, 0, null ], @,
      value: @options.emptyText
      style: @options.emptyTextStyle
    )

  drawItems: ->
    _items = @items
    return unless @typeChr( _items ) == 'a'
    _scrollTop = ELEM.getScrollPosition(@elemId)[1]
    _scrollHeight = ELEM.getSize(@elemId)[1]
    _rowHeight = @options.rowHeight
    
    #Delete old ones
    for _listItem, i in @listItems
      continue unless _listItem?
      [_left, _top] = ELEM.getPosition( _listItem.elemId )
      [_width, _height] = ELEM.getSize( _listItem.elemId )
      if _top + _height < _scrollTop - @options.buffer * 4 * _rowHeight or _top > _scrollTop + _scrollHeight + @options.buffer * 4 * _rowHeight
        _listItem.die()
        @listItems[i] = null

    if _items.length == 0 and not @emptyView?
      @emptyView = @drawEmptyView()
    if _items.length > 0 and @emptyView?
      @emptyView.die()
      @emptyView = null
    
    #Create new ones
    _left = 0
    _top = 0
    _right = 0
    for _item, i in _items
      if @listItems[i]?
        _top += _rowHeight
        continue
      unless _top + _rowHeight < _scrollTop - @options.buffer * _rowHeight or _top > _scrollTop + _scrollHeight + @options.buffer * _rowHeight
        _listItem = @createItem( [ _left, _top, null, _rowHeight, _right, null ], _item, i )
        if @isSelected( _listItem )
          _listItem.setSelected( true )
          if @options.focusOnCreate == true
            @activeItem( _listItem )
        @listItems[i] = _listItem
      _top += _rowHeight
    ELEM.flush()

  getItemClass: ( _value ) ->
    @options.itemClass

  getItemOpts: ( _value ) ->
    @options.itemOpts

  createItem: ( _rect, _value, _index ) ->
    _itemClass = @getItemClass( _value )
    _itemOpts = @getItemOpts( _value )
    _itemClass = HHTListItem unless _itemClass?
    _itemOpts = {} unless _itemOpts?
    _itemOpts['value'] = _value
    _itemOpts['index'] = _index
    _itemOpts['theme'] = @theme
    _itemOpts['allowUnselect'] = @options.allowUnselect
    _itemOpts['enabled'] = @enabled
    _itemClass.new( _rect, @, _itemOpts )

  setItems: ( _items, _search ) ->
    unless @typeChr( _items ) == 'a'
      _items = []
    for _listItem in @listItems
      continue unless _listItem?
      _listItem.die()
    @listItems = []
    _items = @searchItems( _items, _search )
    _items = @sortItems( _items )
    @setLength( _items.length )
    @items = _items
    @drawItems()
    true
    
  sortItems: ( _items )->
    _sortBy = @options.sortBy
    return _items unless _sortBy
    list = @cloneObject( _items, true )
    if ''.toLocaleLowerCase?
      lowerMethod = 'toLocaleLowerCase'
    else
      lowerMethod = 'toLowerCase'
    list.sort (a,b)->
      if a[_sortBy][lowerMethod]() < b[_sortBy][lowerMethod]()
        return -1
      else
        return 1
    return list

  searchItems: ( _items, _search ) ->
    _searchBy = @options.searchBy
    return _items unless _searchBy
    return _items unless _search
    _filter = new RegExp( _search, 'i' )
    _result = []
    for _item in _items
      if _filter.test( _item[_searchBy] )
        _result.push( _item )
    _result


  