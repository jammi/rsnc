HHTTable = HControl.extend
  componentName: 'hht_table'

  controlDefaults: HControlDefaults.extend
    headerStyle: null
    sumStyle: null
    defaultHeaderColStyle: null
    defaultSumColStyle: null
    defaultRowStyle: null
    defaultColStyle: null
    defaultColWidth: 120
    rowStyles: []
    colStyles: []
    colFields: []
    colWidths: []
    colNames: []
    colClasses: []
    headerHeight: 30
    rowHeight: 30
    sumHeight: 30
    rowClick: null
    showHeader: true
    showSum: false
    emptyText: ''
    emptyTextStyle:
      fontSize: '20px'
      textAlign: 'center'
    emptyTextAlign: 'middle' #top, middle, bottom

  constructor: ( _rect, _parent, _opts ) ->
    @sumCols = []
    @colLefts = []
    @colRights = []
    @colWidths = []
    @base( _rect, _parent, _opts )

  customOptions: ( _options ) ->
    _options.rowClass = HHTTableRow unless _options.rowClass?
    _options

  extDraw: ->
    @colCount = @options.colFields.length
    @calcColSizes()
    @drawHeader() if @options.showHeader
    @drawRows()
    @drawSum() if @options.showSum
    true

  calcColSizes: ->
    _left = 0
    _right = 0
    _autoCol = @colCount - 1
    for _col in [0..(@colCount-1)]
      _width = @options.defaultColWidth
      if @options.colWidths[_col]?
        _width = @options.colWidths[_col]
      if _width == 'auto'
        _autoCol = _col
        @colWidths.push( null )
      else if _col < _autoCol
        @colWidths.push( _width )
      else
        _right += _width
        @colWidths.push( _width )
    for _col in [0..(@colCount-1)]
      if _col == _autoCol
        @colLefts.push( _left )
        @colRights.push( _right )
      else if _col < _autoCol
        @colLefts.push( _left )
        @colRights.push( null )
        _left += @colWidths[_col]
      else
        _right -= @colWidths[_col]
        @colLefts.push( null )
        @colRights.push( _right )
    true

  drawHeader: ->
    return if @colCount == 0
    @header = HControl.new( [ 0, 0, null, @options.headerHeight, 0, null ], @,
      style: @options.headerStyle
    )
    for _col in [0..(@colCount-1)]
      _rect = [ @colLefts[_col], 0, @colWidths[_col], null, @colRights[_col], 0 ]
      HHTLabel.new( _rect, @header,
        value: @colName( _col ) 
        style: @headerStyle( _col )
      )

  drawRows: ->
    [ _top, _bottom ] = [ 0, 0 ]
    if @options.showHeader
      _top = @options.headerHeight
    if @options.showSum
      _bottom = @options.sumHeight
    @rows = HHTList.extend(
      createItem: ( _rect, _value, _index ) ->
        @parent.drawRow( @, _rect, _value, _index )
    ).new( [ 0, _top, null, null, 0, _bottom ], @,
      bind: @options.selectValue
      items: @options.tableValue
      rowHeight: @options.rowHeight
      emptyText: @options.emptyText
      emptyTextStyle: @options.emptyTextStyle
      emptyTextAlign: @options.emptyTextAlign
    )
    ELEM.flush()

  drawRow: ( _parent, _rect, _value, _row ) ->
    return if @colCount == 0
    @options.rowClass.new( _rect, _parent,
      value: _value
      index: _row
      style: @rowStyle( _row )
      colCount: @colCount
      defaultColStyle: @options.defaultColStyle
      defaultColWidth: @options.defaultColWidth
      colStyles: @options.colStyles
      colFields: @options.colFields
      colWidths: @options.colWidths
      colNames: @options.colNames
      colClasses: @options.colClasses
      colLefts: @colLefts
      colRights: @colRights
      colWidths: @colWidths
    )

  drawSum: ->
    return if @colCount == 0
    @sum = HControl.new( [ 0, null, null, @options.sumHeight, 0, 0 ], @,
      style: @options.sumStyle
    )
    for _col in [0..(@colCount-1)]
      _rect = [ @colLefts[_col], 0, @colWidths[_col], null, @colRights[_col], 0 ]
      @sumCols.push HHTLabel.new( _rect, @sum,
        value: ''
        style: @sumStyle( _col )
      )
    HValueAction.new( @,
      bind: @options.sumValue
      action: 'updateSum'
    )

  updateSum: ( _value ) ->
    for _col in [0..(@colCount-1)]
      _field = @options.colFields[_col]
      if _value[_field]
        @sumCols[_col].setValue( _value[_field] )
      else
        @sumCols[_col].setValue( '' )

  colName: ( _col ) ->
    _typeChr = @typeChr( @options.colNames )
    if _typeChr == 'h'
      @options.colNames[@options.colFields[_col]]
    else if _typeChr == 'a' and @options.colNames[_col]?
      return @options.colNames[_col]
    else
      return ''

  rowStyle: ( _row ) ->
    if @options.rowStyles[_row]?
      return @options.rowStyle[_row]
    else if @options.defaultRowStyle?
      return @options.defaultRowStyle
    else
      return {}

  headerStyle: ( _col ) ->
    @options.defaultHeaderColStyle

  sumStyle: ( _col ) ->
    @options.defaultSumColStyle

