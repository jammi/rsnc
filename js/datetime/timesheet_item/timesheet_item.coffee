
###
## = Description
## Item class to be used with HTimeSheet.
###
HTimeSheetItem = HControl.extend
  componentName: 'timesheet_item'
  markupElemNames: ['label', 'state', 'icons', 'value', 'subview']
  controlDefaults: HControlDefaults.extend
    displayTime: true
    iconImage: 'timesheet_item_icons.png'
  drawIcon: ( _iconOrder, _iconId )->
    _iconElemId = ELEM.make( @markupElemIds.icons, 'div' )
    _iconUrl = @getThemeGfxFile( @options.iconImage )
    ELEM.addClassName( _iconElemId, 'icon' )
    ELEM.setStyles( _iconElemId,
      right:              (_iconOrder*16+_iconOrder)+'px'
      backgroundPosition: '0px '+(_iconId*-16)+'px'
      backgroundImage:    'url('+_iconUrl+')'
    )
    _iconElemId
  clearAllIcons: ->
    if @typeChr(@icons) == 'a'
      for _iconId in @icons
        ELEM.del( _iconId )
    @icons = []
  die: ->
    @clearAllIcons()
    @icons = null
    @base()
  refreshState: (_start, _duration)->
    return unless @options.displayTime
    _startTime = _start or @value.start
    _endTime   = _startTime + ( _duration or @value.duration )
    _locale    = HLocale.dateTime
    _stateText = _locale.formatTime( _startTime ) + _locale.strings.rangeDelimitter + _locale.formatTime( _endTime )
    ELEM.setHTML( @markupElemIds.state, _stateText )
  refreshValue: ->
    return unless @typeChr(@value) == 'h'
    @drawRect()
    if @value.color
      @setStyle( 'backgroundColor', @value.color )
    else
      @setStyle( 'backgroundColor', '#999' )
    @setLabel( @value.label ) if @value.label
    if @value.locked
      ELEM.addClassName( @elemId, 'locked' )
    else
      ELEM.delClassName( @elemId, 'locked' )
    @refreshState()
    @clearAllIcons()
    if @typeChr( @value.icons ) == 'a'
      for _icon, i in @value.icons
        @icons.push( @drawIcon( i, _icon ) );
  click: ->
    @bringToFront()
  doubleClick: ( x, y )->
    @bringToFront()
    @parent.activateEditor( this )

  dragMode: 0 # none
  _isValueValidForDrag: -> @typeChr(@value) == 'h' and not @value.locked
  startDrag: (x, y)->
    @bringToFront()
    if @_isValueValidForDrag()
      _topY = y-@pageY()
      _bottomY = @rect.height - _topY
      _resizeTop = ( _topY >= 0 && _topY <= 6 )
      _resizeBottom = ( _bottomY >= 0 && _bottomY <= 6 )
      _move = ( _topY > 6 && _bottomY > 6 )
      if _resizeTop
        @dragMode = 2 # resize-top
      else if _resizeBottom
        @dragMode = 3 # resize-bottom
      else if _move
        @dragMode = 1 # move
      else
        @dragMode = 0 # none
      if @dragMode == 0
        @originY = false
      else
        _originY   = y-@parent.pageY()
        _parentY   = @parent.pageY()
        _originTimeStart = @value.start
        _originTimeEnd   = _originTimeStart + @value.duration
        @originY = _originY
        @originTopPx = @rect.top
        @originBottomPx = @rect.bottom
        @originTimeStart = _originTimeStart
        @originTimeEnd   = _originTimeEnd
        @originDuration  = _originTimeEnd - _originTimeStart
        @dragTimeStart = _originTimeStart
        @dragDuration  = @originDuration
  drag: ( x, y )->
    if @_isValueValidForDrag() and @dragMode != 0
      y -= @parent.pageY()
      _movePx    = y - @originY
      _topPx     = @parent.snapPx( @originTopPx + _movePx )
      _parentY   = @parent.pageY()
      if @dragMode == 1 # move
        _maxTopPx  = @parent.timeToPx( @parent.options.timeEnd ) - @rect.height
        _topPx = _maxTopPx if _topPx > _maxTopPx
        _timeStart = @parent.pxToTime(_topPx)
        _duration  = @originDuration
        @rect.offsetTo( @rect.left, _topPx )
        @drawRect()
        @dragTimeStart = _timeStart
        @dragDuration  = _duration
      else if @dragMode == 2 # resize-top
        _maxTopPx  = @parent.timeToPx( @originTimeEnd - @parent.minDuration )
        _topPx = _maxTopPx if _topPx > _maxTopPx
        _timeStart = @parent.pxToTime(_topPx)
        _timeEnd   = @originTimeEnd
        if @rect.bottom - _topPx < @parent.options.itemMinHeight
          _topPx = @rect.bottom - @parent.options.itemMinHeight
        @rect.setTop( _topPx )
        @drawRect()
        @dragTimeStart = _timeStart
        @dragDuration  = _timeEnd - _timeStart
      else if @dragMode == 3 # resize-top
        _minBottomPx  = @parent.timeToPx( @originTimeStart + @parent.minDuration  )
        _bottomPx     = @parent.snapPx( @originBottomPx + _movePx )
        _bottomPx = _minBottomPx if _bottomPx < _minBottomPx
        _timeStart = @originTimeStart
        _timeEnd   = @parent.pxToTime(_bottomPx)
        if _bottomPx - @rect.top < @parent.options.itemMinHeight
          _bottomPx = @rect.top + @parent.options.itemMinHeight
        @rect.setBottom( _bottomPx )
        @drawRect()
        @dragTimeStart = _timeStart
        @dragDuration  = _timeEnd - _timeStart
      @refreshState( @dragTimeStart, @dragDuration )
  endDrag: (x, y)->
    if @_isValueValidForDrag() and @dragMode != 0
      _startChanged = @dragTimeStart != @originTimeStart and @dragTimeStart != @value.start
      _durationChanged = @dragDuration != @originDuration and @dragDuration != @value.duration
      if _startChanged or _durationChanged
        if @parent.editor
          @parent.editor.modifyItem(
            id:       @value.id
            start:    @dragTimeStart
            duration: @dragDuration
            label:    @value.label
          )
