HHTTimePicker = HControl.extend
  componentName: 'hht_timepicker'
  markupElemNames: [ 'bg', 'input_parent', 'value', 'icon' ]

  controlDefaults: HControlDefaults.extend
    refreshOnBlur: true
    useUTC: true
    fieldFormat: null

  defaultEvents:
    textEnter: true
    click: true

  customOptions: (_options)->
    _options.useUTC = HLocale.dateTime.defaultOptions.useUTC if _options.useUTC == null
    _options.fieldFormat = HLocale.dateTime.strings.timeFormat if _options.fieldFormat == null

  _formatIcon: ->
    HHT_ICONS.get( 'clock' )

  getInputElement: ->
    ELEM.get( @markupElemIds.value )

  setFocus: ->
    _elem = @getInputElement()
    _elem.focus() if _elem?
    true

  lostActiveStatus: (_prevActive)->
    @base(_prevActive)
    if @markupElemIds? and @markupElemIds.value? and _prevActive != @
      ELEM.get( @markupElemIds.value ).blur()
      @textBlur()

  setStyle: (_name, _value, _cacheOverride)->
    @base(_name, _value, _cacheOverride)
    return unless @markupElemIds? && @markupElemIds.value?
    @setStyleOfPart('value', _name, _value, _cacheOverride)

  click: ->
    @getInputElement().focus() unless @hasTextFocus

  setTabIndex: ( _tabIndex )->
    @setAttrOfPart( 'value', 'tabIndex', _tabIndex )
    if _tabIndex == 1 and !BROWSER_TYPE.mobile
      @setFocus()

  ### = Description
  ## Special event for text entry components.
  ## Called when the input field gains focus.
  ##
  ###
  textFocus: ->
    return if @hasTextFocus
    EVENT.changeActiveControl( @ )
    @hasTextFocus = true
    true

  ### = Description
  ## Special event for text entry components.
  ## Called when the input field loses focus.
  ###
  textBlur: ->
    return unless @hasTextFocus
    @hasTextFocus = false
    if @options.refreshOnBlur
      @_updateValueFromField()
      @refreshValue()
    true


  ### = Description
  ## Returns the value of the input element.
  ###
  getTextFieldValue: ->
    _inputElement = @getInputElement()
    return _inputElement.value if _inputElement?
    ''

  valueToField: ( _value ) ->
    @moment( _value * 1000 ).format( @options.fieldFormat )

  fieldToValue: (_value) ->
    _date = @moment( _value, @options.fieldFormat )
    return @value unless _date.isValid()
    _date.unix()

  ### = Description
  ## Sets the value of the input element.
  ##
  ## = Parameters
  ## +_value+::  The value to set.
  ###
  setTextFieldValue: ( _value, _override )->
    _inputElement = @getInputElement()
    _value = @valueToField(_value)
    if not @hasTextFocus or _override
      if ( not _value? )
        _inputElement.value = ''
      else if _inputElement.value != _value.toString()
        _inputElement.value = _value 

  _changedFieldValue: (_value1,_value2) ->
    _value1 != _value2

  validateText: (_value)-> @fieldToValue( _value )

  _updateValueFromField: ->
    _validatedValue = @validateText( @getTextFieldValue() )
    if @_changedFieldValue( _validatedValue, @value )
      @setValue( _validatedValue )

  refreshValue: ->
    @setTextFieldValue( @value )
    true

  die: ->
    @getInputElement().blur() if @hasTextFocus
    Event.stopObserving( @markupElemIds.value, 'focus', @_textFocusFn )
    Event.stopObserving( @markupElemIds.value, 'blur', @_textBlurFn )
    Event.stopObserving( @markupElemIds.icon, 'click', @_iconClickFn )
    @base()

  openCalendar: ->
    [ x, y ] = [ @pageX(), @pageY() ]
    [ w, h ] = ELEM.getSize( @elemId )
    @_calendar = HHTTimeSelector.new( [ x + ( w - 120 ) / 2, y + 34, 120, 100 ], @app,
      value: @value
      target: @
    )
    EVENT.changeActiveControl( @_calendar )
    ELEM.flush()
    true

  drawSubviews: ->
    @toggleCSSClass( @elemId, 'show_weekday', @options.showWeekDay == true )
    @hasTextFocus = false
    @_textFocusFn = => @textFocus()
    @_textBlurFn = => @textBlur()
    @_iconClickFn = =>
      if @enabled
        @openCalendar()
    Event.observe( @markupElemIds.value, 'focus', @_textFocusFn )
    Event.observe( @markupElemIds.value, 'blur', @_textBlurFn )
    Event.observe( @markupElemIds.icon, 'click', @_iconClickFn )
    true

