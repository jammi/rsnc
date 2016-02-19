HHTProgressIndicator = HView.extend
  _toggleDirection: ->
    if @_animDirection == 0
      @_animDirection = 1
    else
      @_animDirection = 0
    _directionRect = HRect.nu( @[ '_rect' + @_animDirection ] )
    @_indicator.animateTo( _directionRect, 2000 )

  drawSubviews: ->
    @_indicator = null
    @_animDirection = 0
    _width = @rect.width
    _height = @rect.height
    _width -= 2
    @setStyle( 'border', '1px solid #e6e7e8' )
    @setStyle( 'background-color', '#fff' )
    @['_rect'+0] = HRect.nu( 0, 0, _height + 20, _height )
    @['_rect'+1] = HRect.nu( _width - _height, 0, _width, _height )
    @_indicator = HView.nu( HRect.nu( @['_rect'+0] ), @ )
    @_indicator.setStyle('background-color','#00AAEF')
    @_indicator.onAnimationEnd = =>
      @_toggleDirection()
    @_toggleDirection()
