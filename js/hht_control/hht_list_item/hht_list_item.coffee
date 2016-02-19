HHTListItem = HControl.extend
  componentName: 'hht_list_item'

  controlDefaults: HControlDefaults.extend
    allowUnselect: true

  defaultEvents:
    click: true
    doubleClick: true
    keyUp: true
    keyDown: true
    focus: true

  _formatLabel: ->
    if @typeChr( @value ) == 's'
      return @value
    else if @typeChr( @value ) == 'a'
      return @value[1]
    else if @typeChr( @value ) == 'h'
      return ( @value.name or @value.title or @value.label )
    else
      return ''

  keyUp: ( _key ) ->
    if @parent.itemKeyUp instanceof Function
      return @parent.itemKeyUp( @, _key )
    return false

  keyDown: ( _key )->
    if @parent.itemKeyDown instanceof Function
      return @parent.itemKeyDown( @, _key )
    return false

  lostActiveStatus: ( _newActive ) ->
    if @parent.itemLostActiveStatus instanceof Function
      @parent.itemLostActiveStatus( @, _newActive )

  gainedActiveStatus: ( _lastActive ) ->
    if @parent.itemGainedActiveStatus instanceof Function
      @parent.itemGainedActiveStatus( @, _lastActive )

  click: ->
    if @options.allowUnselect and @selected
      @parent.unselectItem( @ )
    else
      @parent.selectItem( @ )

  doubleClick: ->
    true

  getId: ->
    if @typeChr( @value ) == 's'
      return @value
    else if @typeChr( @value ) == 'a'
      return @value[0]
    else if @typeChr( @value ) == 'h'
      return @value.id
    else
      return false

  idMatch: ( _id ) ->
    ( @getId() == _id )
