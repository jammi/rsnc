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
    _parentView = HControl.extend(
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

    [ w, h ] = ELEM.getSize( @elemId )
    if @options.barbXOffset != 0
      @setStyleOfPart( 'barb', 'left', ( w / 2 + @options.barbXOffset - 15 ) + 'px')
    if @options.barbYOffset != 0
      @setStyleOfPart( 'barb', 'top', ( h / 2 + @options.barbYOffset - 15 ) + 'px' )

    @setStyle( 'pointer-events', 'none' )
    @setCSSClass( @options.direction )
    @setCSSClass( 'popup_anim' )

    _view = @options.viewClass.new( [ 10, 10, null, null, 10, 10 ], _parentView, @options.viewOpts )
    _closeButton = HHTIconButton.new( [ null, 5, 30, 30, 5, null ], _parentView,
      type: 'close'
      iconSize: 10
      click: => HHTPopupManager.closePopup()
    )
    _view.setStyle( 'pointer-events', 'auto' )
    _closeButton.setStyle( 'pointer-events', 'auto' )
    EVENT.changeActiveControl( _parentView )
    ELEM.flush()
    true

HHTPopupManager =
  _popup: null

  closePopup: ->
    _p = @_popup
    @_popup = null
    if _p?
      _p.hide()
      _p.dieSoon()

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
    [ _barbXOffset, _barbYOffset ] = [ 0, 0 ]
    if _parent.elemId
      [ _parentW, _parentH ] = ELEM.getSize( _parent.elemId )
    else
      [ _parentW, _parentH ] = ELEM.windowSize()
    if x > _parentW - w
      x = tx - w
      _direction = 'left'
    else
      _direction = 'right'

    if y < 0
      _barbYOffset = y
      y = 0
    if y > _parentH - h
      _barbYOffset = y - ( _parentH - h )
      y = _parentH - h

    @_popup = HHTPopup.new( [ x, y, w, h ], _parent,
      viewClass: _class
      viewOpts: _opts
      direction: _direction
      barbXOffset: _barbXOffset
      barbYOffset: _barbYOffset
    )
    @_popup

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
    [ _barbXOffset, _barbYOffset ] = [ 0, 0 ]

    if _parent.elemId
      [ _parentW, _parentH ] = ELEM.getSize( _parent.elemId )
    else
      [ _parentW, _parentH ] = ELEM.windowSize()
    if y > _parentH - h
      y = ty - h
      _direction = 'top'
    else
      _direction = 'bottom'

    if x < 0
      _barbXOffset = x
      x = 0
    if x > _parentW - w
      _barbXOffset = x - ( _parentW - w )
      x = _parentW - w

    @_popup = HHTPopup.new( [ x, y, w, h ], _parent,
      viewClass: _class
      viewOpts: _opts
      direction: _direction
      barbXOffset: _barbXOffset
      barbYOffset: _barbYOffset
    )
    @_popup
