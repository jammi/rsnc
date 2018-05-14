const HClass = require('core/class');
const BROWSER_TYPE = require('core/browser_type');
const LOAD = require('core/load');
const Event = require('core/event');
const RSence = require('core/rsence_ns');
const ELEM = require('core/elem');

module.exports = {
  HClass, BROWSER_TYPE, LOAD, Event, RSence, ELEM,
  'class': HClass,
  'Class': HClass,
  browser: BROWSER_TYPE,
  'browser_type': BROWSER_TYPE,
  BrowserType: BROWSER_TYPE,
  load: LOAD,
  Load: LOAD,
  event: Event,
  elem: ELEM,
  Elem: ELEM
};
