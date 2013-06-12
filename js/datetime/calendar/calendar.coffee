
#### = Description
  ## Use HCalendar to display a month calendar that displays days as columns
  ## and weeks as rows. Its value is a date/time number specified in seconds
  ## since or before epoch (1970-01-01 00:00:00 UTC).
  ####
HCalendar = HControl.extend

  componentName: 'calendar'
  markupElemNames: [ 'control', 'state', 'label', 'value', 'prevMonth', 'nextMonth' ]

  ## Disable the mouseWheel event to prevent prev/next -month switching with
  ## the mouse wheel or equivalent content-scrolling user interface gesture
  defaultEvents:
    mouseWheel: true
    keyDown: true

  controlDefaults: HControlDefaults.extend
    preserveTime: true
    useUTC: null
    legacyCompatible: false
  customOptons: (_options)->
    _options.useUTC = HLocale.dateTime.defaultOptions.useUTC if _options.useUTC == null

  ## Calls HCalendar#nextMonth or HCalendar#prevMonth based on delta change
  ## of the mouseWheel event
  mouseWheel: (_delta)->
    if _delta < 0
      @nextMonth()
    else
      @prevMonth()

  ## Draws the next month
  nextMonth: (_set)->
    _date = @moment(@viewMonth).endOf('month').add(1,'ms')
    @setValue( _date.unix() ) if _set
    @drawCalendar( _date )

  ## Draws the prev month
  prevMonth: (_set)->
    _date = @moment(@viewMonth).startOf('month').subtract(1,'ms')
    @setValue( _date.unix() ) if _set
    @drawCalendar( _date )

  ## Draws the next year
  nextYear: (_set)->
    _date = @moment(@viewMonth).endOf('year').add(1,'ms')
    @setValue( _date.unix() ) if _set
    @drawCalendar( _date )

  ## Draws the prev year
  prevYear: (_set)->
    _date = @moment(@viewMonth).startOf('year').subtract(1,'ms')
    @setValue( _date.unix() ) if _set
    @drawCalendar( _date )

  nextDay: -> @setValue( @moment(@value*1000).add(1,'day').unix() )
  prevDay: -> @setValue( @moment(@value*1000).subtract(1,'day').unix() )
  nextWeek: -> @setValue( @moment(@value*1000).add(1,'week').unix() )
  prevWeek: -> @setValue( @moment(@value*1000).subtract(1,'week').unix() )

  ## Keyboard control
  keyDown: (_key)->
    if EVENT.status.shiftKeyDown
      @prevMonth(true) if _key == Event.KEY_LEFT
      @nextMonth(true) if _key == Event.KEY_RIGHT
      @prevYear(true) if _key == Event.KEY_UP
      @nextYear(true) if _key == Event.KEY_DOWN
    else
      @nextDay() if _key == Event.KEY_RIGHT
      @prevDay() if _key == Event.KEY_LEFT
      @nextWeek() if _key == Event.KEY_DOWN
      @prevWeek() if _key == Event.KEY_UP
      @prevMonth(true) if _key == Event.KEY_PAGEUP
      @nextMonth(true) if _key == Event.KEY_PAGEDOWN
      @prevYear(true) if _key == Event.KEY_HOME
      @nextYear(true) if _key == Event.KEY_END
    true

  drawSubviews: ->
    Event.observe( @elemOfPart( 'prevMonth' ), 'click', => @prevMonth() )
    Event.observe( @elemOfPart( 'nextMonth' ), 'click', => @nextMonth() )

  ## Returns an array of week day names starting with the short name of the word "week".
  ## The default locale returns: ['Wk','Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  ## See HLocale for more details
  localizedDays: ->
    _str = @localeStrings
    _arr = @cloneObject( _str.weekDaysShort )
    _arr.push( _arr.shift() )
    _arr.unshift( _str.weekShort )
    _arr

  _destroyWeekDayElems: ->
    if @_weekDayElems?
      ELEM.del( _elemId ) for _elemId in @_weekDayElems
      @_weekDayElems = null

  ## Refreshes the week days header
  refreshWeekDays: ->
    @_destroyWeekDayElems()
    _dayNames = @localizedDays()
    _availWidth = @rect.width-2
    _dayWidth = Math.floor( _availWidth/8 )
    _leftOffset = ( _availWidth % 8 ) - 1
    _parentElem = @markupElemIds.label
    _dayElems = []
    for _dayName, i in _dayNames
      _dayElem = ELEM.make( _parentElem )
      ELEM.setHTML( _dayElem, _dayName )
      ELEM.setStyles( _dayElem,
        width: _dayWidth+'px'
        left: (i * _dayWidth + _leftOffset)+'px'
      )
    @_weekDayElems = _dayElems

  ## Calls #refreshWeekDays when theme is applied
  refreshLabel: ->
    @refreshWeekDays() if @markupElemIds? and not @_weekDayElems?

  ## Calculates the first and last week of the month of the _date
  ##
  ## Params:
  ## - _date:  A Date instance to check date range from
  ##
  ## Returns:
  ## [Object]: {
  ##   week: {
  ##     firstDate: [Date]
  ##     lastDate:  [Date]
  ##     firstNum:  [Number]
  ##     lastNum:   [Number]
  ##     count:     [Number]
  ##   }
  ##   month: {
  ##     firstDate: [Date]
  ##     lastDate:  [Date]
  ##   }
  ## }
  calendarDateRange: (_date)->
    _date = @moment( @_dateSel(_date) )
    _ranges =
      week:
        firstDate: _date.clone().startOf('month').startOf('week')
        lastDate:  _date.clone().endOf('month').endOf('week')
      month:
        firstDate: _date.clone().startOf('month')
        lastDate:  _date.clone().endOf('month')
    _ranges.week.firstNum = _ranges.week.firstDate.week()
    _ranges.week.lastNum = _ranges.week.lastDate.week()
    _ranges.week.count = _ranges.week.lastNum - _ranges.week.firstNum
    if _ranges.month.firstDate.weekday() < 3
      _ranges.week.firstDate.subtract(1,'week')
    _ranges

  lostActiveStatus: (_obj)->
    if (_obj and _obj.isChildOf(@) and not _obj.isChildOf(@menu) and not ( @menu? and _obj.isChildOf(@menu.menuItemView)) )
      @destroyMenus()
    @base(_obj)

  ## Calls #drawCalendar when the value is changed
  refreshValue: -> @drawCalendar( @date() )

  ## Stores the currently viewed year and month
  viewMonth: [ 1970, 0, 1 ]

  destroyMenus: ->
    if @yearMenu
      @yearMenu.dieSoon() if ( @yearMenu? and @yearMenu.die? and not @yearMenu.isDead )
      @yearMenu = null
      delete @yearMenu
    if @menu
      @menu.dieSoon() if ( @menu? and @menu.die? and not @menu.isDead )
      @menu = null
      delete @menu

  ## Shows a pulldown menu for month selection
  monthMenu: ->
    return unless HPopupMenu?
    _calendar = @
    _monthValues = []
    _monthValues.push( [ i, _monthName ] ) for _monthName, i in @localeStrings.monthsLong
    _rect = ELEM.getBoxCoords( @_monthMenu )
    _rect[1] -= @rect.top
    _rect[2] = 100 if _rect[2] < 100
    @destroyMenus()
    @menu = HPopupMenu.extend(
      menuShow: ->
        if @base()
          @_shouldSetValue = true
      lostActiveStatus: (_obj)->
        if (_obj and _obj.isChildOf(@parent) and not _obj.isChildOf(@) and _obj.isChildOf(@menuItemView) and not _obj == @)
          @parent.destroyMenus()
          EVENT.changeActiveControl(@parent)
        else
          @base(_obj)
      refreshValue: ->
        @base()
        return unless @_shouldSetValue
        if @_shouldSetValue and not @isDead
          @parent.viewMonth[1] = @value
          @parent.drawCalendar( @parent.moment( @parent.viewMonth ) )
          @_shouldSetValue = false
        @hide()
    ).new( _rect, @,
      value: @viewMonth[1]
      listItems: _monthValues
    )
    @menu.menuShow()

  ## Shows a text field for year selection
  yearMenu: ->
    _calendar = @
    _calendarEnable = @enabled
    _rect = ELEM.getBoxCoords( @_yearMenu )
    _rect[0] += 12
    _rect[2] = 40 if _rect[2] < 40
    @destroyMenus()
    @yearMenu = HNumericTextControl.extend(
      refreshValue: ->
        @base()
        @parent.viewMonth[0] = @value
        @parent.drawCalendar( @parent.moment( @parent.viewMonth ) )
      lostActiveStatus: (_obj)->
        @base(_obj)
        EVENT.changeActiveControl( @parent )
      gainedActiveStatus: (_obj)->
        @base(_obj)
      die: ->
        return if @isDead
        EVENT.changeActiveControl( @parent )
        @base()
      defaultKey: ->
        @base()
        true
    ).new( _rect, @,
      value: @year()
      minValue: -38399
      maxValue: 38400
      focusOnCreate: true
      refreshOnInput: false
      refreshOnIdle: false
      style:
        textAlign: 'left'
        fontSize: '12px'
        padding: 0
        margin: 0
    )
    EVENT.changeActiveControl(@yearMenu)

  _destroyCalendarElems: ->
    if @_drawCalendarElems?
      ELEM.del( _elemId ) for _elemId in @_drawCalendarElems
      @_drawCalendarElems = null

  die: ->
    @destroyMenus()
    @_destroyWeekDayElems()
    @_destroyCalendarElems()
    @base()

  _createGridElem: (_elems,_parent,_tag,_classNames,_styles)->
    _elemId = ELEM.make( _parent, _tag )
    _elems.push( _elemId )
    ELEM.addClassName( _elemId, _className ) for _className in _classNames
    ELEM.setStyles( _elemId, _styles )
    _elemId

  ## Draws the calendar with the date open given as input.
  ##
  ## Params:
  ## - _date: The date on which calendar UI is opened at.
  drawCalendar: (_date)->
    @destroyMenus()
    _date = @moment(@_dateSel(_date).getTime())
    _this = @
    _calendarDateRange = @calendarDateRange( _date )
    [ _monthFirst, _monthLast, _firstDate, _lastDate ] = [
      _calendarDateRange.month.firstDate
      _calendarDateRange.month.lastDate
      _calendarDateRange.week.firstDate
      _calendarDateRange.week.lastDate
    ]
    _valueDate = @moment(@value*1000)
    # console.log('monthFirst:',_monthFirst.toString())
    # console.log('monthLast:',_monthLast.toString())
    # console.log('firstDate:',_firstDate.toString())
    # console.log('lastDate:',_lastDate.toString())
    _colDate = _firstDate.clone()
    if @options.todayStart?
      _today  = @moment(@options.todayStart*1000)
    else if @options.todayStart == false
      _today  = false
    else
      _today  = @moment()
    _availWidth  = @rect.width - 2
    _availHeight = @rect.height - 36
    _leftPlus    = ( _availWidth % 8 ) - 2
    _topPlus     = ( _availHeight % 6 )
    _colWidth    = Math.floor( _availWidth / 8 )
    _rowHeight   = Math.floor( _availHeight / 6 )
    _parentElem  = @markupElemIds.value
    _elems = []
    for _row in [0..5]
      _top = (_row*_rowHeight)+_topPlus
      _weekElem = @_createGridElem( _elems, _parentElem, 'div', [ 'week_row' ],
        width: _availWidth+'px'
        height: _rowHeight+'px'
        top:          _top+'px'
      )
      for _col in [0..7]
        if _col == 0 # week number columns
          # _colDate = @moment( _firstDate ).add(_row,'weeks').add(_col,'days')
          _colElem = @_createGridElem( _elems, _weekElem, 'div', ['col_wk'],
            width:       _colWidth+'px'
            height:     _rowHeight+'px'
            lineHeight: _rowHeight+'px'
          )
          ELEM.setHTML( _colElem, _colDate.week() )
          # _colDate = _colDate.add(1,'days')
        else # week day columns
          # _colDate = @moment( _firstDate ).add(_row,'weeks').add(_col-1,'days')
          _colDate = _colDate.add(1,'days')
          _colSecs = _colDate.unix()
          _colClasses = []
          _prevDayLast = _colDate.clone().startOf('day').subtract(1,'ms')
          _nextDayFirst = _colDate.clone().endOf('day').add(1,'ms')
          # if _colDate.date() == 10
          #   console.log('prev:',_prevDayLast.toString(),
          #              ' date:',_date.toString(),
          #              ' next:',_nextDayFirst.toString(),
          #              ' value:',@moment(@value*1000).toString())
          if _valueDate.isAfter(_prevDayLast) and _valueDate.isBefore(_nextDayFirst)
            _colClasses.push( 'col_selected' )
          else if _colDate.isBefore(_monthFirst) or _colDate.isAfter(_monthLast)
            _colClasses.push( 'col_inactive' )
          else
            _colClasses.push( 'col_active' )
          if _today and _today.isAfter(_prevDayLast) and _today.isBefore(_nextDayFirst)
            _colClasses.push( 'col_today' )
          _left = (_col*_colWidth+_leftPlus)
          _colElem = @_createGridElem( _elems, _weekElem, 'a', _colClasses,
            left:            _left+'px'
            width:   (_colWidth-1)+'px'
            height: (_rowHeight-1)+'px'
            lineHeight: _rowHeight+'px'
          )
          ELEM.setAttr( _colElem, '_colSecs', _colSecs )
          Event.observe( ELEM.get( _colElem ), 'click', -> _this.setValue( @_colSecs ) ) if @enabled
          ELEM.setHTML( _colElem, _colDate.date() )

    _stateElem = @markupElemIds.state

    @_monthMenu = ELEM.make( _stateElem, 'span' )
    _elems.push( @_monthMenu )

    Event.observe( ELEM.get( @_monthMenu ), 'click', ( -> _this.monthMenu() ), false ) if @enabled
    ELEM.setHTML( @_monthMenu, @monthName( _date ) )

    _spacer = ELEM.make( _stateElem, 'span' )
    _elems.push( _spacer )
    ELEM.setHTML( _spacer, '&nbsp;' )

    @_yearMenu = ELEM.make( _stateElem, 'span' )#, 'a' )
    _elems.push( @_yearMenu )
    if @enabled
      Event.observe( ELEM.get( @_yearMenu ), 'click', ( -> _this.yearMenu() ), false )
    ELEM.setHTML( @_yearMenu, @year( _date ) )

    @viewMonth = [ _monthFirst.year(), _monthFirst.month(), _monthFirst.date() ]
    @_destroyCalendarElems()
    @_drawCalendarElems = _elems

HCalendar.implement( HDateTime )
