HHTNumberPicker = HControl.extend
  componentName: 'hht_numberpicker'

  controlDefaults: HControlDefaults.extend
    showUnit: false
    unit: ''
    unitWidth: 40
    unitStyle: null
    fieldMin: null
    fieldMax: null
    fieldStep: null

  setValue: ( _value ) ->
    unless _value == @value
      @base( _value )
      @text.setValue( _value ) if @text?
    true

  drawSubviews: ->
    if @options.showUnit == true
      HHTLabel.new( [ null, 0, @options.unitWidth, 30, 0, null ], @,
        value: @options.unit
        style: @options.unitStyle
      )
      _rect = [ 0, 0, null, 30, @options.unitWidth + 5, null ]
    else
      _rect = [ 0, 0, null, null, 0, 0 ]
    @text = HHTNumberControl.extend(
      setValue: ( _value ) ->
        @base( _value )
        @parent.setValue( @value )
    ).new( _rect, @,
      value: @options.value
      bind: @options.bind
      enabled: @enabled
      style: @options.textStyle
      fieldMin: @options.fieldMin
      fieldMax: @options.fieldMax
      fieldStep: @options.fieldStep
      style: { textAlign: 'center' }
    )
    true
