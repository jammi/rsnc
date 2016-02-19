HHTSlider = HControl.extend
  componentName: 'hht_slider'

  defaultEvents:
    draggable: true
    keyDown: 'repeat'
    keyUp: true

  controlDefaults: HControlDefaults.extend
    minValue: 0
    maxValue: 1
    roundValue: false
    thumbSize: 21

  refreshOnValueChange: false

  setValue: (_value) ->
    if _value < @minValue
      _value = @minValue
    if _value > @maxValue
      _value = @maxValue
    if @options.roundValue
      @base( Math.round( _value ) )
    else
      @base(_value)
    if @_thumbElemId
      @drawThumbPos()
    @

  draw: ->
    unless @drawn
      @drawRect()
      @drawMarkup()
      @_initThumb()
    @refresh()

  startDrag: ( x, y ) ->
    _originalPosition = ELEM.getVisiblePosition( @elemId, true )
    @_originX = _originalPosition[0]
    @_originY = _originalPosition[1]
    @drag(x,y)

  endDrag: ( x, y ) ->
    @drag( x, y )

  drag: ( x, y ) ->
    x -= @_originX
    _value = @_pos2value( x )
    @setValue(_value)

  keyDown: ( _keycode ) ->
    if _keycode == Event.KEY_LEFT
      @_moveThumb( -0.05 )
    else if _keycode == Event.KEY_RIGHT
      @_moveThumb( 0.05 )
    return true

  keyUp: ( _keycode ) ->
    return true

  _moveThumb: ( _valueChange, _rate ) ->
    if @active
      _value = (@maxValue - @minValue) * _valueChange
      @setValue( @value + _value)

  _initThumb: ->
    @_thumbElemId = @markupElemIds.control
    @drawThumbPos()

  _value2px: ->
    _pxrange  = @rect.width - @options.thumbSize
    _intvalue = _pxrange * ( (@value - @minValue) / (@maxValue - @minValue) )
    _pxvalue = parseInt(_intvalue, 10) + 'px'
    return _pxvalue

  _pos2value: (_mousePos) ->
    _pxrange  = @rect.width - @options.thumbSize
    _mousePos -= (@options.thumbSize/2)
    if _mousePos < 0
      _mousePos = 0
    if _mousePos > _pxrange
      _mousePos = _pxrange
    return @minValue + ((_mousePos / _pxrange) * (@maxValue - @minValue))

  drawThumbPos: ->
    _whichprop = 'left'
    _propval = @_value2px()
    ELEM.setStyle( @_thumbElemId, _whichprop, _propval )
  