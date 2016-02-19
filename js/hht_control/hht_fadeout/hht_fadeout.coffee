HHTFadeOut = HView.extend
  componentName: 'hht_fadeout'
  viewDefaults: HViewDefaults.extend
    align: 'top' #top or bottom
    
  drawSubviews: ->
    ELEM.addClassName( @elemId, @options.align )
  