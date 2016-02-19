HHTCard = HControl.extend
  componentName: 'hht_card'
  markupElemNames: [ 'title', 'label' ]
  defaultEvents: { resize: true }

  escKey: ->
    if @options.closeFunction instanceof Function
      @options.closeFunction() 
      return true
    false

  extDraw: ->
    if @options.label?
      @alignLabel()
      @setStyleOfPart( 'label', 'visibility', 'inherit' )
    if @options.title?
      @setStyleOfPart( 'title', 'visibility', 'inherit' )
    true

  _formatLabel: ->
    if @options.label?
      return @options.label
    else
      return ''
      
  _formatTitle: ->
    if @options.title?
      return @options.title
    else
      return ''
    
  alignLabel: ->
    @setStyleOfPart( 'label', 'top', "#{@rect.height / 2 - 20}px" )
    
  resize: ->
    @alignLabel()

  setTitle: ( _title ) ->
    ELEM.setHTML( @markupElemIds.title, _title )
    true 
