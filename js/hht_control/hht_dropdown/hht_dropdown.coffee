HHTDropdown = HControl.extend
  componentName: 'hht_dropdown'
  markupElemNames: [ 'icon', 'label', 'help' ]
  defaultEvents:
    click: true
    resize: true
    keyDown: true
  controlDefaults: HControlDefaults.extend
    items: []
    favorites: []
    rowHeight: 30
    maxLength: 8
    iconSource: null
    selectKeys: [ Event.KEY_RETURN, Event.KEY_SPACE ]
    idKey: 0
    labelKey: 1
    sortBy: 1
    searchBy: 1
    listWidth: 'auto'
    autoSelect: false
    direction: 'down'

  constructor: (_rect, _parent, _options) ->
    @base( _rect, _parent, _options )
    if @typeChr( @options.items ) == 'a'
      @setItems( @options.items )
    else if @options.items?
      HValueAction.new( @,
        bind: @options.items
        action: 'setItems'
      )
    else
      @setItems( [] )
    true

  die: ->
    @closeList()
    Event.stopObserving( @elemId, 'focus', @_onFocusFn )
    @base()

  drawMarkup: ->
    @base()
    @toggleCSSClass( @elemId, 'has_icons', @options.iconSource? )
    @setStyleOfPart( 'label', 'line-height', ELEM.getSize( @elemId )[1] + 'px' )
    @setStyleOfPart( 'help', 'line-height', ELEM.getSize( @elemId )[1] + 'px' )
    @_onFocusFn = => EVENT.changeActiveControl( @ )
    Event.observe( @elemId, 'focus', @_onFocusFn )
    @

  customOptions: ( _options ) ->
    _options.itemClass = HHTDropdownItem unless _options.itemClass?
    _options.value = 0 unless _options.value
    _options

  resize: ->
    @closeList()

  keyDown: ( _key )->
    if _key in @options.selectKeys
      return @openList()
    return false

  lostActiveStatus: ( _newActive ) ->
    if @opened == true and _newActive? and not _newActive.isChildOf( @view )
      @closeList()
    return true

  gainedActiveStatus: ( _lastActive )->
    true

  click: ->
    if @opened == true
       @closeList()
    else
      @openList()
    true

  updateIcon: ( _icon )->
    if @markupElemIds?
      ELEM.setHTML( @markupElemIds.icon, _icon )

  setValue: ( _value ) ->
    @base( _value )
    if @options?
      _icon = @_formatIcon()
      _label = @_formatLabel()
      @updateIcon( _icon )
      @setLabel( _label )
      @toggleCSSClass( @elemId, 'no_selection', ( _label.length == 0 ) )
      @toggleCSSClass( @elemId, 'has_items', @hasItems() )
    if @opened == true
      @closeList()
      EVENT.changeActiveControl( @ )
    true

  setItems: ( _items ) ->
    @items = _items
    @toggleCSSClass( @elemId, 'has_items', @hasItems() )
    if @options.autoSelect
      for _item in _items
        if @getItemId( _item ) == @value
          @setValue( @value )
          return true
      if @items.length > 0
        @setValue( @getItemId( _items[0] ) )
    else
      @setValue( @value )
    return true

  hasItems: ->
    ( @typeChr( @items ) == 'a' and @items.length > 0 )

  updateViewRect: ( _height ) ->
    return unless @view?
    @view.rect.setHeight( _height + 7 )
    @view.drawRect()
    HSystem._updateFlexibleRects()

  openList: ->
    return false unless @hasItems()
    _this = @
    _showSearch = ( @items.length > @options.maxLength )
    if @options.listWidth == 'auto'
      _w = @rect.width + 6
    else
      _w = @options.listWidth
    _length = Math.min( @items.length, @options.maxLength )
    if _showSearch
      _h = @options.rowHeight * _length + 30 + 7
      _favorites = @options.favorites
    else
      _h = @options.rowHeight * _length + 7
      _favorites = []
    if @options.direction == 'up'
      @view = HHTCard.new( [ @pageX() - 3, @pageY() - _h + @options.rowHeight, _w, _h ], @app )
    else
      @view = HHTCard.new( [ @pageX() - 3, @pageY() - 3, _w, _h ], @app )
    @list = HHTSearchList.extend(
      escKey: ->
        _this.closeList()
        EVENT.changeActiveControl( _this )
        true
      lostActiveStatus: (_newActive) ->
        _this.lostActiveStatus( _newActive )
      gainedActiveStatus: (_lastActive) ->
        _this.gainedActiveStatus( _lastActive )
      setValue: ( _value ) ->
        @base( _value )
        if @inited == true
          _this.setValue( _value )
          _elem = ELEM.get( _this.elemId )
          _elem.focus() if _elem?
        true
      listChanged: ( _length, _height ) ->
        _this.updateViewRect( _height )
    ).new( [ 3, 4, null, null, 3, 3 ], @view,
      value: @value
      items: @items
      favorites: _favorites
      maxLength: @options.maxLength
      itemClass: @options.itemClass
      emptyText: HLocale.components.HHTDropdown.strings.nothing_found
      searchText: HLocale.components.HHTDropdown.strings.search
      showAllText: HLocale.components.HHTDropdown.strings.show_all
      showSearch: _showSearch
      sortBy: @options.sortBy
      searchBy: @options.searchBy
      idKey: @options.idKey
      labelkey: @options.labelKey
      selectByReturn: true
      allowUnselect: false
    )
    @list.inited = true
    ELEM.addClassName( @elemId, 'opened' )
    @opened = true
    true

  closeList: ->
    return unless @opened == true
    @opened = false
    ELEM.delClassName( @elemId, 'opened' )
    @view.hide()
    @view.dieSoon()
    @view = null
    true

  getItemId: ( _item ) ->
    _item[@options.idKey]

  getItemLabel: ( _item ) ->
    _item[@options.labelKey]

  _formatLabel:  ->
    return '' unless @typeChr( @items ) == 'a'
    for _item in @items
      if @getItemId( _item ) == @value
        return @getItemLabel( _item )
    return ''

  _formatIcon: ->
    return '' unless @options.iconSource?
    return '' unless @typeChr( @items ) == 'a'
    for _item in @items
      if @getItemId( _item ) == @value
        return @options.iconSource.get( @value )
    return ''

  _formatHelp: ->
    if @options.helpText?
      @options.helpText
    else
      HLocale.components.HHTDropdown.strings.select

  _formatIndicatorUp: ->
    HHT_ICONS.get( 'arrow_up' )

  _formatIndicatorDown: ->
    HHT_ICONS.get( 'arrow_down' )
