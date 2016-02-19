HHTTableRow = HHTListItem.extend
  componentName: 'hht_table_row'

  cellClass: ( _col, _value ) ->
    if @options.colClasses[_col]?
      return @options.colClasses[_col]
    else
      return HHTLabel

  cellStyle: ( _col, _value ) ->
    if @options.colStyles[_col]?
      _style = @options.colStyles[_col]
    else if @options.defaultColStyle?
      _style = @options.defaultColStyle
    else
      _style = {}
    _style['cursor'] = 'pointer'
    _style

  cellValue: ( _col, _value ) ->
    if @options.colFields[_col]?
      if @options.colFields[_col] == true
        return _value
      else
        return _value[ @options.colFields[_col] ]
    else
      return ''  

  drawSubviews: ->
    @cols = []
    for _col in [0..(@options.colCount-1)]
      _class = @cellClass( _col, @value )
      _rect = [ @options.colLefts[_col], 0, @options.colWidths[_col], null, @options.colRights[_col], 0 ]
      @cols.push _class.extend(
        click: ->
          @options.click()
        doubleClick: ->
          true
      ).new( _rect, @,
        events:
          click: true
          doubleClick: true
        value: @cellValue( _col, @value )
        style: @cellStyle( _col, @value )
        click: => @click()
      )
    true

