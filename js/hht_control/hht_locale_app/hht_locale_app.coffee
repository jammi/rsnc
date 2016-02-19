HHTLocaleApp = HHTGUIApp.extend
  #This method is needed, if scripts are obfuscated
  _setMoment: ( _lang, _localized ) ->
    _data = {}
    _data['_months'[1..]] = _localized['months']
    _data['_monthsShort'[1..]] = _localized['monthsShort']
    _data['_weekdays'[1..]] = _localized['weekdays']
    _data['_weekdaysShort'[1..]] = _localized['weekdaysShort']
    _data['_weekdaysMin'[1..]] = _localized['weekdaysMin']
    _data['_week'[1..]] = _localized['week']
    moment.locale( _lang, _data )
    true

  _updateLocalized: ( _localized ) ->
    return unless @typeChr( _localized ) == 'h'
    #DateTime
    @_setMoment( 'en', _localized.moment )

    #Uploader
    HLocale.components.HHTUploader = { strings: _localized.uploader }
    
    #Report
    HLocale.components.Report = { strings: _localized.report }
    
    #Buttons
    HLocale.components.HHTButton = { strings: _localized.button }

    #Dropdown
    HLocale.components.HHTDropdown = { strings: _localized.dropdown }

    #Duration
    HLocale.components.HHTDurationLabel = { strings: _localized.duration }

    #CommentView
    HLocale.components.HHTComment = { strings: _localized.comment }

    #HHTDateTime
    HLocale.components.HHTDateTime = { strings: _localized.hht_datetime }

    #Roles
    HLocale.components.roles = { strings: _localized.roles }

    #EventInOut
    HLocale.components.EventInOut = { strings: _localized.event_in_out }

  drawSubviews: ->
    HValueAction.new( @,
      bind: @options.valueIds.localized
      action: '_updateLocalized'
    )
    true    