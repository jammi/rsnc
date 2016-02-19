HHTPopup = HControl.extend
  componentName: 'hht_popup'
  markupElemNames: [ 'bg', 'barb' ]

  controlDefaults: HControlDefaults.extend
    direction: 'right'

  constructor: (_rect, _parent, _options) ->
    @base( _rect, _parent, _options )
    [ w, h ] = ELEM.getSize( @elemId )
    @reAlign( w, h )
    ELEM.addClassName( @elemId, @options.direction )
    # ELEM.addClassName( @elemId, 'popup_anim' )
    true

  reAlign: ( w, h )->
    x = @rect.left
    y = @rect.top
    y -= h/2

    [ parentW, parentH ] = ELEM.getSize( @parent.elemId )
    x = 10 if x < 10
    if x > parentW - w - 10
      x = parentW - w - 10
      @options.direction = 'left'
    barbMove = 0
    if y < 10
      barbMove = y - 10
      y = 10
    else if y > parentH - h - 10
      barbMove = y - ( parentH - h - 10 )
      y = parentH - h - 10 
  
    @setRect( [ x, y, w, h ] )
    @setStyleOfPart( 'barb', 'top', "#{( h / 2 - 10) + barbMove }px" )
    ELEM.flush()
    true
