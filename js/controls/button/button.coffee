
### = Description
 ## Simple button component, designed to be extended for any
 ## actual functionality above regular HControl.
 ###
HButton = HControl.extend

  componentName: 'button'
  optimizeWidthOnRefresh: true
  controlDefaults: HControlDefaults.extend
    defaultKeyClick: false # use defaultResponder instead; it's a better name
    defaultResponder: false
    pack: false

  defaultEvents:
    click: true

  ###
  # = Description
  # setStyle function for button.
  #
  ###
  setStyle: (_name, _value, _setElemStyle)->
    if _setElemStyle?
      @base(_name,_value)
    else
      @setStyleOfPart('label',_name,_value)
    @

  defaultKey: ->
    if @enabled and ( @options.defaultKeyClick or @options.defaultResponder )
      if @options.defaultKeyClick and !@isProduction
        console.warn("defaultKeyClick is deprecated; use defaultResponder instead (sorry)")
      @setCSSClass('clickeffect')
      @timeouts.push( setTimeout( =>
        @unsetCSSClass('clickeffect')
      , 200 ) )
      @click()
      return false
    null

  click: ->
    console.log('no click action defined in HButton') if !@isProduction

  refresh: ->
    @base()
    if @options.defaultKeyClick or @options.defaultResponder
      if @options.defaultKeyClick and !@isProduction
        console.warn("defaultKeyClick is deprecated; use defaultResponder instead (sorry)")
      @setCSSClass('action')
    else
      @unsetCSSClass('action')

  labelPadding: 0
  optimizeWidth: ->
    _labelWidth = @stringWidth(@label,null,@markupElemIds.label)
    _labelWidth += @labelPadding+Math.floor(@rect.height*0.6)
    if @rect.width != _labelWidth
      # console.log(@viewId,'labelWidth:',@rect.width,'->',_labelWidth)
      @rect.setWidth(_labelWidth)
      @drawRect()
