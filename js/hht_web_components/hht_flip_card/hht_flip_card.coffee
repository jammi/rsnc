HHTFlipCard = HControl.extend
  componentName: 'hht_flip_card'
  
  constructor: (_rect, _parent, _options) ->
    @tabs = []
    @tabOpts = []
    @base( _rect, _parent, _options )
    @setValue( @value )
    
  extDraw: ->
    ELEM.setStyle( @elemId, 'overflow', 'visible' )
    @addTab()
    
  close: ->
    @setValue( 0 )
    
  createTab: ( _index, _zIndex ) ->
    _rect = [ 0, 0, null, null, 0, 0 ]
    _parent = @
    _opts = @tabOpts[_index]
    _opts['style'] = { zIndex: _zIndex }
    if @tabs[_index]['new']?
      _tab = @tabs[_index].new( _rect, _parent, _opts )
    else
      _tab = HControl.new( _rect, _parent, _opts )
      @tabs[_index]( _tab )
    return _tab

  setValue: ( _value ) ->
    @base( _value )
    return if _value == @prevValue
    return if _value < 0 or _value >= @tabs.length
    _oldTab = @tab
    if not _oldTab?
      _newTab = @createTab( _value, 0 )
      ELEM.addClassName( _newTab.elemId, 'hht_flip_card_front' )
    else if ELEM.hasClassName( @elemId, 'flipped' )
      _newTab = @createTab( _value, 0 )
      ELEM.addClassName( @elemId, 'opened' )
      ELEM.delClassName( @elemId, 'flipped' )
      ELEM.addClassName( _newTab.elemId, 'hht_flip_card_front' )
    else
      _newTab = @createTab( _value, 1 )
      ELEM.addClassName( @elemId, 'opened' )
      ELEM.addClassName( @elemId, 'flipped' )
      ELEM.addClassName( _newTab.elemId, 'hht_flip_card_back' )    
    ELEM.addClassName( _newTab.elemId, 'hht_card' )
    if _value == 0
      _newTab.hide() 
    @tab = _newTab
    @prevValue = _value
    setTimeout( ( ->
      _oldTab.die() if _oldTab? and not _oldTab.isDead
      HSystem._updateFlexibleRects()
      ELEM.flush()
    ), 1100 )

  addTab: ( _class, _opts ) ->
    _class = HControl unless _class?
    _opts = {} unless _opts?
    _opts['theme'] = @theme
    @tabs.push( _class )
    @tabOpts.push( _opts )
    