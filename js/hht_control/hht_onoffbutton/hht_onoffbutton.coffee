HHTOnOffButton = HControl.extend
  componentName: 'hht_onoffbutton'
  markupElemNames: [ 'on', 'off', 'on_label', 'off_label' ]
  controlDefaults: HControlDefaults.extend
    onValue: true
    offValue: false
    type: 'in_out' #in_out, yes_no, on_off
    onOnClick: ( _target ) => true
    onOffClick: ( _target ) => true
    onChange: ( _target ) => true

  constructor: ( _rect, _parent, _options ) ->
    @base( _rect, _parent, _options )
    @_clickOnFn = =>
      if @enabled
        if @value != @options.onValue
          _oldValue = @value
          @setValue( @options.onValue )
          @options.onChange( @, _oldValue, @value )
        @options.onOnClick( @ )
    @_clickOffFn = =>
      if @enabled
        if @value != @options.offValue
          _oldValue = @value
          @setValue( @options.offValue )
          @options.onChange( @, _oldValue, @value )
        @options.onOffClick( @ )
      true
    Event.observe( @markupElemIds.on, 'click', @_clickOnFn )
    Event.observe( @markupElemIds.off, 'click', @_clickOffFn )
    if @theme == 'mobile'
      @setStyleOfPart( 'on_label', 'line-height', @rect.height + 'px' )
      @setStyleOfPart( 'off_label', 'line-height', @rect.height + 'px' )

  die: ->
    Event.stopObserving( @markupElemIds.on, 'click', @_clickOnFn )
    Event.stopObserving( @markupElemIds.off, 'click', @_clickOffFn )
    @base()

  _formatOnLabel: ->
    switch @options.type
      when 'in_out' then HLocale.components.HHTButton.strings.in_button
      when 'yes_no' then HLocale.components.HHTButton.strings.yes_button
      else HLocale.components.HHTButton.strings.on_button

  _formatOffLabel: ->
    switch @options.type
      when 'in_out' then HLocale.components.HHTButton.strings.out_button
      when 'yes_no' then HLocale.components.HHTButton.strings.no_button
      else HLocale.components.HHTButton.strings.off_button

  _isOn: ->
    ( @value == @options.onValue )

  _isOff: ->
    ( @value == @options.offValue )

  refreshValue: ->
    if @markupElemIds?
      @toggleCSSClass( @markupElemIds.on, 'selected', ( @value == @options.onValue ) )
      @toggleCSSClass( @markupElemIds.off, 'selected', ( @value == @options.offValue ) )
