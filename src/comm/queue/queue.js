
const HApplication = require('foundation/application');

/* A Group of localizable strings; errors and warnings.
**/
const STRINGS = {
  ERR: 'COMM.Queue Error: ',
  JS_EXEC_FAIL: 'Failed to execute the Javascript function: ',
  REASON: ' Reason:'
};

/** = Description
  * COMM.Queue executes javascript blocks in a managed queue.
  *
  * COMM.Queue is used by COMM.Transporter and JSLoader to continue
  * javascript command execution after a XMLHttpRequest finishes.
  *
  * COMM.Queue runs as a single instance, dan't try to reconstruct it.
**/
class QueueApp extends HApplication {

  /* The constructor takes no arguments and starts queue flushing automatically.
  **/
  constructor() {

    // Run with priority 10; not too demanding but not too sluggish either
    super(10, 'COMM.Queue');

    // The queue itself, is packed with anonymous functions
    this.commandQueue = [];

    this._scripts = {};

    // Flag to signal the pause and resume status.
    this.paused = false;

    if (document.head) {
      this._headElem = document.head;
    }
    else {
      this._headElem = document.getElementsByTagName('head')[0];
    }
  }

  /* Checks periodically, if the queue needs flushing.
  **/
  idle() {
    // Runs the flush operation, if the queue is not
    // empty and the state is not resumed:
    !this.paused && this.commandQueue.length !== 0 && this.flush();
  }

  /* = Description
  * Pauses the queue.
  *
  * Use to stop execution, if some data or code needs to be loaded that the
  * rest of the queue depends on.
  * Typically called before an +XMLHttpRequest+ with the +onSuccess+
  * event defined to call +resume+ when the request is done.
  *
  **/
  pause() {
    this.paused = true;
  }

  /* = Description
  * Resumes queue flushing.
  *
  * Use to resume execuption, when some depending code for the rest
  * of the queue has been loaded.
  * Typically on an +XMLHttpRequest+ +onSuccess+ event.
  *
  **/
  resume() {
    this.paused = false;
    this.flush();
  }

  /* Basic queue item exception reporter. Override with your own, if needed.
  **/
  clientException(_exception, _item) {
    return (
      STRINGS.ERR_PREFIX +
      STRINGS.JS_EXEC_FAIL +
      _exception.name + '->' + _exception.message +
      STRINGS.REASON +
      _exception
    );
  }

  /* = Description
  * Flushes the queue until stopped.
  *
  * Iterates through the +commandQueue+ and calls each function.
  * Removes items from the queue after execution.
  *
  **/
  flush() {
    const len = this.commandQueue.length;
    const endTime = this.msNow() + 250;
    for (let i = 0; i < len; i++) {
      if (this.paused) {
        break;
      }
      else if (this.msNow() > endTime) {
        this.pause();
        setTimeout(() => {
          this.resume();
        }, 0);
        break;
      }
      else {
        const _item = this.commandQueue.shift();

        try {
          if (this.isFunction(_item)) {
            _item.call();
          }
          else if (this.isArray(_item)) {
            const [_function, _arguments] = _item;
            _function.apply(this, _arguments);
          }
        }
        catch (e) {
          this.clientException(e, _item);
        }
      }
    }
  }

  /* = Description
  * Adds an item to the beginning of the queue.
  *
  * Use to make the given +_function+ with its
  * optional +_arguments+ the next item to flush.
  *
  * = Parameters:
  * +_function+::  An anonymous function. Contains the code to execute.
  *
  * +_arguments+:: _Optional_ arguments to pass on to the +_function+
  **/
  unshift(_function, _arguments) {
    if (typeof _arguments !== 'undefined') {
      this.commandQueue.unshift([_function, _arguments]);
    }
    else {
      this.commandQueue.unshift(_function);
    }
  }

  /* = Description
  * Adds an item to the end of the queue.
  *
  * Use to make the given +_function+ with its
  * optional +_arguments+ the last item to flush.
  *
  * = Parameters:
  * +_function+::  An anonymous function. Contains the code to execute.
  *
  * +_arguments+:: _Optional_ arguments to pass on to the +_function+
  **/
  push(_function, _arguments) {
    if (typeof _arguments !== 'undefined') {
      this.commandQueue.push([_function, _arguments]);
    }
    else {
      this.commandQueue.push(_function);
    }
  }

  addScript(_scriptId, _scriptSrc) {
    const _script = document.createElement('script');
    this._scripts[_scriptId] = _script;
    if (typeof _script.textContent !== 'undefined' && _script.textContent !== null) {
      _script.textContent = _scriptSrc;
    }
    else if (typeof _script.text !== 'undefined' && _script.text !== null) {
      _script.text = _scriptSrc;
    }
    else {
      _script.appendChild(document.createTextNode(_scriptSrc));
    }
    this._headElem.appendChild(_script);
  }

  delScript(_scriptId) {
    const _script = this._scripts[_scriptId];
    this._headElem.removeChild(_script);
    delete this._scripts[_scriptId];
  }
}

module.exports = new QueueApp();
