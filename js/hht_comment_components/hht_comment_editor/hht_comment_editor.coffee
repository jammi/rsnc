HHTCommentEditor = HControl.extend
  componentName: 'hht_comment_editor'

  controlDefaults: HControlDefaults.extend
    showButton: true

  defaultKey: ->
    unless @options.showButton
      @send()
      return true
    else
      return false

  customOptions: (_opts) ->
    unless _opts.helpText?
      _opts.helpText = HLocale.components.HHTComment.strings.write_comment_here
    _opts

  send: ->
    tags = []
    tags.push('sms') if @smsNotif.value == true
    @smsNotif.setValue( false )
    @options.inputValue.set( { value: @input.value, tags: tags } )
    @input.setValue( '' )
    @input.setTextFieldValue( '', true )

  hasText: ->
    @input.value.length > 0

  validComment: ->
    return false unless @input?
    ( @input.value.length > 0 and @input.value.length <= @charsLimit() )

  charsLimit: ->
    _isSMS = @smsNotif.value
    _isConfirm = false
    if _isSMS
      if _isConfirm
        _charLimit = 100
      else
        _charLimit = 160
    else
      100000

  updateCharsRemaining: ->
    return unless @input?
    _isSMS = @smsNotif.value
    _charLimit = @charsLimit()
    _isConfirm = false
    if _isSMS
      _charsLeft = _charLimit - @input.value.length
      if _charsLeft < 0
        _charsLeft = """<b style="color:red">#{_charsLeft}</b>"""
        @sendButton.setEnabled( false ) if @sendButton?
      else
        @sendButton.setEnabled( true ) if @sendButton?
      @charsRemaining.setValue("#{HLocale.components.HHTComment.strings.chars_remaining} #{_charsLeft}")
      @charsRemaining.show()
      @charsRemaining.bringToFront()
    else
      @sendButton.setEnabled( true ) if @sendButton?
      @charsRemaining.hide()
 
  drawSubviews: ->
    if @options.showButton == true
      _rect = [ null, null, 80, 30, 5, 5 ]
      @sendButton = HHTButton.new( _rect, @,
        label: HLocale.components.HHTComment.strings.send
        click: => @send()
        tabIndex: 0
      )
    @smsNotif = HHTCheckBox.extend(
      refreshValue: ->
        @base()
        @parent.updateCharsRemaining()
        @parent.sendButton.setEnabled( @parent.validComment() ) if @sendButton?
    ).new( [ null, null, 80, 30, 5, 38 ], @,
      label: HLocale.components.HHTComment.strings.sms_notification
      value: false
      enabled: true
      visible: ( @options.smsEnabled == true )
      tabIndex: 0
    )
    @charsRemaining = HHTLabel.new( [ null, null, 200, 24, 100, 2 ], @,
      value: HLocale.components.HHTComment.strings.chars_remaining
      visible: false
      style:
        fontSize: '13px'
        textAlign: 'right'
    )
    if @options.showButton == true
      _right = 90
    else
      _right = 0
    @input = HHTTextArea.extend(
      refreshValue: ->
        @base()
        @parent.updateCharsRemaining()
        @parent.sendButton.setEnabled( @parent.validComment() ) if @sendButton?
    ).new( [ 0, 0, null, null, _right, 0 ], @,
      value: ''
      helpText: @options.helpText
      focusOnCreate: true
      tabIndex: 0
    )
