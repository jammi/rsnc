HHTCard = HControl.extend
  componentName: 'hht_card'
  markupElemNames: [ 'title' ]

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
    if @typeChr( _title ) == 's' and _title.length > 0
      @toggleCSSClass( @elemId, 'show_title', true )
      ELEM.setHTML( @markupElemIds.title, _title )
    else
      @toggleCSSClass( @elemId, 'show_title', false )
      ELEM.setHTML( @markupElemIds.title, '' )
