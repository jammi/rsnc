HDateTime = UtilMethods.extend

  # constants:
  msWeek: 604800000
  msDay: 86400000
  msHour: 3600000
  msMinute: 60000

  locale: HLocale.dateTime
  localeStrings: HLocale.dateTime.strings

  _dateSel: (_date)->
    if _date and _date._d instanceof Date # moment.js
      _zone = _date.zone()
      _date = @moment(_date.unix()*1000).zone(_zone)
      _date = _date.toDate()
    return @date() if @typeChr( _date ) != 'd'
    _date

  dateInRange: (_date, _min, _max)-> ( _date >= _min and _date < _max )

  ### = Description
  # Returns month name of the given date.
  #
  # = Parameters
  # +_date+:: Date to return month name from.
  #
  # = Returns
  # Month name
  #
  ###
  monthName: (_date)-> @localeStrings.monthsLong[ @_dateSel(_date).getMonth() ]

  ### = Description
  # Returns week number for date given as input.
  #
  # = Parameters
  # +_date+:: Date to return week number from.
  #
  # = Returns
  # Number of the week.
  #
  ###
  week: (_date)-> @moment(@_dateSel(_date)).week()

  ### = Description
  # Returns day of the month for the date given as input.
  #
  # = Parameters
  # +_date+:: Date to return day of the month.
  #
  # = Returns
  # Day of the month
  #
  ###
  mday: (_date)-> @moment( @_dateSel(_date) ).date()
  setMday: (_mday)-> @moment( @date() ).date( _mday ).unix()

  ### = Description
  # Returns month number for the date given as input.
  # Note that months are numbered from 0 to 11.
  #
  # = Parameters
  # +_date+:: Date to return month number from.
  #
  # = Returns
  # Number of the month 0 (January) to 11 (December).
  #
  ###
  month: (_date)-> @moment( @_dateSel(_date) ).month()
  setMonth: ( _month )-> @moment( @date() ).month( _month ).unix()


  ### = Description
  # Returns year for given date.
  #
  # = Parameters
  # +_date+:: Date to return year from.
  #
  # = Returns
  # Year
  #
  ###
  year: (_date)-> @moment( @_dateSel(_date) ).year()
  setYear: ( _year )-> @moment( @date() ).year( _year ).unix()

  ### = Description
  # Returns the timezone offset in milliseconds.
  #
  # = Parameters
  # +_date+:: The date to get timezone offset from.
  #
  # = Returns
  # Timezone offset in milliseconds.
  #
  ###
  tzMs: (_date)->
    if @typeChr(_date) == 'n'
      _dateDiv = @msNow()/_date
      if _dateDiv > 1000
        _date = @moment(_date)
      else
        _date = @moment(_date*1000)
    _date.zone()*@msMinute


  ### = Description
  # Returns a Date instance for epoch given in seconds.
  #
  # = Parameters
  # +_epochSecs+:: Point of time given in seconds
  #                   since 1 January 1970 00:00:00 UTC.
  #
  # = Returns
  # Date object
  #
  ###
  date: (_epochSecs)->
    if @typeChr(_epochSecs) != 'n'
      _epochSecs = @value
    @moment(_epochSecs*1000).toDate()

  ### = Description
  # Returns a Date object with first millisecond of the year.
  #
  # = Parameters
  # +_date+:: The date to get the first millisecond of the same year.
  #
  # = Returns
  # The Date object for the first millisecond of the year
  #
  ###
  firstDateOfYear: (_date)-> @moment(@_dateSel(_date)).startOf('year').toDate()

  ### = Description
  # Get last millisecond of the input given date's year as a Date object.
  #
  # = Parameters
  # +_date+:: The last millisecond of the year on the date given.
  #
  # = Returns
  # Last millisecond of the year as a Date object.
  #
  ###
  lastDateOfYear: (_date)-> @moment(@_dateSel(_date)).endOf('year').toDate()

  ### = Description
  # Returns the first millisecond of the input given date's month.
  #
  # = Parameters
  # +_date+:: The date to get the first millisecond of the month
  #
  # = Returns
  # The first millisecond on the given date's month as a Date object.
  #
  ###
  firstDateOfMonth: (_date)-> @moment(@_dateSel(_date)).startOf('month').toDate()

  ### = Description
  # Returns the last millisecond of the input given date's month.
  #
  # = Parameters
  # +_date+:: The date to get the last millisecond of the month.
  #
  # = Returns
  # The last millisecond of the given date's month as a Date object.
  #
  ###
  lastDateOfMonth: (_date)-> @moment(@_dateSel(_date)).endOf('month').toDate()

  ### = Description
  # Returns the first millisecond when the week starts for date given as input.
  #
  # = Parameters
  # +_date+:: The date to get the first millisecond.
  #
  # = Returns
  # Date for the first millisecond of the week.
  #
  ###
  firstDateOfWeek: (_date)-> @moment(@_dateSel(_date)).startOf('week').toDate()

  ### = Description
  # Returns the last millisecond of the week for the given date.
  #
  # = Parameters
  # +_date+:: The date to get the last millisecond
  #
  # = Returns
  # The last millisecond of the week as a Date object.
  #
  ###
  lastDateOfWeek: (_date)-> @moment(@_dateSel(_date)).endOf('week').toDate()

