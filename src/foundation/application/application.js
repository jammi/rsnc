
const HSystem = require('foundation/system');
const {LOAD} = require('core/elem');
let HView; LOAD(() => {HView = require('foundation/view');});
const HValueResponder = require('foundation/valueresponder');

/** = Description
 **
 ** Simple application template.
 **
 ** Depends on <HSystem>
 **
 ** HApplication instances are good namespaces to bind your client-side logic to.
 ** Feel free to extend HApplication to suit your needs. The primary default
 ** purpose is root-level component (<HView>) management and being the
 ** root controller for <onIdle> events.
 **
 ** = Instance members
 ** +views+::    A list of child component ids bound to it via +HView+ and +HSystem+
 ** +parent+::   Usually +HSystem+.
 ** +parents+::  An array containing parent instances. In this case, just +HSystem+.
 ** +isBusy+::   A flag that is true when the app is doing onIdle events or stopped.
 **
 ** = Usage
 ** Creates the +HApplication+ instance +myApp+, makes a +HWindow+ instance
 ** as its first view.
 **   var myApp = HApplication.nu(10,'Sample Application');
 **   HWindow.nu( [10,10,320,200], myApp, {label:'myWin'} );
 **
***/
class HApplication extends HValueResponder {

  /* = Description
  *
  * = Parameters
  * All parameters are optional.
  *
  * +_priority+::   The priority, a number between 1 and Infinity. Smaller
  *                 number means higher priority, affects onIdle polling.
  *
  * +_label+::      A label for the application; for process managers.
  *
  **/
  constructor(_priority, _label) {

    super();

    this.elemId = 0; // document.body

    // Special null viewId for HApplication instances,
    // they share a system-level root view; the document object
    this.viewId = null;

    // storage for views
    this.views = [];

    // storage for dom element id's in view, not utilized in HApplication by default
    this.markupElemIds = [];

    // Views in Z order. The actual Z data is stored in HSystem, this is just a
    // reference to that array.
    this.viewsZOrder = HSystem.viewsZOrder;

    // Finalize initialization via HSystem
    HSystem.addApp(this, _priority);

    if (_label) {
      this.label = _label;
    }
    else {
      this.label = 'ProcessID=' + this.appId;
    }
  }

 /* = Description
  * Used by addView to build a +self.parents+ array of parent classes.
  *
  * = Parameters
  * +_viewId+::   The target view's ID.
  **/
  buildParents(_viewId) {
    const _view = HSystem.views[_viewId];
    _view.parent = this;
    _view.parents = [];
    this.parents.forEach(parent => {
      _view.parents.push(parent);
    });
    _view.parents.push(this);
  }

 /* = Description
  * Adds a view to the app, +HView+ defines an indentical structure for subviews.
  *
  * Called from inside the +HView+ constructor and should be automatic for all
  * components that accept the +_parent+ parameter, usually the second argument,
  * after the +HRect+ instance.
  *
  * = Parameters
  * +_view+::   Usually +this+ inside +HView+ -derived components.
  *
  * = Returns
  * The view ID.
  *
  **/
  addView(_view) {

    const _viewId = HSystem.addView(_view);
    this.views.push(_viewId);

    this.buildParents(_viewId);
    this.viewsZOrder.push(_viewId);

    return _viewId;
  }

 /* = Description
  * Removes the view of the given +_viewId+.
  *
  * Call this if you need to remove a child view from its parent without
  * destroying its view, making it in effect a view without parent.
  * Useful, for example, for moving a view from one parent component to
  * another when dragging a component to a droppable container.
  *
  * = Parameters
  * +_viewId+::   The view ID.
  *
  **/
  removeView(_viewId) {
    if (this.typeChr(_viewId) in ['h', 'o'] && this.typeChr(_viewId.remove) === '>') {
      console.warn('warning, viewId not a number:', _viewId, ', trying to call its remove method directly..');
      _viewId.remove();
    }
    const _view = HSystem.views[_viewId];
    if (_view) {
      if (this.typeChr(_view.remove) === '>') {
        _view.remove();
      }
      else {
        console.error('view does not have method "remove":', _view);
      }
    }
    else {
      console.error('tried to remove non-existent viewId:', _viewId);
    }
  }

 /* = Description
  * Removes and destructs the view of the given +_viewId+.
  *
  * Call this if you need to remove a child view from its parent, destroying
  * its child views recursively and removing all of the DOM elements too.
  *
  * = Parameters
  * +_viewId+::   The view ID.
  *
  **/
  destroyView(_viewId) {
    const _view = HSystem.views[_viewId];
    if (this.typeChr(_view.die) === '>') {
      _view.die();
    }
    else {
      console.error('view ', _view, 'does not have method "die"');
    }
  }

 /* = Description
  * The destructor of the +HApplication+ instance.
  *
  * Stops this application and destroys all its views recursively.
  *
  **/
  die() {
    HSystem.killApp(this.appId, false);
  }

 /* = Description
  * Destructs all views but doesn't destroy the +HApplication+ instance.
  *
  * Destroys all the views added to this application but doesn't destroy the
  * application itself.
  *
  **/
  destroyAllViews() {
    const _views = this.cloneObject(this.views);
    this.views = [];
    _views.forEach(_view => {
      if (this.typeChr(_view) in ['h', 'o'] && this.typeChr(_view.die) === '>') {
        _view.die();
      }
      else {
        console.error('invalid view:', _view);
      }
    });
  }

  renice(_priority) {
    HSystem.reniceApp(this.appId, _priority);
  }

  /* Calls the idle method of each view. Don't extend this method. */
  _pollViews() {
    this._pollViewsRecurse(this.views);
  }

  _pollViewsRecurse(_views) {
    if (_views && _views.length) {
      _views.map(_viewId => {
        const _view = HSystem.views[_viewId];
        if (_view) {
          ['idle', 'onIdle'].forEach(_method => {
            if (this.typeChr(_view[_method]) === '>') {
              _view[_method]();
            }
          });
          if (_view.hasAncestor && this.typeChr(_view.hasAncestor === '>') && _view.hasAncestor(HView)) {
            return _view;
          }
          else {
            return null;
          }
        }
        else {
          return null;
        }
      }).filter(_item => {
        return _item !== null;
      }).filter(_view => {
        return this.typeChr(_view.views) === 'a' && _view.views.length > 0;
      }).forEach(_view => {
        this._pollViewsRecurse(_view.views);
      });
    }
  }

  /* Gets called by +HSystem+. It makes +onIdle+ extensions more failure
  *  resistant. Do not extend.
  **/
  _startIdle() {
    HSystem.busyApps[this.appId] = true;
    this._busyTimer = setTimeout(() => {
      this.idle();
      this.onIdle();
      this._pollViews();
      HSystem.busyApps[this.appId] = false;
    }, 10);
  }

  /* = Description
  * The receiver of the +onIdle+ "poll event". The app priority defines the interval.
  *
  * Extend this method, if you are going to perform regular actions in a app.
  *
  * Intended for "slow infinite loops".
  *
  **/
  onIdle() {
    /* Extend this */
  }

  idle() {
    /* or extend this */
  }

}

module.exports = HApplication;
