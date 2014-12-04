HHTModalApp = HHTGUIApp.extend

  autoAlign: true
  _gap: 8

  constructor: ( _options ) ->
    @_items = []
    @base( _options )

  die: ->
    @_delItems()
    @_bg.die()
    @_bg = null
    @view.die()
    @view = null
    @base()

  resize: ->
    @_updatePos()

  _delItems: ->
    for _item in @_items
      _item.die()
    @_items = []
    true

  addItem: ( _class, _w, _h, _opts ) ->
    if @options.theme == 'mobile'
      [ _w, _h ] = ELEM.windowSize()
    [ _x, _y ] = @_calcPos( _w, _h )
    _item = _class.new( [ _x, _y, _w, _h ], @view, _opts )
    ELEM.addClassName( _item.elemId, 'card_anim_start' )
    @_items.push( _item )
    @_updatePos() unless _item.isHidden
    ELEM.addClassName( _item.elemId, 'card_anim_end' )
    _item

  toggleItem: ( _item, _visible ) ->
    if _visible == true
      _item.show()
    else
      _item.hide()
    @_updatePos()

  _calcPos: ( _newW, _newH ) ->
    [ _w, _h ] = [ 0, 0 ]
    for _item in @_items
      continue if _item.isHidden
      _w += _item.rect.width + @_gap
      _h = Math.max( _h, _item.rect.height )
    [ _viewW, _viewH ] = ELEM.getSize( @view.elemId )
    [ _w + ( _viewW - _w - _newW ) / 2, ( _viewH - _newH ) / 2 ]

  _updatePos: ->
    return false unless @view?
    [ _w, _h ] = [ -@_gap, 0 ]
    for _item in @_items
      continue if _item.isHidden
      _w += _item.rect.width + @_gap
      _h = Math.max( _h, _item.rect.height )
    [ _viewW, _viewH ] = ELEM.getSize( @view.elemId )
    _left = ( _viewW - _w ) / 2
    _top = ( _viewH - _h ) / 2
    for _item in @_items
      continue if _item.isHidden
      _item.offsetTo( _left, _top )
      _left += _item.rect.width + @_gap      

  _drawView: ->
    @_bg = HControl.new( [ 0, 0, 1000, 640, 0, 0 ], @ )
    ELEM.addClassName( @_bg.elemId, 'bg_anim_start' )
    @view = HControl.extend(
      defaultEvents: { resize: true }
      resize: -> @parent.resize()
    ).new( [ 0, 0, 1000, 640, 0, 0 ], @ )
