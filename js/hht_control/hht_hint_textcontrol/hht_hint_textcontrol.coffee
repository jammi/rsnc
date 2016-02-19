HHTHintTextControl = HHTTextControl.extend
  componentName: 'hht_hint_textcontrol'
   
  drawSubviews: ->
    @base()
    if @options.style? and @options.style.fontSize?
      @setStyleOfPart( 'value', 'font-size', @options.style.fontSize )
      @setStyleOfPart( 'help', 'font-size', @options.style.fontSize )