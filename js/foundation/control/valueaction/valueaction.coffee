HValueAction = UtilMethods.extend

  constructor: ( _rect, _parent, _options ) ->
    if _rect? and _rect.hasAncestor and _rect.hasAncestor( HClass )
      _options = _parent
      _parent = _rect
    else
      console.warn( "Warning: the rect constructor argument of HValueAction is deprecated:", _rect )
    @parent = _parent
    @options = _options
    if _options.value
      @value = _options.value
    if _options.bind?
      _valueObj = _options.bind
      if @typeChr( _valueObj ) == 's'
        _valueObj = @getValueById( _valueObj )
      _valueObj.bind( @ )
    else if _options.valueObj?
      _options.valueObj.bind( @ )
    if @typeChr( @parent.addView ) == '>'
      @viewId = @parent.addView( @ )
    @inited = true
    @

  remove: ->
    if @parent
      _viewZIdx = @parent.viewsZOrder.indexOf(@viewId)
      _viewPIdx = @parent.views.indexOf(@viewId)
      @parent.views.splice(_viewPIdx,1)
      HSystem.delView(@viewId)
      @parent.viewsZOrder.splice( _viewZIdx, 1 )
      _sysUpdateZIndexOfChildrenBufferIndex = HSystem._updateZIndexOfChildrenBuffer.indexOf( @viewId )
      if ~_sysUpdateZIndexOfChildrenBufferIndex
        HSystem._updateZIndexOfChildrenBuffer.splice( _sysUpdateZIndexOfChildrenBufferIndex, 1 )
      @parent  = null
      @parents = []
    @

  die: ->
    if @typeChr( @parent.removeView ) == '>'
      @parent.removeView( @viewId )
    if @valueObj?
      @valueObj.release( @ )
    @value = null
    @viewId = null

  refresh: ->
    if @options.skipFirstRefresh and !@inited
      return false
    if @options.refreshAction or @options.action
      _refreshAction = if @options.refreshAction then @options.refreshAction else @options.action
      if @parent? and @parent[_refreshAction]?
        if @typeChr( @parent[_refreshAction] ) == '>'
          @parent[_refreshAction]( @value )
        else
          @parent[_refreshAction] = @value
    true

HValueAction.implement( HValueResponder )
