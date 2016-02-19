COMM.Transporter.failure = ( _resp ) =>
  if _resp.X.status == 0
    COMM.Transporter.failMessage('Transporter Error','Transporter was unable to complete the synchronization request.')
  else
    COMM.Transporter.failMessage('Transporter Error','Transporter was unable to complete the synchronization request.')
  true

ReloadApp = HApplication.extend
  constructor: ( _title, _message, _url ) ->
    # console.log( "ReloadApp start", _title, _message, _url )
    setTimeout( ( -> window.location.reload( true ) ), 1000 )
