# Client -> Server push value buffer.
# Works like HValue, but only streams out changes
# instead of keeping only the last state.
# The nature of the buffer is volatile, so don't rely
# on re-transmission on failures.
# Ideal for event logging purposes.
HPushValue = HValue.extend
  constructor: (_id,_value)->
    @buffer = []
    @base( _id, null )
  toSync: ->
    _arr = []
    _histLen = @buffer.length
    for i in [0..(_histLen-1)]
      _arr.push( @buffer.shift() )
    @value = null
    _arr
  set: (_value)->
    @buffer.push(_value)
    @value = _value 
    COMM.Values.changed(@)
    @refresh()

  die: ->
    @buffer = null
    delete @buffer
    @base()
