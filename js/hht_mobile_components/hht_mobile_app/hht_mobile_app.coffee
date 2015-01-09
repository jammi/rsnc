HHTMobileApp = HHTGUIApp.extend

  die: ->
    Event.stopObserving( window, 'orientationchange', @_screenRotateFn )
    for _wrapper, _index in @_wrappers
      _wrapper.die()
    @base()

  constructor: ( _options ) ->
    @_round = 0
    @_wrappers = []
    @_visibleWrappers = []
    @viewIndex = 0
    @hashTag = "#/#{_options.label}"
    @base( _options )
    @_checkDefaultView()
    @_screenRotateFn = => @_onScreenRotated()
    Event.observe( window, 'orientationchange', @_screenRotateFn )

  _drawView: ->
    true

  prevPage: ->
    history.go( -1 )

  changeSubview: ( _index ) ->
    unless @options.disableHashTag
      location.href = "#{@hashTag}/#{_index}"
    true

  isHorizontal: ->
    ( window.orientation in [ -90, 90 ] )

  isVertical: ->
    ( not @isHorizontal() )

  _viewRect: ->
    if @isHorizontal() and @options.hRect?
      @options.hRect
    else
      @options.rect

  _onScreenRotated: ->
    _rect = @_viewRect()
    for _view in _wrappers
      _view.setRect( _rect )
      _view.drawRect()
    @screenRotated( window.orientation )
    true

  screenRotated: ( _orientation ) ->
    true

  setViewIndex: ( _viewIndex ) ->
    @viewIndex = _viewIndex

  addSubview: ( _class, _opts, _active ) ->
    _opts = {} unless @typeChr( _opts ) == 'h'
    _index = @_wrappers.length
    @_wrappers.push HClass.extend(
      constructor: ( _app, _hashTag, _index, _enabled ) ->
        @_app = _app
        @_hashTag = _hashTag
        @_index = _index
        @_enabled = _enabled
        if @_enabled
          COMM.urlResponder.addResponder( "#{@_hashTag}/#{@_index}", @ )
      die: ->
        if @_content?
          @_content.die()
          @_content = null
        if @_enabled
          COMM.urlResponder.delResponder( "#{@_hashTag}/#{@_index}", @ )
        @_delFromList()
      show: ->
        unless @_content?
          @_content = _class.new( @_app._viewRect(), @_app, _opts )
          @_app.setViewIndex( @_index )
          ELEM.flush()
          HSystem._updateFlexibleRects()
          @_addToList()
      hide: ->
        if @_content?
          @_content.die()
          @_content = null
        @_delFromList()

      _addToList: ->
        @_app._visibleWrappers.push( @_index )

      _delFromList: ->
        i = @_app._visibleWrappers.indexOf( @_index )
        @_app._visibleWrappers.splice( i, 1 )

    ).nu(
      @,
      @hashTag,
      _index,
      ( @options.disableHashTag != true )
    )
    if _active
      @changeSubview( _index )
    true

  _checkDefaultView: ->
    return if @options.disableHashTag
    if @_visibleWrappers.length == 0
      _regex = new RegExp( @hashTag )
      if _regex.test( location.href )
        location.replace( "#{@hashTag}/#{0}" )

  onIdle: ->
    @_checkDefaultView()
