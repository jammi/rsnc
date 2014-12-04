HHTButtonBar = HView.extend
  componentName: 'hht_button_bar'

  viewDefaults: HViewDefaults.extend
    gap: 0
    align: 'right'

  constructor: ( _rect, _parent, _opts ) ->
    @pos = 0
    @buttons = []
    @base( _rect, _parent, _opts )

  toggleButton: ( _button, _visible ) ->
    if _visible
      _button.show()
    else
      _button.hide()
    @pos = 0
    for _b in @buttons
      continue if _b.isHidden == true
      _w = _b.rect.width
      _h = _b.rect.height
      if @options.align == 'right'
        _b.setRect( [ null, 0, _w, _h, @pos, null ] )
      else
        _b.setRect( [ @pos, 0, _w, _h ] )
      _b.drawRect()
      @pos += _w + @options.gap
    HSystem._updateFlexibleRects()

  addButton: ( _opts, _class, _visible ) ->
    _opts = {} unless _opts?
    _class = HHTButton unless _class?
    _visible = true unless _visible?
    _opts['visible'] = _visible
    _opts['type'] = 'white'
    _button = _class.new( [ 0, 0, 80, 30 ], @, _opts )
    _w = _button.calcWidth()
    if @options.align == 'right'
      _button.setRect( [ null, 0, _w, @rect.height, @pos, null ] )
    else
      _button.setRect( [ @pos, 0, _w, @rect.height ] )
    _button.drawRect()
    @buttons.push( _button )
    if _visible
      @pos += _w + @options.gap
      if @rect.width < @pos
        @rect.setWidth( @pos )
        @drawRect()
        for _b in @buttons
          _b.drawRect()
      HSystem._updateFlexibleRects()
    _button
