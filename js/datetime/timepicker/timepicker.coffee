HTimePicker = HDatePicker.extend
  controlDefaults: HDatePicker.prototype.controlDefaults.extend
    fieldFormat: null
    refreshAfter: 3
    preserveTime: false
    preserveDate: true
    calendarPicker: false
    scrollUnit: 'minutes'
  customOptions: (_options)->
    _options.fieldFormat = HLocale.dateTime.strings.timeFormat if _options.fieldFormat == null
    @base(_options)
    _options.calendarPicker = false # always enforce the picker false on HTimePicker
