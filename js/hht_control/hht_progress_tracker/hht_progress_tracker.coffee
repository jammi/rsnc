HHTProgressTracker = HControl.extend
  componentName: 'hht_progress_tracker'
  markupElemNames: [ 'line' ]

  defaultEvents:
    resize: true

  resize: ->
    _count = @_stepElems.length
    for _elem, _step in @_stepElems
      if _step == 0
        ELEM.setStyle( _elem, 'left', '0px' )
      else if _step == _count - 1
        ELEM.setStyle( _elem, 'right', '0px' )
      else
        ELEM.setStyle( _elem, 'left', ( ( @rect.width - 30 ) / ( _count - 1 ) * _step - 100 ) + 'px' )
    true

  _addStep: ( _step, _label, _count ) ->
    _styles = {}
    if _step == 0
      _styles['left'] = '0px'
      _pos = 'first'
    else if _step == _count - 1
      _styles['right'] = '0px'
      _pos = 'last'
    else
      _styles['left'] = ( ( @rect.width ) / ( _count - 1 ) * _step - 100 ) + 'px'
      _pos = 'middle'

    _stepElem = ELEM.make( @elemId, 'div',
      styles: _styles
      classes: [ 'step', _pos ]
    )

    unless @options.theme == 'mobile'
      _labelElem = ELEM.make( _stepElem, 'div',
        html: _label
        classes: ['label']
      )
      _labelWidth = @stringWidth( _label, _label.length, _labelElem )
      _labelWidth = 30 if _labelWidth < 30
    else
      _labelWidth = 30

    _circleElem = ELEM.make( _stepElem, 'div',
      html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>'
      styles: _styles
      classes: [ 'circle' ]
    )

    _numberElem = ELEM.make( _stepElem, 'div',
      html: "#{_step + 1}"
      classes: [ 'number' ]
    )

    _circleX = ( _labelWidth - 30 ) / 2
    if _step == 0
      ELEM.setStyle( _circleElem, 'left', _circleX + 'px' )
      ELEM.setStyle( _numberElem, 'left', _circleX + 'px' )
      ELEM.setStyle( @markupElemIds.line, 'left', ( _circleX + 15 ) + 'px' )
    else if _step == _count - 1
      ELEM.setStyle( _circleElem, 'right', _circleX + 'px' )
      ELEM.setStyle( _numberElem, 'right', _circleX + 'px' )
      ELEM.setStyle( @markupElemIds.line, 'right', ( _circleX + 15 ) + 'px' )
    else
      ELEM.setStyle( _circleElem, 'left', 85 + 'px' )
      ELEM.setStyle( _numberElem, 'left', 85 + 'px' )
    @_stepElems.push( _stepElem )
    ELEM.flush()

  refreshValue: ->
    for _elem, i in @_stepElems
      @toggleCSSClass( _elem, 'completed', ( i <= @value ) )

  drawSubviews: ->
    @_stepElems = []
    if @typeChr( @options.items ) == 'a'
      for _item, i in @options.items
        @_addStep( i, _item, @options.items.length )
    true