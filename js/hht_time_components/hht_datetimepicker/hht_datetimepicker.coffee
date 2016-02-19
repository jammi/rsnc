HHTDateTimePicker = HControl.extend

  controlDefaults: HControlDefaults.extend
    tabIndex: 0
    showWeekday: true
    calendarPicker: true

  combineDateTime: ( _date, _time ) ->
    _d = new Date( _date * 1000 )
    _t = new Date( _time * 1000 )
    Date.UTC( 
      _d.getUTCFullYear(), _d.getUTCMonth(), _d.getUTCDate(),
      _t.getUTCHours(), _t.getUTCMinutes(), _t.getUTCSeconds(), 0
    ) / 1000

  setEnabled: ( _enabled ) ->
    @base( _enabled )
    @date.setEnabled( _enabled ) if @date?
    @time.setEnabled( _enabled ) if @time?
    true

  getTime: ( _allDay )->
    if _allDay == true
      @combineDateTime( @options.dateValue.value, 0 )
    else
      @combineDateTime( @options.dateValue.value, @options.timeValue.value )

  drawSubviews: ->
    @date = HHTDatePicker.new( [ 0, 0, null, null, 100, 0 ], @,
      bind: @options.dateValue
      todayStart: @options.todayValue
      fieldFormat: HLocale.components.HHTDateTime.strings.date_format
      calendarPicker: @options.calendarPicker
      preserveTime: false
      tabIndex: @options.tabIndex
      enabled: @enabled
      showWeekday: @options.showWeekday
    )
    @time = HHTTimePicker.new( [ null, 0, 95, null, 0, 0 ], @,
      bind: @options.timeValue
      todayStart: @options.todayValue
      fieldFormat: HLocale.components.HHTDateTime.strings.time_format
      timePicker: true
      tabIndex: @options.tabIndex + 1
      enabled: @enabled
    )

