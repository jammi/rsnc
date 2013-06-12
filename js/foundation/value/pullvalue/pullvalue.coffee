# Opposite of HPushValue (Server -> Client push)
HPullValue = HValue.extend
  s: (_values)->
    for _value in _values
      @value = _value
      @refresh()

