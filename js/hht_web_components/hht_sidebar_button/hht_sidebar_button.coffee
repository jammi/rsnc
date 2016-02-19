HHTSidebarButton = HControl.extend
  componentName: 'hht_sidebar_button'

  defaultEvents: { click: true }

  _formatLabel: ->
    @options.label

  click: ->
    @options.click()
