HHTMobileNaviButton = HControl.extend
  componentName: 'hht_mobile_navi_button'
  defaultEvents: { click: true }
  theme: 'mobile'

  _formatIcon: ->
    HHT_ICONS.get( @options.icon )

  click: ->
    ELEM.addClassName( @elemId, 'clicked' )
    @options.click()