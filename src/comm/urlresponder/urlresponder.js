
const HApplication = require('foundation/application');

/** = Description
 ** This application registers url responders to hide/show
 ** certain views automatically whenever the anchor
 ** part of the url is changed.
 **
 ** It is bound to the server HValue instance
 ** +msg.session[:main][:location_href]+ by
 ** the 'main' plugin. By default it runs with
 ** a client-side-only HValue instance until then.
 **
**/
class URLResponder extends HApplication {
  constructor() {
    super(1, 'URLResponder');
    this.urlMatchers = [];
    this.urlCallBacks = [];
    this.defaultCallBacks = [];
    this.prevCallBacks = [];
    this.prevMatchStrs = [];
    this.value = 0;
  }

  // sets the view to show when there is
  // no matches (like a virtual 404)
  setDefaultResponder(_callBack) {
    this.defaultCallBacks = [_callBack];
    this.refresh();
  }

  addDefaultResponder(_callBack) {
    this.defaultCallBacks.push(_callBack);
    this.refresh();
  }

  delDefaultResponder(_callBack) {
    this.defaultCallBacks.splice(this.defaultCallbacks.indexOf(_callBack), 1);
    this.refresh();
  }

  // Removes responder
  // - matchStr is an url that the callBack will
  //   respond to
  // - callBack is the component registered
  delResponder(_matchStr, _callBack) {
    const _urlMatcher = new RegExp(_matchStr);
    if (this.prevCallBacks.includes(_callBack)) {
      this.prevCallBacks.splice(this.prevCallBacks.indexOf(_callBack), 1);
      this.prevMatchStrs.splice(this.prevMatchStrs.indexOf(_matchStr), 1);
    }
    for (let i = 0; i < this.urlMatchers.length; i++) {
      const _urlMatch = this.urlMatchers[i].toString() === _urlMatcher.toString();
      if (_urlMatch) {
        this.urlMatchers.splice(i, 1);
        this.urlCallBacks.splice(i, 1);
        return 1;
      }
    }
    this.refresh();
    return 0;
  }

  // Adds responder
  // - matchRegExp is the regular expression
  //   that matches the anchor part of the uri
  // - callBack is the component that will receive hide/show calls
  // - activate is a flag that tells the view to be immediately
  //   activate (and the previous one to deactivate)
  addResponder(_matchRegExp, _callBack, _activate) {
    const _urlMatcher = new RegExp(_matchRegExp);
    this.urlMatchers.push(_urlMatcher);
    this.urlCallBacks.push(_callBack);
    if (this.isString(_activate)) {
      window.location.href = _activate;
    }
    const _matchStr = this.value;
    if (_urlMatcher.test(_matchStr)) {
      _callBack.show();
      if (this.prevMatchStrs.includes(_matchStr)) {
        this.prevMatchStrs.push(_matchStr);
      }
      this.prevCallBacks.push(_callBack);
    }
  }

  // Checks the matchStr agains regular expressions
  checkMatch(_matchStr) {
    if (this.prevMatchStrs.includes(_matchStr)) {
      return 0;
    }
    const _urlCallBacks = [];
    for (let i = 0; i < this.urlMatchers.length; i++) {
      const _urlMatch = this.urlMatchers[i].test(_matchStr);
      if (_urlMatch) {
        _urlCallBacks.push(this.urlCallBacks[i]);
      }
    }
    if (_urlCallBacks.length !== 0) {
      for (let i = 0; i < _urlCallBacks.length; i++) {
        const _urlCallBack = _urlCallBacks[i];
        _urlCallBack.show();
        if (this.prevMatchStrs.includes(_matchStr)) {
          this.prevMatchStrs.push(_matchStr);
        }
      }
      let _prevCallBack;
      for (let i = 0; i < this.prevCallBacks.length; i++) {
        _prevCallBack = this.prevCallBacks[i];
        if (!_urlCallBacks.includes(_prevCallBack)) {
          this.prevCallBacks[i].hide();
        }
      }
      this.prevCallBacks = _urlCallBacks;
      return 1;
    }
    if (this.defaultCallBacks.length !== 0) {
      if (this.prevCallBacks.length !== 0) {
        for (let i = 0; i < this.prevCallBacks.length; i++) {
          this.prevCallBacks[i].hide();
        }
      }
      this.prevCallBacks = [];
      for (let i = 0; i < this.defaultCallBacks.length; i++) {
        this.defaultCallBacks[i].show();
        this.prevCallBacks.push(this.defaultCallBacks[i]);
      }
    }
    return -1;
  }

  refresh() {
    if (this.value.length === 0) {
      return;
    }
    this.checkMatch(this.value);
  }

  idle() {
    if (this.valueObj) {
      const _href = window.location.href;
      if (_href !== this.value) {
        this.setValue(_href);
      }
    }
  }
}

module.exports = URLResponder;
