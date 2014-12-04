HHTCard = HControl.extend
  componentName: 'hht_card'

  escKey: ->
    if @options.closeFunction instanceof Function
      @options.closeFunction() 
      return true
    false

  die: ->
    ELEM.del( @_labelId ) if @_labelId?
    ELEM.del( @_titleId ) if @_titleId?
    @base()

  extDraw: ->
    if @options.label?
      @setLabel( @options.label )
    if @options.title?
      @setTitle( @options.title )
    true

  setLabel: ( _label ) ->
    unless @_labelId?
      @_labelId = ELEM.make( @elemId, 'div',
        classes: [ 'label' ]
      )
    ELEM.setHTML( @_labelId, _label )
    
  setTitle: ( _title ) ->
    unless @_titleId
      @_titleId = ELEM.make( @elemId, 'div',
        classes: [ 'title' ]
      )
    ELEM.setHTML( @_titleId, _title )
