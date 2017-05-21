const HApplication = require('foundation/application');
const HControlDefaults = require('foundation/control/controldefaults');
const HControl = require('foundation/control');
const EventManager = require('foundation/eventmanager');
const JSONRenderer = require('foundation/json_renderer');
const HLocale = require('foundation/locale');
const HSystem = require('foundation/system');
const HThemeManager = require('foundation/thememanager');
const HValue = require('foundation/value');
const HDummyValue = require('foundation/value/dummyvalue');
const HPullValue = require('foundation/value/pullvalue');
const HPushValue = require('foundation/value/pushvalue');
const HValueAction = require('foundation/valueaction');
const HValueResponderDefaults = require('foundation/valueresponder/valueresponderdefaults');
const HValueResponder = require('foundation/valueresponder');
const HValueView = require('foundation/valueview');
const HViewDefaults = require('foundation/view/viewdefaults');
const HView = require('foundation/view');

module.exports = {
  HApplication, HControlDefaults, HControl, EventManager,
  JSONRenderer, HLocale, HSystem, HThemeManager, HValue,
  HDummyValue, HPullValue, HPushValue, HValueAction,
  HValueResponderDefaults, HValueResponder, HValueView,
  HViewDefaults, HView,
  app: HApplication,
  App: HApplication,
  application: HApplication,
  Application: HApplication,
  controldefaults: HControlDefaults,
  ControlDefaults: HControlDefaults,
  control: HControl,
  Control: HControl,
  EVENT: EventManager,
  'json_renderer': JSONRenderer,
  JsonRenderer: JSONRenderer,
  locale: HLocale,
  Locale: HLocale,
  sys: HSystem,
  Sys: HSystem,
  system: HSystem,
  System: HSystem,
  thememanager: HThemeManager,
  ThemeManager: HThemeManager,
  value: HValue,
  Value: HValue,
  dummyvalue: HDummyValue,
  DummyValue: HDummyValue,
  pullvalue: HPullValue,
  PullValue: HPullValue,
  pushvalue: HPushValue,
  PushValue: HPushValue,
  valueaction: HValueAction,
  ValueAction: HValueAction,
  valueresponderdefaults: HValueResponderDefaults,
  ValueResponderDefaults: HValueResponderDefaults,
  valueresponder: HValueResponder,
  ValueResponder: HValueResponder,
  valueview: HValueView,
  ValueView: HValueView,
  viewdefaults: HViewDefaults,
  ViewDefaults: HViewDefaults,
  view: HView,
  View: HView
};
