#### = Description
  ## HTextControl is a control unit that represents an editable input
  ## line of text. Commonly, textcontrol is used as a single text field in
  ## the request forms. HTextControl view or theme can be changed; the
  ## default_theme is used by default.
  ##
  ## = Instance variables
  ## +type+::   '[HTextControl]'
  ## +value+::  The string that is currently held by this object.
  ####
HTextControl = HControl.extend

  componentName: 'textcontrol'

  # allows text selection
  textSelectable: true

  defaultEvents:
    textEnter: true
    click: true
    contextMenu: true

  multiline: false
  controlDefaults: HControlDefaults.extend
    labelPadding: 2
    labelStyle:
      textIndent: 0
      fontSize: '10px'
      lineHeight: '14px'
      color: '#666'
    labelWidth:     'auto'
    refreshAfter:   0.0 # amount of milliseconds to wait for a refresh from the input field
    refreshOnBlur:  true
    refreshOnInput: true
    refreshOnIdle:  false
    unit: false # unit suffix

  ## This flag is true, when the text input field has focus.
  hasTextFocus: false

  ### = Description
  ## The contextMenu event for text input components is not prevented by default.
  ###
  contextMenu: -> true

  markupElemNames: ['value','invalid','label','subview','bg']

  ### = Description
  ## The refreshLabel method sets the title property of the text
  ## field, essentially creating a tooltip using the label.
  ###
  labelPadding: 2
  refreshLabel: ->
    return unless @label
    return unless @markupElemIds? and @markupElemIds.label?
    @setAttrOfPart( 'label', 'title', @label )
    if @_labelView?
      @_labelView.setLabel( @label )
    else
      @_labelView = HLabel.new( [ 2, 2, 2000, 28 ], @,
        label: @label
        style: @options.labelStyle
      )
    if @options.labelWidth == 'auto'
      ELEM.flushElem([@_labelView.elemId])
      _labelWidth = @_labelView.stringWidth( @label )
    else
      _labelWidth = @options.labelWidth
    _labelWidth += @options.labelPadding || @labelPadding
    @_labelView.rect.setWidth( _labelWidth )
    @_labelView.drawRect()
    if @multiline
      @setStyleOfPart('value','textIndent',_labelWidth+'px')
    else
      @setStyleOfPart('label','left',_labelWidth+'px')

  _clearFocusBlurEvent: ->
    _elemId = @markupElemIds.value
    Event.stopObserving(_elemId,'focus',=>@textFocus())
    Event.stopObserving(_elemId,'blur',=>@textBlur())

  _invalidChar: '&#12336;'
  _setInvalidMarker: ->
    _str = @getInputElement().value
    _strLen = _str.length
    if @fieldType == 'password'
      _str = ''
      for i in [1.._strLen]
        _str += '&#8226;'
    w = @stringWidth(_str,null,@markupElemIds.label,{
      fontFamily: @styleOfPart('value','fontFamily')
      fontSize: @styleOfPart('value','fontSize')
      fontWeight: @styleOfPart('value','fontWeight')
      whiteSpace: 'pre'
    })
    _invaCount = Math.ceil(w/@_invalidCharWidth)+1
    _istr = ''
    _align = @styleOfPart('value','textAlign')
    @setStyleOfPart('invalid','textAlign',_align)
    [ _left, _right ] = [
      parseInt( @styleOfPart('value','left'), 10 ),
      parseInt( @styleOfPart('value','right'), 10 )
    ]
    [ _pLeft, _pRight ] = [
      parseInt( @styleOfPart('value','paddingLeft'), 10 ),
      parseInt( @styleOfPart('value','paddingRight'), 10 )
    ]
    [ _mLeft, _mRight ] = [
      parseInt( @styleOfPart('value','marginLeft'), 10 ),
      parseInt( @styleOfPart('value','marginRight'), 10 )
    ]
    if _align == 'right'
      @setStyleOfPart('invalid','left','auto')
      @setStyleOfPart('invalid','right',(_right+_pRight)+'px')
    else
      @setStyleOfPart('invalid','right','auto')
      @setStyleOfPart('invalid','left',(_left+_pLeft+_mLeft)+'px')
    @setStyleOfPart('invalid','width',w+'px')
    @setStyleOfPart('invalid','visibility','inherit')
    _istr += @_invalidChar for [0.._invaCount]
    @setMarkupOfPart('invalid',_istr)
  _unsetInvalidMarker: ->
    @setMarkupOfPart('invalid','')
    @setStyleOfPart('invalid','visibility','hidden')

  setValid: (_state)-> # true == valid, false == invalid
    @_isValid = _state
    if _state
      @_unsetInvalidMarker()
    else
      @_setInvalidMarker()

  resize: ->
    @_ie8fix() if BROWSER_TYPE.ie8

  _ie8fix: ->
    h = @rect.height-4
    @setStyleOfPart('value','paddingTop','2px')
    @setStyleOfPart('value','lineHeight',h+'px')

  _snatchField: (_parentId,_id)->
    _idType = @typeChr(_id)
    if _idType == 's'
      _elemId = ELEM.bindId(_id)
    else if _idType == 'n'
      _elemId = ELEM.get(_id)
    else
      console.warn('Unknown id type for snatchField:',_id,' (type:'+_idType+'); assuming element...') if !@isProducton
      _elemId = ELEM.bind(_id)
    ELEM.moveToParent(_elemId,_parentId)
    _elemId

  fieldType: 'text'
  
  setFocus: ->
    _elem = @getInputElement()
    if _elem?
      _elem.focus()
      @setSelectionRange( @value.length, @value.length ) if @typeChr(@value) == 's'
  
  drawMarkup: ->
    @base()
    @_invalidCharWidth = @stringWidth(@_invalidChar,null,@markupElemIds.invalid)
    _parentId = @markupElemIds.label
    if @options.snatchField?
      _elemId = @_snatchField(_parentId,@options.snatchField)
    else
      _attrs = {
        type: @fieldType,
        value: @value
      }
      if @multiline
        _elemId = ELEM.make(_parentId,'textarea',{attr:_attrs})
      else
        _elemId = ELEM.make(_parentId,'input',{attr:_attrs})
    @markupElemIds.value = _elemId
    @setCSSClass('value','input')
    Event.observe(_elemId,'focus',=>@textFocus())
    Event.observe(_elemId,'blur',=>@textBlur())
    if BROWSER_TYPE.ie8
      @setResize( true ) unless @events.resize
      @_ie8fix()

  lostActiveStatus: (_prevActive)->
    @base(_prevActive)
    if @markupElemIds? and @markupElemIds.value? and _prevActive != @
      ELEM.get( @markupElemIds.value ).blur()
      @textBlur()

  setStyle: (_name, _value, _cacheOverride)->
    @base(_name, _value, _cacheOverride)
    return unless @markupElemIds? && @markupElemIds.value?
    @setStyleOfPart('value', _name, _value, _cacheOverride)

  click: ->
    @getInputElement().focus() unless @hasTextFocus

  setTabIndex: ( _tabIndex )->
    @setAttrOfPart( 'value', 'tabIndex', _tabIndex )

  setEnabled: (_flag)->
    @base(_flag)
    if @markupElemIds? and @markupElemIds.value?
      ELEM.get(@markupElemIds.value).disabled = !@enabled
    else if not @isDead
      @pushTask =>
        @setEnabled(_flag) unless @isDead

  _clipboardEventTimer: null
  _getChangeEventFn: ->
    _this = @
    return (e)->
      clearTimeout( _this._clipboardEventTimer ) if _this._clipboardEventTimer
      _this._clipboardEventTimer = setTimeout( ( -> _this.clipboardEvent() ), 200 )
      return true
  _changedFieldValue: (_value1,_value2)-> _value1 != _value2
  _updateValueFromField: ->
    _validatedValue = @validateText( @getTextFieldValue() )
    if @_changedFieldValue( _validatedValue, @value )
      @setValue( _validatedValue )

  clipboardEvent: ->
    @_updateValueFromField()
    clearTimeout( @_clipboardEventTimer )
    @_clipboardEventTimer = null

  _changeEventFn: null
  _clearChangeEventFn: ->
    if @_changeEventFn
      Event.stopObserving( ELEM.get(@markupElemIds.value), 'paste', @_changeEventFn )
      Event.stopObserving( ELEM.get(@markupElemIds.value), 'cut', @_changeEventFn )
      @_changeEventFn = null

  _setChangeEventFn: ->
    @_clearChangeEventFn() if @_changeEventFn
    @_changeEventFn = @_getChangeEventFn()
    Event.observe( ELEM.get(@markupElemIds.value), 'paste', @_changeEventFn )
    Event.observe( ELEM.get(@markupElemIds.value), 'cut', @_changeEventFn )

  ### = Description
  ## Special event for text entry components.
  ## Called when the input field gains focus.
  ##
  ###
  textFocus: ->
    return if @hasTextFocus
    EVENT.changeActiveControl( @ )
    @hasTextFocus = true
    @_setChangeEventFn()
    true

  ### = Description
  ## Special event for text entry components.
  ## Called when the input field loses focus.
  ###
  textBlur: ->
    return unless @hasTextFocus
    @hasTextFocus = false
    @_clearChangeEventFn()
    if @options.refreshOnBlur
      @_updateValueFromField()
      @refreshValue()
    true

  # idle: ->
  #   @refreshAfter() if @hasTextFocus and @options.refreshOnIdle and @options.refreshOnInput

  refreshValue: ->
    @setTextFieldValue( @value )

  ### = Description
  ## Placeholder method for validation of the value.
  ##
  ###
  validateText: (_value)-> @fieldToValue(_value)

  ### = Description
  ## Returns the input element or null, if no input element created (yet).
  ###
  getInputElement: ->
    return ELEM.get( @markupElemIds.value ) if @markupElemIds and @markupElemIds.value
    null

  ### = Description
  ## Returns the value of the input element.
  ###
  getTextFieldValue: ->
    _inputElement = @getInputElement()
    return _inputElement.value if _inputElement?
    ''

  valueToField: (_value)-> _value
  fieldToValue: (_value)-> _value

  ### = Description
  ## Sets the value of the input element.
  ##
  ## = Parameters
  ## +_value+::  The value to set.
  ###
  setTextFieldValue: (_value, _override)->
    _inputElement = @getInputElement()
    return unless _inputElement?
    [ _selectionStart, _selectionEnd ] = @getSelectionRange()
    _value = @valueToField(_value)
    @_lastFieldValue = _value
    if not @hasTextFocus or _override
      _inputElement.value = _value if _inputElement.value != _value.toString()
      @setSelectionRange( _selectionStart, _selectionEnd )
    @setValid(true) if _inputElement.value == _value

  die: ->
    @getInputElement().blur() if @hasTextFocus
    clearTimeout(@_refreshTimer) if @_refreshTimer
    @_refreshTimer = null
    @_clearChangeEventFn()
    @_clearFocusBlurEvent()
    @base()

  ### = Description
  ## Returns the selection (or text cursor position) of the input element
  ## as an +Array+ like +[ startOffset, endOffset ]+.
  ###
  _getLeftAlignedSelectionRange: ->
    _inputElement = @getInputElement()
    _rangeArr = [ 0, 0 ]
    # if _inputElement == null or @hasTextFocus == false
    #   _rangeArr = [ 0, 0 ]
    ## All except Internet Explorer
    if _inputElement.selectionStart?
      _rangeArr = [ _inputElement.selectionStart, _inputElement.selectionEnd ]
    ## Internet Explorer:
    else if document.selection and document.selection.createRange
      _range = document.selection.createRange()
      if _range and _range.parentElement() == _inputElement
        _len = _inputElement.value.length
        _normalizedValue = _inputElement.value.replace(/\r\n/g, "\n")
        # Create a working TextRange that lives only in the input
        _textInputRange = _inputElement.createTextRange()
        _textInputRange.moveToBookmark( _range.getBookmark() )

        # Check if the start and end of the selection are at the very end
        # of the input, since moveStart/moveEnd doesn't return what we want
        # in those cases
        _endRange = _inputElement.createTextRange()
        _endRange.collapse(false)

        if ~_textInputRange.compareEndPoints("StartToEnd", _endRange)
          _rangeArr = [ _len, _len ]
        else
          _rangeArr[0] = 0-_textInputRange.moveStart("character", 0-_len)
          _rangeArr[0] += (_normalizedValue.slice(0, _rangeArr[0]).split("\n").length - 1)
          if ~_textInputRange.compareEndPoints("EndToEnd", _endRange)
            _rangeArr[1] = _len
          else
            _rangeArr[1] = 0-_textInputRange.moveEnd("character", 0-_len)
            _rangeArr[1] += (_normalizedValue.slice(0, _rangeArr[1]).split("\n").length - 1)
    return _rangeArr
  _getRightAlignedSelectionRange: ->
    _inputElement = @getInputElement()
    _inputValue = _inputElement.value
    _valueLength = _inputValue.length
    _range = @_getLeftAlignedSelectionRange()
    _range = [ _valueLength-_range[0], _valueLength-_range[1] ]
    _range
  getSelectionRange: ->
    return @_getRightAlignedSelectionRange() if @styleOfPart('value','textAlign') == 'right'
    @_getLeftAlignedSelectionRange()
  _refreshTimer: null
  _lastFieldValue: null
  refreshAfter: ->
    _fieldValue = @getTextFieldValue()
    if not @_lastFieldValue? or _fieldValue != @_lastFieldValue
      @_lastFieldValue = _fieldValue
      if @_refreshTimer
        clearTimeout( @_refreshTimer )
        @_refreshTimer = null
      @pushTask => @_updateValueFromField()

  ### = Description
  ## Sets the selection (or text cursor position) of the input element.
  ##
  ## = Parameters
  ## +_selectionStart+::   The start of the selection (or an Array containing
  ##                       both start and end offset, see below).
  ## +_selectionEnd+::     The end offset of the selection.
  ##
  ## = Note
  ## - +_selectionStart+ can also be given as an +Array+
  ##   like +[ startOffset, endOffset ]+.
  ## - If the +_selectionEnd+ is omitted, no selection is made; the text
  ##   cursor is positioned at the startOffset instead.
  ###
  setSelectionRange: ( _selectionStart, _selectionEnd )->
    if @typeChr( _selectionStart ) == 'a'
      [ _selectionStart, _selectionEnd ] = _selectionStart
    unless _selectionEnd?
      _selectionEnd = _selectionStart
    _inputElement = @getInputElement()
    return if _inputElement == null or @hasTextFocus == false
    if @styleOfPart('value','textAlign') == 'right'
      _len = _inputElement.value.length
      _selectionStart = _len - _selectionStart
      _selectionEnd = _len - _selectionEnd
    # Internet Explorer
    if _inputElement.createTextRange
      _range = _inputElement.createTextRange()
      _range.collapse()
      _selectionEnd = _selectionEnd - _selectionStart
      if _selectionEnd == 0
        _range.move( 'character', _selectionStart )
      else
        _range.moveStart( 'character', _selectionStart )
        _range.moveEnd( 'character', _selectionEnd )
      _range.select()
    # Other browsers:
    else if _inputElement.selectionStart
      _inputElement.setSelectionRange( _selectionStart, _selectionEnd )

  defaultKey: ->
    @refreshAfter()
    null

  ### = Description
  ## Receives the +textEnter+ event to update the value
  ## based on what's (potentially) entered in the text input field.
  ###
  textEnter: ->
    @refreshAfter() if @options.refreshOnInput
    true

  drawSubviews: ->
    @drawUnit()

  _extraLabelRight: 0
  drawUnit: ->
    if @options.unit
      _style =
        fontSize:   @styleOfPart('value','fontSize')
        fontFamily: @styleOfPart('value','fontFamily')
        fontWeight: @styleOfPart('value','fontWeight')
        color:      @styleOfPart('value','color')
        whiteSpace: 'pre'
        textAlign:     'right'
        verticalAlign: 'middle'
        lineHeight:    '100%'
      ELEM.flush()
      [ w, h ] = @stringSize(@options.unit,null,@markupElemIds.label,true,_style)
      h = ELEM.getSize(@markupElemIds.label)[1]
      _style.lineHeight = h+'px'
      _unitRect = [null,1,w+4,h-2,4,1]
      @unitSuffix = HLabel.new(_unitRect,@,
        label: @options.unit
        style: _style
      )
      @_extraLabelRight += @unitSuffix.rect.width
      @setStyleOfPart('label','right',this._extraLabelRight+'px')

HTextField = HTextControl
