
var
HLocale = (UtilMethods.extend({
  setData: function(_locale){
    this.updateObject(_locale,this);
  },
  components: {

  },
  general: {
    decimalSeparator: '.',
    thousandsSeparator: ''
  },
  compUnits: {
    strings: {
      bit: ' b',
      'byte': ' B',
      kilobyte: ' kB',
      kibibyte: ' KiB',
      megabyte: ' MB',
      mebibyte: ' MiB',
      gigabyte: ' GB',
      gibibyte: ' GiB',
      terabyte: ' TB',
      tebibyte: ' TiB',
      petabyte: ' PB',
      pebibyte: ' PiB'//,
      // exabyte: ' EB',
      // ebibyte: ' EiB',
      // zettabyte: ' ZB',
      // zebibyte: ' ZiB',
      // yottabyte: ' YB',
      // yobibyte: ' YiB'
    },
    units: {
      SI: [
        [ 1000, 'byte' ],
        [ 1000000, 'kilobyte' ],
        [ 1000000000, 'megabyte' ],
        [ 1000000000000, 'gigabyte' ],
        [ 1000000000000000, 'terabyte' ],
        [ 1000000000000000000, 'petabyte' ]
      ],
      IEC: [
        [ 1024, 'byte' ],
        [ 1048576, 'kibibyte' ],
        [ 1073741824, 'mebibyte' ],
        [ 1099511627776, 'gibibyte' ],
        [ 1125899906842624, 'tebibyte' ],
        [ 1152921504606846976, 'pebibyte' ]
      ]
    },
    defaultUnitSystem: 'SI',
    formatBytes: function( _value, _decimals, _unitSystem ){
      var _this = HLocale.compUnits;
      if(!_decimals){ _decimals = 0; }
      if(!_unitSystem){ _unitSystem = _this.defaultUnitSystem; }
      var
      _strings = _this.strings,
      _decMul = Math.pow(10,_decimals),
      _conv = _this.units[_unitSystem],
      i = 0,
      _lim, _div=1, _num, _suffix;
      for( ; i < _conv.length; i++ ){
        _lim = _conv[i][0];
        _suffix = _strings[_conv[i][1]];
        if( _value < _lim ){
          break;
        }
        _div = _lim;
      }
      if( i && _decimals ){
        _num = Math.round((_value*_decMul)/_div)/_decMul;
      }
      else {
        _num = Math.round(_value/_div);
      }
      return _num+_suffix;
    }
  },
  dateTime: {
    strings: {
      monthsLong: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ],
      monthsShort: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      weekDaysLong:  [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
      weekDaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
      weekLong: 'Week',
      weekShort: 'WK',
      dateDelimitter: '.',
      timeDelimitter: ':',
      timeMsDelimitter: '.',
      rangeDelimitter: ' ... ',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss',
      dateTimeFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    settings: {
      zeroPadTime: true,
      AMPM: false
    },
    defaultOptions: {
      useUTC: false,
      tzMinutes: 0,
      longWeekDay: false,
      shortWeekDay: false,
      shortYear: false,
      fullYear: true,
      seconds: false,
      milliSeconds: false
    },
    options: function( _custom ){
      var
      _this = HLocale.dateTime,
      _default = _this.defaultOptions,
      _options = {},
      _key;
      for( _key in _default ){
        _options[_key] = _default[_key];
      }
      if( _custom ){
        for( _key in _custom ){
          _options[_key] = _custom[_key];
        }
      }
      return _options;
    },
    zeroPadTime: function( _num ){
      if( HLocale.dateTime.settings.zeroPadTime && _num < 10 ){
        return '0'+_num;
      }
      return _num.toString();
    },
    formatShortWeekDay: function( _dateTimeEpoch ){
      var
      _this = HLocale.dateTime,
      _date = new Date( _dateTimeEpoch * 1000 ),
      _strings = _this.strings,
      _wday = _this.options().useUTC?_date.getUTCDay():_date.getDay();
      return _strings.weekDaysShort[ _wday ];
    },
    formatLongWeekDay: function( _dateTimeEpoch ){
      var
      _this = HLocale.dateTime,
      _date = new Date( _dateTimeEpoch * 1000 ),
      _strings = _this.strings,
      _wday = _this.options().useUTC?_date.getUTCDay():_date.getDay();
      return _strings.weekDaysLong[ _wday ];
    },
    formatDate: function( _dateTimeEpoch, _options ){
      _options = this.options( _options );
      var
      _this = HLocale.dateTime,
      _date = new Date( _dateTimeEpoch * 1000 ),
      _strings = _this.strings,
      _wday = _options.useUTC?_date.getUTCDay():_date.getDay(),
      _dateString = _options.useUTC?(_date.getUTCDate() + _strings.dateDelimitter + (_date.getUTCMonth() + 1) + _strings.dateDelimitter):
                                    (_date.getDate() + _strings.dateDelimitter + (_date.getMonth() + 1) + _strings.dateDelimitter);

      if( _options.fullYear ){
        _dateString += _options.useUTC?_date.getUTCFullYear():_date.getFullYear();
      }
      else if( _options.shortYear ){
        _dateString += _options.useUTC?_date.getUTCYear():_date.getYear();
      }

      if( _options.longWeekDay ){
        return _strings.weekDaysLong[_wday] + ' ' + _dateString;
      }
      else if( _options.shortWeekDay ){
        return _strings.weekDaysShort[_wday] + ' ' + _dateString;
      }
      return _dateString;
    },
    formatTime: function( _dateTimeEpoch, _options ){
      _options = this.options( _options );
      var
      _this = HLocale.dateTime,
      _date = new Date( _dateTimeEpoch * 1000 ),
      _strings = _this.strings,
      _timeString = _options.useUTC?(_this.zeroPadTime( _date.getUTCHours() ) + _strings.timeDelimitter + _this.zeroPadTime( _date.getUTCMinutes() )):
                                    (_this.zeroPadTime( _date.getHours() ) + _strings.timeDelimitter + _this.zeroPadTime( _date.getMinutes() ));

      if( _options.seconds ){
        _timeString += _strings.timeDelimitter + _this.zeroPadTime( _options.useUTC?_date.getUTCSeconds():_date.getSeconds() );
        if( _options.milliSeconds ){
          _timeString += _strings.timeMsDelimitter + _options.useUTC?_date.getUTCMilliseconds():_date.getMilliseconds;
        }
      }
      return _timeString;
    },
    formatDateTime: function( _dateTimeEpoch, _options ){
      var _this = HLocale.dateTime;
      return _this.formatDate( _dateTimeEpoch, _options ) + ' ' + _this.formatTime( _dateTimeEpoch, _options );
    }
  }
})).nu();
