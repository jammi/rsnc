HHTNotification =
  current: null

  del: ->
    if HHTNotification.current?
      HHTNotification.current.die()
      HHTNotification.current = null

  show: ( _parent, _message, _timeout ) ->
    HHTNotification.del()
    _timeout = 3000 unless _timeout
    _notif = HView.new( [ 0, 0, 100, 40 ], _parent,
      html: _message
    )
    ELEM.addClassName( _notif.elemId, 'hht_notification' )
    HHTNotification.current = _notif
    _width = _notif.stringWidth( _message, null, _notif.elemId ) + 20
    _height = 40
    [ _appW, _appH ] = ELEM.windowSize()
    _notif.resizeTo( _width, _height )
    _notif.moveTo( (_appW - _width) / 2, (_appH - _height) / 2 )
    ELEM.flush()
    setTimeout( ( -> HHTNotification.del() ), _timeout )
    true
