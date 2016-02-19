HHTTimeSelector = HControl.extend
  componentName: 'hht_time_selector'
  markupElemNames: [ 'hours_up', 'hours_down', 'mins_up', 'mins_down', 'hours', 'mins', 'am_pm' ]

  controlDefaults: HControlDefaults.extend
    useUTC: true

  defaultEvents:
    resize: true

  _formatUpIcon: ->
    HHT_ICONS.get( 'arrow_up' )

  _formatDownIcon: ->
    HHT_ICONS.get( 'arrow_down' )

  escKey: ->
    @close()
    true

  resize: ->
    @close()

  close: ->
    return if @closed
    @closed = true
    if @options.target
      @options.target.setValue( @value )
    @hide()
    setTimeout( ( => @dieSoon() ), 500 )
    true

  lostActiveStatus: ( _newActive ) ->
    @close()

  _updateView: ->
    _selectedTime = @moment( @value * 1000 )
    if HLocale.components.HHTDateTime.strings.clock_type == '12'
      ELEM.setHTML( @markupElemIds.hours, _selectedTime.format( 'hh' ) )
      ELEM.setHTML( @markupElemIds.mins, _selectedTime.format( 'mm' ) )
      ELEM.setHTML( @markupElemIds.am_pm, _selectedTime.format( 'a' ) )
    else
      ELEM.setHTML( @markupElemIds.hours, _selectedTime.format( 'HH' ) )
      ELEM.setHTML( @markupElemIds.mins, _selectedTime.format( 'mm' ) )
      ELEM.setHTML( @markupElemIds.am_pm, '' )
    true

  _prevMin: ->
    _step = 300
    _step += @value % _step
    @setValue( @moment( @value * 1000 ).subtract( _step, 'seconds' ).unix() )
    @_updateView()

  _nextMin: ->
    _step = 300
    _step -= @value % _step
    @setValue( @moment( @value * 1000 ).add( _step, 'seconds' ).unix() )
    @_updateView()

  _prevHour: ->
    @setValue( @moment( @value * 1000 ).subtract( 1, 'hours' ).unix() )
    @_updateView()

  _nextHour: ->
    @setValue( @moment( @value * 1000 ).add( 1, 'hours' ).unix() )
    @_updateView()

  die: ->
    Event.stopObserving( @markupElemIds.hours_up, 'click', @_hoursUpClickFn )
    Event.stopObserving( @markupElemIds.hours_down, 'click', @_hoursDownClickFn )
    Event.stopObserving( @markupElemIds.mins_up, 'click', @_minsUpClickFn )
    Event.stopObserving( @markupElemIds.mins_down, 'click', @_minsDownClickFn )
    @base()

  drawSubviews: ->
    if HLocale.components.HHTDateTime.strings.clock_type == '12'
      @resizeTo( 150, 100 )
    else
      @resizeTo( 120, 100 )
    @_updateView()
    @_hoursUpClickFn = => @_nextHour()
    @_hoursDownClickFn = => @_prevHour()
    @_minsUpClickFn = => @_nextMin()
    @_minsDownClickFn = => @_prevMin()
    Event.observe( @markupElemIds.hours_up, 'click', @_hoursUpClickFn )
    Event.observe( @markupElemIds.hours_down, 'click', @_hoursDownClickFn )
    Event.observe( @markupElemIds.mins_up, 'click', @_minsUpClickFn )
    Event.observe( @markupElemIds.mins_down, 'click', @_minsDownClickFn )
    true
