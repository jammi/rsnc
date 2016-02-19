HHTGraph = HControl.extend
  componentName: 'hht_graph'

  markupElemNames: [ 'no_graph', 'graph' ]

  defaultEvents: { resize: true }
    
  controlDefaults: HControlDefaults.extend
    title: ''
    legendVisible: true
    showLine: true
    showPoints: false
    pointSize: 8
    showMarks: false
    showAnimation: true

  customOptions: ( _options )->
    unless _options['noDataText']
      _options['noDataText'] = HLocale.components.Report.strings.no_data
    _options

  setRect: ( _rect ) ->
    @base( _rect )
    @resize()

  resize: ->
    return unless @chart?
    _chart = @chart
    _canvas = ELEM.get( @markupElemIds.graph )
    _w = ELEM.getSize( @elemId )[0]
    _h = ELEM.getSize( @elemId )[1]
    _canvas.width = _w
    _canvas.height = _h
    _canvas.setAttribute( 'width', "#{_w}px" )
    _canvas.setAttribute( 'height', "#{_h}px" )
    _canvas.style.width = "#{_w}px"
    _canvas.style.height = "#{_h}px"
    _chart.bounds.top = 0
    _chart.bounds.width = _w
    _chart.bounds.height = _h
    _chart.draw()

  click: ( _button, x, y, _point ) ->
    true

  markerText: ( _line, _point ) ->
    _point.value

  setTitle: ( title ) ->
    @chart.title.text = title
    
  showLegend: ( _value ) ->
    @chart.legend.visible = _value

  delSeries: ( _series ) ->
    @chart.removeSeries( _series )
    @chart.draw()
    
  clearSeries: ->
    for _series in @series
      @chart.removeSeries( _series )
    @chart.draw()

  formatDefault:  ( _axes, value, s ) ->
    s

  formatClock: ( _axes, value, s ) ->
    moment( value*1000 ).utc().format( "hh:mm" )

  formatDate: ( _axes, value, s ) ->
    ''

  showMarks: ( _value ) ->
    @options.showMarks = _value
    @refreshValue()
  
  formatTime: ( _axes, value, s ) ->
    hours = Math.floor( value / 3600 )
    mins = Math.floor( ( value - hours * 3600 ) / 60 )
    secs = Math.floor( value - hours * 3600 - mins * 60 )
    hours0 = hours
    mins0 = mins
    secs0 = secs
    hours0 = "0#{hours}" if hours < 10
    mins0 = "0#{mins}" if mins < 10
    secs0 = "0#{secs}" if secs < 10

    if _axes.showHours
      return "#{hours0}:#{mins0}"
    else if _axes.showMins and _axes.showSecs
      return "#{mins0}:#{secs0}"
    else if _axes.showMins
      return "#{mins}"
    else if _axes.showSecs
      return "#{secs}"
    else
      return ""
    
  createSeries: ( _data )->
    if _data.value?
      _series = [ _data ]
    else if @typeChr( _data.values ) == 'a'
      _series = _data.values
    else
      _series = []

    for _s in _series
      switch _s.type
        when 'line' then @series.push( @createLine( _s ) )
        when 'bar' then @series.push( @createBar( _s ) )
    true
  
  createLine: ( _item ) ->
    _line = new Tee.Line()
    @chart.addSeries( _line )
    _line.loadJSON( _item )
    if _item.smooth?
      _line.smooth = _item.smooth
    _line.onclick = ( button, x, y ) => @click( button, x, y, _item.value.series.point[x] )
    @makeLineStyle( _line )
    return _line
  
  createBar: ( _item ) ->
    _bar = new Tee.Bar()
    @chart.addSeries( _bar )
    _bar.loadJSON( _item )
    _bar.onclick = ( button, x, y ) => @click( button, x, y, _item.value.series.point[x] )
    @makeBarStyle( _bar )
    return _bar
    
  createAxesTitle: ( _axes ) -> 
    _localized = HLocale.components.Report.strings.axes
    if _axes.type == 'no_data'
      return ""
    else if _axes.title
      return _axes.title
    else if _axes.type == 'pulse'
      return "#{_localized['pulse']} (#{_localized['pulse_unit']})"
    else if _axes.type == 'velocity'
      return "#{_localized['velocity']} (#{_localized['velocity_unit']})"
    else if _axes.type == 'vertical'
      return "#{_localized['vertical']} (#{_localized['vertical_unit']})"
    else if _axes.type == 'time'
      if _axes.showHours
        return "#{_localized['time']} (#{_localized['time_unit_hhmm']})"
      else if _axes.showMins and _axes.showSecs
        return "#{_localized['time']} (#{_localized['time_unit_mmss']})"
      else if _axes.showMins
        return "#{_localized['time']} (#{_localized['time_unit_minutes']})"
      else if _axes.showSecs
        return "#{_localized['time']} (#{_localized['time_unit_seconds']})"
    else if _axes.type == 'date'
      _start = moment( _axes.date_start * 1000 ).utc().format( "DD.MM.YYYY" )
      _end = moment( _axes.date_end * 1000 ).utc().format( "DD.MM.YYYY" )
      return "#{_start} - #{_end}"
    ""
    
  setAxes: ( _src, _dest ) ->
    return unless _src? and _dest?
    _localized = HLocale.components.Report.strings
    _dest.visible = _src.visible if _src.visible?
    _dest.automatic = _src.automatic if _src.automatic?
    _dest.minimum = _src.minimum if _src.minimum?
    _dest.maximum = _src.maximum if _src.maximum?
    if _src.type != 'date'
      _dest.increment = _src.increment if _src.increment?
    _dest.title.text = @createAxesTitle( _src )
    _formatFunction = switch _src.type
      when 'time' then 'formatTime'
      when 'clock' then 'formatClock'
      when 'date' then 'formatDate'
      else 'formatDefault'
    _dest.labels.ongetlabel = ( value, s ) => 
      @[_formatFunction]( _src, value, s )
    true
      
  refreshValue: ->
    return unless @chart?
    @clearSeries()
    _leftAxes = @value['leftAxes']
    _bottomAxes = @value['bottomAxes']
    if _leftAxes and _leftAxes.type == 'no_data'
      @toggleCSSClass( @elemId, 'has_graph', false )
    else if _bottomAxes and _bottomAxes.type == 'no_data'
      @toggleCSSClass( @elemId, 'has_graph', false )
    else
      @toggleCSSClass( @elemId, 'has_graph', true )
      @setTitle( @options.title )
      @showLegend( @options.legendVisible )
      @setAxes( _leftAxes, @chart.axes.left )
      @setAxes( _bottomAxes, @chart.axes.bottom )
      @createSeries( @value )
      @makeStyle( @chart )
      @chart.draw()
      @animate()
    true
    
  makeLineStyle: ( _line ) ->
    _series = _line.data.json.value.series
    if _series.size?
      _line.format.stroke.size = _series.size
    else
      _line.format.stroke.size = 2
    if _series.show_points?
      _line.pointer.visible = _series.show_points
    else
      _line.pointer.visible = @options.showPoints
    if _series.show_line?
      _line.drawLine = _series.show_line
    else
      _line.drawLine = @options.showLine

    _line.format.shadow.visible = false
    if _series.show_marks == true and @options.showMarks == true
      _line.marks.visible = true
      _line.markText = ( x ) => @markerText( _line, _series.point[x] )
    else
      _line.marks.visible = false
    _line.pointer.format.shadow.visible = false
    _line.pointer.format.gradient.visible = false
    _line.pointer.format.stroke.fill = 'none'
    _line.pointer.width = @options.pointSize
    _line.pointer.height = @options.pointSize

  makeStyle: ( _chart ) ->
    _chart.zoom.enabled = false
    _chart.scroll.enabled = false
    _chart.legend.visible = false

    _chart.panel.margins.top = 10
    _chart.panel.margins.left = 0
    _chart.panel.margins.right = 5
    _chart.panel.margins.bottom = 0
    _chart.panel.format.shadow.visible = false
    _chart.panel.format.round = { x: 0, y: 0 }
    _chart.panel.transparent = true
    _chart.panel.format.fill = '#FFF'
    
    _chart.axes.left.title.format.font.fill = '#7f8C8D'
    # _chart.axes.left.grid.format.fill = '#ecf0f1'
    _chart.axes.left.format.stroke.fill = '#FFF'
    _chart.axes.left.ticks.visible= false;
    _chart.axes.left.labels.format.font.fill = '#7f8C8D'
    _chart.axes.left.labels.format.font.style = '14px Arial'

    _chart.axes.bottom.title.format.font.fill = '#7f8C8D'
    _chart.axes.bottom.format.stroke.fill = '#7f8C8D'
    _chart.axes.bottom.format.stroke.size = '0.5'
    _chart.axes.bottom.labels.format.font.fill = '#7f8C8D'
    _chart.axes.bottom.labels.format.font.style = '14px Arial'
    _chart.axes.bottom.title.format.font.fill = '#7f8C8D'
    _chart.axes.bottom.grid.visible = false

    _chart.title.format.font.style = '25px Arial'
    _chart.title.format.font.shadow.visible = false
    _chart.title.format.font.fill = '#7f8C8D'
    
    _chart.walls.back.visible = false

  makeBarStyle: ( _bar ) ->
    _bar.format.shadow.visible = false
    _bar.format.stroke.fill = '#fff'
    _bar.format.gradient = false
    _bar.marks.visible = false
    
  animate: ->
    return true if BROWSER_TYPE.iPhone or BROWSER_TYPE.ipad
    return true if @series.length == 0
    return true unless @options.showAnimation
    animation = new Tee.SeriesAnimation()
    animation.duration = 500
    animation.kind = 'each'
    animation.animate( @chart )
    true  

  drawSubviews: ->
    @series = []
    @chart = new Tee.Chart( ELEM.get( @markupElemIds.graph ) )
    @resize()
    true
