HTable = HControl.extend
  componentName: 'table'
  markupElemNames: [ 'header', 'subview', 'grid' ]
  defaultEvents:
    resize: true
  controlDefaults: HControlDefaults.extend
    tableType: 'rows' # 'cols' not supported yet
    sortCol: 0 # the default sort column
    useCellGrid: false # whether to use colored cells or not
    cellBgColor: '#eee' # the average bg color
    cellBgColorDiff: '#080808' # color to add/subtract for even/odd col/row
    cellBorderWidth: 1 # cell border width in pixels
    cellBorderColor: '#fff' # cell border color
    sortable: true # set to false, if table should not be sorted
  customOptions: (_options)->
    _options.headerCols = false unless _options.headerCols? # array of strings
    _options.sortDescending = [] unless _options.sortDescending? # column sorting by index; true for descending; false for ascending
    _options.colWidths = [] unless _options.colWidths? # widths by column index; default 'auto'
    _options.colClasses = {} unless _options.colClasses? # class by column index
    _options.defaultColOptions = {} unless _options.defaultColOptions? # fallback default column options
    _options.colOptions = {} unless _options.colOptions? # column class constructor options by column index
    _options.defaultColClass = HStringView unless _options.defaultColClass? # fallback default column class
  _destroyHeader: ->
    if @headerCols?
      _table = @
      for _elemId, i in @headerCols
        Event.stopObserving(ELEM.get(_elemId),'click',@sortFns[i])
        ELEM.del(_elemId)
      delete @headerCols
      delete @headerSizes
      delete @sortFns
  sortByCol: (_col)->
    if @options.sortCol == _col
      if @options.sortDescending[_col]?
        @options.sortDescending[_col] = !@options.sortDescending[_col]
      else
        @options.sortDescending[_col] = false
    else
      @options.sortCol = _col
    if @_sortColElem?
      ELEM.del(@_sortColElem)
      @_sortColElem = null
      delete @_sortColElem
    @drawHeader()
    @refreshTable()
    # if @colViews?
    #   for _size, i in @headerSizes
    #     _colView = @colViews[i]
    #     _colView.rect.setLeft(_size[0])
    #     _colView.rect.setWidth(_size[1])
    #     _colView.drawRect()
  _initCellBgColors: ->
    _color1 = @options.cellBgColor
    _colorDiff = @options.cellBgColorDiff
    if _color1 == 'transparent'
      @_cellBgColors = [ 'transparent', 'transparent', 'transparent' ]
      return
    else if not _colorDiff
      @_cellBgColors = [ _color1, _color1, _color1 ]
      return
    _color0 = @hexColorSubtract( _color1, _colorDiff )
    _color2 = @hexColorAdd( _color1, _colorDiff )
    @_cellBgColors = [ _color0, _color1, _color2 ]
  _cellBgColorOf: (_row, _col)->
    _colorIndex = (_row%2) + (1-_col%2)
    @_cellBgColors[_colorIndex]
  _destroyBgCells: ->
    for _row in @_bgCells
      for _bgCellId in _row
        ELEM.del( _bgCellId )
    delete @_bgCells
  die: ->
    @_destroyBgCells() if @_bgCells?
    @_destroyHeader()
    @base()
  _drawCellStyles: (_1stIdx, _addCount)->
    @_destroyBgCells() if @_bgCells? and not _1stIdx?
    return unless @colViews?
    return unless @_rowsDrawn
    @_bgCells = [] unless _1stIdx?
    _parent = @markupElemIds.grid
    _leftOffset = @headerSizes[0][0]
    @_initCellBgColors() unless _1stIdx?
    _borderSize = @options.cellBorderWidth
    _borderColor = @options.cellBorderColor
    _borderStyle = _borderSize+'px solid '+_borderColor
    _heightOffset = _borderSize
    _height = 24-_heightOffset
    _topAdd = 24
    _halfBorderWidth = Math.floor(_borderSize*0.5)
    if _borderSize == 0
      _widthOffset = 0
      _borderLeftOffset = 0
    else
      _widthOffset = _borderSize-_halfBorderWidth - 2
      _borderLeftOffset = 0 -_halfBorderWidth
    for _colView, _colNum in @colViews
      [ _left, _width ] = @headerSizes[_colNum]
      if _colNum == 0
        _left = _borderLeftOffset
        _width += _leftOffset+_borderLeftOffset
        _width -= _halfBorderWidth if _borderSize % 2 == 1
      else
        _left += _borderLeftOffset-_widthOffset
        #_left -= _borderSize if _borderSize > 1
        _width += _widthOffset
        _width += _halfBorderWidth
      _top = _borderLeftOffset
      for _row, _rowNum in @_rows
        unless _1stIdx? and _rowNum < _1stIdx
          @_bgCells[_rowNum] = [] unless @_bgCells[_rowNum]?
          @_bgCells[_rowNum][_colNum] = ELEM.make(
            _parent, 'div',
            styles:
              backgroundColor: @_cellBgColorOf(_rowNum,_colNum)
              border: _borderStyle
              top: _top+'px'
              left: _left+'px'
              width: _width+'px'
              height: _height+'px'
          )
        _top += _topAdd
    ELEM.flush()
  drawHeader: ->
    _elemIds = []
    _sizes = []
    _autoWidths = []
    _sortFns = []
    _left = 0
    _table = @
    _sortColElem = null
    _sortColClassName = (_styles)->
      if _styles.textAlign? and _styles.textAlign == 'right'
        ELEM.delClassName(_sortColElem,'sort')
        ELEM.addClassName(_sortColElem,'sort_left')
      else
        ELEM.delClassName(_sortColElem,'sort_left')
        ELEM.addClassName(_sortColElem,'sort')
    for _headerCol, i in @options.headerCols
      _elemId = ELEM.make( @markupElemIds.header, 'div' )
      @options.sortDescending[i] = false unless @options.sortDescending[i]?
      ELEM.addClassName(_elemId,'column')
      _width = 0
      if @options.colWidths[i]?
        if @options.colWidths[i] == 'auto'
          _autoWidths.push(i)
        else
          _width += @options.colWidths[i]
      else
        _width += @stringWidth(_headerCol, null, _elemId)
      _sizes.push([_left,_width])
      ELEM.setAttr(_elemId,'sortcol',i)
      ELEM.setHTML(_elemId,_headerCol)
      if @options.sortCol == i and @options.sortable
        _sortColElem = ELEM.make( _elemId, 'div' )
        if @options.headerStyles? and @options.headerStyles[i]?
          _sortColClassName( @options.headerStyles[i] )
        else if @options.defaultHeaderStyle
          _sortColClassName( @options.defaultHeaderStyle )
        else
          ELEM.addClassName( _sortColElem, 'sort' )
        if @options.sortDescending[i]
          ELEM.setHTML( _sortColElem, '&#9660;' )
        else
          ELEM.setHTML( _sortColElem, '&#9650;' )
      _sortFns.push((e)->
        _table.sortByCol(@sortcol)
        e.preventDefault()
        true
      )
      if @options.sortable
        Event.observe(_elemId,'click',_sortFns[i])
      else
        ELEM.setStyle(_elemId,'cursor','default')
      _left += _width
      _elemIds.push( _elemId )
    if _autoWidths.length > 0
      _autoWidth = Math.floor(( @rect.width - _left )/_autoWidths.length)
    _plusLeft = 0
    for [_left, _width], i in _sizes
      _elemId = _elemIds[i]
      ELEM.setStyle(_elemId,'left',_left+_plusLeft+'px')
      _sizes[i][0] = _left+_plusLeft
      if _autoWidths.indexOf(i) != -1
        _width = _autoWidth
        # _width += 20 if i == @options.sortCol
        _sizes[i][1] = _width
        _plusLeft += _autoWidth
      ELEM.setStyle(_elemId,'width',_width+'px')
      if @options.headerStyles? and @options.headerStyles[i]?
        ELEM.setStyles( _elemId, @options.headerStyles[i] )
      else if @options.defaultHeaderStyle
        ELEM.setStyles( _elemId, @options.defaultHeaderStyle )
    @_destroyHeader()
    @headerCols = _elemIds
    @headerSizes = _sizes
    @_sortColElem = _sortColElem
    @sortFns = _sortFns
    ELEM.flush()
  resize: ->
    return unless @_rows?
    @drawHeader()
    for _colNum in [0...@headerCols.length]
      _left = @headerSizes[_colNum][0] + 1
      _width = @headerSizes[_colNum][1]
      @colViews[_colNum].rect.offsetTo( _left, 0 )
      @colViews[_colNum].rect.setWidth( _width )
      @colViews[_colNum].drawRect()
    if @options.useCellGrid
      @_drawCellStyles()
  drawSubviews: ->
    if @options.headerCols
      @drawHeader()
    else
      @setStyleOfPart('subview','top',0)
  _findClassInNameSpace: (_className)->
    if typeof _className == 'function' and _className.hasAncestor? and _className.hasAncestor( HControl )
      return _className
    else if typeof _className == 'string' and window[_className]?
      return window[_className] # should have more elegant lookup
    console.warn( 'HTable#'+'_'+'findClassNameInNamespace: No such className => ', _className, ', using default => ',@options.defaultColClass )
    return @options.defaultColClass
  _getClassNameAndValueOfCol: (_col, _colNum)->
    if @options.colOptions[_colNum]?
      _colOption = @cloneObject( @options.colOptions[_colNum] )
    else
      _colOption = @cloneObject( @options.defaultColOptions )
    if @options.colClasses[_colNum]?
      _colClass = @options.colClasses[_colNum]
      if typeof _colClass == 'function' and _colClass.hasAncestor? and _colClass.hasAncestor( HControl )
        return [ _colClass, _colOption ]
      else if _colClass instanceof Object and not _colClass.hasAncestor?
        for _className of _colClass
          return [ @_findClassInNameSpace( _className ), _colClass[_className] ] if @typeChr(_className) == 's'
      else if @typeChr(_colClass) == 's'
        return [ @_findClassInNameSpace( _colClass ), _colOption ]
    return [ @_findClassInNameSpace( @options.defaultColClass ), _colOption ]
  _destroyRows: ->
    for _row, _rowNum in @_rows
      for _col, _colNum in _row
        _col.die()
        _row[_colNum]
    @_rows = []
    @_rowsDrawn = false
  filterRow: (_value)-> false
  sortEq: (a, b, _col)-> a == b
  sortLt: (a, b, _col)-> a < b
  sortGt: (a, b, _col)-> a > b
  sortTableRows: ->
    _rowsVisible = 0
    _col = @options.sortCol
    _sortDescending = @options.sortDescending
    _desc = _sortDescending[_col]
    _rowSort = []
    for _row, i in @_rows
      _rowSort.push( [ @value[i], _row ] )
    _nextCols = []
    if @options.sortOrder? and @options.sortOrder[_col]?
      if @typeChr( @options.sortOrder[_col] ) == 'a'
        _nextCols = @cloneObject( @options.sortOrder[_col] )
      else
        _nextCols = [ @options.sortOrder[_col] ]
    else
      _nextCols = []
    _sortEq = @sortEq
    _sortLt = @sortLt
    _sortGt = @sortGt
    _rowSorter = (_row1, _row2, _col, _nextCols, _desc)->
      _r1 = _row1[0][_col]
      _r2 = _row2[0][_col]
      while _sortEq( _r1, _r2, _col ) and _nextCols.length > 0
        _nextCol = _nextCols.shift()
        _desc = _sortDescending[_nextCol]
        _r1 = _row1[0][_nextCol]
        _r2 = _row2[0][_nextCol]
      return 0 if _sortEq( _r1, _r2, _col )
      if _desc
        return 1 if _sortLt( _r1, _r2, _col )
      else
        return 1 if _sortGt( _r1, _r2, _col )
      return -1
    _rowSort.sort( (_row1,_row2)->
      _rowSorter(_row1, _row2, _col, HVM.clone(_nextCols), _desc)
    )
    _top = 0
    _rowHeight = 24
    for [ _value, _row ], _rowNum in _rowSort
      if @filterRow(_value)
        for _col in _row
          _col.hide()
      else
        _rowsVisible += 1
        for _col, _colNum in _row
          _col.show()
          _col.rect.offsetTo( 0, _top )
          _col.drawRect()
        _top += _rowHeight
    @_rowsVisible = _rowsVisible
  refreshTableRows: (_newData)->
    return unless @headerCols?
    _colViews = @colViews
    unless _colViews
      _colViews = []
      for _colNum in [0..@headerCols.length-1]
        _left = @headerSizes[_colNum][0] + 1
        _width = @headerSizes[_colNum][1]
        _colViews[_colNum] = HView.nu( [ _left, 0, _width, 1 ], @ )
      @colViews = _colViews
    if @_rowsDrawn and not _newData
      @sortTableRows() if @options.sortable
    else if @_rowsDrawn and _newData and @_rows.length == @value.length
      @refreshTableValues()
    else if @_rowsDrawn and _newData and @_rows.length > @value.length
      _1stIdx  = @value.length
      _lastIdx = @_rows.length-1
      _delCount = _lastIdx-_1stIdx+1
      for _rowNum in [_1stIdx.._lastIdx] by 1
        _row = @_rows[_rowNum]
        for _col, _colNum in _row
          _ctrl = @_rows[_rowNum][_colNum]
          _ctrl.die()
      @_rows.splice(_1stIdx,_delCount)
      if @_bgCells?
        for _row, _rowNum in @_bgCells
          if _rowNum >= _1stIdx
            for _bgCellId in _row
              ELEM.del( _bgCellId )
        @_bgCells.splice(_1stIdx,_delCount)
      _top = 24 * _1stIdx
      for _colView in @colViews
        _colView.rect.setHeight(_top)
        _colView.drawRect()
      @refreshTableValues()
    else if @_rowsDrawn and _newData and @_rows.length < @value.length
      _1stIdx = @_rows.length
      _lastIdx = @value.length-1
      _addCount = _lastIdx - _1stIdx + 1
      @refreshTableValues(_1stIdx)
      @createTableRows(_1stIdx,_addCount)
    else @createTableRows()
  refreshTableValues: (_lastIdx)->
    for _row, _rowNum in @value
      break if _lastIdx? and _rowNum >= _lastIdx
      for _col, _colNum in _row
        _ctrl = @_rows[_rowNum][_colNum]
        _ctrl.setValue( _col ) unless _ctrl.value == _col
    @sortTableRows() if not _lastRow? and @options.sortable
  createTableRows: (_1stIdx,_addCount)->
    @_destroyRows() if @_rowsDrawn and not _1stIdx?
    _rowHeight = 24
    if _1stIdx?
      _top = _1stIdx * _rowHeight
      _rows = @_rows
      _viewDefs = []
    else
      _top = 0
      _rows = []
      _viewDefs = []
    _colViews = @colViews
    for _row, _rowNum in @value
      continue if _1stIdx? and _rowNum < _1stIdx
      _rows[_rowNum] = []
      for _col, _colNum in _row
        [ _colClass, _colOpts ] = @_getClassNameAndValueOfCol(_col, _colNum)
        _colOpts.value = _col
        _colOpts.tableRow = _rowNum
        _colOpts.tableCol = _colNum
        _colOpts.autoDraw = false unless _colOpts.autoDraw?
        _viewDefs.push( [_colClass,_rowNum,_colNum,_top,_rowHeight,_colViews[_colNum],_colOpts] )
      _top += _rowHeight
    for _colView in _colViews
      _colView.rect.setHeight(_top)
      _colView.drawRect()
    @_drawCellStyles(_1stIdx,_addCount) if _1stIdx? and @options.useCellGrid
    _finishDraw = =>
      @_rows = _rows
      @_rowsDrawn = true
      @sortTableRows() if @options.sortable
      unless _1stIdx?
        if @options.useCellGrid
          @pushTask => @_drawCellStyles()
        if @drawTableExtras?
          @pushTask => @drawTableExtras()
      if @drawFinished?
        @pushTask => @drawFinished()
    if _viewDefs.length > 0
      @pushTask =>
        _viewsToDraw = []
        _count = _viewDefs.length
        _progress = HProgressBar.new([0,0,@rect.width,24],@,visible:false)
        setTimeout( ->
          _progress.show()
        , 100 )
        _itemNum = 0
        for i in [0.._count-1]
          @pushTask =>
            _itemNum+=1
            [_colClass,_rowNum,_colNum,y,h,_parent,_colOpts] = _viewDefs.shift()
            _view = _colClass.new( [ 0,y,null,h,0,null ], _parent, _colOpts )
            _rows[_rowNum][_colNum] = _view
            _progress.setValue(_itemNum/_count)
            _viewsToDraw.push(_view)
        @pushTask =>
          _colView.draw() for _colView in _viewsToDraw
          ELEM.flush()
          @pushTask( _finishDraw )
          _progress.die()
    else _finishDraw()
  refreshTableCols: (_newData)->
    console.warn('HTable#refreshTableCols is not implemented yet!')
  refreshTable: (_newData)->
    if @options.tableType == 'rows'
      @refreshTableRows(_newData)
    else if @options.tableType == 'cols'
      console.warn('ERROR; refreshTable: tableType \'cols\' not supported!')
      @refreshTableCols(_newData)
  refreshValue: ->
    if @value instanceof Array
      @refreshTable( true )
