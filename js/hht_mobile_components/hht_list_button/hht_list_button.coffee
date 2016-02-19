HHTListButton = HControl.extend
  componentName: 'hht_list_button'
  markupElemNames: [ 'label' ]
  defaultEvents: { click: true }

  click: ->
    @setCSSClass( 'clicked' )
    if @options.click?
      @options.click()
    else
      @base()

  _formatLabel: ->
    @options.label

  _formatIcon: ->
    HHT_ICONS.get( 'arrow_right' )