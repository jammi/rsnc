#
# Reference points:
# http://code.google.com/apis/maps/documentation/v3/reference.html
#
HHTGoogleMaps = HControl.extend
  componentName: 'hht_google_maps'
  markupElemNames: [ 'map' ]

  defaultEvents:
    resize: true
  
  controlDefaults: HControlDefaults.extend
    zoom: 12
    mapTypeId: 'ROADMAP'
    mapTypeControlStyle: 'DEFAULT'
    center: [ 60.2591266, 24.6522657 ]
    scaleControl: true
    mapTypeControl: true
    disableDefaultUI: false
    scrollwheel: true
    draggable: true

  customOptions: ( _options )->
    unless _options['loadingText']?
      _options['loadingText'] = HLocale.components.Report.strings.loading_map
    _options
  
  #Valid map types
  validMapTypeIds: [
    'HYBRID',     # This map type displays a transparent layer of major streets on satellite images.
    'ROADMAP',    # This map type displays a normal street map.
    'SATELLITE',  # This map type displays satellite images.
    'TERRAIN'     # This map type displays maps with physical features such as terrain and vegetation.
  ]

  constructor: (_rect, _parent, _options) ->
    @markers = []
    @polylines = []
    @base( _rect, _parent, _options )
  
  resize: ->
    return unless @map?
    google.maps.event.trigger( @map, 'resize' )
  
  addMarker: ( _options ) ->
    return unless @map?
    _options.map = @map
    _position = _options.position
    unless _position?
      _position = @options.center
    _options.position = new google.maps.LatLng( _position[0], _position[1] )
    _marker = new google.maps.Marker( _options )
    @markers.push( _marker )
    return _marker
    
  addPolyline: ( _options ) ->
    return unless @map? and _options.path.length > 0
    _path = []
    _bounds = new google.maps.LatLngBounds()
    for _xy in _options.path
      continue unless @typeChr( _xy[0] ) == 'n'
      continue unless @typeChr( _xy[1] ) == 'n'
      _coord = new google.maps.LatLng( _xy[0], _xy[1] )
      _path.push( _coord )
      _bounds.extend( _coord )
    _options.map = @map
    _options.path = _path
    @polylines.push( new google.maps.Polyline( _options ) )
    @_currentBounds = _bounds
      
  # setLegend: ( _html, styles ) ->
  #   return unless @map?
  #   unless @_hasLegend
  #     @map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push( ELEM.get( @markupElemIds.legend ) )
  #     @_hasLegend = true
  #   ELEM.setHTML( @markupElemIds.legend, _html )
  #   ELEM.setStyles( @markupElemIds.legend, styles ) if styles?

  setCenter: ( _location ) ->
    return unless @map?
    @map.setCenter( new google.maps.LatLng( _location[0], _location[1] ) )

  zoomToBounds: ->
    return unless @map? and @_currentBounds
    @map.fitBounds( @_currentBounds )

  zoomToAllBounds: ->
    return unless @map?
    _bounds = new google.maps.LatLngBounds()
    for _polyline in @polylines
      for _latLng in _polyline.getPath().getArray()
        _bounds.extend( _latLng )
    for _marker in @markers
      _bounds.extend( _marker.position )
    @map.fitBounds( _bounds )

  delMarker: ( _marker ) ->
    _markers = []
    for _item in @markers
      if _item == _marker
        _marker.setMap( null )
      else
        _markers.push( _item )
    @markers = _markers
  
  clearMarkers: ->
    for _marker in @markers
      _marker.setMap( null )
    @markers = []

  clearPolylines: ->
    for _polyline in @polylines
      _polyline.setMap( null )
    @polylines = []
  
  refreshValue: ->
    return unless @map? and @typeChr( @value ) == 'a'
    @clearMarkers()
    @addMarker( { position: @value } )
    @map.setCenter( new google.maps.LatLng( @value[0], @value[1] ) )

  _onLoad: ( _state ) ->
    return if @map? or _state != 1
    ELEM.addClassName( @elemId, 'has_map' )
    if @validMapTypeIds.indexOf( @options.mapTypeId ) == -1
      @options.mapTypeId = @validMapTypeIds[0]
    @map = new google.maps.Map( ELEM.get( @markupElemIds.map ),
      zoom: @options.zoom
      center: new google.maps.LatLng( @options.center[0], @options.center[1] )
      mapTypeId: google.maps.MapTypeId[ @options.mapTypeId ]
      scaleControl: @options.scaleControl
      mapTypeControl: @options.mapTypeControl
      disableDefaultUI: @options.disableDefaultUI
      scrollwheel: @options.scrollwheel
      draggable: @options.draggable
    )
    if @typeChr( @_listener ) == '>'
      google.maps.event.addListenerOnce( @map, 'idle', ( => @_listener( @ ) ) )
    true

  load: ( _listener ) ->
    unless GoogleMapsLoader?
      console.log( "Warning: GoogleMapsLoader missing" )
      return false
    @_listener = _listener
    GoogleMapsLoader.load()
    HValueAction.new( @,
      bind: GoogleMapsLoader.state
      action: '_onLoad'
    )
    return true
