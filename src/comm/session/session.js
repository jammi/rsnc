
const sha256 = require('util/sha256');

/** = Description
  * COMM.Session is the session key manager.
  *
  * COMM.Session is used by COMM.Transporter to generate key hashes for
  * the session management of COMM.Transporter's keys.
  *
  * The server expects this exact algorithm and refuses to serve unless
  * the SHA256 hash sum of the keys matches.
  *
  * Uses a +SHA+ instance for generation.
  *
  * +COMM.Queue+ runs as a single instance, don't try to reconstruct it.
**/
class Session {

  /* The constructor takes no arguments.
  **/
  constructor() {
    this.shaKey = sha256.hex(Math.round(+new Date() * Math.random() * 1000).toString());
    this.sesKey = '0:2:' + this.shaKey;
    this.reqNum = 0;
  }

  /* = Description
  * Generates a new SHA256 sum using a combination of
  * the previous sum and the +_newKey+ given.
  *
  * Sets +self.sesKey+ and +self.shaKey+
  *
  * = Parameters:
  * +_newKey+:: A key set by the server.
  *
  **/
  newKey(_sesKey) {
    const shaKey = sha256.hex(_sesKey + this.shaKey);
    this.oldKey = _sesKey;
    this.reqNum++;
    this.sesKey = this.reqNum + ':2:' + shaKey;
    this.shaKey = shaKey;
  }

  get Session() {
    return Session;
  }
}

module.exports = new Session();
