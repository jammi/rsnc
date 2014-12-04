HHTTextControl = HControl.extend
  componentName: 'hht_textcontrol'
  markupElemNames: [ 'bg', 'value', 'help' ]

  controlDefaults: HControl.prototype.controlDefaults.extend
    helpText: null
    refreshOnBlur:  true
    refreshOnChange: true
    refreshOnInput: true
    fontSize: null
    type: 'gray' # gray, white

  defaultEvents:
    textEnter: false
    click: true

  textSelectable: true
  fieldName: 'input'
  fieldType: 'text'

  constructor: (_rect, _parent, _options) ->
    @hasTextFocus = false
    if _options.fieldType?
      @fieldType = _options.fieldType
    @base( _rect, _parent, _options )
    if @options.validValue
      HValueAction.new( @,
        bind: @options.validValue
        action: 'setValid'
      )
    true

  die: ->
    @getInputElement().blur() if @hasTextFocus
    _elemId = @markupElemIds.value
    Event.stopObserving( _elemId, 'focus', @_textFocusFn )
    Event.stopObserving( _elemId, 'blur', @_textBlurFn )
    Event.stopObserving( _elemId, 'input', @_textChangeFn )
    @base()

  drawMarkup: ->
    @base()
    if @options.snatchField?
      _elemId = @_snatchField( @elemId, @options.snatchField )
    else
      _attrs = { type: @fieldType, value: @value }
      _attrs.min = @options.fieldMin if @typeChr( @options.fieldMin ) == 'n'
      _attrs.max = @options.fieldMax if @typeChr( @options.fieldMin ) == 'n'
      _attrs.step = @options.fieldStep if @typeChr( @options.fieldMin ) == 'n'
      _elemId = ELEM.make( @elemId, @fieldName, { attr: _attrs } )
    @markupElemIds.value = _elemId
    @setCSSClass( 'value', 'input' )
    @_textFocusFn = => @textFocus()
    @_textBlurFn = => @textBlur()
    @_textChangeFn = => @textChange()
    Event.observe( _elemId, 'focus', @_textFocusFn )
    Event.observe( _elemId, 'blur', @_textBlurFn )
    Event.observe( _elemId, 'input', @_textChangeFn )
 
    @setCSSClass( @options.type )
    if @options.fontSize
      @setStyleOfPart( 'value', 'font-size', @options.fontSize + 'px' )
      @setStyleOfPart( 'help', 'font-size', @options.fontSize + 'px' )
    @setStyleOfPart( 'help', 'line-height', @rect.height + 'px' )
    @

  refreshValue: ->
    @setTextFieldValue( @value )
    @toggleCSSClass( @elemId, 'has_text', ( @typeChr( @value ) == 's' and @value.length > 0 ) )
    true

  _formatHelp: ->
    if @typeChr( @options.helpText ) == 's'
      @options.helpText
    else
      ''

  _snatchField: ( _parentId, _id )->
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

  
  setFocus: ->
    _elem = @getInputElement()
    _elem.focus() if _elem?
    @setSelectionRange( @value.length, @value.length ) if @typeChr(@value) == 's'

  lostActiveStatus: (_prevActive)->
    @base(_prevActive)
    if @markupElemIds? and @markupElemIds.value? and _prevActive != @
      ELEM.get( @markupElemIds.value ).blur()
      @textBlur()

  setStyle: (_name, _value, _cacheOverride)->
    @base(_name, _value, _cacheOverride)
    return unless @markupElemIds? && @markupElemIds.value?
    @setStyleOfPart( 'value', _name, _value, _cacheOverride )

  click: ->
    @getInputElement().focus() unless @hasTextFocus

  setTabIndex: ( _tabIndex )->
    @setAttrOfPart( 'value', 'tabIndex', _tabIndex )
    if _tabIndex == 1 and !BROWSER_TYPE.mobile
      @setFocus()

  setEnabled: (_flag) ->
    @base(_flag)
    if @markupElemIds? and @markupElemIds.value?
      ELEM.get(@markupElemIds.value).disabled = !@enabled
    else if not @isDead
      @pushTask =>
        @setEnabled(_flag) unless @isDead

  setValid: ( _flag ) ->
    @toggleCSSClass( @elemId, 'invalid', ( _flag in [ 0, false ] ) )

  _clipboardEventTimer: null

  # _getChangeEventFn: ->
  #   _this = @
  #   return (e)->
  #     clearTimeout( _this._clipboardEventTimer ) if _this._clipboardEventTimer
  #     _this._clipboardEventTimer = setTimeout( ( -> _this.clipboardEvent() ), 200 )
  #     return true

  _changedFieldValue: (_value1,_value2) ->
    _value1 != _value2

  _updateValueFromField: ->
    _validatedValue = @validateText( @getTextFieldValue() )
    if @_changedFieldValue( _validatedValue, @value )
      @setValue( _validatedValue )

  clipboardEvent: ->
    @_updateValueFromField()
    clearTimeout( @_clipboardEventTimer )
    @_clipboardEventTimer = null

  ### = Description
  ## Special event for text entry components.
  ## Called when the input field gains focus.
  ##
  ###
  textFocus: ->
    return if @hasTextFocus
    EVENT.changeActiveControl( @ )
    @hasTextFocus = true
    true

  ### = Description
  ## Special event for text entry components.
  ## Called when the input field loses focus.
  ###
  textBlur: ->
    return unless @hasTextFocus
    @hasTextFocus = false
    if @options.refreshOnBlur
      @_updateValueFromField()
      @refreshValue()
    true

  textChange: ->
    if @options.refreshOnChange
      @_updateValueFromField()
      @refreshValue()
    true

  ### = Description
  ## Placeholder method for validation of the value.
  ##
  ###
  validateText: (_value) -> @fieldToValue(_value)

  ### = Description
  ## Returns the input element or null, if no input element created (yet).
  ###
  getInputElement: ->
    if @markupElemIds and @markupElemIds.value
      return ELEM.get( @markupElemIds.value )
    else
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
  setTextFieldValue: ( _value, _override )->
    _inputElement = @getInputElement()
    return unless _inputElement?
    [ _selectionStart, _selectionEnd ] = @getSelectionRange()
    _value = @valueToField(_value)
    @_lastFieldValue = _value
    if not @hasTextFocus or _override
      if ( not _value? )
        _inputElement.value = ''
      else if _inputElement.value != _value.toString()
        _inputElement.value = _value 
      @setSelectionRange( _selectionStart, _selectionEnd )

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
    return [ 0, 0 ] unless @fieldType == 'text'
    return @_getRightAlignedSelectionRange() if @styleOfPart('value','textAlign') == 'right'
    @_getLeftAlignedSelectionRange()

  refreshAfter: ->
    _fieldValue = @getTextFieldValue()
    if not @_lastFieldValue? or _fieldValue != @_lastFieldValue
      @_lastFieldValue = _fieldValue
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
    return unless @fieldType == 'text'
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
