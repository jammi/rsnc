HHTAudioPlayer = HControl.extend
  componentName: 'hht_audioplayer'
  markupElemNames: [ 'button' ]
  defaultEvents:
    click: true
  controlDefaults: HControlDefaults.extend
    formats: [ 'ogg', 'mp3' ]
  _playingQueue: []
  _soundEvents: [ 'playing', 'ended', 'pause', 'timeupdate' ]

  constructor: ( _rect, _parent, _opts ) ->
    @base( _rect, _parent, _opts )
    @_sound = new buzz.sound( @options.value, { formats: @options.formats } )
    for _event in @_soundEvents
      @_bind( _event )
    @_updateIcon()

  die: ->
    @stop()
    for _event in @_soundEvents
      @_unbind( _event )
    @base()

  _bind: ( _event ) ->
    @_sound.bind( _event, ( => @['on' + _event]() ) )

  _unbind: ( _event ) ->
    @_sound.unbind( _event )

  _addToQueue: ->
    _index = @_playingQueue.indexOf( @viewId )
    @_playingQueue.push( @viewId ) if _index == -1

  _rmFromQueue: ->
    _index = @_playingQueue.indexOf( @viewId )
    @_playingQueue.splice( _index, 1 ) if _index > -1

  _pauseOthers: ->
    for _viewId in @_playingQueue
      continue if _viewId == @viewId
      HSystem.views[_viewId].pause() if HSystem.views[_viewId]?
    true
 
  _updateIcon: ->
    if @_sound.isPaused()
      ELEM.setHTML( @markupElemIds.button, HHT_ICONS.get( 'play' ) )
    else
      ELEM.setHTML( @markupElemIds.button, HHT_ICONS.get( 'stop' ) )

  click: ->
    @_sound.togglePlay()

  play: ->
    @_sound.play()

  pause: ->
    @_sound.pause()

  stop: ->
    @_sound.stop()
    @_rmFromQueue()

  getTime: ->
    @_sound.getTime()

  onplaying: ->
    @_pauseOthers()
    @_addToQueue()
    @_updateIcon()
    true

  onended: ->
    @_rmFromQueue()
    @_updateIcon()
    true

  onpause: ->
    @_rmFromQueue()
    @_updateIcon()
    true

  ontimeupdate: ->
    true
