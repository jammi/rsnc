HHTSearchList = HControl.extend
  componentName: 'hht_search_list'
  
  controlDefaults: HControlDefaults.extend
    searchText: 'Search More...'
    emptyText: 'Nothing found'
    showAllText: 'Show All'
    items: []
    favorites: []
    rowHeight: 30
    maxLength: 7
    showSearch: true
    idKey: 0
    labelKey: 1
    sortBy: 1
    searchBy: 1
    selectByReturn: false
    allowUnselect: true

  listChanged: ( _length, _height ) ->
    true

  hasFavorites: ->
    ( @typeChr( @options.favorites ) == 'a' and @options.favorites.length > 0 )

  favoriteList: ->
    return @options.items unless @hasFavorites()
    _list = []
    for _f in @options.favorites
      for _item in @options.items
        if _item[@options.idKey] == _f
          _list.push( _item )
          break
      break if _list.length == @options.maxLength
    if _list.length == 0
      return @options.items
    else
      return _list

  search: ( _value ) ->
    if _value.length > 0 or @showAll == true or not @showAllButton?
      @list.options.sortBy = @options.sortBy
      @showAllButton.hide() if @showAllButton?
      if @options.showSearch == true
        @list.setRect( [ 0, 30, null, null, 0, 0 ] )
      else
        @list.setRect( [ 0, 0, null, null, 0, 0 ] )
      @list.drawRect()
      @list.setItems( @options.items, _value )
    else
      @list.options.sortBy = false
      @showAllButton.show()
      if @options.showSearch == true
        @list.setRect( [ 0, 30, null, null, 0, 30 ] )
        @list.drawRect()
      @list.setItems( @favoriteList() )
    _length = Math.min( @options.maxLength, @list.getLength() )
    if _length == 0 and @options.showSearch == true
      ELEM.addClassName( @elemId, 'empty' )
      _length = 1
    else
      ELEM.delClassName( @elemId, 'empty' )
    _height = _length * @options.rowHeight
    if @options.showSearch
      _height += 30
      if _value.length == 0 and @options.showAll != true
        _height += 30
    @listChanged( _length, _height + 1 )
    true

  drawSubviews: ->
    _parent = @
    if @options.showSearch == true
      _listRect = [ 0, 30, null, null, 0, 30 ]
    else
      _listRect = [ 0, 0, null, null, 0, 0 ]
    @list = HHTList.extend(
      lostActiveStatus: ( _newActive ) ->
        _parent.lostActiveStatus( _newActive )
      gainedActiveStatus: ( _lastActive ) ->
        _parent.gainedActiveStatus( _lastActive )
      itemLostActiveStatus: ( _item, _newActive ) ->
        _parent.lostActiveStatus( _newActive )
      itemGainedActiveStatus: ( _item, _lastActive ) ->
        _parent.gainedActiveStatus( _lastActive )
      setValue: ( _value ) ->
        @base( _value )
        if @prevValue?
          _parent.setValue( _value )
        @prevValue = _value
    ).new( _listRect, @,
      value: @value
      items: []
      itemClass: @options.itemClass
      rowHeight: @options.rowHeight
      searchBy: @options.searchBy
      sortBy: @options.sortBy
      selectByReturn: @options.selectByReturn
      allowUnselect: @options.allowUnselect
      focusOnCreate: true
    )
    if @options.showSearch
      @searchField = HHTSearchField.extend(
        lostActiveStatus: (_newActive) ->
          _parent.lostActiveStatus( _newActive )
        gainedActiveStatus: (_lastActive) ->
          _parent.gainedActiveStatus( _lastActive )
        setValue: ( _value ) ->
          @base( _value )
          if @prevValue? and _value != @prevValue
            _parent.search( _value )
          @prevValue = _value
      ).new( [ 0, 0, null, 30, 0, null ], @,
        value: ''
        helpText: @options.searchText
        showIcon: false
        focusOnCreate: true
      )
      if @hasFavorites()
        @showAllButton = HHTButton.new( [ 3, null, null, 30, 3, 0 ], @,
          label: @options.showAllText
          type: 'white'
          style:
            textAlign: 'right'
          click: => 
            @showAll = true
            @search( @searchField.value )
        )
      @search( @searchField.value )
      if @options.focusOnCreate == true
        EVENT.changeActiveControl( @searchField )
    else
      @search( '' )      
    true