
# Default locale (en) strings for HTimeSheet
HLocale.components.HTimeSheet =
  strings:
    newItemLabel: 'New item'
HTimeSheet = HControl.extend

  componentName: 'timesheet'
  markupElemNames: [ 'label', 'value', 'timeline' ]

  defaultEvents:
    draggable:    true
    click:        true
    doubleClick:  true
    resize:       true

  controlDefaults: HControlDefaults.extend
    timeStart:          0 # 1970-01-01 00:00:00
    timeEnd:        86399 # 1970-01-01 23:59:59
    tzOffset:           0 # For custom timezone offsets in seconds; eg: 7200 => UTC+2
    itemMinHeight:     16 # Smallest allowed size for an item (in pixels)
    hideHours:      false # Enable to hide the hours in the gutter
    autoLabel:      false # Automatically set the label to the date, when enabled
    autoLabelFn: 'formatDate' # The name of the function to return formatted date/time
    notchesPerHour:     4 # by default 1/4 of an hour precision (15 minutes)
    divideHours:        1 # by default all hours is shown      
    snapToNotch:     true # Snaps time to nearest notch/line
    itemOffsetLeft:    64 # Theme settings; don't enter in options
    itemOffsetRight:    0 # Theme settings; don't enter in options
    itemOffsetTop:     20 # Theme settings; don't enter in options
    itemOffsetBottom:   0 # Theme settings; don't enter in options
    itemDisplayTime:         true  # Items display their time by default
    allowClickCreate:       false  # Enable to allow clicking in empty areas to create new items
    iconImage: 'timesheet_item_icons.png' # Icon resources for items
    allowDoubleClickCreate:  true  # Double-clicking empty areas are shortcuts for new items by default
    minDragSize:                5  # Minimum amount of pixels dragged required for accepting a drag
    hourOffsetTop:             -4  # Theme settings; don't enter in options

  customOptions: ( _opt )->
    @localeStrings = HLocale.components.HTimeSheet.strings
    _opt.defaultLabel = @localeStrings.newItemLabel unless _opt.defaultLabel?
    _opt.autoLabelFnOptions = { longWeekDay: true } unless _opt.autoLabelFnOptions?
    unless _opt.dummyValue?
      _opt.dummyValue =
        label: ''
        start: 0
        color: '#000000'

  themeSettings: ( _itemOffsetLeft, _itemOffsetTop, _itemOffsetRight, _itemOffsetBottom, _hourOffsetTop )->
    if @options.hideHours
      ELEM.addClassName( @elemId, 'nohours' )
      @options.itemOffsetLeft = 0
    else if _itemOffsetLeft?
      @options.itemOffsetLeft = _itemOffsetLeft
    @options.itemOffsetTop = _itemOffsetTop if _itemOffsetTop?
    @options.itemOffsetRight = _itemOffsetRight if _itemOffsetRight?
    @options.itemOffsetBottom = _itemOffsetBottom if _itemOffsetBottom?
    @options.hourOffsetTop = _hourOffsetTop if _hourOffsetTop?

  autoLabel: ->
    _locale = HLocale.dateTime
    _opt    = @options
    _label  = _locale[_opt.autoLabelFn]( _opt.timeStart, _opt.autoLabelFnOptions )
    if @label != _label
      @label = _label
      @refreshLabel()

  clearHours: ->
    for _hourItemId in @hourItems
      ELEM.del( _hourItemId )

  drawHours: ->
    _hourParent = @markupElemIds.timeline
    _lineParent = @markupElemIds.value
    _dateStart  = new Date( @options.timeStart * 1000 )
    _dateEnd    = new Date( @options.timeEnd * 1000 )
    _hourStart  = _dateStart.getUTCHours()
    _hourEnd    = _dateEnd.getUTCHours()
    _hours      = (_hourEnd - _hourStart) + 1
    _rectHeight = ELEM.getSize( _hourParent )[1]
    _topOffset  = @options.itemOffsetTop
    _height     = _rectHeight - _topOffset - @options.itemOffsetBottom
    _pxPerHour  = _height / _hours
    _notchesPerHour = @options.notchesPerHour
    _pxPerLine  = _pxPerHour / _notchesPerHour
    _bottomPos  = _rectHeight-_height-_topOffset-2
    _pxPerNotch = _pxPerHour / _notchesPerHour
    _divideHours = @options.divideHours

    ELEM.setStyle( _hourParent, 'visibility', 'hidden', true )
    ELEM.setStyle( @markupElemIds.value, 'bottom', _bottomPos+'px' )

    @clearHours() if @hourItems?

    @itemOptions =
      notchHeight:  _pxPerNotch
      notches:      _hours * _notchesPerHour
      offsetTop:    _topOffset
      offsetBottom: _bottomPos
      height:       _height

    @hourItems = []

    for _hour in [_hourStart.._hourEnd]
      _lineTop  = Math.round( _topOffset + (_hour*_pxPerHour) )
      if _hour != _hourStart and _hour % _divideHours == 0
        _hourTop = _lineTop + @options.hourOffsetTop
        @hourItems.push( ELEM.make( @markupElemIds.timeline, 'div',
          attr:
            className: 'hour'
          styles:
            top: _hourTop+'px'
          html: _hour+':00'
        ) )
        @hourItems.push( ELEM.make( _lineParent, 'div',
          attr:
            className: 'line'
          styles:
            top: (_lineTop+1)+'px'
            height: Math.round(_pxPerNotch-1)+'px'
        ) )
      for i in [1..._notchesPerHour] by 1
        _notchTop = Math.round(_lineTop + (_pxPerNotch*i))
        @hourItems.push( ELEM.make( _lineParent, 'div',
          attr:
            className: 'notch'
          styles:
            top: (_notchTop+1)+'px'
            height: Math.round(_pxPerNotch-1)+'px'
        ) )
    ELEM.setStyle( @markupElemIds.timeline, 'visibility', 'inherit' );

  # extra hook for refreshing; updates label and hours before doing common things
  refresh: ->
    if @drawn
      @autoLabel() if @options.autoLabel
      # @drawHours()
    @base()

  # set the timezone offset (in seconds)
  setTzOffset: (_tzOffset)->
    @options.tzOffset = _tzOffset
    @refresh()

  # set the start timestamp of the timesheet
  setTimeStart: (_timeStart)->
    @options.timeStart = _timeStart
    @refresh()

  # set the end timestamp of the timesheet
  setTimeEnd: (_timeEnd)->
    @options.timeEnd = _timeEnd
    @refresh()

  # sets the range of timestams of the timesheet
  setTimeRange: (_timeRange)->
    if @typeChr(_timeRange) == 'a' and _timeRange.length == 2
      @setTimeStart( _timeRange[0] )
      @setTimeEnd(   _timeRange[1] )
    else if @typeChr(_timeRange) == 'h' and _timeRange.timeStart? and _timeRange.timeEnd?
      @setTimeStart( _timeRange.timeStart )
      @setTimeEnd(   _timeRange.timeEnd   )

  # sets the timestamp of the timesheet
  setDate: (_date)->
    @setTimeRange( [ _date, _date + @options.timeEnd - @options.timeStart ] )
    @refresh()

  # draw decorations
  drawSubviews: ->
    @drawHours()
    _options = @options
    _minDuration = Math.round(3600/_options.notchesPerHour)
    _dummyValue = @cloneObject( @options.dummyValue )
    _dummyValue.duration = _minDuration
    @dragPreviewRect = @rectFromValue(
      start:    _options.timeStart
      duration: _minDuration
    )
    @minDuration = _minDuration
    @dragPreview = HTimeSheetItem.new( @dragPreviewRect, @,
      value:        _dummyValue
      visible:      false
      iconImage:    @options.iconImage
      displayTime:  @options.itemDisplayTime
    )
    @dragPreview.setStyleOfPart('state','color','#fff')

  # event listener for clicks, simulates double clicks in case of not double click aware browser
  click: (x,y)->
    _prevClickTime = false
    _notCreated = not @clickCreated and not @doubleClickCreated and not @dragCreated
    if not @startDragTime and @prevClickTime
      _prevClickTime = @prevClickTime
    else if @startDragTime
      _prevClickTime = @startDragTime
    if _notCreated and @options.allowClickCreate
      @clickCreate( x,y )
      @clickCreated = true
      @doubleClickCreated = false
      @prevClickTime = false
    else if _notCreated and @options.allowDoubleClickCreate
      _currTime = new Date().getTime()
      if _prevClickTime
        _timeDiff = _currTime - _prevClickTime
      else
        _timeDiff = -1
      if _timeDiff > 150 and _timeDiff < 500 and not @doubleClickCreated
        @clickCreate( x, y )
        @clickCreated = false
        @doubleClickCreated = true
        @doubleClickSimCreated = true
      else
        @doubleClickCreated = false
      @prevClickTime = _currTime
    else
      @clickCreated = false
      @doubleClickCreated = false
      @prevClickTime = false

  # creates an item on click
  clickCreate: (x,y)->
    _startTime = @pxToTime( y-@pageY(), true )
    _endTime = _startTime + @minDuration
    @refreshDragPreview( _startTime, _endTime )
    @dragPreview.bringToFront()
    @dragPreview.show()
    if @activateEditor( @dragPreview )
      @editor.createItem( @cloneObject( @dragPreview.value ) )
    else
      @dragPreview.hide()

  # event listener for double clicks
  doubleClick: (x,y)->
    @prevClickTime = false
    @doubleClickCreated = false
    _notCreated = not @clickCreated and not @doubleClickCreated and not @doubleClickSimCreated and not @dragCreated
    if not @options.allowDoubleClickCreate and @options.allowClickCreate and _notCreated
      @click( x, y )
    else if @options.allowDoubleClickCreate and not @options.allowClickCreate and _notCreated
      @clickCreate( x, y )
      @clickCreated = false
      @doubleClickCreated = true
    else
      @clickCreated = false
    @doubleClickSimCreated = false

  # update the preview area
  refreshDragPreview: (_startTime, _endTime)->
    @dragPreviewRect.setTop( @timeToPx( _startTime ) )
    @dragPreviewRect.setBottom( @timeToPx( _endTime ) )
    @dragPreviewRect.setHeight( @options.itemMinHeight ) if @dragPreviewRect.height < @options.itemMinHeight
    @dragPreview.drawRect()
    @dragPreview.value.start = _startTime
    @dragPreview.value.duration = _endTime - _startTime
    @dragPreview.refreshValue()

  # drag & drop event listeners, used for dragging new timesheet items
  startDrag: (x,y)->
    @_startDragY = y
    @startDragTime = @pxToTime( y-@pageY(), true )
    @refreshDragPreview( @startDragTime, @startDragTime + @minDuration )
    @dragPreview.bringToFront()
    @dragPreview.show()
    true

  drag: (x,y)->
    _dragTime = @pxToTime( y-@pageY() )
    if _dragTime < @startDragTime
      _startTime = _dragTime
      _endTime = @startDragTime
    else
      _endTime = _dragTime
      _startTime = @startDragTime
    @refreshDragPreview( _startTime, _endTime )
    true

  endDrag: (x,y)->
    _dragTime = @pxToTime( y-@pageY() )
    _minDistanceSatisfied = Math.abs( @_startDragY - y ) >= @options.minDragSize
    @dragPreview.hide()
    if _dragTime != @startDragTime
      if _minDistanceSatisfied
        if @activateEditor( @dragPreview )
          @dragCreated = true
          @editor.createItem( @cloneObject( @dragPreview.value ) )
          return true
      @dragCreated = false
    else
      @dragCreated = false
      @clickCreated = false
      @startDragTime = false
      @click(x, y)
      return true
    false

  # a resize triggers refresh, of which the important part is refreshValue, which triggers redraw of the time sheet items
  resize: ->
    @base()
    @refresh()

  # snaps the time to grid
  snapTime: (_timeSecs,_begin)->
    _options = @options
    _pxDate = new Date( Math.round(_timeSecs) * 1000 )
    _snapSecs = Math.round( 3600 / _options.notchesPerHour )
    _halfSnapSecs = _snapSecs * 0.5
    _hourSecs = (_pxDate.getUTCMinutes()*60) + _pxDate.getUTCSeconds()
    _remSecs  = _hourSecs % _snapSecs
    if _begin
      _timeSecs -= _remSecs
    else
      if _remSecs > _halfSnapSecs
        _timeSecs += _snapSecs-_remSecs
      else
        _timeSecs -= _remSecs
    _timeSecs

  # snaps the pixel to grid
  snapPx: (_px)->
    _timeSecs = @pxToTime( _px )
    _timeSecs = @snapTime( _timeSecs )
    @timeToPx( _timeSecs )

  # activates the editor; _item is the timesheet item to edit
  activateEditor: (_item)->
    if @editor
      _editor = @editor
      _editor.setTimeSheetItem( _item )
      _item.bringToFront()
      _editor.bringToFront()
      _editor.show()
      return true
    false

  ###
  # = Description
  # Sets the editor given as parameter as the editor of instance.
  #
  # = Parameters
  # +_editor+::
  ###
  setEditor: (_editor)-> @editor = _editor

  ###
  # = Description
  # Destructor; destroys the editor first and commences inherited die.
  ###
  die: ->
    @editor.die() if @editor
    @editor = null
    @base()

  # converts pixels to time
  pxToTime: (_px, _begin)->
    _options = @options
    _timeStart = _options.timeStart
    _timeEnd   = _options.timeEnd
    _timeRange = _timeEnd - _timeStart
    _itemOptions = @itemOptions
    _top       = _itemOptions.offsetTop+1
    _height    = _itemOptions.height
    _pxPerSec  = _height / _timeRange
    _px -= _top
    _timeSecs  = _timeStart + ( _px / _pxPerSec )
    _timeSecs = @snapTime( _timeSecs, _begin ) if @options.snapToNotch
    if _timeSecs > _options.timeEnd
      _timeSecs = _options.timeEnd
    else if _timeSecs < _options.timeStart
      _timeSecs = _options.timeStart
    Math.round( _timeSecs )

  # converts time to pixels
  timeToPx: (_time, _begin)->
    _time = @snapTime( _time, _begin ) if @options.snapToNotch
    _options = @options
    _timeStart = _options.timeStart
    _timeEnd   = _options.timeEnd
    _time = _timeStart if _time < _timeStart
    _time = _timeEnd   if _time > _timeEnd
    _timeRange = _timeEnd - _timeStart
    _itemOptions = @itemOptions
    _top       = _itemOptions.offsetTop
    _height    = _itemOptions.height
    _pxPerSec  = _height / _timeRange
    _timeSecs  = _time - _timeStart
    _px        = _top + ( _timeSecs * _pxPerSec )
    Math.round( _px )

  # converts time to pixels for the rect
  rectFromValue: (_value)->
    _topPx = @timeToPx( _value.start )
    _bottomPx = @timeToPx( _value.start + _value.duration )
    _leftPx = @options.itemOffsetLeft
    _rightPx = @rect.width - @options.itemOffsetRight - 2
    if _topPx == 'underflow'
      _topPx = _itemOptions.offsetTop
    else if _topPx == 'overflow'
      return false
    if _bottomPx == 'underflow'
      return false
    else if _bottomPx == 'overflow'
      _bottomPx = _itemOptions.offsetTop + _itemOptions.height
    _rect = HRect.new( _leftPx, _topPx, _rightPx, _bottomPx )
    if _rect.height < @options.itemMinHeight
      _rect.setHeight( @options.itemMinHeight )
    _rect

  # creates a single time sheet item component
  createTimeSheetItem: (_value)->
    _rect = @rectFromValue( _value )
    return false if rect == false
    HTimeSheetItem.new( _rect, @,
      value: _value
      displayTime: @options.itemDisplayTime
      events:
        draggable: true
        doubleClick: true
    )

  # calls createTimeSheetItem with each value of the timesheet value array
  drawTimeSheetItems: ->
    _data = @value
    _items = @timeSheetItems
    if @typeChr(_data) == 'a' and _data.length > 0
      for _value in _data
        _item = @createTimeSheetItem( _value )
        _items.push( _item ) if _item

  ###
  # =Description
  # Create a new timeSheetItems if it hasn't been done already,
  # otherwise destroy the items of the old one before proceeding.
  ###  
  
  _initTimeSheetItems: ->
    @timeSheetItems = [] unless @timeSheetItems?
    if @timeSheetItems.length > 0
      for _timeSheetItem in @timeSheetItems
        _timeSheetItem.die()
      @timeSheetItems = []

  # finds the index in the array which contains most sequential items
  _findLargestSequence: (_arr)->
    _index = 0
    _length = 1
    _maxLength = 1
    _bestIndex = 0
    for i in [1..._arr.length] by 1
      # grow:
      if _arr[i] - _arr[i-1] == 1 and _index == i-_length
        _length++
      # reset:
      else
        _index = i
        _length = 1
      if _length > _maxLength
        _bestIndex = _index
        _maxLength = _length
    [ _bestIndex, _maxLength ]

  # find the amount of overlapping time sheet items
  _findOverlapCount: (_items)->
    _overlaps = []
    _testRects = @_getTestRects( _items )
    for i in [0..._items.length] by 1
      _overlaps[i] = 0
    for i in [0...(_items.length-1)] by 1
      for j in [(i+1)..._items.length] by 1
        if _items[i].rect.intersects( _testRects[j] )
          _overlaps[i]++
          _overlaps[j]++
    Math.max.apply( Math, _overlaps )

  _getTestRects: (_items)->
    _rects = []
    for i in [0..._items.length] by 1
      _rects[i] = HRect.new( _items[i].rect )
      _rects[i].insetBy( 1, 1 )
    _rects

  # returns a sorted copy of the timeSheetItems array
  _sortedTimeSheetItems: (_sortFn)->
    unless _sortFn?
      _sortFn = (a,b)-> b.rect.height - a.rect.height
    _arr = []
    _items = @timeSheetItems
    _arr.push( _item ) for _item in _items
    _arr.sort(_sortFn)

  # Optimizes the left and right position of each timesheet item to fit
  # NOTE: This method will require refactoring; it's way too long and complicated
  _updateTimelineRects: ->
    # loop indexes:
    _options = @options
    _rect = @rect
    _availWidth = _rect.width - _options.itemOffsetRight - _options.itemOffsetLeft
    _left = _options.itemOffsetLeft
    # get a list of timesheet items sorted by height (larger to smaller order)
    _items = @_sortedTimeSheetItems()
    _itemCount = _items.length
    # amount of items ovelapping (max, actual number might be smaller after optimization)
    _overlapCount = @_findOverlapCount( _items )
    _width = Math.floor( _availWidth / (_overlapCount+1) )
    _maxCol = 0
    _origColById = []
    # No overlapping; nothing to do
    return false unless _overlapCount
    # move all items initially to one column right of the max overlaps
    _leftPos = _left+(_width*(_overlapCount+1))
    for i in [0..._itemCount] by 1
      _itemRect = _items[i].rect
      _itemRect.setLeft( _leftPos )
      _itemRect.setRight( _leftPos+_width )

    # optimize gaps by traversing each combination
    # and finding the first column with no gaps
    # the top-level loops three times in the following modes:
    # 0: place items into the first vacant column and find the actual max columns
    # 1: stretch columns to final column width
    # 2: stretch columns to fit multiple columns, if space is vacant
    for l in [0...3] by 1
      for i in [0..._itemCount] by 1
        _itemRect = _items[i].rect
        # in mode 1, just the column widths are changed
        if l == 1
          _leftPos = _left + (_origColById[i]*_width)
          _itemRect.setLeft( _leftPos )
          _itemRect.setRight( _leftPos + _width )
          continue
        _overlapCols = []
        _vacantCols = []
        _testRects = @_getTestRects( _items )
        _testRect = HRect.new( _itemRect )
        # test each column position (modes 0 and 2)
        for k in [0...(_overlapCount+1)] by 1
          _leftPos = _left + (k*_width)
          _testRect.setLeft( _leftPos )
          _testRect.setRight( _leftPos + _width )
          for j in [0..._itemCount] by 1
            if i != j and _testRect.intersects( _testRects[j] )
              _overlapCols.push( k ) unless ~_overlapCols.indexOf( k )
          if not ~_vacantCols.indexOf( k ) and not ~_overlapCols.indexOf( k )
            _vacantCols.push( k )

        # on the first run (mode 0) place items into the first column:
        if l == 0
          _origCol = _vacantCols[0]
          _origColById.push( _origCol )
          _leftPos = _left+(_origCol*_width)
          _rightPos = _leftPos + _width
          _maxCol = _origCol if _maxCol < _origCol
        else
          # on mode 2: stretch to fill multiple column widths,
          # because no item moving is done anymore at this stage, so we know what's free and what's not
          if _vacantCols.length > 0
            _optimalColAndLength = @_findLargestSequence( _vacantCols )
            _col = _vacantCols[ _optimalColAndLength[0] ]
            _colWidth = _optimalColAndLength[1]
          else
            _origCol = _origColById[i]
            _col = _origCol
            _colWidth = 1
          _leftPos = _left+(_col*_width)
          _rightPos = _leftPos+(_colWidth*_width)
        _itemRect.setLeft( _leftPos )
        _itemRect.setRight( _rightPos )
      # after the first run (mode 0) we know the actual amount of columns, so adjust column width accordingly
      if l == 0
        _overlapCount = _maxCol
        _width = Math.floor( _availWidth / (_maxCol+1) )
    true

  # draws the timeline (sub-routine of refreshValue)
  drawTimeline: ->
    @_initTimeSheetItems()
    @drawTimeSheetItems()
    @_updateTimelineRects()
    # use the dimensions of the views
    for _timeSheetItem in @timeSheetItems
      _timeSheetItem.drawRect()

  _sha: SHA.new(8)

  ###
  # Each item looks like this, any extra attributes are allowed,
  # but not used and not guaranteed to be preserved:
  #
  # { id: 'abcdef1234567890', # identifier, used in server to map id's
  #   label: 'Event title',   # label of event title
  #   start: 1299248619,      # epoch timestamp of event start
  #   duration: 3600,         # duration of event in seconds
  #   locked: true,           # when false, prevents editing the item
  #   icons: [ 1, 3, 6 ],     # icon id's to display
  #   color: '#ffffff'        # defaults to '#ffffff' if undefined
  # }
  #
  # = Description
  # Redraws and refreshes the values on timesheet.
  #
  ###
  refreshValue: ->
    return unless @itemOptions
    # optimization that ensures the rect and previous value are different before redrawing
    _valueStr = @encodeObject( @value )
    _rectStr = @rect.toString()
    _timeRangeStr = @options.timeStart+':'+@options.timeEnd
    _shaSum = @_sha.strSHA1( _valueStr+_rectStr+_timeRangeStr )
    if @_prevSum != _shaSum
      # the preview timesheet item is hidden when new data arrives (including what it created)
      @dragPreview.hide()
      @_prevSum = _shaSum
      @drawTimeline()
