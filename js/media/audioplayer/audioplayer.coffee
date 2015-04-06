HAudioPlayer = HControl.extend
  # componentName: 'audioplayer'
  controlDefaults: HControlDefaults.extend
    autoPlay: false
    skipSeconds: 2.0
    playLabel: '&#9658;'
    skipBackLabel: '&#9664;&#9664;'
    pauseLabel: '&#10073;&#10073;'
    stopLabel: '<div class="player_stop">&#9632;</div>'
    rewindLabel: '<span class="player_rewind0">&#9614;</span><span class="player_rewind1">&#9664;</span><span class="player_rewind2">&#9664;</span>'
    playerFeatures: [
      # 'play'
      # 'pause'
      # 'stop'
      # 'rewind'
      # 'skipback'
      # 'playPause'
      'playStop'
      # 'mute'
      # 'volume'
      # 'seek'
      # 'position'
      # 'timeLeft'
    ]
  play: ->
    if @_mediaElement?
      @_mediaElement.setVolume( 1 )
      @_mediaElement.setMuted( false )
      @_mediaElement.addEventListener( 'ended', ( => @_mediaEnded() ), false )
      @_mediaElement.play() 
    @_playStopButton.setLabel(@options.stopLabel) if @_playStopButton?
    @_playPauseButton.setLabel(@options.pauseLabel) if @_playPauseButton?
  pause: ->
    @_mediaElement.pause() if @_mediaElement?
    _playLabel = @options.playLabel
    @_playStopButton.setLabel(_playLabel) if @_playStopButton?
    @_playPauseButton.setLabel(_playLabel) if @_playPauseButton?
  seek: (_time)->
    @_mediaElement.setCurrentTime(_time) if @_mediaElement?
  stop: ->
    @seek(0)
    @pause()
  rewind: ->
    @seek(0)
  skipBack: ->
    @seek()
  idle: ->
    true
  playStop: ->
    if @playing
      @stop()
    else
      @play()
    @playing = !@playing
  playPause: ->
    if @playing
      @pause()
    else
      @play()
      @_playPauseButton.setLabel(@options.pauseLabel)
    @playing = !@playing
  _createFeatures: ->
    for _playerFeature in @options.playerFeatures
      @_createRewindButton()  if _playerFeature == 'rewind'
      @_createPlayButton()  if _playerFeature == 'play'
      @_createPauseButton()  if _playerFeature == 'pause'
      @_createStopButton()  if _playerFeature == 'stop'
      @_createPlayStopButton()  if _playerFeature == 'playStop'
      @_createPlayPauseButton() if _playerFeature == 'playPause'
  _createPlayButton: ->
    [ x, y, w, h ] = @_playGeom
    _opt = @options
    _buttonLabel = _opt.playLabel
    @_playButton = HButton.extend( click: ->@parent.play() ).new( [x,y,h,h], @,
      label: _buttonLabel
      enabled: false
    )
    @_playGeom[0] += @_playGeom[2]
  _createPauseButton: ->
    [ x, y, w, h ] = @_playGeom
    _opt = @options
    _buttonLabel = _opt.pauseLabel
    @_pauseButton = HButton.extend( click: ->@parent.pause() ).new( [x,y,h,h], @,
      label: _buttonLabel
      enabled: false
    )
    @_playGeom[0] += @_playGeom[2]
  _createStopButton: ->
    [ x, y, w, h ] = @_playGeom
    _opt = @options
    _buttonLabel = _opt.stopLabel
    @_stopButton = HButton.extend( click: ->@parent.stop() ).new( [x,y,h,h], @,
      label: _buttonLabel
      enabled: false
    )
    @_playGeom[0] += @_playGeom[2]
  _createRewindButton: ->
    [ x, y, w, h ] = @_playGeom
    _opt = @options
    _buttonLabel = _opt.rewindLabel
    @_rewindButton = HButton.extend( click: ->@parent.rewind() ).new( [x,y,h,h], @,
      label: _buttonLabel
      enabled: false
    )
    @_playGeom[0] += @_playGeom[2]
  _createPlayStopButton: ->
    [ x, y, w, h ] = @_playGeom
    _opt = @options
    if @options.autoPlay
      _buttonLabel = _opt.stopLabel
    else
      _buttonLabel = _opt.playLabel
    @_playStopButton = HButton.extend( click: ->@parent.playStop() ).new( [x,y,h,h], @,
      label: _buttonLabel
      enabled: false
    )
    @_playGeom[0] += @_playGeom[2]
  _createPlayPauseButton: ->
    [ x, y, w, h ] = @_playGeom
    _opt = @options
    if @options.autoPlay
      _buttonLabel = _opt.pauseLabel
    else
      _buttonLabel = _opt.playLabel
    @_playPauseButton = HButton.extend( click: ->@parent.playPause() ).new( [x,y,h,h], @,
      label: _buttonLabel
      enabled: false
    )
    @_playGeom[0] += @_playGeom[2]
  _enableAll: (_state)->
    @_playStopButton.setEnabled(_state) if @_playStopButton?
    @_playPauseButton.setEnabled(_state) if @_playPauseButton?
    @_playButton.setEnabled(_state) if @_playButton?
    @_pauseButton.setEnabled(_state) if @_pauseButton?
    @_stopButton.setEnabled(_state) if @_stopButton?
    @_rewindButton.setEnabled(_state) if @_rewindButton?
  _mediaLoaded: (_mediaElement, _domObject)->
    @playing = @options.autoPlay
    @play() if @playing
    @_enableAll( @enabled )
  _mediaFailed: ->
    console.log('HAudioPlayer media failure:',arguments)
  _mediaEnded:->
    @stop() 
    @playing = false
  die: ->
    @pause()
    ELEM.del(@_audioElementId) if @_audioElementId?
    @base()
  extDraw: ->
    _opt = @options
    @_playGeom = [0,0,@rect.height,@rect.height]
    @_mediaElement = null
    @_createFeatures()
    @_audioElementId = ELEM.make(@elemId,'audio',{attr:{src:@value}})
    _audioElement = ELEM.get(@_audioElementId)
    try
      @_mediaElement = new MediaElement(_audioElement,
        success: => @_mediaLoaded()
        error: => @_mediaFailed()
      )
    catch e
      console.log('MediaElement init error:',e)
