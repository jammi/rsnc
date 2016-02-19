HHT_UTIL = 
  linkifyHTML: ( _html ) ->
     #http://, https://, or ftp://
    _rp = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim
    _html = _html.replace( _rp, '<a href="$1" target="_blank">$1</a>' )

    #start with www
    _rp = /(^|[^\/])(www\.[\S]+(\b|$))/gim 
    _html = _html.replace( _rp, '$1<a href="http://$2" target="_blank">$2</a>' )

    #Mails
    _rp = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z0-9_]+?(?:\.[a-zA-Z]{2,6}))+/gim
    _html = _html.replace( _rp, '<a href="mailto:$1">$1</a>' )

    return _html