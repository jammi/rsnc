const HApplication = require('foundation/application');

/** = Description
 ** The single instance of this class is constructed after the first
 ** handshake request with the server by the 'main' plugin.
 **
 ** It has dual functionality:
 ** - It tells the the client time.
 **   It's available as the server HValue instance
 **   +msg.session[:main][:client_time]+ from
 **   any Plugin instance.
 ** - It polls the server on regular intervals.
 **   The polling interval is defined by the server
 **   as the _timeoutSecs constructor parameter.
 **
**/
class SessionWatcher extends HApplication {
  constructor(_timeoutSecs, _sesTimeoutValueId) {
    // onIdle is called when HSystem's ticker count % 100 == 0
    // this means it's 5 seconds with HSystemTickerInterval 50
    super(10, 'SesWatcher');
    // gets the HValue represented by
    // sesTimeoutValueId (:client_time in server)
    this.sesTimeoutValue = this.getValueById(_sesTimeoutValueId);
    this.timeoutSecs = _timeoutSecs;
  }

  // Tells the server the client's current time
  idle() {
    const _now = this.msNow();
    if ((_now - this.sesTimeoutValue.value) > this.timeoutSecs) {
      this.sesTimeoutValue.set(_now);
    }
  }
}

module.exports = SessionWatcher;
