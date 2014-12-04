HHTInfo = HControl.extend
  componentName: 'hht_info'
  defaultEvents:
    click: true
    resize: true

  controlDefaults: HControlDefaults.extend
    icon: 'info'
    popupWidth: 300
    popupHeight: 250
    diffX: 0
    diffY: 5
    direction: 'right'
    convertLineBreaks: false

  escKey: ->
    @_hidePopup()
    true

  resize: ->
    @_hidePopup()

  _formatIcon: ->
    HHT_ICONS.get( @options.icon )

  _formatLabel: ->
    if @options.label?
      @options.label
    else
      ''

  die: ->
    @_hidePopup()
    @base()
  
  _hidePopup: ->
    if @_popup? and @_popup.isDead == false
      @_popup.die()
      @_popup = null

  # _reAlign: ->
  #   _popup = @_popup
  #   if _popup?
  #     x = @pageX() + 30
  #     y = @pageY() - 10
  #     _rect = H_popup.rect.clone()
  #     _rect._offsetTo( x, y )
  #     _popup.setRect( _rect )

  click: ( x, y ) ->
    return true if @_popup?
    _this = @
    x = @pageX() + @rect.width + @options.diffX
    y = @pageY() - @rect.height / 2 + @options.diffY
    @_popup = HHTPopup.extend(
      lostActiveStatus: (_obj) ->
        unless _obj == @_text
          _this._hidePopup()
        true
      drawSubviews: ->
        @_text = HHTText.extend(
          lostActiveStatus: (_obj) ->
            if @parent?
              @parent.lostActiveStatus( _obj )
        ).new( [ 30, 15, null, null, 15, 15 ], @,
          value: _this.value
          convertLineBreaks: @options.convertLineBreaks
        )
    ).new( [ x, y, @options.popupWidth, @options.popupHeight ], @app.view,
      value: @value
      direction: @options.direction
      convertLineBreaks: @options.convertLineBreaks
    )
    ELEM.flush()
    EVENT.changeActiveControl( @_popup )
    true