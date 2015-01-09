HHTProgressCard = HHTCard.extend

  controlDefaults: HHTCard.prototype.controlDefaults.extend
    prevValue: null
    nextValue: null
    tabTitles: []
    tabClasses: []
    tabOpts: []

  _drawTitle: ->
    if @theme != 'mobile'
      @_title = HHTCardTitle.new( [ 20, 20, null, 38, 20, null ], @,
        value: ''
        style: { fontSize: '25px' }
        showLine: true
      )

  _drawTracker: ->
    if @theme == 'mobile'
      _rect = [ 20, null, null, 40, 20, 70 ]
    else
      _rect = [ 20, null, null, 70, 20, 60 ]
    @_tracker = HHTProgressTracker.new( _rect, @,
      bind: @options.bind
      items: @options.tabTitles
    )

  _prevButtonClick: ->
    return if @options.prevValue and @options.prevValue.value in [ 0, false ]
    if @value >= 0
      @setValue( @value - 1 )

  _nextButtonClick: ->
    return if @options.nextValue and @options.nextValue.value in [ 0, false ]
    if @value < @options.tabTitles.length - 1
      @setValue( @value + 1 )

  _drawButtons: ->
    if @theme == 'mobile'
      _rect = [ 20, null, 120, 45, null, 10 ]
    else
      _rect = [ 20, null, 110, 35, null, 20 ]
    @_prevButton = HHTButton.new( _rect, @,
      label: ''
      click: => @_prevButtonClick()
    )
    if @theme == 'mobile'
      _rect = [ null, null, 120, 45, 20, 10 ]
    else
      _rect = [ null, null, 110, 35, 20, 20 ]
    @_nextButton = HHTButton.new( _rect, @,
      label: ''
      click: => @_nextButtonClick()
    )
    if @options.prevValue
      HValueAction.new( _prevButton,
        bind: @options.prevValue
        action: 'setEnabled'
      )
    if @options.nextValue
      HValueAction.new( _nextButton,
        bind: @options.nextValue
        action: 'setEnabled'
      )
    true

  refreshValue: ->
    if @_content?
      @_content.die()
      @_content = null
    if @options.tabClasses[@value]?
      _class = @options.tabClasses[@value]
    else
      _class = HHTProgressTab
    if @options.tabOpts[@value]?
      _opts = @options.tabOpts[@value]
    else
      _opts = {}
    if @theme == 'mobile'
      _rect = [ 20, 10, null, null, 20, 115 ]
    else
      _rect = [ 20, 60, null, null, 20, 140 ]
    @_content = _class.new( _rect, @, _opts )
    if @typeChr( @_content.getTitle ) == '>'
      _title = @_content.getTitle()
    else if @options.tabTitles[@value]?
      _title = @options.tabTitles[@value]
    else
      _title = ''
    if @_title?
      @_title.setValue( _title )
    _prevLabel = @_content.prevLabel()
    _nextLabel = @_content.nextLabel()
    if _prevLabel?
      @_prevButton.setLabel( _prevLabel )
      @_prevButton.show()
    else
      @_prevButton.hide()
    if _nextLabel?
      @_nextButton.setLabel( _nextLabel )
      @_nextButton.show()
    else
      @_nextButton.hide()
    ELEM.flush()
    true

  extDraw: ->
    @_drawButtons()
    @_drawTitle()
    @_drawTracker()
    true