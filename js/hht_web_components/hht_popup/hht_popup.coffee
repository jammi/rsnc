HHTPopup = HView.extend
  componentName: 'hht_popup'
  markupElemNames: [ 'bg', 'barb' ]

  viewDefaults: HViewDefaults.extend
    direction: 'right' #left, right, bottom, up

  constructor: (_rect, _parent, _options) ->
    @base( _rect, _parent, _options )
    if @options.direction == 'right'
      _rect = [ 18, 3, null, null, 3, 3 ]
    if @options.direction == 'left'
      _rect = [ 3, 3, null, null, 18, 3 ]
    if @options.direction == 'top'
      _rect = [ 3, 3, null, null, 3, 18 ]
    if @options.direction == 'bottom'
      _rect = [ 3, 18, null, null, 3, 3 ]
    @_view = HControl.extend(
      defaultEvents:
        resize: true
      resize: ->
        HHTPopupManager.closePopup()
      escKey: ->
        HHTPopupManager.closePopup()
        true
      lostActiveStatus: ( _newActive ) ->
        if _newActive? and _newActive.isChildOf( @ )
          setTimeout( ( => EVENT.changeActiveControl( @ ) ), 10 )
        else
          HHTPopupManager.closePopup()
    ).new( _rect, @ )
    @setStyle( 'pointer-events', 'none' )
    true

HHTPopupManager =
  popup: null

  closePopup: ->
    _popup = @popup
    @popup = null
    if _popup?
      _popup.hide()
      _popup.dieSoon()

  newPopup: ( _rect, _parent, _class, _opts ) ->
    @closePopup()
    _opts = {} unless _opts
    [ x, y, w, h ] = _rect
    if _opts.targetElem?
      [ tx, ty, tw, th ] = ELEM.getVisibleBoxCoords( _opts.targetElem )
      x = tx + tw
    else
      [ tx, ty, tw, th ] = [ x, y, 1, 1 ]
    y = ty  + ( th - h ) / 2
    if _parent.elemId
      [ _parentW, _parentH ] = ELEM.getSize( _parent.elemId )
    else
      [ _parentW, _parentH ] = ELEM.windowSize()
    if x > _parentW - w
      x = tx - w
      _direction = 'left'
      _viewRect = [ 10, 10, null, null, 10, 10 ]
    else
      _direction = 'right'
      _viewRect = [ 10, 10, null, null, 10, 10 ]

    @popup = HHTPopup.new( [ x, y, w, h ], _parent,
      direction: _direction
    )
    ELEM.addClassName( @popup.elemId, _direction )
    ELEM.addClassName( @popup.elemId, 'popup_anim' )
    _view = _class.new( _viewRect, @popup._view, _opts )
    _view.setStyle( 'pointer-events', 'auto' )
    EVENT.changeActiveControl( @popup._view )
    ELEM.flush()
    @popup

  newVPopup: ( _rect, _parent, _class, _opts ) ->
    @closePopup()
    _opts = {} unless _opts
    [ x, y, w, h ] = _rect
    if _opts.targetElem?
      [ tx, ty, tw, th ] = ELEM.getVisibleBoxCoords( _opts.targetElem )
      y = ty + th
    else
      [ tx, ty, tw, th ] = [ x, y, 1, 1 ]
    x = tx  + ( tw - w ) / 2

    if _parent.elemId
      [ _parentW, _parentH ] = ELEM.getSize( _parent.elemId )
    else
      [ _parentW, _parentH ] = ELEM.windowSize()
    if y > _parentH - h
      y = ty - h
      _direction = 'top'
      _viewRect = [ 10, 10, null, null, 10, 10 ]
    else
      _direction = 'bottom'
      _viewRect = [ 10, 10, null, null, 10, 10 ]

    @popup = HHTPopup.new( [ x, y, w, h ], _parent,
      direction: _direction
    )
    ELEM.addClassName( @popup.elemId, _direction )
    ELEM.addClassName( @popup.elemId, 'popup_anim' )
    _view = _class.new( _viewRect, @popup._view, _opts )
    _view.setStyle( 'pointer-events', 'auto' )
    EVENT.changeActiveControl( @popup._view )
    ELEM.flush()
    @popup
