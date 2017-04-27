
const UtilMethods = require('util/util_methods');

const defaultLocale = {
  components: {},

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
      pebibyte: ' PiB',
      exabyte: ' EB',
      ebibyte: ' EiB',
      zettabyte: ' ZB',
      zebibyte: ' ZiB',
      yottabyte: ' YB',
      yobibyte: ' YiB'
    },
    units: {
      SI: [
        [1000, 'byte'],
        [1000000, 'kilobyte'],
        [1000000000, 'megabyte'],
        [1000000000000, 'gigabyte'],
        [1000000000000000, 'terabyte'],
        [1000000000000000000, 'petabyte']
      ],
      IEC: [
        [1024, 'byte'],
        [1048576, 'kibibyte'],
        [1073741824, 'mebibyte'],
        [1099511627776, 'gibibyte'],
        [1125899906842624, 'tebibyte'],
        [1152921504606846976, 'pebibyte']
      ]
    },
    defaultUnitSystem: 'SI',
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
      weekDaysLong: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      weekDaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
  }
};

const HLocale = new (class extends UtilMethods {

  constructor(locale) {
    super();
    this.setData(locale || defaultLocale);
  }

  setData(_locale) {
    this.updateObject(_locale, this);
  }

  get components() {
    return this.components;
  }

  get general() {
    return this.general;
  }

  get compUnits() {
    return this.compUnits;
  }

  get dateTime() {
    return this.dateTime;
  }

  formatBytes(_value, _decimals, _unitSystem) {
    const _units = this.compUnits;
    if (!_decimals) {
      _decimals = 0;
    }
    if (!_unitSystem) {
      _unitSystem = _units.defaultUnitSystem;
    }
    const _strings = _units.strings;
    const _decMul = Math.pow(10, _decimals);
    const _conv = _units.units[_unitSystem];
    let i = 0;
    let _div = 1;
    let _num;
    let _suffix;
    for (; i < _conv.length; i++) {
      const _lim = _conv[i][0];
      _suffix = _strings[_conv[i][1]];
      if (_value < _lim) {
        break;
      }
      _div = _lim;
    }
    if (i && _decimals) {
      _num = Math.round((_value * _decMul) / _div) / _decMul;
    }
    else {
      _num = Math.round(_value / _div);
    }
    return _num + _suffix;
  }

  dateOptions(_custom) {
    const _units = this.dateTime;
    const _default = _units.defaultOptions;
    const _options = {};
    Object.entries(_default).forEach(([_key, _value]) => {
      _options[_key] = _value;
    });
    if (_custom) {
      Object.entries(_custom).forEach(([_key, _value]) => {
        _options[_key] = _value;
      });
    }
    return _options;
  }

  zeroPadTime(_num) {
    if (this.dateTime.settings.zeroPadTime && _num < 10) {
      return `0${_num}`;
    }
    return _num.toString();
  }

  formatShortWeekDay(_dateTimeEpoch) {
    const _units = this.dateTime;
    const _date = new Date(_dateTimeEpoch * 1000);
    const _strings = _units.strings;
    const _wday = _units.options().useUTC ? _date.getUTCDay() : _date.getDay();
    return _strings.weekDaysShort[_wday];
  }

  formatLongWeekDay(_dateTimeEpoch) {
    const _units = this.dateTime;
    const _date = new Date(_dateTimeEpoch * 1000);
    const _strings = _units.strings;
    const _wday = _units.options().useUTC ? _date.getUTCDay() : _date.getDay();
    return _strings.weekDaysLong[_wday];
  }

  formatDate(_dateTimeEpoch, _options) {
    _options = this.dateOoptions(_options);
    const _units = this.dateTime;
    const _date = new Date(_dateTimeEpoch * 1000);
    const _strings = _units.strings;
    const _wday = _options.useUTC ? _date.getUTCDay() : _date.getDay();
    const _formatUTC = () => {
      return (
        _date.getUTCDate() +
        _strings.dateDelimitter +
        (_date.getUTCMonth() + 1) +
        _strings.dateDelimitter
      );
    };
    const _formatLocal = () => {
      return (
        _date.getDate() +
        _strings.dateDelimitter +
        (_date.getMonth() + 1) +
        _strings.dateDelimitter
      );
    };
    let _dateString = _options.useUTC ? _formatUTC() : _formatLocal();
    if (_options.fullYear) {
      _dateString += _options.useUTC ? _date.getUTCFullYear() : _date.getFullYear();
    }
    else if (_options.shortYear) {
      _dateString += _options.useUTC ? _date.getUTCYear() : _date.getYear();
    }

    if (_options.longWeekDay) {
      return _strings.weekDaysLong[_wday] + ' ' + _dateString;
    }
    else if (_options.shortWeekDay) {
      return _strings.weekDaysShort[_wday] + ' ' + _dateString;
    }
    return _dateString;
  }

  formatTime(_dateTimeEpoch, _options) {
    _options = this.dateOptions(_options);
    const _units = this.dateTime;
    const _date = new Date(_dateTimeEpoch * 1000);
    const _strings = _units.strings;
    const _formatUTC = () => {
      return (
        this.zeroPadTime(_date.getUTCHours()) +
        _strings.timeDelimitter +
        this.zeroPadTime(_date.getUTCMinutes())
      );
    };
    const _formatLocal = () => {
      return (
        this.zeroPadTime(_date.getHours()) +
        _strings.timeDelimitter + this.zeroPadTime(_date.getMinutes())
      );
    };
    let _timeString = _options.useUTC ? _formatUTC : _formatLocal;
    if (_options.seconds) {
      _timeString += _strings.timeDelimitter;
      _timeString += this.zeroPadTime(_options.useUTC ? _date.getUTCSeconds() : _date.getSeconds());
      if (_options.milliSeconds) {
        _timeString += _strings.timeMsDelimitter;
        _timeString += _options.useUTC ? _date.getUTCMilliseconds() : _date.getMilliseconds();
      }
    }
    return _timeString;
  }

  formatDateTime(_dateTimeEpoch, _options) {
    return (
      this.formatDate(_dateTimeEpoch, _options) +
      ' ' +
      this.formatTime(_dateTimeEpoch, _options)
    );
  }

})(defaultLocale);

// Deprecate this at some point:
window.HLocale = HLocale;

module.exports = HLocale;
