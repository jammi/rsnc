HHTDurationPicker = HControl.extend
  componentName: 'hht_durationpicker'

  controlDefaults: HControlDefaults.extend
    fieldFormat: 'HH:mm:ss'
    fieldLabel: 'hh:mm:ss'
    pickerWidth: 40
 
  setFocus: ->
    if @_hours?
      @_hours.setFocus()
    else if @_mins?
      @_mins.setFocus()
    else if @_secs?
      @_secs.setFocus()

  _parseNumber: ( v ) ->
    v = parseInt( v )
    if isNaN( v )
      0
    else
      v

  _twoDigits: ( _value ) ->
    if _value < 10
      return "0" + _value
    else
    return _value

  _formatHours: ->
    _value = @_parseNumber( @value )
    return "" if _value == 0
    _hours = Math.floor( _value / 3600 )
    @_twoDigits( _hours )

  _formatMins: ->
    _value = @_parseNumber( @value )
    return "" if _value == 0
    _mins = Math.floor( _value / 60 )
    if @_hours?
      _mins = _mins % 60
    @_twoDigits( _mins )

  _formatSecs: ->
    _value = @_parseNumber( @value )
    return "" if _value == 0
    _secs = _value
    if @_mins?
      _secs = _value % 60
    @_twoDigits( _secs )

  _valueChanged: ->
    return unless @inited
    if @_hours?
      _h = @_parseNumber( @_hours.value ) * 3600
    else
      _h = 0
    if @_mins?
      _m = @_parseNumber( @_mins.value ) * 60
    else
      _m = 0
    if @_secs?
      _s = @_parseNumber( @_secs.value )
    else
      _s = 0
    @_localValue = _h + _m + _s
    @setValue( @_localValue )
    true

  _createHours: ( _rect ) ->
    HHTNumberControl.extend(
      refreshValue: ->
        @parent._valueChanged( @value )
    ).new( _rect, @,
      value: @_formatHours()
      fieldMin: 0
      fieldStep: 1
    )

  _createMins: ( _rect ) ->
    if @_hours?
      _fieldMax = 59
    else
      _fieldMax = null
    HHTNumberControl.extend(
      refreshValue: ->
        @parent._valueChanged( @value )
    ).new( _rect, @,
      value: @_formatMins()
      fieldMin: 0
      fieldMax: _fieldMax
      fieldStep: 1
    )

  _createSecs: ( _rect ) ->
    if @_mins?
      _fieldMax = 59
    else
      _fieldMax = null
    HHTNumberControl.extend(
      refreshValue: ->
        @parent._valueChanged( @value )
    ).new( _rect, @,
      value: @_formatSecs()
      fieldMin: 0
      fieldMax: _fieldMax
      fieldStep: 10
    )

  _createLabel: ( _rect ) ->
    if @options.fieldLabel
      HHTLabel.new( _rect, @,
        value: @options.fieldLabel
      )

  refreshValue: ->
    @base()
    if @value != @_localValue
      @inited = false
      @_hours.setValue( @_formatHours() ) if @_hours?
      @_mins.setValue( @_formatMins() ) if @_mins?
      @_secs.setValue( @_formatSecs() ) if @_secs?
      @inited = true

  drawSubviews: ->
    _w = @options.pickerWidth
    _h = @rect.height
    if @options.fieldFormat == 'HH:mm:ss'
      @_hours = @_createHours( [ 0, 0, _w, _h ] )
      @_mins = @_createMins( [ _w + 5, 0, _w, _h ] )
      @_secs = @_createSecs( [ _w * 2 + 10, 0, _w, _h ] )
      @_label = @_createLabel( [ _w * 3 + 15, 0, null, _h, 0, null ] )
    else if @options.fieldFormat == 'HH:mm'
      @_hours = @_createHours( [ 0, 0, _w, _h ] )
      @_mins = @_createMins( [ _w + 5, 0, _w, _h ] )
      @_label = @_createLabel( [ _w * 2 + 10, 0, null, _h, 0, null ] )
    else if @options.fieldFormat == 'mm:ss'
      @_mins = @_createMins( [ 0, 0, _w, _h ] )
      @_secs = @_createSecs( [ _w + 5, 0, _w, _h ] )
      @_label = @_createLabel( [ _w * 2 + 10, 0, null, _h, 0, null ] )
    @inited = true
    true