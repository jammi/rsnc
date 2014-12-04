HHTDialog = HControl.extend
  componentName: 'hht_dialog'
  
  controlDefaults: HControlDefaults.extend
    width: 500
    height: 200
    title: null
    type: 'modal' #modal, #hover

  defaultEvents:
    resize: true

  constructor: ( _rect, _parent, _opts ) ->
    @base( _rect, _parent, _opts )
    @setCSSClass( @options.type )
    ELEM.flush()
    
  resize: ->
    [ w, h ] = ELEM.windowSize()
    @rect.setWidth( w )
    @rect.setHeight( h )
    @drawRect()
    @centerSubview()
    true

  close: ->
    @setValue( 1 )
  
  open: ->
    @setValue( 0 )

  refreshValue: ->
    if @value == 0
      @bringToFront()
      @show()
    else
      @hide()
    true
  
  createSubview: ( _class, _rect, _opts )->
    @hide()
    @subview = _class.new( _rect, @, _opts )
    @resize()
    @show() if @value == 0
    @subview
    
  centerSubview: ->
    return unless @subview? and @subview.rect?
    [ _parentWidth, _parentHeight ] = ELEM.getSize( @elemId )
    _rect = @subview.rect
    _centerLeft = Math.round( (_parentWidth - _rect.width) * 0.5 )
    if _rect.height < _parentHeight
      _centerTop = Math.round( (_parentHeight - _rect.height) * 0.5 )
    else
      _centerTop = 0
    @subview.rect.offsetTo( _centerLeft, _centerTop )
    @subview.drawRect()
    
  deleteSubview: ->
    if @subview?
      @subview.die()
      @subview = null
  
  extDraw: ->
    @createSubview( HHTCard, [ 0, 0, @options.width, @options.height ],
      title: @options.title
    )
    @bringToFront()
    true

HHTYesNoDialog = HHTDialog.extend

  customOptions: ( _options ) ->
    unless _options['noLabel']?
      _options['noLabel'] = HLocale.components.HHTButton.strings.no_button
    unless _options['yesLabel']?
      _options['yesLabel'] = HLocale.components.HHTButton.strings.yes_button
    _options

  escKey: ->
    @clickNo()

  drawContent: ->
    HHTText.new( [ 20, 60, null, null, 20, 60 ], @subview,
      value: @options.label
      style:
        fontSize: '18px'
        lineHeight: '28px'
        textAlign: 'center'
    )
  
  clickNo: ->
    @options.noFunction() if @options.noFunction?
    @setValue( 1 )
    @dieSoon()
    true
    
  clickYes: ->
    @options.yesFunction() if @options.yesFunction?
    @setValue( 1 )
    @dieSoon()
    true
  
  drawButtons: ->
    @noButton = HHTButton.new( [ 20, null, 80, 30, null, 20 ], @subview,
      label: @options.noLabel
      click: => @clickNo()
      tabIndex: 1
    )
    @yesButton = HHTButton.new( [ null, null, 80, 30, 20, 20 ], @subview,
      label: @options.yesLabel
      click: => @clickYes()
      tabIndex: 2
    )
    
  drawSubviews: ->
    @base()
    @drawButtons()
    @drawContent()
    true

HHTTextControlDialog = HHTYesNoDialog.extend
  clickYes: ->
    @options.yesFunction( @editor.value ) if @options.yesFunction?
    @setValue( 1 )
    @dieSoon()
    true

  drawContent: ->
    HHTCardTitle.new( [ 20, 20, null, 35, 20, null ], @subview,
      value: @options.title
      style:
        borderBottom: '#00AAEF 2px solid'
    )
    @editor = HHTTextControl.extend(
      refreshValue: ->
        @base()
        @options.dialog.yesButton.setEnabled( @value.length > 0 )
    ).new( [ 20, 85, null, 30, 20, null ], @subview,
      value: @options.text
      focusOnCreate: true
      helpText: @options.helpText
      dialog: @
    )

HHTCheckBoxDialog = HHTYesNoDialog.extend
  drawContent: ->
    @base()
    if @options.showCheckbox == true
      HHTCheckBox.new( [ 130, 100, 350, 30 ], @subview,
        bind: @options.checkboxValue
        label: @options.checkboxLabel
      )

HHTOKDialog = HHTDialog.extend
  escKey: ->
    @clickOK()

  drawContent: ->
    HHTText.new( [ 20, 60, null, null, 20, 60 ], @subview,
      value: @options.label
      style:
        fontSize: '18px '
        lineHeight: '28px'
        textAlign: 'center'
    )
  
  clickOK: ->
    @options.okFunction() if @options.okFunction?
    @setValue( 1 )
    @dieSoon()
    true
    
  drawButtons: ->
    @okButton = HHTButton.new( [ null, null, 90, 40, 20, 20 ], @subview,
      label: HLocale.components.HHTButton.strings.ok
      tabIndex: 1
      click: => @clickOK()
    )
    
  drawSubviews: ->
    @base()
    @drawButtons()
    @drawContent()
    true
    
HHTAuthDialog = HHTDialog.extend
  escKey: ->
    @clickNo()

  drawContent: ->
    HHTText.new( [ 20, 50, null, null, 20, 90 ], @subview,
      value: @options.label
      style:
        fontSize: '18px '
        lineHeight: '28px'
        textAlign: 'center'
    )
    HHTTextControl.new( [ @subview.rect.width / 2 - 150, null, 300, 30, null, 70 ], @subview,
      bind: @options.passwordValue
      helpText: @options.passwordHelpText
      focusOnCreate: true
      fieldType: 'password'
    )

  clickNo: ->
    @options.noFunction() if @options.noFunction?
    @setValue( 1 )
    @dieSoon()
    true
  
  clickYes: ->
    @options.yesFunction() if @options.yesFunction?
    @setValue( 1 )
    @dieSoon()
    true

  drawButtons: ->
    @noButton = HHTButton.new( [ 20, null, 80, 30, null, 20 ], @subview,
      label: HLocale.components.HHTButton.strings.no_button
      tabIndex: 1
      click: => @clickNo()
    )
    @yesButton = HHTButton.new( [ null, null, 80, 30, 20, 20 ], @subview,
      label: HLocale.components.HHTButton.strings.yes_button
      tabIndex: 2
      click: => @clickYes()
    )
  
  drawSubviews: ->
    @base()
    @drawButtons()
    @drawContent()
    HValueAction.new( @yesButton,
      bind: @options.passwordValidValue
      action: 'setEnabled'
    )
    true
