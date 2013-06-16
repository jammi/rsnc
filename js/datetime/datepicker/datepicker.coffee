HDatePicker = HTextControl.extend
  defaultEvents: UtilMethods.prototype.cloneObject( HNumberField.prototype.defaultEvents )
  controlDefaults: HTextControl.prototype.controlDefaults.extend
    refreshAfter: 3
    useUTC: null
    fieldFormat: null
    preserveTime: true
    preserveDate: false
    calendarPicker: false
    calendarHorizontalAlign: 'right'
    calendarVerticalAlign: 'top'
    scrollUnit: 'days'
  customOptions: (_options)->
    _options.useUTC = HLocale.dateTime.defaultOptions.useUTC if _options.useUTC == null
    _options.fieldFormat = HLocale.dateTime.strings.dateFormat if _options.fieldFormat == null
  mouseWheel: (_delta)->
    _date = @moment(@value*1000)
    if _delta > 0
      _date.add(1,@options.scrollUnit)
    else if _delta < 0
      _date.subtract(1,@options.scrollUnit)
    @setValue(_date.unix())
    @setTextFieldValue(@value,true)
    true
  valueToField: (_value)->
    _date = @moment(_value*1000)
    @_datePreserve = [ _date.year(), _date.month(), _date.date() ] if @options.preserveDate
    if @options.preserveTime and @_timePreserve? and @calendar? and not @calendar.menuItemView.isHidden
      @_dateRestore(_date)
      @setValue(_date.unix())
    else if @options.preserveTime
      @_timePreserve = [ _date.hours(), _date.minutes(), _date.seconds() ] if @options.preserveTime
    _date.format(@options.fieldFormat)
  _dateRestore: (_date)->
    if @_datePreserve? and @options.preserveDate
      [ _year, _month, _mday ] = @_datePreserve
      _date.year( _year )
      _date.month( _month )
      _date.date( _mday )
      until _date.isValid()
        _mday = _mday - 1
        _date.date( _mday )
    else if _date.year() == 0 and _date.month() == 0 and _date.date() == 1
      _date.year(1970)
      _date.month(0)
      _date.date(1)
    if @_timePreserve? and @options.preserveTime
      [ _hours, _minutes, _seconds ] = @_timePreserve
      _date.hours( _hours )
      _date.minutes( _minutes )
      _date.seconds( _seconds )
  fieldToValue: (_value)->
    _date = @moment(_value,@options.fieldFormat)
    if _date.isValid()
      @setValid(true)
    else
      @setValid(false)
      return @value
    @_dateRestore(_date)
    _date.unix()
  refreshValue: ->
    @base()
    @calendar.setValue(@value) if @calendar?
  drawSubviews: ->
    @setStyleOfPart('value','textAlign','right')
    # @base()
    if @options.calendarPicker
      @setStyleOfPart('label','right','26px')
      @calendar = HCalendarPulldown.extend(
        refreshValue: ->
          @base()
          @parent.setValue(@value)
      ).new( [null,0,24,24,1,null], @,
        value: @value
        valueObj: @valueObj
        useUTC: @options.useUTC
        todayStart: @options.todayStart
        calendarHorizontalAlign: @options.calendarHorizontalAlign
        calendarVerticalAlign: @options.calendarVerticalAlign
        preserveTime: @options.preserveTime
        style:
          borderLeft: '1px dotted #666'
      )
      @calendar.bringToFront()
