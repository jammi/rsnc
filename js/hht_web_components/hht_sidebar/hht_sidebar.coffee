HHTSidebar = HView.extend
  componentName: 'hht_sidebar'

  _hideCard: ->
    return false if @_hidden
    @_hidden = true
    @_anim.moveTo( @rect.width - 32, 0 )
    true

  _showCard: ->
    return false unless @_hidden
    @_hidden = false
    @_anim.moveTo( 0, 0 )

  _selectTab: ( _index ) ->
    if _index == @value
      @setValue( -1 )
    else
      @setValue( _index )

  _delContent: ->
    if @_content?
      @_content.die()
      @_content = null

  refreshValue: ->
    for _tab, i in @_tabs
      _tab.setSelected( i == @value )
    if @value >= 0 and @value < @_tabClasses.length
      @_delContent()
      @_content = @_tabClasses[@value].new( [ 10, 10, null, null, 10, 40 ], @_card, @_tabOpts[@value] )
      @_showCard()
    else
      @_hideCard()

  addTab: ( _label, _class, _opts ) ->
    _index = @_tabs.length
    _tab = HHTSidebarButton.new( [ 0, 30 + _index * 100, 32, 100 ], @_anim,
      label: _label
      click: => @_selectTab( _index )
    )
    _tab.setStyle( 'pointer-events', 'auto' )
    @_tabs.push( _tab )
    @_tabClasses.push( _class )
    @_tabOpts.push( _opts )
    @refreshValue()
    true

  setValue: ( _value ) ->
    _oldValue = @value
    @value = _value
    if _value != @options.bind.value
      @options.bind.set( _value )
    if _value != _oldValue
      @refreshValue()
    true

  extDraw: ->
    @_hidden = true
    @_tabs = []
    @_tabClasses = []
    @_tabOpts = []
    @setStyle( 'pointer-events', 'none' )
    @_anim = HView.new( [ @rect.width - 32, 0, @rect.width, null, null, 0 ], @ )
    @_anim.setStyle( 'pointer-events', 'none' )
    @_card = HControl.new( [ 32, 8, null, null, 8, 8 ], @_anim )
    @_card.setStyle( 'pointer-events', 'auto' )
    @_card.setCSSClass( 'card' )
    HHTButton.new( [ null, null, 100, 30, 10, 5 ], @_card,
      type: 'white'
      label: HLocale.components.HHTButton.strings.hide
      style: { textAlign: 'right' }
      click: => @setValue( -1 )
    )
    ELEM.addClassName( @_anim.elemId, 'horizontal_anim' )
    HValueAction.new( @,
      bind: @options.bind
      action: 'setValue'
    )
    true