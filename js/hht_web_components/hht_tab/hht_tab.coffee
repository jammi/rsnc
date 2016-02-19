HHTTab = HControl.extend
  componentName: 'hht_tab'
  markupElemNames: [ 'items', 'tabs' ]
  
  controlDefaults: HControlDefaults.extend
    itemGap: 20

  constructor: (_rect, _parent, _options) ->
    @items = []
    @itemsWidth = 0
    @itemWidths = []
    @tabs = []
    @tabOpts = []
    @tabsEnabled = []
    @_onClickFns = []
    @base( _rect, _parent, _options )
    @setValue( @value )

  die: ->
    for _item, i in @items
      Event.stopObserving( @items[i], 'click', @_onClickFns[i] )
      ELEM.del( _item )
    @base()

  toggleTab: ( _index, _enabled ) ->
    @tabsEnabled[_index] = _enabled

    @itemsWidth = 0
    for _item, i in @items
      if @tabsEnabled[i] == true
        ELEM.setStyle( _item, 'visibility', 'inherit' )
        ELEM.setStyle( _item, 'left', @itemsWidth + 'px' )
        @itemsWidth += @itemWidths[i]
      else
        ELEM.setStyle( _item, 'visibility', 'hidden' )
    true

  enableTabs: ( _indexes ) ->
    for _tab, i  in @tabs
      @toggleTab( i, ( i in _indexes ) )
    unless @value in _indexes
      @setValue( _indexes[0] )
    true

  refreshTab: ( _index ) ->
    if _index == @value
      @createTab( _index )
    true

  createTab: ( _index ) ->
    #Update selection
    if @prevValue?
      ELEM.delClassName( @items[@prevValue], 'selected' )
    ELEM.addClassName( @items[_index], 'selected' )
    #Delete old
    if @tab?
      @tab.die()
    #Create new
    _rect = [ 0, 40, 0, 0, 0, 0 ]
    if @tabs[_index]['new']?
      @tab = @tabs[_index].new( _rect, @, @tabOpts[_index] )
    else
      @tab = HControl.new( _rect, @, @tabOpts[_index] )
      @tabs[_index]( @tab )
    ELEM.flush()
    true

  _addLabel: ( _label, _enabled ) ->
    _index = @items.length

    if _enabled
      _visibility = 'inherit'
    else
      _visibility = 'hidden'
    #Item
    _itemId = ELEM.make( @markupElemIds.items, 'div', 
      styles:
        visibility: _visibility
        left: @itemsWidth + 'px'
    )
    ELEM.addClassName( _itemId, 'item' )

    #Label
    _labelId = ELEM.make( _itemId, 'div', { html: _label } )
    ELEM.addClassName( _labelId, 'label' )
    _width = @stringWidth( _label, _label.length, _labelId ) + @options.itemGap
    ELEM.setStyle( _itemId, 'width', _width + 'px' )

    #barb
    _barbLeft = ( _width - 30 ) / 2
    _barbOuterId = ELEM.make( _itemId, 'div', styles: { left: _barbLeft + 'px' } )
    ELEM.addClassName( _barbOuterId, 'barb_outer' )
    _barbInnerId = ELEM.make( _itemId, 'div', styles: { left: _barbLeft + 'px' } )
    ELEM.addClassName( _barbInnerId, 'barb_inner' )

    @itemWidths.push( _width )
    @items.push( _itemId )

    if _enabled
      @itemsWidth += _width

    _onClickFn = ( _event ) => @clickItem( _event, _index )
    @_onClickFns.push( _onClickFn )
    Event.observe( _itemId, 'click', _onClickFn )
    _itemId

  clickItem: ( _event, _index ) ->
    @setValue( _index )
    Event.stop( _event )
    true

  setValue: ( _value ) ->
    @base( _value )
    return if _value == @prevValue
    return if _value < 0 or _value >= @tabs.length
    @createTab( _value )
    @prevValue = _value
    true

  selectedTab: ->
    @tab

  addTab: ( _label, _class, _opts, _enabled ) ->
    _index = @tabs.length
    _enabled = true unless _enabled?
    @_addLabel( _label, _enabled )
    _class = HControl unless _class?
    _opts = {} unless _opts?
    _opts['theme'] = @theme
    @tabs.push( _class )
    @tabOpts.push( _opts )
    @tabsEnabled.push( _enabled )
    if _index == @value
      @createTab( _index )
      @prevValue = _index
    true
