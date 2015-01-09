# The default locale settings, may be overridden on the server.
HLocale.components.HHTUploader =
  strings:
    ok: 'OK'
    stateLabels:
       # Upload success states:
       '0': "Select file...",
       '1': "Uploading...",
       '2': "Processing data...",
       '3': "Upload Complete",
       '4': "Preparing upload",
       # Upload failure states:
       '-1': "Error: Invalid request",
       '-2': "Error: Invalid upload key",
       '-3': "Error: Invalid data format",
       '-4': "Error: File too big",
       '-6': "Error: Post-processing failed"

HHTUploadButton = HControl.extend
  componentName: 'hht_upload_button'
  markupElemNames: [ 'iframe', 'form', 'file', 'value', 'upload_form', 'upload_target' ]

  controlDefaults: HControlDefaults.extend
    type: 'blue' #blue, white, orange or green
    icon: false
    iconSize: 20

  constructor: ( _rect, _parent, _opts ) ->
    @uploadState = false
    @uploadKey = false
    @base( _rect, _parent, _opts )

  customOptions: ( _options ) ->
    unless _options['label']
      _options['label'] = HLocale.components.HHTButton.strings.upload
    _options

  extDraw: ->
    @button = HHTButton.new( [ 0, 0, null, null, 0, 0 ], @,
      label: @options.label
      type: @options.type
      icon: @options.icon
      iconSize: @options.iconSize
    )

  calcWidth: ->
    @button.calcWidth()

  setLabel: ( _label )->
    @button.setLabel( _label )

  setIcon: ( _icon )->
    @button.setIcon( _icon )

  setUploadKey: ( _uploadKey ) ->
    @uploadKey = null
    @button.setLabel( @options.label )
    @button.setEnabled( true )
    @setStyleOfPart( 'form', 'visibility', 'inherit' )
    @setAttrOfPart( 'form', 'action', 'U/' + _uploadKey, true )
    @setAttrOfPart( 'file', 'value', '', true )
    @uploadKey = _uploadKey

  setProgressState: ( _state, _label ) ->
    @button.setLabel( _label )
    @button.setEnabled( false )
    @setStyleOfPart( 'form', 'visibility', 'hidden' )
    if _state == 1
      @elemOfPart( 'form' ).submit()

  setErrorState: ( _label ) ->
    HHTNotification.show( @, _label  )
    @setStyleOfPart( 'form', 'visibility', 'hidden' )
    true

  setUploadState: ( _state, _uploadKey )->
    if _state != @uploadState
      @uploadState = _state
      _stateKey = _state.toString()
      _stateLabels = HLocale.components.HHTUploader.strings.stateLabels
      if _stateLabels[_stateKey]?
        _label = _stateLabels[_stateKey]
        ELEM.get( @markupElemIds.value ).value = @valueObj.id
        if _state == 0
          @setUploadKey( _uploadKey )
        else if _state >= 1 and _state <= 4
          @setProgressState( _state, _label )
          @getNewUploadKey() if _state == 3
        else if _state < 0
          @setErrorState( _label )
          @getNewUploadKey()

  upload: ->
    if @uploadKey?
      @setValue( '1:::' + @uploadKey )

  getNewUploadKey: ->
    @setValue( '4:::' + @uploadKey )

  refreshValue: ->
    return unless typeof @value == 'string'
    return unless ~@value.indexOf(':::')
    _stateAndKey = @value.split(':::')
    return unless _stateAndKey.length == 2
    @setUploadState( parseInt( _stateAndKey[0], 10), _stateAndKey[1] )
    true
