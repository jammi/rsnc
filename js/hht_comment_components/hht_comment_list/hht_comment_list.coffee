HHTCommentList = HValueView.extend
  componentName: 'hht_comment_list'

  viewDefaults: HViewDefaults.extend
    emptyText: false #String
    paddingTop: 30
    itemGap: 5
    firstItemLeft: 0
    firstItemRight: 0
    itemLeft: 0
    itemRight: 0

  defaultEvents:
    resize: true

  customOptions: ( _options ) ->
    unless _options.emptyText
      _options.emptyText = HLocale.components.HHTComment.strings.no_comments
    _options.firstItemClass = HHTCommentItem unless _options.firstItemClass?
    _options.itemClass = HHTCommentItem unless _options.itemClass?
    _options.itemOpts = {} unless _options.itemOpts?
    _options

  die: ->
    clearTimeout( @_timeout ) if @_timeout?
    @base()
  
  resize: ->
    @refreshValue()

  adjustHeight: ->
    _height = Math.max( ELEM.getScrollSize( @elemId )[1], 100 )
    @rect.setHeight( _height )
    @drawRect()
    _height

  _markSeen: ->
    clearTimeout( @_timeout ) if @_timeout?
    if @options.markSeenValue?
      @_timeout = setTimeout( ( => @options.markSeenValue.set( 1 ) ), 1000 )
    true

  refreshValue: ->
    if @items?
      for _item in @items
        _item.die()
    @items = []
    unless @typeChr(@value) == 'a' and @value.length > 0
      ELEM.addClassName( @elemId, 'no_comments' )
      return true
    ELEM.delClassName( @elemId, 'no_comments' )
    [ _left, _top, _height, _right ] = [ 0, @options.paddingTop, 40, 0 ]
    for _comment, i in @value
      _opts = @options.itemOpts
      _opts['value'] = _comment
      _opts['theme'] = @theme
      if i == 0
        _rect = [ @options.firstItemLeft, _top, null, _height, @options.firstItemRight, null ]
        _item = @options.firstItemClass.new( _rect, @, _opts )
      else
        _rect = [ @options.itemLeft, _top, null, _height, @options.itemRight, null ]
        _item = @options.itemClass.new( _rect, @, _opts )
      _item.adjustHeight()
      _top = _item.rect.bottom + @options.itemGap
      @items.push( _item )
    @items.push( HView.new( [ 0, _top, null, @options.itemGap, 0, null ], @ ) )
    _elem = ELEM.get( @elemId )
    _elem.scrollTop = _top
    @_markSeen()
    true

  drawSubviews: ->
    @setStyle( 'overflow-y', 'auto' )
