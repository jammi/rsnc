HHTImage = HControl.extend
  controlDefaults: HControlDefaults.extend
    scaleToFit: true
    value: null

  getImgSrc: ->
    if @value
      return @value
    else if @options.valueObj
      return @options.valueObj.value
    else if @options.value
      return @options.value
    else
      return ''

  _makeScaleToFit: ( _parentId ) ->
    @elemId = ELEM.make( _parentId, 'img', {
      attrs: [
        [ 'src',   @getImgSrc() ]
        [ 'alt',   @label ]
        [ 'title', @label ]
      ]
    } )

  _makeScaleToOriginal: ( _parentId ) ->
    @elemId = ELEM.make( _parentId, 'div' )
    ELEM.setStyle( @elemId, 'background-image', 'url(' + @getImgSrc()+ ')' )
    ELEM.setStyle( @elemId, 'background-position', '0px 0px' )
    ELEM.setStyle( @elemId, 'background-repeat', 'no-repeat' )
    ELEM.setAttr( @elemId, 'title', @label )

  _makeElem: ( _parentId ) ->
    if @options.scaleToFit
      @_makeScaleToFit( _parentId )
    else 
      @_makeScaleToOriginal( _parentId )

  refreshValue: ->
    _src = @getImgSrc()
    if @options.scaleToFit
      unless ELEM.getAttr( @elemId, 'src' ) == _src
        ELEM.setAttr( @elemId, 'src', _src )
    else
      _url = 'url(' + _src + ')'
      unless ELEM.getStyle( @elemId, 'background-image' ) == _url
        ELEM.setStyle( @elemId, 'background-image', _url )

  refreshLabel: ->
    if @options.scaleToFit
      ELEM.setAttr( @elemId, 'alt', @label )
    ELEM.setAttr( @elemId, 'title', @label )

  scaleToFit: ->
    if @options.scaleToFit
      ELEM.del( @elemId )
      @_makeScaleToFit( @_getParentElemId() )
      @options.scaleToFit = true

  scaleToOriginal: ->
    if @options.scaleToFit
      ELEM.del( @elemId )
      @_makeScaleToOriginal( @_getParentElemId() )
      @options.scaleToFit = false
