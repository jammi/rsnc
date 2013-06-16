HComboBoxInterface =
  refreshValue: ->
    @base()
    if @menu?
      if @menu.isValueInList(@value)
        @menu.setValue(@value)
      else
        @menu.setValue(@value)
        @menu.valueMatrix.setValue(-1)
  drawSubviews: ->
    @base()
    @stepper = null
    @options.withStepper = false
    _menuOptions = @options.menuOptions
    _menuOptions.value = @value unless _menuOptions.value
    _menuOptions.enabled = @enabled
    _menuOptions.hidden = @isHidden
    _menuOptions.listItems = [] unless _menuOptions.listItems
    @menu = HPopupMenu.extend(
      refreshValue: ->
        @base()
        @parent.setValue(@value) unless @parent.value == @value or @value == null
      _firstRect: true
      menuItemViewRect: ->
        if @_firstRect
          @_firstRect = false
          return [ -1000, -1000, @parent.rect.width, (@listItems.length or 1)*24 ]
        w = @parent.rect.width-2
        [ x, y ] = [ @pageX(), @pageY() ]
        x += -2 - w + @rect.width
        if @options.menuBelow
          y += @parent.rect.height
        _rect = [ x, y, w, (@listItems.length or 1)*24 ]
        _rect
      repositionMenuItems: ->
        @menuItemView.setRect( @menuItemViewRect() )
        @menuItemView.drawRect()
      drawSubviews: ->
        @base()
        @destroyMarkupElem('label')
        @setMarkupOfPart('bg','&#9662;')
        @setStyleOfPart('bg',
          lineHeight: (@rect.height+2)+'px'
          verticalAlign: 'middle'
          borderLeft: '1px solid #ccc'
          position: 'absolute'
          fontSize: '13px'
          textAlign: 'center'
          backgroundColor: '#f9f9f9'
        )
      @refreshValue()
    ).new( [null,1,14,@rect.height-2,1,null], @, _menuOptions )
    @_extraLabelRight += 14
    if @unitSuffix
      ELEM.setStyle(@unitSuffix.elemId,'paddingRight','14px')
      @unitSuffix.drawRect()
    @setStyleOfPart('label','right',this._extraLabelRight+'px')
    @menu.bringToFront()
HComboBox = HTextControl.extend(HComboBoxInterface).extend({_comboNumber:false})
HNumericComboBox = HNumericTextControl.extend(HComboBoxInterface).extend({_comboNumber:true})
