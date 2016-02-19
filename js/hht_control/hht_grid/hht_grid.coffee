HHTGrid = HView.extend

  viewDefaults: HViewDefaults.extend
    colCount: 2
    rowHeights: [ 30 ]
    colWidths: [ 100 ]
    rowGap: 10
    rowGaps: []
    colGap: 10
    colGaps: []

  constructor: ( _rect, _parent, _opts ) ->
    @rowIndex = 0
    @colIndex = 0
    @base( _rect, _parent, _opts )

  getRowGap: ( _row, _col ) ->
    if @options.rowGaps[_row]?
      @options.rowGaps[_row]
    else
      @options.rowGap

  getColGap: ( _row, _col ) ->
    if @options.colGaps[_col]?
      @options.colGaps[_col]
    else
      @options.colGap

  getItemLeft: ( _row, _col ) ->
    _left = 0
    _i = 0
    while _i < _col
      _left += @getItemWidth( _row, _i ) + @getColGap( _row, _i )
      _i += 1
    return _left

  getItemTop: ( _row, _col ) ->
    _top = 0
    _i = 0
    while _i < _row
      _top += @getItemHeight( _i, _col ) + @getRowGap( _i, _col )
      _i += 1
    return _top

  getItemWidth: ( _row, _col ) ->
    if @options.colWidths[_col]?
      return @options.colWidths[_col]
    else
      return null

  getItemHeight: ( _row, _col ) ->
    if @options.rowHeights[_row]?
      return @options.rowHeights[_row]
    else
      return @options.rowHeights[ @options.rowHeights.length - 1 ]

  getItemRight: ( _row, _col ) ->
    if @options.colWidths[_col]?
      return null
    else
      return 0

  getItemBottom: ( _row, _col ) ->
    null

  getItemRect: ( _row, _col, _offsetRect ) ->
    if @typeChr( _offsetRect ) == 'a'
      [ _offsetX, _offsetY, _offsetW, _offsetH ] = _offsetRect
    else
      [ _offsetX, _offsetY, _offsetW, _offsetH ] = [ 0, 0, 0, 0 ]
    [ 
      @getItemLeft( _row, _col ) + _offsetX,
      @getItemTop( _row, _col ) + _offsetY,
      @getItemWidth( _row, _col ) + _offsetW,
      @getItemHeight( _row, _col ) + _offsetH,
      @getItemRight( _row, _col ),
      @getItemBottom( _row, _col )
    ]

  nextItem: ->
    @colIndex += 1
    if @colIndex >= @options.colCount
      @nextRow()

  nextRow: ->
    @rowIndex += 1
    @colIndex = 0    

  addItem: ( _class, _opts, _offsetRect ) ->
    _item = @setItem( @rowIndex, @colIndex, _class, _opts, _offsetRect )
    @nextItem()
    _item

  setItem: ( _row, _col, _class, _opts, _offsetRect ) ->
    _class.new( @getItemRect( _row, _col, _offsetRect ), @, _opts )
