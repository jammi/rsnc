HHTDateLabel = HControl.extend
  componentName: 'hht_date_label'
  markupElemNames: [ 'date', 'time' ]

  controlDefaults: HControlDefaults.extend
    textSelectable: false
    dateFormat: null
    timeFormat: null
    showWeekday: false
    showDate: true
    showTime: false
    todayLabel: false
    valueKey: false
    prefix: ''
    suffix: ''

  constructor: (_rect, _parent, _options) ->
    @base( _rect, _parent, _options )
    if _options.style?
      ELEM.setStyles( @markupElemIds.date, _options.style )
      ELEM.setStyles( @markupElemIds.time, _options.style )
    @showTime() if @options.showTime == true and @options.showDate == true

  customOptions: ( _options ) ->
    unless _options.dateFormat?
      if _options.showWeekday
        _options['dateFormat'] = HLocale.components.HHTDateTime.strings.weekday_date_format
      else
        _options['dateFormat'] = HLocale.components.HHTDateTime.strings.date_format
    unless _options.timeFormat?
      _options['timeFormat'] = HLocale.components.HHTDateTime.strings.time_format
    _options

  isToday: ->
    return false unless @options.timeNow?
    return (@options.timeNow.value >= @value and @options.timeNow.value < @value + 86400)

  formatDate: ( _value ) ->
    moment( _value * 1000 ).utc().format( @options.dateFormat )

  formatTime: ( _value ) ->
    moment( _value * 1000 ).utc().format( @options.timeFormat )

  showTime: ->
    @toggleCSSClass( @elemId, 'show_time', true )

  hideTime: ->
    @toggleCSSClass( @elemId, 'show_time', false )

  refreshValue: ->
    if @markupElemIds?
      _label = ''
      _value = @value
      if @options.valueKey? and @typeChr( _value ) == 'h'
        _value = _value[@options.valueKey]
      if @typeChr( _value ) == 'n'
        _label = @formatDate( _value )
        if @options.todayLabel? and @isToday()
          ELEM.addClassName( @elemId, 'today' )
          if @rect.width < 400
            _label =  @options.todayLabel
          else
            _label = "#{_label} (#{@options.todayLabel})"
        else
          ELEM.delClassName( @elemId, 'today' )
      if @options.showTime == true and @options.showDate == false
        _label = @formatTime( _value )
      if @options.prefix
        _label = @options.prefix + _label
      if @options.suffix
        _label = _label + @options.suffix
      ELEM.setHTML( @markupElemIds.date, _label )
      ELEM.setHTML( @markupElemIds.time, @formatTime( _value ) )
    true

