const BROWSER_TYPE = require('core/browser_type');

// Onload handler

let _initDone = false;
let _isLoaded = false;
let _loadTimer = null;
const _loadQueue = [];

// Runs a cmd
const _run = (_cmd) => {
  if (typeof _cmd === 'function') {
    _cmd.call();
  }
  else {
    console.error(
      'Evaluation of LOAD strings is not supported.' +
      'Please convert to anonymous function: ' + _cmd);
  }
};

// Processes the queue for tasks to run upon completion of document load
const _flushQueue = () => {
  if (_loadQueue.length === 0) {
    _initDone = true;
  }
  else {
    _run(_loadQueue.shift());
  }
};

// Checks if the document is fully loaded
const _onloadWaitCheck = () => {
  if (BROWSER_TYPE.safari && document.readyState === 'complete') {
    _isLoaded = true;
  }
  else if (document.body) {
    _isLoaded = true;
  }
  if (_isLoaded) {
    clearTimeout(_loadTimer);
    while (!_initDone) {
      _flushQueue();
    }
  }
  else {
    _loadTimer = setTimeout(() => {
      _onloadWaitCheck();
    }, 10);
  }
};
_onloadWaitCheck();

const LOAD = _cmd => {
  if (_initDone) {
    _run(_cmd);
  }
  else {
    _loadQueue.push(_cmd);
  }
};

module.exports = LOAD;
