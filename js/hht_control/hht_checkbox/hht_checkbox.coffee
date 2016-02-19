HHTCheckBox = HControl.extend
  componentName: 'hht_checkbox'
  markupElemNames: [ 'icon', 'label' ]

  defaultEvents:
    click: true
    keyDown: true

  controlDefaults: HControlDefaults.extend
    selectKeys: [ Event.KEY_RETURN, Event.KEY_SPACE ]
    multiLine: false

  die: ->
    Event.stopObserving( @elemId, 'focus', @_onFocusFn )
    @base()

  drawMarkup: ->
    @base()
    @_onFocusFn = => EVENT.changeActiveControl( @ )
    Event.observe( @elemId, 'focus', @_onFocusFn )
    @

  click: ->
    @toggle()

  keyDown: ( _key ) ->
    if _key in @options.selectKeys
      @toggle()
      true
    return false    

  toggle: ->
    @setValue( !@value )

  _formatOnIcon: ->
    HHT_ICONS.get( 'tick_on' )

  _formatOffIcon: ->
    HHT_ICONS.get( 'tick_off' )

  refreshValue: ->
    if @markupElemIds?
      if @value
        ELEM.setHTML( @markupElemIds.icon, @_formatOnIcon() )
      else
        ELEM.setHTML( @markupElemIds.icon, @_formatOffIcon() )

  extDraw: ->
    if @options.multiLine == true
      ELEM.addClassName( @elemId, 'multiline' )
    if @options.verticalAlign == 'middle'
      ELEM.setStyle( @markupElemIds.label, 'line-height', "#{@rect.height}px" )
      ELEM.setStyle( @markupElemIds.label, 'vertical-align', 'middle' )
      ELEM.setStyle( @markupElemIds.icon, 'top', "#{(@rect.height - 16) / 2}px" )
