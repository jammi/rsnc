HHTCommentView = HView.extend

  viewDefaults: HViewDefaults.extend
    showButton: true
    showDate: true
    paddingTop: 30
    editorHeight: 70

  customOptions: ( _options ) ->
    _options.itemClass = HHTCommentItem unless _options.itemClass?
    _options

  adjustHeight: ->
    _height = @comments.adjustHeight() + @options.editorHeight + 5
    @rect.setHeight( _height )
    @drawRect()
    @editor.drawRect()
    _height

  hasText: ->
    @editor.hasText()

  send: ->
    @editor.send()
  
  drawSubviews: ->
    @comments = HHTCommentList.new( [ 0, 0, null, null, 0, @options.editorHeight ], @,
      bind: @options.values.comment_output
      markSeenValue: @options.values.mark_seen
      itemClass: @options.itemClass
      paddingTop: @options.paddingTop
      itemOpts:
        showDate: @options.showDate
    )
    @editor = HHTCommentEditor.new( [ 0, null, null, @options.editorHeight, 0, 0 ], @,
      inputValue: @options.values.comment_input
      smsEnabled: @options.values.sms_enabled
      showButton: @options.showButton
    )
