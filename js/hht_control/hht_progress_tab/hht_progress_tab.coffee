HHTProgressTab = HControl.extend

  controlDefaults: HControlDefaults.extend
    scrollY: false

  extDraw: ->
    if @options.scrollY == true
      @setStyle( 'overflow-y', 'auto' )

  prevLabel: ->
    HLocale.components.HHTButton.strings.prev

  nextLabel: ->
    HLocale.components.HHTButton.strings.next
