HHTIconButton = HControl.extend
  componentName: 'hht_iconbutton'
  markupElemNames: [ 'icon' ]
  defaultEvents: { click: true }
  
  controlDefaults: HControlDefaults.extend
    icon: 'close'
    iconSize: 16
    help: null

  click: ->
    if @options.click?
      @options.click()
    else
      @base()
      
  _formatIcon: ->
    HHT_ICONS.get( @options.icon )
    
  setIcon: ( _icon )->
    @options.icon = _icon
    ELEM.setHTML( @markupElemIds.icon, @_formatIcon() )

  extDraw: ->
    ELEM.addClassName( @elemId, @options.icon )
    ELEM.setStyle( @markupElemIds.icon, 'left', "#{(@rect.width - @options.iconSize) / 2}px" )
    ELEM.setStyle( @markupElemIds.icon, 'top', "#{(@rect.height - @options.iconSize) / 2}px" )
    ELEM.setStyle( @markupElemIds.icon, 'width', "#{@options.iconSize}px" )
    ELEM.setStyle( @markupElemIds.icon, 'height', "#{@options.iconSize}px" )
    if @typeChr( @options.help ) == 's'
      ELEM.setAttr( @elemId, 'title', @options.help )