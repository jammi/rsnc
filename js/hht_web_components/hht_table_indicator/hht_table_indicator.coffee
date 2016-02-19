HHTTableIndicator = HControl.extend
  componentName: 'hht_table_indicator'
  controlDefaults: HControlDefaults.extend
    dotSize: 25
    dotGap: 5

  defaultEvents:
    resize: true

  resize: ->
    @selectPage( @pageIndex )
  
  die: ->
    @removeItems()
    @base()

  prevPage: ->
    if @pageIndex > 0
      @selectPage( @pageIndex - 1 )

  nextPage: ->
    if @pageIndex < @pageCount - 1
      @selectPage( @pageIndex + 1 )

  selectPage: ( _page ) ->
    @options.table.selectPage( _page )
    @refreshContent()
    
  makeItem: ( _left, _size, _selected, _page ) ->
    _dotItem = ELEM.make( @elemId, 'div',
      html: HHT_ICONS.get( 'dot', _size, _size )
      styles: { left: "#{_left}px" }
      classes: [ 'item' ]
    )
    _onClickFn = => @selectPage( _page )
    Event.observe( _dotItem, 'click', _onClickFn )

    ELEM.addClassName( _dotItem, 'selected' ) if _selected
    _numberItem = ELEM.make( _dotItem, 'div',
      html: "#{_page + 1}"
      classes: [ 'number' ]
    )
    ELEM.flush()


    @_dotItems.push( _dotItem )
    @_numberItems.push( _numberItem )
    @_onClickItems.push( _onClickFn )

  removeItems: ->
    if @_dotItems?
      for _item, i in @_dotItems
        Event.stopObserving( _item, 'click', @_onClickItems[i] )
        ELEM.del( _item )
    if @_numberItems?
      for _item, i in @_numberItems
        ELEM.del( _item )
    @_dotItems = []
    @_numberItems = []
    @_onClickItems = []
  
  refreshContent: ->
    return unless @options.table?
    return unless @options.table.getPageCount
    return unless @options.table.getPageIndex
    
    _table = @options.table
    _pageCount = _table.getPageCount()
    _pageIndex = _table.getPageIndex()
    _size = @options.dotSize
    _gap = @options.dotGap
    _width = ( _pageCount + 2 ) * ( _size + _gap )
    @rect.setLeft( ( @parent.rect.width - _width ) / 2 )
    @rect.setWidth( _width )
    @drawRect()

    return if _pageCount == @pageCount and _pageIndex == @pageIndex
 
    @removeItems()
    if _pageCount > 1
      _left = 0
      _arrowSize = 20
      _elem = ELEM.make( @elemId, 'div',
        html: HHT_ICONS.get( 'arrow_left', _arrowSize, _arrowSize )
        styles: 
          left: "#{_left}px"
          top: '3px'
      )
      ELEM.addClassName( _elem, 'item' )
      _click = => @prevPage()
      Event.observe( _elem, 'click', _click )
      ELEM.flush()
      @_dotItems.push( _elem )
      @_onClickItems.push( _click )

      _left += ( _arrowSize + _gap )
      
      for i in [0..._pageCount]
        _selected = ( i == _pageIndex )
        @makeItem( _left, _size, _selected, i )
        _left += ( _size + _gap )

      _elem = ELEM.make( @elemId, 'div',
        html: HHT_ICONS.get( 'arrow_right', _arrowSize, _arrowSize )
        styles: 
          left: "#{_left}px" 
          top: '3px'
      )
      ELEM.flush()
      ELEM.addClassName( _elem, 'item' )
      _click = => @nextPage()
      Event.observe( _elem, 'click', _click )
      @_dotItems.push( _elem )
      @_onClickItems.push( _click )
    @pageCount = _pageCount
    @pageIndex = _pageIndex
    true

  refreshValue: ->
    @refreshContent()

  drawSubviews: ->
    @refreshContent()
