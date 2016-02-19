HHTDurationLabel = HControl.extend
  componentName: 'hht_duration_label'
  markupElemNames: [ 'value' ]

  controlDefaults: HControlDefaults.extend
    textSelectable: false
    valueKey: false
    prefix: ""
    suffix: ""

  constructor: (_rect, _parent, _options) ->
    @base( _rect, _parent, _options )
    if _options.style?
      ELEM.setStyles( @markupElemIds.value, _options.style )
  
  refreshValue: ->
    _value = @value
    if @options.valueKey and @typeChr( @value ) == 'h'
      _value = @value[@options.valueKey]
    _label = @_formatDuration( _value )
    if @options.prefix
      _label = @options.prefix + _label
    if @options.suffix
      _label = _label + @options.suffix
    ELEM.setHTML( @markupElemIds.value, _label )

  _dayStr: ( _days ) ->
    _localized = HLocale.components.HHTDurationLabel.strings
    if _days == 0
      ''
    else if _days == 1
      "#{_days} #{_localized.one_day}"
    else
      "#{_days} #{_localized.days}"

  _hourStr: ( _hours ) ->
    _localized = HLocale.components.HHTDurationLabel.strings
    if _hours == 0
      ''
    else if _hours == 1
      "#{_hours} #{_localized.one_hour}"
    else
      "#{_hours} #{_localized.hours}"

  _minStr: ( _mins ) ->
    _localized = HLocale.components.HHTDurationLabel.strings
    if _mins == 0
      ''
    else if _mins == 1
      "#{_mins} #{_localized.one_minute}"
    else
      "#{_mins} #{_localized.minutes}"

  _formatDuration: ( _seconds ) ->
    return '' unless @typeChr( _seconds ) == 'n'
    return '' unless _seconds > 0
    _seconds += 30
    _localized = @app.localized
    _days = Math.floor( _seconds / 86400 )
    _hours = Math.floor( ( _seconds - _days * 86400 ) / 3600 )
    _mins = Math.floor( ( _seconds - _days * 86400 - _hours * 3600 ) / 60 )
    if _days == 0
      "#{@_hourStr(_hours)} #{@_minStr(_mins)}"
    else
      "#{@_dayStr(_days)} #{@_hourStr(_hours)}"
