HHTCommentItem = HValueView.extend
  componentName: 'hht_comment_item'
  markupElemNames: [ 'content', 'name' ]

  viewDefaults: HViewDefaults.extend
    showDate: true

  extDraw: ->
    if @theme == 'mobile'
      ELEM.setStyle( @elemId, 'margin-left', '10px' )
      ELEM.setStyle( @elemId, 'margin-right', '10px' )

  adjustHeight: ->
    _size1 = ELEM.getScrollSize( @markupElemIds.name )
    _size2 = ELEM.getScrollSize( @markupElemIds.content )
    _height = _size1[1] + _size2[1] + 30
    @rect.setHeight( _height )
    @drawRect()

  _formatSMS: ->
    if @typeChr( @value.tags ) == 'a' and 'sms' in @value.tags
      'SMS'
    else
      ''

  _formatUserIcon: ->
    HHT_ICONS.getUserIcon( @value.user )

  _formatUserName: ->
    @value.user.name
    
  _formatDate: ->
    if @options.showDate == true
      moment( @value.time * 1000 ).utc().format( HLocale.components.HHTDateTime.strings.date_time_format )
    else
      ''
  
  _formatContent: ->
    if @typeChr( @value.attachment ) == 'h'
      HLocale.components.HHTComment.strings.audio_comment
    else
      HHT_UTIL.linkifyHTML( @escapeHTML( @value.value ) ) + '<br />'
      
  drawSubviews: ->
    ELEM.setStyle( @elemId, 'overflow-y', 'visible' )
    if @typeChr( @value.attachment ) == 'h'
      ELEM.addClassName( @elemId, 'has_attachment' )
      HHTAudioPlayer.new( [ 40, 27, 24, 24 ], @,
        value: @value.attachment.audio_url
      )
    true
