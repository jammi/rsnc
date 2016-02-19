HHTButton = HControl.extend
  componentName: 'hht_button'
  markupElemNames: [ 'icon', 'label' ]

  controlDefaults: HControlDefaults.extend
    type: 'blue' #blue, white, orange or green
    icon: false
    iconSize: 20

  defaultEvents:
    click: true
    keyDown: true

  setStyle: ( _name, _value, _setElemStyle )->
    if _setElemStyle?
      @base( _name, _value )
    else
      @setStyleOfPart( 'label', _name, _value )
    @

  die: ->
    Event.stopObserving( @elemId, 'focus', @_onFocusFn )
    @base()

  drawMarkup: ->
    @base()
    @_onFocusFn = => EVENT.changeActiveControl( @ )
    Event.observe( @elemId, 'focus', @_onFocusFn )
    @

  extDraw: ->
    @setType( @options.type )
    if @options.icon?
      ELEM.addClassName( @elemId, @options.icon )
    if @options.icon
      ELEM.addClassName( @elemId, 'has_icon')
      ELEM.setStyle( @markupElemIds.icon, 'top', "#{(@rect.height - @options.iconSize - 4) / 2}px" )
      ELEM.setStyle( @markupElemIds.icon, 'width', "#{@options.iconSize}px" )
      ELEM.setStyle( @markupElemIds.icon, 'height', "#{@options.iconSize}px" )
    true

  click: ->
    if @options.click?
      @options.click()
    else
      @base()

  keyDown: ( _key ) ->
    if _key == Event.KEY_RETURN
      @click()
      return true
    return false
      
  _formatIcon: ->
    if @options.icon
     HHT_ICONS.get( @options.icon )
    else
      ''

  _formatLabel: ->
    @options.label

  setType: ( _type ) ->
    _validTypes = [ 'blue', 'white', 'green', 'orange' ]
    _type = 'blue' unless _type in _validTypes
    for _t in _validTypes
      ELEM.delClassName( @elemId, _t )
    ELEM.addClassName( @elemId, _type )
    true
  
  calcWidth: ->
    _width = @stringWidth( @label, null, @markupElemIds.label )
    _width += 15
    _width += 30 if @options.icon
    _width
  
HHTClickButton = HHTButton.extend

  controlDefaults: HHTButton.prototype.controlDefaults.extend
    clickOnValue: 1
    clickOffValue: 0

  refreshValue: ->
    @setEnabled( @value == @options.clickOffValue )

  click: ->
    if @enabled
      @setValue( @options.clickOnValue )
    true