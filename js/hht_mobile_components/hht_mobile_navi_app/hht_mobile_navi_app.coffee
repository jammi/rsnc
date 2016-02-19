HHTMobileNaviApp = HHTMobileApp.extend

  constructor: ( _options ) ->
    @base( _options )
    @_updateNavi()

  _getTitle: ->
    ''

  _getButtons: ->
    []

  _hasBackButton: ->
    false

  _updateNavi: ->
    for _app in HSystem.apps
      if _app? and _app.isNavigation
        _app.setTitle( @_getTitle() )
        _app.setButtons( @_getButtons() )
        _app.setBackButton( @_hasBackButton() )

  setViewIndex: ( _viewIndex ) ->
    @base( _viewIndex )
    @_updateNavi()
