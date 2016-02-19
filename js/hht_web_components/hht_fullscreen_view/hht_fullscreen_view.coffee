HHTFullScreenView = HControl.extend

  constructor: (_rect, _parent, _options) ->
    @base( _rect, _parent, _options )
    @_onFullScreenChangeEventListener = ( e ) => @_onFullScreenChange()
    document.addEventListener( 'fullscreenchange', @_onFullScreenChangeEventListener )
    document.addEventListener( 'mozfullscreenchange', @_onFullScreenChangeEventListener )
    document.addEventListener( 'webkitfullscreenchange', @_onFullScreenChangeEventListener )
    ELEM.setStyle( @elemId, 'background-color', '#FFF' )

  die: ->
    document.removeEventListener( 'fullscreenchange', @_onFullScreenChangeEventListener )
    document.removeEventListener( 'mozfullscreenchange', @_onFullScreenChangeEventListener )
    document.removeEventListener( 'webkitfullscreenchange', @_onFullScreenChangeEventListener )
    @base()

  _isFullScreen: ->
    ( document.fullScreenElement? || document.mozFullScreen || document.webkitIsFullScreen )

  onFullScreenChange: ( _isFullScreen ) ->
    true

  _requestFullScreen: ->
    _elem = ELEM.get( @app.elemId )
    if _elem.requestFullScreen?
      _elem.requestFullScreen()
    else if _elem.mozRequestFullScreen?
      _elem.mozRequestFullScreen()
    else if _elem.webkitRequestFullScreen?
      _elem.webkitRequestFullScreen()
    return true

  _onFullScreenChange: ( e ) ->
    if @_isFullScreen()
      @_oldParent = @parent
      @_oldLeft = ELEM.getStyle( @elemId, 'left' )
      @_oldTop = ELEM.getStyle( @elemId, 'top' )
      @_oldRight = ELEM.getStyle( @elemId, 'right' )
      @_oldBottom = ELEM.getStyle( @elemId, 'bottom' )
      @_oldZIndex = ELEM.getStyle( @elemId, 'z-index' )
      @parent.removeView( @viewId )
      @app.addView( @ )
      ELEM.moveToParent( @elemId, @app.elemId )
      ELEM.setStyle( @elemId, 'left', 0 )
      ELEM.setStyle( @elemId, 'top', 0 )
      ELEM.setStyle( @elemId, 'right', 0 )
      ELEM.setStyle( @elemId, 'bottom', 0 )
      ELEM.setStyle( @elemId, 'z-index', 30000 )
    else
      @app.removeView( @viewId )
      @_oldParent.addView( @ )
      ELEM.moveToParent( @elemId, @_oldParent.elemId )

      ELEM.setStyle( @elemId, 'left', @_oldLeft )
      ELEM.setStyle( @elemId, 'top', @_oldTop )
      ELEM.setStyle( @elemId, 'right', @_oldRight )
      ELEM.setStyle( @elemId, 'bottom', @_oldBottom )
      ELEM.setStyle( @elemId, 'z-index', @_oldZIndex )
    @onFullScreenChange( @_isFullScreen() )
    setTimeout( ( => 
      EVENT.resize()
      ELEM.flush()
      HSystem._updateFlexibleRects()
    ), 1000 )

    true

  _cancelFullScreen: ->
    _elem = document
    if _elem.cancelFullScreen?
      _elem.cancelFullScreen()
    else if _elem.mozCancelFullScreen?
      _elem.mozCancelFullScreen()
    else if _elem.webkitCancelFullScreen?
      _elem.webkitCancelFullScreen()
    return true
