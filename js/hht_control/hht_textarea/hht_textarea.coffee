HHTTextArea = HHTTextControl.extend
  componentName: 'hht_textarea'
  fieldName: 'textarea'
  defaultKey: => return false

  drawMarkup: ->
    @base()
    @setStyleOfPart( 'help', 'line-height', '20px' )
    @
