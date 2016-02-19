HHTMiniCalendar = HControl.extend
  componentName: 'hht_mini_calendar'
  markupElemNames: [ 'left_arrow', 'right_arrow', 'title', 'days' ]

  controlDefaults: HControlDefaults.extend
    fieldFormat: 'MMMM, YYYY'
    useUTC: true

  defaultEvents:
    click: true
    resize: true

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

  _inRect: ( _x1, _y1, _x2, _y2, _w, _h ) ->
    ( !( _x1 < _x2 or _y1 < _y2 or _x1 > _x2 + _w or _y1 > _y2 + _h ) )

  click: ( x, y ) ->
    _date = @moment( @_viewDate.unix() * 1000 ).startOf( 'month' ).startOf( 'week' )
    for _elem in @_days
      [ _ex, _ey ] = ELEM.getVisiblePosition( _elem )
      [ _ew, _eh ] = ELEM.getSize( _elem )
      if @_inRect( x, y, _ex, _ey, _ew, _eh )
        @setValue( _date.unix() )
        @close()
        return false
      _date.add( 1, 'days' )
    true

  lostActiveStatus: ( _newActive ) ->
    @close()

  _formatLeftArrow: ->
    HHT_ICONS.get( 'arrow_left' )

  _formatRightArrow: ->
    HHT_ICONS.get( 'arrow_right' )

  _drawSelector: ->
    true

  _updateView: ->
    _selectedDate = @moment( @value * 1000 )
    _today = @moment()
    _month = @_viewDate.month()
    ELEM.setHTML( @markupElemIds.title, @_viewDate.format( @options.fieldFormat ) )
    _date = @moment( @_viewDate.unix() * 1000 ).startOf( 'month' ).startOf( 'week' )
    for _elem in @_days
      ELEM.setHTML( _elem, '<div class="number">' + _date.format( 'D' ) + '</div>' )
      @toggleCSSClass( _elem, 'active_month', _date.month() == _month )
      @toggleCSSClass( _elem, 'selected', _date.isSame( _selectedDate, 'day' ) )
      @toggleCSSClass( _elem, 'today', _date.isSame( _today, 'day' ) )
      _date.add( 1, 'days' )
    true

  _drawDays: ->
    _date = @moment().startOf( 'week' )
    for _dow in [ 0..6 ]
      _elemId = ELEM.make( @markupElemIds.days, 'div'
        classes: [ 'title' ]
        html: _date.format( 'ddd' )
        styles:
          left: ( _dow * 100 / 7 ) + '%'
          top: '0px'
          width: 'calc( 100% / 7 - 5px )'
          height: 'calc( 100% / 6 - 5px )'
      )
      @_dayNames.push( _elemId )
      _date.add( 1, 'days' )

    for _week in [ 0..5 ]
      for _dow in [ 0..6 ]
        _elemId = ELEM.make( @markupElemIds.days, 'div'
          classes: [ 'day' ]
          styles:
            left: ( _dow * 100 / 7 ) + '%'
            top: ( (_week + 1) * 100 / 7 ) + '%'
            width: 'calc( 100% / 7 - 5px )'
            height: 'calc( 100% / 6 - 5px )'
        )
        @_days.push( _elemId )
    true

    true

  _updateDays: ->
    true

  _prevMonth: ->
    @_viewDate.subtract( 1, 'months' )
    @_updateView()

  _nextMonth: ->
    @_viewDate.add( 1, 'months' )
    @_updateView()

  die: ->
    Event.stopObserving( @markupElemIds.left_arrow, 'click', @_leftClickFn )
    Event.stopObserving( @markupElemIds.right_arrow, 'click', @_rightClickFn )
    @base()

  drawSubviews: ->
    @_viewDate = @moment( @value * 1000 )
    @_days = []
    @_dayNames = []
    @_drawSelector()
    @_drawDays()
    @_updateView()
    @_leftClickFn = => @_prevMonth()
    @_rightClickFn = => @_nextMonth()
    Event.observe( @markupElemIds.left_arrow, 'click', @_leftClickFn )
    Event.observe( @markupElemIds.right_arrow, 'click', @_rightClickFn )
    true
