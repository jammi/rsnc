HHTFullScreenView = UtilMethods.extend

  die: ->
    if @_listenersActivated == true
      document.removeEventListener( 'fullscreenchange', @_onFullScreenChangeEventListener )
      document.removeEventListener( 'mozfullscreenchange', @_onFullScreenChangeEventListener )
      document.removeEventListener( 'webkitfullscreenchange', @_onFullScreenChangeEventListener )
    @base()

  _isFullScreen: ->
    ( document.fullScreenElement? || document.mozFullScreen || document.webkitIsFullScreen )

  _requestFullScreen: ( _targetView ) ->
    unless @_listenersActivated
      @_onFullScreenChangeEventListener = ( e ) => @_onFullScreenChange()
      document.addEventListener( 'fullscreenchange', @_onFullScreenChangeEventListener )
      document.addEventListener( 'mozfullscreenchange', @_onFullScreenChangeEventListener )
      document.addEventListener( 'webkitfullscreenchange', @_onFullScreenChangeEventListener )
      @_listenersActivated = true

    if _targetView?
      @_targetView = _targetView
    else
      @_targetView = @
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
      @_oldParent = @_targetView.parent
      @_oldRect = @_targetView.rect.toArray()
      @_oldZIndex = ELEM.getStyle( @_targetView.elemId, 'z-index' )
      @parent.removeView( @_targetView.viewId )
      @app.addView( @_targetView )
      ELEM.moveToParent( @_targetView.elemId, @app.elemId )
      @_targetView.setRect( [ 0, 0, null, null, 0, 0 ] )
      @_targetView.drawRect()
      ELEM.setStyle( @_targetView.elemId, 'z-index', 30000 )
    else
      @app.removeView( @_targetView.viewId )
      @_oldParent.addView( @_targetView )
      ELEM.moveToParent( @_targetView.elemId, @_oldParent.elemId )

      @_targetView.setRect( @_oldRect )
      @_targetView.drawRect()
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
