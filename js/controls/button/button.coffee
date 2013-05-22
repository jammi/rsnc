
### = Description
 ## Simple button component, designed to be extended for any
 ## actual functionality above regular HControl.
 ###
HButton = HControl.extend

  componentName: 'button'
  optimizeWidthOnRefresh: true
  controlDefaults: HControlDefaults.extend
    defaultKeyClick: false
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
    if @options.defaultKeyClick
      @click()
      return false
    null

  click: ->
    console.log('no click action defined in HButton') if !@isProduction

  labelPadding: 0
  optimizeWidth: ->
    _labelWidth = @stringWidth(@label,null,@markupElemIds.label)
    _labelWidth += @labelPadding+Math.floor(@rect.height*0.6)
    if @rect.width != _labelWidth
      # console.log(@viewId,'labelWidth:',@rect.width,'->',_labelWidth)
      @rect.setWidth(_labelWidth)
      @drawRect()
