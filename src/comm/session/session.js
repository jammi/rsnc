
const SHA = require('util/sha1');

/** = Description
  * COMM.Session is the session key manager.
  *
  * COMM.Session is used by COMM.Transporter to generate key hashes for
  * the session management of COMM.Transporter's keys.
  *
  * The server expects this exact algorithm and refuses to serve unless
  * the SHA1 hash sum of the keys matches.
  *
  * Uses a +SHA+ instance for generation.
  *
  * +COMM.Queue+ runs as a single instance, don't try to reconstruct it.
**/
class Session {

  /* The constructor takes no arguments.
  **/
  constructor() {
    this.sha = new SHA(8);
    this.sha_key = this.sha.hexSHA1(((new Date().getTime()) * Math.random() * 1000).toString());
    this.ses_key = '0:1:' + this.sha_key;
    this.req_num = 0;
  }

  /* = Description
  * Generates a new SHA1 sum using a combination of
  * the previous sum and the +_newKey+ given.
  *
  * Sets +self.ses_key+ and +self.sha_key+
  *
  * = Parameters:
  * +_newKey+:: A key set by the server.
  *
  **/
  newKey(_sesKey) {
    const shaKey = this.sha.hexSHA1(_sesKey + this.sha_key);
    this.old_key = _sesKey;
    this.req_num++;
    this.ses_key = this.req_num + ':1:' + shaKey;
    this.sha_key = shaKey;
  }
}

module.exports = new Session();
