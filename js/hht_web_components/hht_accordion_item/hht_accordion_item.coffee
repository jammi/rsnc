HHTAccordionItem = HControl.extend
  componentName: 'hht_accordion_item'
  markupElemNames: [ 'bg', 'label', 'button' ]
  defaultEvents: { click: true }
  controlDefaults: HControlDefaults.extend
    showButton: false
  
  die: ->
    if @options.buttonClick?
      Event.stopObserving( @markupElemIds.button, 'click', @options.buttonClick )
    @base()
    
  click: ->
    @parent.setValue( @options.index )
    true
  
  formatButton: ->
    if @options.showButton == true
      HHT_ICONS.get( @options.buttonIcon )
    else
      ''

  formatIndicatorOpened: ->
    HHT_ICONS.get( 'arrow_down' )

  formatIndicatorClosed: ->
    HHT_ICONS.get( 'arrow_up' )

  hideButton: ->
    ELEM.delClassName( @elemId, 'show_button' )

  showButton: ->
    ELEM.addClassName( @elemId, 'show_button' )
  
  setTitle: ( _title, _color ) ->
    ELEM.setHTML( @markupElemIds.label, _title )
    if @options.color?
      ELEM.setStyle( @markupElemIds.label, 'color', _color )
      ELEM.setStyle( @markupElemIds.bg, 'border-bottom', "2px solid #{_color}" )

  drawSubviews: ->
    @base()
    @toggleCSSClass( @elemId, 'show_button', @options.showButton )
    @setTitle( @options.label, @options.color )
    if @options.buttonClick?
      Event.observe( @markupElemIds.button, 'click', @options.buttonClick )
    true
      
