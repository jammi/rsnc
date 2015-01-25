HHTGUIApp = HApplication.extend
  constructor: ( _options ) ->
    _priority = ( if _options.priority then _options.priority else 100 )
    _allowMulti = ( if _options.allowMulti then _options.allowMulti else false )
    _valueObj = ( if _options.valueObj then _options.valueObj else false )
    @base( _priority, '' )

    @options = HClass.extend( _options ).extend(
      allowMulti: _allowMulti
      pid: @appId
      elemId: 0
      views: []
    ).nu()
    @elemId = @options.elemId

    if _options.localized
      @localized = _options.localized
    if _options.strings
      @strings = _options.strings
    if _valueObj
      @valueObj.bind( _this )
    else
      @value = _options.value
    @extDraw()
    @drawSubviews()
    ELEM.flush()
    setTimeout( ( -> HSystem._updateFlexibleRects() ), 1200 )
    true

  _setMeta: (_name,_content) ->
    _old = document.getElementById( _name )
    if _old?
      _meta = _old
      _meta.setAttribute( 'content', _content )
    else
      _meta = document.createElement( 'meta' )
      _meta.setAttribute( 'name', _name )
      _meta.setAttribute( 'content', _content )
      document.head.appendChild( _meta )
    _meta

  extDraw: ->
    @view = @drawView( @options.rect )

  resize: ->
    true
  
  die: ->
    @view.die() if @view?
    @base()

  getValues: ( _valueIds ) ->
    _values = {}
    for _valueName, _valueId of _valueIds
      _values[ _valueName ] = HVM.values[ _valueId ]
    _values

  drawView: ( _rect )->
    return unless @typeChr( _rect ) == 'a'
    _styles = {}
    _styles['backgroundColor'] = @options.color if @options.color?
    _styles['opacity'] = @options.opacity if @options.opacity?
    HControl.extend(
      resize: ->
        @parent.resize()
    ).new( @options.rect, @,
      events: { resize: true }
      style: _styles
    )

  centerView: ( _view ) ->
    @centerViewX( _view )
    @centerViewY( _view )
    true

  centerViewY: ( _view, _parent ) ->
    if _parent?
      _parentH = ELEM.getSize( _parent.elemId )[1]
    else
      _parentH = ELEM.windowSize()[1]
    _viewH = _view.rect.height
    _view.rect.setTop( Math.max( 0, Math.floor( ( _parentH - _viewH ) / 2 ) ) )
    _view.rect.setHeight( _viewH )
    _view.drawRect()
    true
  
  centerViewX: ( _view, _parent ) ->
    if _parent?
      _parentW = ELEM.getSize( _parent.elemId )[0]
    else
      _parentW = ELEM.windowSize()[0]
    _viewW = _view.rect.width 
    _view.rect.setLeft( Math.max( 0, ( _parentW - _viewW ) / 2 ) )
    _view.rect.setWidth( _viewW )
    _view.drawRect()
    true

  drawSubviews: ->
    true
  