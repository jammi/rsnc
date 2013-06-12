HDateTimePicker = HDatePicker.extend
  controlDefaults: HDatePicker.prototype.controlDefaults.extend
    fieldFormat: null
    refreshAfter: 3
    preserveTime: false
    preserveDate: false
    calendarPicker: false
    scrollUnit: 'minutes'
  customOptions: (_options)->
    _options.fieldFormat = HLocale.dateTime.strings.dateTimeFormat if _options.fieldFormat == null
    @base(_options)

