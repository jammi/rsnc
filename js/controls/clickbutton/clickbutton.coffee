### = Description
 ## Simple HButton extension, operates on its value so it's useful
 ## for sending button clicks to the server and the like.
 ## For the value responder, reset the value to 0 when read to make
 ## the button clickable again.
 ##
 ## = Value states
 ## +0+::     Enabled, clickable
 ## +1+::     Disabled, clicked
 ## +Other+:: Disabled, not clickable, not clicked
 ###
HClickButton = HButton.extend

  defaultEvents:
    click: true

  controlDefaults: HButton.prototype.controlDefaults.extend
    clickOnValue: 1
    clickOffValue: 0

  ###
  # = Description
  # Sets the button enabled if this.value is 0.
  #
  ###
  refreshValue: ->
    if @options.inverseValue
      @setEnabled( @value == @options.clickOnValue )
    else
      @setEnabled( @value == @options.clickOffValue )

  ###
  # = Description
  # Click method, sets the value to disabled if the button is enabled.
  #
  ###
  click: ->
    if @enabled
      if @options.inverseValue
        @setValue( @options.clickOffValue )
      else
        @setValue( @options.clickOnValue )

HClickValueButton = HClickButton
