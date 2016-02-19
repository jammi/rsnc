HHTMobileNavi = HControl.extend
  componentName: 'hht_mobile_navi'
  theme: 'mobile'
  textSelectable: false
  markupElemNames: [ 'icon', 'title' ]
  
  _toggleMenu: ->
    if @_backButtonEnabled
      history.go( -1 )
    else
      for _app in HSystem.apps
        if _app? and _app.isNavigation
          _app.toggleMenu()

  _formatIcon: ->
    HHT_ICONS.get( 'navigation' )

  _formatTitle: ->
    if @options.title?
      @options.title
    else
      ''

  setBackButton: ( _enabled ) ->
    if _enabled
      @_backButtonEnabled = true
      ELEM.setHTML( @markupElemIds.icon, HHT_ICONS.get( 'arrow_left' ) )
    else
      @_backButtonEnabled = false
      ELEM.setHTML( @markupElemIds.icon, HHT_ICONS.get( 'navigation' ) )

  setTitle: ( _title ) ->
    ELEM.setHTML( @markupElemIds.title, _title )

  setButtons: ( _buttons ) ->
    if @_buttons?
      for _button in @_buttons
        _button.die()
    @_buttons = []
    _right = 5
    for _button, i in _buttons
      @_buttons.push HHTMobileNaviButton.new( [ null, 0, 50, 50, _right, null ], @,
        icon: _button.icon
        click: _button.click
      )
      _right += 55
    ELEM.setStyle( @markupElemIds.title, 'right', _right + 'px' )
    true

  extDraw: ->
    @_clickTarget = HControl.extend(
      defaultEvents: { click: true }
      click: -> @parent._toggleMenu()
    ).new( [ 0, 0, null, null, 120, 0 ], @ )
