HHTBirthday = HValueView.extend

  _itemList: ->
    if @theme == 'mobile'
      _months = moment.monthsShort()
    else
      _months = moment.months()
    _list = []
    for _month, i in _months
      _list.push( [ i + 1, _month ] )
    _list

  _parseValue: ( _value ) ->
    if @typeChr( _value ) == 's'
      _splits = _value.split( '-' )
      if _splits.length == 3
        return [ parseInt( _splits[0] ), parseInt( _splits[1] ), parseInt( _splits[2] ) ]
    return [ 1986, 1, 1 ]

  _updateDate: ->
    return false unless @_inited
    @setValue( "#{@_year.value}-#{@_month.value}-#{@_day.value}")

  drawSubviews: ->
    [ y, m, d ] = @_parseValue( @value )
    @_day = HHTNumberControl.extend(
      refreshValue: ->
        @base()
        @parent._updateDate()
    ).new( [ 0, 0, 45, null, null, 0 ], @,
      value: d
      fieldMin: 1
      fieldMax: 31
      fieldStep: 1
    )
    @_month = HHTDropdown.extend(
      refreshValue: ->
        @base()
        @parent._updateDate()
    ).new( [ 50, 0, null, null, 65, 0 ], @,
      value: m
      items: @_itemList()
      sortBy: false
      maxLength: 12
    )
    @_year = HHTNumberControl.extend(
      refreshValue: ->
        @base()
        @parent._updateDate()
    ).new( [ null, 0, 60, null, 0, 0 ], @,
      value: y
      fieldMin: 1900
      fieldMax: 2010
      fieldStep: 1
    )
    @_inited = true