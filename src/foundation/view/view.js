
const BROWSER_TYPE = require('core/browser_type');
const LOAD = require('core/load');
const ELEM = require('core/elem');
const UtilMethods = require('util/util_methods');
const HRect = require('util/geom/rect');
const HPoint = require('util/geom/point');
const HLocale = require('foundation/locale');
const HSystem = require('foundation/system');
const HThemeManager = require('foundation/thememanager');
const HValueResponder = require('foundation/valueresponder');
const HViewDefaults = require('foundation/view/viewdefaults');

const CSS_OVERFLOWS = ['false', 'visible', 'hidden', 'scroll', 'auto', 'initial', 'inherit'];
const DISPLAY_MODES = ['block', 'inline', 'flex'];

/** = Description
 ** HView is the foundation class for all views. HView is useful for
 ** any type of view and control grouping. It is designed for easy extension
 ** and it's the foundation for HControl and all other controls.
 **
 ** The major differences between HView and HControl is that HView handles
 ** only visual representation and structurization. In addition to HView's
 ** features, HControl handles labels, values, events, states and such.
 ** However, HControl is more complex, so use HView instead whenever you don't
 ** need the additional features of HControl. HView implements the HMarkupView
 ** interface for template-related task.
 **
 ** = Usage
 **  var myAppInstance = HApplication.nu();
 **  var rect1 = [10, 10, 100, 100];
 **  var myViewInstance = HView.nu( rect1, myAppInstance, { style: { backgroundColor: '#fc0' } } );
 **  var rect2 = [10, 10, 70, 70];
 **  var mySubView1 = HView.nu( rect2, myViewInstance, { style: { backgroundColor: '#cfc' } } );
 **  var rect3 = [20, 20, 50, 50];
 **  var mySubView2 = HView.nu( rect3, mySubView1, { style: { backgroundColor: '#000' } } );
 **
**/
class HView extends HValueResponder {
  get refreshOnValueChange() {
    return true;
  }

  get isView() {return true;}  // attribute to check if the object is a view
  get isCtrl() {return false;} // attribute to check for if the object is a control
  // attribute to check for killed object references
  get isDead() {
    if (this.isntUndefined(this.__isDead)) {
      return false;
    }
    else {
      return this.__isDead;
    }
  }
  set isDead(_value) {
    if (this.isntBoolean(_value)) {
      console.error('isDead must be boolean, but got: ' + (typeof _value));
      this.__isDead = true;
    }
    else if (this.__isDead === true) {
      console.error('isDead was already true, kill only once!');
      this.__isDead = true;
    }
    else {
      this.__isDead = _value;
    }
  }

  get elem() {
    return ELEM.get(this.elemId);
  }

/** Component specific theme path.
  **/
  // themePath: null,

/** Component CSS position type: absolute|relative|fixed
  **/
  get cssPosition() {
    return this.isntNullOrUndefined(this.__cssPosition) ?
      this.__cssPosition : 'absolute';
  }
  set cssPosition(_cssPosition) {
    if (_cssPosition === 'absolute' || _cssPosition === 'relative' || _cssPosition === 'fixed') {
      this.__cssPosition = _cssPosition;
    }
    else {
      console.error('invalid cssPosition:', _cssPosition);
    }
  }

/** Component CSS overflow type: false|visible|hidden|scroll|auto|initial|inherit
  **/
  get cssOverflow() {
    return this.isntNullOrUndefined(this.__cssOverflow) ?
      this.__cssOverflow : 'hidden';
  }

  set cssOverflow(_cssOverflow) {
    if (CSS_OVERFLOWS.includes(_cssOverflow)) {
      this.__cssOverflow = _cssOverflow;
    }
  }

/** Component CSS overflow-x type: false|visible|hidden|scroll|auto|initial|inherit
  **/
  get cssOverflowY() {
    return this.isntNullOrUndefined(this.__cssOverflowY) ?
      this.__cssOverflowY : false;
  }
  set cssOverflowY(_cssOverflowY) {
    if (CSS_OVERFLOWS.includes(_cssOverflowY)) {
      this.__cssOverflowY = _cssOverflowY;
    }
  }

/** Component CSS overflow-x type: false|visible|hidden|scroll|auto|initial|inherit
  **/
  get cssOverflowX() {
    return this.isntNullOrUndefined(this.__cssOverflowX) ?
      this.__cssOverflowX : false;
  }
  set cssOverflowX(_cssOverflowX) {
    if (CSS_OVERFLOWS.includes(_cssOverflowX)) {
      this.__cssOverflowY = _cssOverflowX;
    }
  }

/** The display mode to use.
  * Defaults to 'block'.
  * The other sane alternatives are 'inline' and 'flex'.
  **/
  // displayMode: 'block',
  get displayMode() {
    return this.isntNullOrUndefined(this.__displayMode) ?
      this.__displayMode : 'block';
  }
  set displayMode(_displayMode) {
    if (DISPLAY_MODES.includes(_displayMode)) {
      this.__displayMode = _displayMode;
    }
  }

/** The visual value of a component, usually a String.
  * See +#setLabel+.
  **/
  // label: null,
  get label() {
    if (this.isObject(this.options)) {
      return this.options.label;
    }
    else {
      return '';
    }
  }

  set label(_label) {
    if (this.isObject(this.options)) {
      this.options.label = _label;
    }
  }

/** When true, calls the +refreshLabel+ method whenever
  * +self.label+ is changed.
  **/
  get refreshOnLabelChange() {
    return true;
  }

/** Escapes HTML in the label when true.
  **/
  get escapeLabelHTML() {
    return false;
  }

/** True, if the coordinates are right-aligned.
  * False, if the coordinates are left-aligned.
  * Uses _rightOffset if true. Defined with 6-item arrays
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexRight method.
  **/
  get flexRight() {
    return this.isntUndefined(this.__flexRight) ? this.__flexRight : false;
  }
  set flexRight(_state) {
    if (this.isBoolean(_state)) {
      this.__flexRight = _state;
    }
    else {
      console.error('invalid flexRight:', _state);
    }
  }

/** True, if the coordinates are left-aligned.
  * False, if the coordinates are right-aligned.
  * Uses the X-coordinate of rect, if true.
  * Disabled using 6-item arrays with null x-coordinate
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexLeft method.
  **/
  get flexLeft() {
    return this.isntUndefined(this.__flexLeft) ? this.__flexLeft : true;
  }
  set flexLeft(_state) {
    if (this.isBoolean(_state)) {
      this.__flexLeft = _state;
    }
    else {
      console.error('invalid flexLeft:', _state);
    }
  }

/** True, if the coordinates are top-aligned.
  * False, if the coordinates are bottom-aligned.
  * Uses the Y-coordinate of rect, if true.
  * Disabled using 6-item arrays with null x-coordinate
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexTop method.
  **/
  get flexTop() {
    return this.isntUndefined(this.__flexTop) ? this.__flexTop : true;
  }
  set flexTop(_state) {
    if (this.isBoolean(_state)) {
      this.__flexTop = _state;
    }
    else {
      console.error('invalid flexTop:', _state);
    }
  }

/** True, if the coordinates are bottom-aligned.
  * False, if the coordinates are top-aligned.
  * Uses _bottomOffset if true. Defined with 6-item arrays
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexRight method.
  **/
  get flexBottom() {
    return this.isntUndefined(this.__flexBottom) ? this.__flexBottom : false;
  }
  set flexBottom(_state) {
    if (this.isBoolean(_state)) {
      this.__flexBottom = _state;
    }
    else {
      console.error('invalid flexBottom:', _state);
    }
  }

/** The amount of pixels to offset from the right edge when
  * flexRight is true. Defined with 6-item arrays
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexRight method.
  **/
  get flexRightOffset() {
    if (this.isntNumber(this.__rightOffset)) {
      this.__rightOffset = 0;
    }
    return this.__rightOffset;
  }

  set flexRightOffset(_num) {
    if (this.isNumber(_num)) {
      this.__rightOffset = _num;
    }
    else {
      console.error('invalid _rightOffset:', _num);
    }
  }

/** The amount of pixels to offset from the bottom edge when
  * flexBottom is true.Defined with 6-item arrays
  * for the _rect parameter of setRect or the constructor.
  * Can be set directly using the setFlexBottom method.
  **/
  // _bottomOffset: 0,
  get flexBottomOffset() {
    if (this.isntNumber(this.__bottomOffset)) {
      this.__bottomOffset = 0;
    }
    return this.__bottomOffset;
  }

  set flexBottomOffset(_num) {
    if (this.isNumber(_num)) {
      this.__bottomOffset = _num;
    }
    else {
      console.error('invalid _bottomOffset:', _num);
    }
  }

/** The drawn flag is false before the component is visually
  * drawn, it's true after it's drawn.
  **/
  // drawn: false,
  get drawn() {
    return this.__drawn;
  }

  set drawn(_drawn) {
    this.__drawn = !!_drawn;
  }

/** The theme the component is constructed with. By default,
  * uses the HThemeManager.currentTheme specified at the time
  * of construction.
  **/
  // theme: null,

/** The preserveTheme flag prevents the view from being redrawn
  * if HThemeManager.currentTheme is changed after the view
  * has been drawn. Is true, if theme has been set.
  **/
  // preserveTheme: false,
  get preserveTheme() {
    if (this.isntUndefined(this.__preserveTheme)) {
      this.__preserveTheme = false;
    }
    return this.__preserveTheme;
  }
  set preserveTheme(_value) {
    if (this.isntBoolean(_value)) {
      console.error('preserveTheme must be boolean, but got: ' + (typeof _value));
      this.__preserveTheme = !!_value;
    }
    else {
      this.__preserveTheme = _value;
    }
  }

/** The optimizeWidthOnRefresh flag, when enabled, allows
  * automatic width calculation for components that support
  * that feature.
  **/
  // optimizeWidthOnRefresh: false,
  // get optimizeWidthOnRefresh() {
  //   return false;
  // }

/** The parent is the +_parent+ supplied to the constructor.
  * This is a complete object reference to the parent's name-space.
  **/
  // parent: null,

/** The parents is an array containing parent instances up to
  * the root controller level. The root controller is almost
  * always an instance of HApplication.
  **/
  // parents: null,

/** The viewId is the unique ID (serial number) of this view.
  * This means the view can be looked up globally based on its
  * id by using the +HSystem.views+ array.
  **/
  // viewId: null,

/** The appId is the unique ID (serial number) of the app process
  * acting as the root controller of the view tree of which this
  * view is a member.
  * This means the app can be looked up globally based on this
  * id by using the +HSystem.apps+ array.
  **/
  // appId: null,

/** The app is the reference of the app process acting as
  * the root controller of the view tree of which this view is a
  * member.
  * This is a complete object reference to the app's name-space.
  **/
  // app: null,

/** The views array contains a list of sub-views of this view
  * by id. To access the object reference, use the +HSystem.views+
  * array with the id.
  **/
  // views: null,

/** The viewsZOrder array contains a list of sub-views ordered by
  * zIndex. To change the order, use the bringToFront,
  * sendToBack, bringForwards, sendBackwards, bringToFrontOf and
  * sentToBackOf methods.
  **/
  // viewsZOrder: null,

  /** The view z-index is controlled by parent view if this is true(default).
  * In other case view handle own z-index by CSS etc.
  **/
  get zOrderDisabled() {
    return this.__zOrderDisabled || false;
  }

  set zOrderDisabled(_zOrderDisabled) {
    if (this.isBoolean(_zOrderDisabled)) {
      this.__zOrderDisabled = _zOrderDisabled;
    }
  }

/** The isHidden flog reflects the visibility of the view.
  **/
  get isHidden() {
    if (this.isObject(this.options)) {
      return !!this.options.isHidden;
    }
    else {
      return false;
    }
  }

  set isHidden(_isHidden) {
    if (this.isObject(this.options) && this.isBoolean(_isHidden)) {
      this.options.isHidden = !!_isHidden;
    }
  }

/** The +HRect+ instance bound to +self+ using the +constructor+ or +setRect+.
  **/
  // rect: null,

  // Allows text to be selected when true
  get textSelectable() {
    return this.options.textSelectable || false;
  }
  set textSelectable(_textSelectable) {
    this.options.textSelectable = _textSelectable;
  }

  get markupElemNames() {
    return this.__markupElemNames || ['bg', 'label', 'state', 'control', 'value', 'subview'];
  }

  set markupElemNames(_markupElemNames) {
    if (this.isArray(_markupElemNames)) {
      this.__markupElemNames = _markupElemNames;
    }
    else {
      console.error('invalid format of markupElemNames:', _markupElemNames);
    }
  }

  get minWidth() {
    return this.__minWidth || 0;
  }

  set minWidth(_num) {
    if (this.isNumber(_num)) {
      this.__minWidth = _num;
    }
    else {
      console.error('invalid minWidth:', _num);
    }
  }

  get minHeight() {
    return this.__minHeight || 0;
  }

  set minHeight(_num) {
    if (this.isNumber(_num)) {
      this.__minHeight = _num;
    }
    else {
      console.error('invalid minHeight:', _num);
    }
  }

  get _stringSizeImportantAttrs() {
    return [
      'fontSize', 'fontWeight', 'fontFamily', 'lineHeight',
      'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'
    ];
  }

  // Extend with something returning an array if your component has
  // an optimal size to work with points rather than rects.
  // get optimalSize() {
  //   const width = 100;
  //   const height = 20;
  //   return [width, height];
  // }

  /* = Description
  * Constructs the logic part of a HView.
  * The view still needs to be drawn on screen. To do that, call draw after
  * subcomponents of the view are initialized.
  *
  * = Parameters
  * +_rect+::     An instance of +HRect+, defines the position and size of views.
  *               It can be also defined with an array, see below.
  * +_parent+::   The parent instance this instance will be contained within.
  *               A valid parent can be another HView compatible instance,
  *               an HApplication instance, a HControl or a similar extended
  *               HView instance. The origin of the +_rect+ is the same as the
  *               parent's offset. For HApplication instances, the web browser's
  *               window's left top corner is the origin.
  *
  * == The +_rect+ dimensions as arrays
  * Instead of an instance of +HRect+, dimensions can also be supplied as arrays.
  * The array length must be either 4 or 6. If the length is 4, the dimensions are
  * specified as follows: +[ x, y, width, height ]+. Note that this is different
  * from the construction parameters of +HRect+ that takes the coordinates as two
  * points, like: +( left, top, right, bottom )+.
  * Arrays with 6 items are a bit more complex (and powerful) as they can specify
  * the flexible offsets too.
  *
  * === The array indexes for a +_rect+ configured as an 4-item array:
  * Always left/top aligned, all items must be specified.
  * Index::            Description
  * +0+::              The X-coordinate (measured from the parent's left edge)
  * +1+::              The Y-coordinate (measured from the parent's top edge)
  * +2+::              The width.
  * +3+::              The height.
  *
  * === The array indexes a +_rect+ configured as an 6-item array:
  * Can be any configuration of left/top/right/bottom alignment and supports
  * flexible widths. At least 4 items must be specified.
  * Index::            Description
  * +0+::              The left-aligned X-coordinate or +null+ if the view is
  *                    right-aligned and using a right-aligned X-coordinate at
  *                    index +4+ as well as the width specified at index +2+.
  * +1+::              The top-aligned Y-coordinate or +null+ if the view is
  *                    bottom-aligned and using a right-aligned X-coordinate at
  *                    index +5+ as well as the height specified at index +3+.
  * +2+::              The width, if only one X-coordinate specifies the
  *                    position (at indexes +0+ or +4+).
  *                    If both X-coordinates (at indexes +0+ and +4+) are
  *                    specified, the width can be specified with a +null+ for
  *                    automatic (flexible) width. If the width is specified,
  *                    it's used as the minimum width.
  * +3+::              The height, if only one Y-coordinate specifies the
  *                    position (at indexes +1+ or +5+).
  *                    If both Y-coordinates (at indexes +1+ and +5+) are
  *                    specified, the height can be specified with a +null+ for
  *                    automatic (flexible) height. if the height is specified,
  *                    it's used as the minimum height.
  * +4+::              The right-aligned X-coordinate or +null+ if the view is
  *                    left-aligned and using a left-aligned X-coordinate at
  *                    index +0+ as well as the width specified at index +2+.
  * +5+::              The bottom-aligned Y-coordinate or +null+ if the view is
  *                    top-aligned and using a top-aligned X-coordinate at
  *                    index +1+ as well as the height specified at index +3+.
  * == Usage examples of +_rect+:
  * Specified as two instances of +HPoint+,
  * x: 23, y: 75, width: 200, height: 100:
  *  HRect.nu( HPoint.nu( 23, 75 ), HPoint.nu( 223, 175 ) )
  *
  * The same as above, but without +HPoint+ instances:
  *  HRect.nu( 23, 75, 223, 175 )
  *
  * The same as above, but with an array as the constructor
  * parameter for +HRect+:
  *  HRect.nu( [ 23, 75, 223, 175 ] )
  *
  * The same as above, but with an array instead of a +HRect+ instance:
  *  [ 23, 75, 200, 100 ]
  *
  * The same as above, but with a 6-item array:
  *  [ 23, 75, 200, 100, null, null ]
  *
  * The same as above, but aligned to the right instead of left:
  *  [ null, 75, 200, 100, 23, null ]
  *
  * The same as above, but aligned to the right/bottom edges:
  *  [ null, null, 200, 100, 23, 75 ]
  *
  * The same as above, but aligned to the left/bottom edges:
  *  [ 23, null, 200, 100, null, 75 ]
  *
  * Flexible width (based on the parent's dimensions):
  *  [ 23, 75, null, 100, 23, null ]
  *
  * Flexible height (based on the parent's dimensions):
  *  [ 23, 75, 200, null, null, 75 ]
  *
  * Flexible width and height (based on the parent's dimensions):
  *  [ 23, 75, null, null, 23, 75 ]
  *
  * Flexible width and height, but limited to a minimum width
  * of 200 and a minimum height of 100 (based on the parent's dimensions):
  *  [ 23, 75, 200, 100, 23, 75 ]
  *
  **/
  constructor(_rect, _parent, _options) {
    if (!_parent && !_options && _rect) {
      _options = _rect;
    }
    if (!_options) {
      _options = {};
    }
    if (!_options.rect && _rect && _options !== _rect) {
      _options.rect = _rect;
    }
    if (!_options.parent && _parent) {
      _options.parent = _parent;
    }
    super(_options);
    if (this.options.autoDraw) {
      this.draw();
    }
  }

  setOptions(_options) {
    _options = super.setOptions(_options);

    if (this.isntUndefinedOrNull(_options.cssOverflow)) {
      this.cssOverflow = _options.cssOverflow;
    }
    if (this.isntUndefinedOrNull(_options.cssOverflowY)) {
      this.cssOverflowY = _options.cssOverflowY;
    }
    if (this.isntUndefinedOrNull(_options.cssOverflowX)) {
      this.cssOverflowX = _options.cssOverflowX;
    }
    if (this.isntUndefinedOrNull(_options.cssPosition)) {
      this.cssPosition = _options.cssPosition;
    }
    if (this.isntUndefinedOrNull(_options.displayMode)) {
      this.displayMode = _options.displayMode;
    }
    if (this.isntUndefinedOrNull(_options.zOrderDisabled)) {
      this.zOrderDisabled = _options.zOrderDisabled;
    }

    const _parent = _options.parent;
    const _rect = (() => {
      if (_options.rect) {
        if (this.isArray(_options.rect) &&
            this.isArray(this.optimalSize)
        ) {
          const [w, h] = this.optimalSize;
          if (this.isntNumber(_options.rect[2])) {
            _options.rect[2] = w;
          }
          if (this.isntNumber(_options.rect[3])) {
            _options.rect[3] = h;
          }
        }
        return _options.rect;
      }
      return null;
    })();
    // destructable timeouts:
    this.timeouts = [];
    // adds the parentClass as a "super" object
    this.parent = _parent;
    if (this.isntNullOrUndefined(HSystem.apps[this.options.appId])) {
      this.appId = this.options.appId;
    }
    else {
      this.appId = this.parent.appId;
    }
    this.app = HSystem.apps[this.appId];
    this.isHidden = this.options.visible === false || this.options.hidden === true;
    this.viewId = this.parent.addView(this);
    // the parent addView method adds this.parents.
    // sub-view ids, index of HView-derived objects that are found in HSystem.views[viewId]
    this.views = [];
    // Sub-views in Z order.
    this.viewsZOrder = [];
    // Keep the view (and its sub-views) hidden until its drawn.
    this.createElement();
    // Set the geometry
    this.setRect(_rect);
    // Additional DOM element bindings are saved into this array so they can be
    // deleted from the element manager when the view gets destroyed.
    this._domElementBindings = [];
    if (this.isFunction(this.customOptions)) {
      this.customOptions(_options || {});
    }
    // Moved these to the top to ensure safe theming operation
    if (_options.theme) {
      this.theme = _options.theme;
      this.preserveTheme = true;
    }
    else if (!this.theme) {
      this.theme = HThemeManager.currentTheme;
      this.preserveTheme = false;
    }
    else {
      this.preserveTheme = true;
    }
    const _isValueRange = _options.minValue || _options.maxValue;
    if (_isValueRange && this.isFunction(this.setValueRange) && this.isNumber(this.value)) {
      this.setValueRange(this.value, _options.minValue, _options.maxValue);
    }
    return _options;
  }

/** The minimum numeric value allowed, when the component
  * utilizes value ranges. See setValueRange
  **/
  get minValue() {
    return this.options.minValue || null;
  }
  set minValue(_minValue) {
    this.options.minValue = _minValue;
  }

/** The maximum allowed value, when the component
  * utilizes value ranges. See setValueRange
  **/
  get maxValue() {
    return this.options.maxValue || null;
  }
  set maxValue(_maxValue) {
    this.options.maxValue = _maxValue;
  }

/** The defaultOptionsClass in HView is a HViewDefaults object that is extended
  * in the constructor with the options block given. The format of
  * it its return value is a class.
  * It's only used when not extended via HControl, see HControl#defaultOptionsClass.
  **/
  get defaultOptionsClass() {
    return this.__defaultOptionsClass || HViewDefaults;
  }
  get viewDefaults() {
    return this.defaultOptionsClass;
  }
  set viewDefaults(_defaultOptionsClass) {
    if (this.isClass(_defaultOptionsClass)) {
      this.__defaultOptionsClass = _defaultOptionsClass;
    }
    else {
      console.error('invalid format of viewDefaults: ', _defaultOptionsClass);
    }
  }
  /* = Description
  * When the +_flag+ is true, the view will be aligned to the right.
  * The +_px+ offset defines how many pixels from the parent's right
  * edge the right edge of this view will be. If both setFlexRight
  * and setFlexLeft are set, the width is flexible.
  * Use the constructor or setRect instead of calling this method
  * directly.
  *
  * = Parameters
  * +_flag+::    Boolean flag (true/false). Enables
  *              right-alignment when true.
  * +_px+::      The amount of pixels to offset from the right
  *              edge of the parent's right edge.
  *
  * = Returns
  * +self+
  **/
  setFlexRight(_flag, _px) {
    if (this.isNullOrUndefined(_flag)) {
      _flag = true;
    }
    this.flexRight = _flag;
    if (this.isNullOrUndefined(_px)) {
      _px = 0;
    }
    this._rightOffset = _px;
    return this;
  }

  /* = Description
  * When the +_flag+ is true, the view will be aligned to the left (default).
  * The +_px+ offset defines how many pixels from the parent's left
  * edge the left edge of this view will be. If both setFlexLeft
  * and setFlexRight are set, the width is flexible.
  * Use the constructor or setRect instead of calling this method
  * directly.
  *
  * = Parameters
  * +_flag+::    Boolean flag (true/false). Enables
  *              left-alignment when true.
  * +_px+::      The amount of pixels to offset from the left
  *              edge of the parent's left edge.
  *
  * = Returns
  * +self+
  **/
  setFlexLeft(_flag, _px) {
    if (this.isNullOrUndefined(_flag)) {
      _flag = true;
    }
    this.flexLeft = _flag;
    if (this.isNumber(_px) && this.rect) {
      this.rect.setLeft(_px);
    }
    return this;
  }

  /* = Description
  * When the +_flag+ is true, the view will be aligned to the top (default).
  * The +_px+ offset defines how many pixels from the parent's top
  * edge the top edge of this view will be. If both setFlexTop
  * and setFlexBottom are set, the height is flexible.
  * Use the constructor or setRect instead of calling this method
  * directly.
  *
  * = Parameters
  * +_flag+::    Boolean flag (true/false). Enables
  *              top-alignment when true.
  * +_px+::      The amount of pixels to offset from the top
  *              edge of the parent's top edge.
  *
  * = Returns
  * +self+
  **/
  setFlexTop(_flag, _px) {
    if (this.isNullOrUndefined(_flag)) {
      _flag = true;
    }
    this.flexTop = _flag;
    if (this.isNumber(_px) && this.rect) {
      this.rect.setTop(_px);
    }
    return this;
  }

  /* = Description
  * When the +_flag+ is true, the view will be aligned to the bottom.
  * The +_px+ offset defines how many pixels from the parent's bottom
  * edge the bottom edge of this view will be. If both setFlexBottom
  * and setFlexTop are set, the height is flexible.
  * Use the constructor or setRect instead of calling this method
  * directly.
  *
  * = Parameters
  * +_flag+::    Boolean flag (true/false). Enables
  *              bottom-alignment when true.
  * +_px+::      The amount of pixels to offset from the bottom
  *              edge of the parent's bottom edge.
  *
  * = Returns
  * +self+
  **/
  setFlexBottom(_flag, _px) {
    if (this.isNullOrUndefined(_flag)) {
      _flag = true;
    }
    this.flexBottom = _flag;
    if (this.isNullOrUndefined(_px)) {
      _px = 0;
    }
    this._bottomOffset = _px;
    return this;
  }

  /* = Description
  * Used by html theme templates to get the theme-specific full image path.
  *
  * = Returns
  * The full path of the theme-specific gfx path as a string.
  **/
  getThemeGfxPath() {
    const _themeName = this.preserveTheme ? this.theme : HThemeManager.currentTheme;
    return HThemeManager.themePaths[_themeName];
  }

  /* = Description
  * Used by html theme templates to get the theme-specific full path
  * of the _fileName given.
  *
  * = Returns
  * The full path of the file.
  **/
  getThemeGfxFile(_fileName) {
    const _themeName = this.preserveTheme ? this.theme : HThemeManager.currentTheme;
    return HThemeManager._buildThemePath(_fileName, _themeName);
  }

  // The element tag for the cell element of the component.
  get cellTagName() {
    return 'div';
  }

  // default attributes of the cell element
  get cellTagAttrs() {
    return {
      // type: 'text' // example when something has cellTagName: 'input'
    };
  }

  /* = Description
  * The _makeElem method does the ELEM.make call to create
  * the <div> element of the component. It assigns the elemId.
  * It's a separate method to ease creating component that require
  * other element types.
  * ++
  **/
  _makeElem(_parentElemId) {
    this.elemId = ELEM.make(_parentElemId, this.cellTagName);
    if (process.env.BUILD_TYPE === 'development') {
      ELEM.setAttr(this.elemId, 'view_id', this.viewId, true);
      ELEM.setAttr(this.elemId, 'elem_id', this.elemId, true);
    }
    Object.entries(this.cellTagAttrs).forEach(([key, value]) => {
      ELEM.setAttr(this.elemId, key, value, true);
    });
  }

  /* = Description
  * Delete elems by ids by calling ELEM.del for each id.
  * If elems is not array, do nothing.
  * Return always new empty array
  **/
  _delElems(_elems) {
    if (this.isArray(_elems)) {
      _elems.forEach(_elemId => {
        ELEM.del(_elemId);
      });
    }
    return [];
  }

  /* = Description
  * The getParentElemId method returns the ELEM ID of the parent.
  */
  getParentElemId() {
    if (this.isNullOrUndefined(this.parent.getSubviewId)) {
      return this.parent.elemId || 0;
    }
    else {
      return this.parent.getSubviewId();
    }
  }

  _getParentElemId() {
    console.warn('HView#_getParentElemId is deprecated, use #getParentElemId instead');
    this.getParentElemId();
  }

  getSubviewId() {
    if (this.markupElemIds && this.isntNullOrUndefined(this.markupElemIds.subview)) {
      return this.markupElemIds.subview;
    }
    else if (this.isntNullOrUndefined(this.elemId)) {
      return this.elemId;
    }
    return 0;
  }

  _getSubviewId() {
    console.warn('HView#_getSubviewId is deprecated, use #getSubviewId instead');
    return this.getSubviewId();
  }

  /* = Description
  * The selectable state defines when the view should be selectable or not.
  *
  **/
  updateTextSelectable() {
    if (this.textSelectable) {
      ELEM.delClassName(this.elemId, 'textunselectable');
      ELEM.addClassName(this.elemId, 'textselectable');
    }
    else {
      ELEM.delClassName(this.elemId, 'textselectable');
      ELEM.addClassName(this.elemId, 'textunselectable');
    }
  }

  setTextSelectable(_flag) {
    this.textSelectable = !!_flag;
    this.updateTextSelectable();
  }

  /* = Description
  * The createElement method calls the methods required to initialize the
  * main DOM element of the view.
  **/
  createElement() {
    if (this.isntNumber(this.elemId)) {
      this._makeElem(this.getParentElemId());
      if (this.cssOverflowY === false && this.cssOverflowX === false) {
        if (this.cssOverflow) {
          ELEM.setStyle(this.elemId, 'overflow', this.cssOverflow, true);
        }
      }
      if (this.cssOverflowY !== false) {
        ELEM.setStyle(this.elemId, 'overflow-y', this.cssOverflowY, true);
      }
      if (this.cssOverflowX !== false) {
        ELEM.setStyle(this.elemId, 'overflow-x', this.cssOverflowX, true);
      }
      ELEM.setStyle(this.elemId, 'visibility', 'hidden', true);
      ELEM.setStyle(this.elemId, 'position', this.cssPosition);

      // Theme name => CSS class name
      if (this.preserveTheme) {
        ELEM.addClassName(this.elemId, this.theme);
      }
      else {
        ELEM.addClassName(this.elemId, HThemeManager.currentTheme);
      }
      // componentName => CSS class name
      if (this.isString(this.componentName)) {
        const classNamesArray =
          this.isString(this.componentClassNames) ?
            this.componentClassNames.split(' ') :
              this.isArray(this.componentClassNames) ?
                this.componentClassNames :
                [this.componentName];
        classNamesArray.forEach(className => {
          ELEM.addClassName(this.elemId, className);
        });
      }
      // BROWSER_TYPE.* = true => CSS class names
      Object.entries(BROWSER_TYPE).forEach(([_browserName, _active]) => {
        if (_active) {
          ELEM.addClassName(this.elemId, _browserName);
        }
      });
      if (this.isArray(this.options.classes)) {
        this.options.classes.forEach(_className => {
          ELEM.addClassName(this.elemId, _className);
        });
      }
      if (this.isntNullOrUndefined(this.options.textSelectable)) {
        this.textSelectable = this.options.textSelectable;
      }
      this.updateTextSelectable();
    }
  }

  _createElement() {
    console.warn('HView#_createElement is deprecated, use #createElement instead');
    this.createElement();
  }

  /* = Description
  * The +drawRect+ method refreshes the dimensions of the view.
  * It needs to be called to affect changes in the rect.
  * It enables the drawn flag.
  *
  * = Returns
  * +self+
  *
  **/
  drawRect() {
    if (this.isNullOrUndefined(this.rect)) {
      if (this.drawn === false) {
        this._updateZIndex();
      }
      this.drawn = true;
      return this;
    }
    else {
      if (!this.rect.isValid || !this.parent) {
        !this.rect.isValid && console.error('HView#drawRect; invalid rect:', this.rect);
        !this.parent && console.error('Hview#drawRect; invalid parent:', ELEM.get(this.elemId));
      }
      else {
        Object.entries({
          left: this.flexLeft ? this.rect.left : 'auto',
          top: this.flexTop ? this.rect.top : 'auto',
          right: this.flexRight ? this._rightOffset : 'auto',
          bottom: this.flexBottom ? this._bottomOffset : 'auto',
          width: (this.flexLeft && this.flexRight) ? 'auto' : this.rect.width,
          height: (this.flexTop && this.flexBottom) ? 'auto' : this.rect.height,
          display: this.displayMode,
        }).forEach(([_key, _value], i) => {
          if (i < 6 && _value !== 'auto') {
            _value += 'px';
          }
          ELEM.setStyle(this.elemId, _key, _value, true);
        });
        // Show the rectangle once it gets created, unless visibility was set to
        // hidden in the constructor.
        if (!this.isHidden) {
          ELEM.setStyle(this.elemId, 'visibility', 'inherit', true);
        }
        if (this.drawn === false) {
          this._updateZIndex();
        }
        if (this.isntNullOrUndefined(this.themeStyle)) {
          this.themeStyle.call(this);
        }
        this.drawn = true;
      }
      return this;
    }
  }

  /* This method updates the z-index property of the children of self.
  * It's essentially a wrapper for HSystem.updateZIndexOfChildren passed
  * with the viewId of self.
  */
  _updateZIndex() {
    HSystem.updateZIndexOfChildren(this.viewId);
  }

  /* This method updates the z-index property of the siblings of self.
  * It's essentially a wrapper for HSystem.updateZIndexOfChildren passed
  * with the parent's viewId of self.
  */
  _updateZIndexAllSiblings() {
    HSystem.updateZIndexOfChildren(this.parent.viewId);
  }

  /* = Description
  * The higher level draw wrapper for drawRect, drawMarkup and drawSubviews.
  * Finally calls refresh.
  *
  * = Returns
  * +self+
  *
  */
  draw() {
    const _wasDrawn = this.drawn;
    this.drawRect();
    if (!_wasDrawn) {
      this.firstDraw();
      if (this.isString(this.componentName)) {
        this.drawMarkup();
      }
      if (this.isArray(this.options.classNames)) {
        this.options.classNames.forEach(_className => {
          this.setCSSClass(_className);
        });
      }
      this.options.style && this.setStyles(this.options.style);
      this.options.html && this.setHTML(this.options.html);
      // Extended draw for components to define / extend.
      // This is preferred over drawSubviews, when defining
      // parts of a complex component.
      if (this.isFunction(this.extDraw)) {
        this.extDraw();
      }
      // Extended draw for the purpose of drawing sub-views.
      this.drawSubviews();
      // if options contain a sub-views function, call it with the name-space of self
      if (this.isFunction(this.options.subviews)) {
        this.options.subviews.call(this, this);
      }
      // for external testing purposes, a custom className can be defined:
      if (this.options.testClassName) {
        ELEM.addClassName(this.elemId, this.options.testClassName);
      }
      if (this.isntNullOrUndefined(this.options.tabIndex)) {
        this.setTabIndex(this.options.tabIndex);
      }
      if (!this.isHidden) {
        this.show();
      }
      if (this.options.focusOnCreate === true && !BROWSER_TYPE.mobile) {
        this.timeouts.push(setTimeout(() => {this.setFocus();}, 300));
      }
    }
    this.refresh();
    return this;
  }

  /* = Description
  * Called once, before the layout of the view is initially drawn.
  * Doesn't do anything by itself, but provides an extension point.
  *
  **/
  firstDraw() {}

  /* = Description
  * Called once, when the layout of the view is initially drawn.
  * Doesn't do anything by itself, but provides an extension point for making
  * sub-views.
  *
  **/
  drawSubviews() {}

  /* = Description
  * Replaces the contents of the view's DOM element with html from the theme specific html file.
  *
  * = Returns
  * +self+
  **/
  drawMarkup() {
    const _themeName = this.preserveTheme ? this.theme : HThemeManager.currentTheme;
    const _markup = HThemeManager.resourcesFor(this, _themeName);
    this.markupElemIds = {};
    if (this.isString(_markup) && _markup !== '') {
      ELEM.setHTML(this.elemId, _markup);
      this.markupElemNames.forEach(_partName => {
        const _elemName = _partName + this.elemId;
        // Optimization of matching the html string before searching the DOM:
        const _htmlIdMatch = `id="${_elemName}"`;
        if (_markup.includes(_htmlIdMatch)) {
          const _elemId = this.bindDomElement(_elemName, this.elemId);
          if (this.isNumber(_elemId)) {
            this.markupElemIds[_partName] = _elemId;
            // removes the id attribute, because it's no longer needed:
            ELEM.delAttr(_elemId, 'id');
          }
          else {
            console.warn(
              `HView#drawMarkup warning; no such partNamue: ${_partName
              } for componentName: ${this.componentName}`, this);
          }
        }
      });
      if (this.isFunction(this.themeStyle)) {
        this.themeStyle.call(this);
      }
    }
    return this;
  }

  /* = Description
  * Sets or unsets the _className into a DOM element that goes by the ID
  * _elemId.
  *
  * = Parameters
  * +_elemId+:: ID of the DOM element, or the element itself, to be
  *                modified.
  * +_className+::  Name of the CSS class to be added or removed.
  * +_state+::     Boolean value that tells should the CSS class be added or
  *                removed. If undefined or null, toggles the current state.
  *
  * = Returns
  * +self+
  *
  **/
  toggleCSSClass(_elemId, _className, _state) {
    if (this.isntNullOrUndefined(_elemId)) {
      if (this.isString(_elemId)) {
        _elemId = this.markupElemIds[_elemId];
      }
      if (this.isInteger(_elemId) && this.isString(_className)) {
        if (this.isNullOrUndefined(_state)) {
          _state = !ELEM.hasClassName(_elemId, _className);
        }
        if (_state) {
          ELEM.addClassName(_elemId, _className);
        }
        else {
          ELEM.delClassName(_elemId, _className);
        }
      }
      else {
        console.error(`HView#toggleCSSClass error; elemId(${_elemId
          }) is not an integer or className('${_className
          }') is not a string!`);
      }
    }
    else {
      console.error(`HView#toggleCSSClass error; null or undefined elemId ${_elemId}`);
    }
    return this;
  }

  setCSSClass(_first, _second) {
    const _hasElemId = this.isntNullOrUndefined(_second);
    const _elemId = _hasElemId ? _first : this.elemId;
    const _className = _hasElemId ? _second : _first;
    return this.toggleCSSClass(this.elemId, _className, true);
  }

  unsetCSSClass(_first, _second) {
    const _hasElemId = this.isntNullOrUndefined(_second);
    const _elemId = _hasElemId ? _first : this.elemId;
    const _className = _hasElemId ? _second : _first;
    return this.toggleCSSClass(this.elemId, _className, false);
  }

  /* = Description
  * Replaces the contents of the view's DOM element with custom html.
  *
  * = Parameters
  * +_html+:: The HTML (string-formatted) to replace the content with.
  *
  * = Returns
  * +self+
  *
  **/
  setHTML(_html) {
    ELEM.setHTML(this.elemId, _html);
    return this;
  }

  /* = Description
  * Wrapper for setHTML, sets escaped html, if tags and such are present.
  *
  * = Parameters
  * +_text+:: The text to set. If it contains any html, it's escaped.
  *
  * = Returns
  * +self+
  **/
  setText(_text) {
    return this.setHTML(this.escapeHTML(_text));
  }

  /* = Description
  *
  * Called mostly internally whenever a property change requires usually visual
  * action. It's called by methods like setLabel and setValue.
  * Extends HView.refresh. The boolean properties refreshOnValueChange and
  * refreshOnLabelChange control whether refreshValue or refreshLabel
  * should be called. It's used as-is in most components. If you implement
  * your class extension with properties similar to value or label,
  * you are advised to extend the refresh method.
  *
  * This method should be extended in order to redraw only specific parts. The
  * base implementation calls optimizeWidth when optimizeWidthOnRefresh is set
  * to true.
  *
  * = Returns
  * +self+
  *
  **/
  refresh() {
    if (this.drawn) {
      // this.drawn is checked here so the rectangle doesn't get drawn by the
      // constructor when setRect() is initially called.
      this.drawRect();
    }
    if (this.drawn && this.refreshOnLabelChange && this.isFunction(this.refreshLabel)) {
      this.refreshLabel();
    }
    if (this.isFunction(this.themeStyle)) {
      this.themeStyle.call(this);
    }
    if (this.drawn && this.refreshOnValueChange && this.isFunction(this.refreshValue)) {
      this.refreshValue();
    }
    if (this.drawn && this.isFunction(this.optimizeWidth)) {
      this.optimizeWidth();
    }
    return this;
  }

/** = Description
  * Called when the +self.value+ has been changed. By default
  * tries to update the value element defined in the theme of
  * the component. The HView itself doesn't define a theme,
  * so without a theme doesn't do anything.
  *
  * = Returns
  * +self+
  *
  **/
  refreshValue() {
    if (this.isObject(this.markupElemIds) && this.isNumber(this.markupElemIds.value)) {
      const _value = this.isString(this.value) ?
        this.value : JSON.stringify(this.value);
      this.setMarkupOfPart('value', _value);
    }
    return this;
  }

/** = Description
  * Assigns the object a new value range. Used for sliders, steppers etc. Calls
  * setValue with the value given.
  *
  * = Parameters
  * +_value+::    The new value to be set to the component's
  *               HValue compatible instance.
  *
  * +_minValue+:: The new minimum value limit. See minValue.
  *
  * +_maxValue+:: The new maximum value limit. See maxValue.
  *
  * = Returns
  * +self+
  *
  **/
  setValueRange(_value, _minValue, _maxValue) {
    this.minValue = _minValue;
    this.maxValue = _maxValue;
    if (this.isNumber(_value)) {
      _value = (_value < _minValue) ? _minValue : _value;
      _value = (_value > _maxValue) ? _maxValue : _value;
      this.setValue(_value);
    }
    return this;
  }

  /* Gets the size of the parent. If the parent is the document body, uses the browser window size.
  **/
  parentSize() {
    if (!this.parent) {
      console.warn('HView#parentSize; no parent!');
      return [0, 0];
    }
    if (this.parent.elemId === 0) {
      return ELEM.windowSize();
    }
    else {
      return ELEM.getSize(this.parent.elemId);
    }
  }

  /* Returns the maximum rect */
  maxRect() {
    return [0, 0, null, null, 0, 0];
  }

  setMinWidth(_minWidth) {
    if (this.isNumber(_minWidth)) {
      this.minWidth = _minWidth;
      ELEM.setStyle(this.elemId, 'min-width', this.minWidth + 'px', true);
    }
    else {
      console.warn(`HView#setMinWidth warning; setMinWidth(${typeof _minWidth
        } ${_minWidth}) should be a number; value ignored!`);
    }
  }

  setMinHeight(_minHeight) {
    if (this.isNumber(_minHeight)) {
      this.minHeight = _minHeight;
      ELEM.setStyle(this.elemId, 'min-height', this.minHeight + 'px', true);
    }
    else {
      console.warn(`HView#setMinHeight warning; setMinHeight(${typeof _minHeight
        } ${_minHeight}) should be a number; value ignored!`);
    }
  }

  _setArrayRect(_arr) {
    const _arrLen = _arr.length;
    const _throwPrefix = 'HView#_setArrayRect: If the HRect instance is replaced by an array, ';
    if (_arrLen === 4 || _arrLen === 6) {
      let [_leftOffset, _topOffset, _width, _height, _rightOffset, _bottomOffset] = _arr;
      let _right = null;
      let _bottom = null;
      const _validLeftOffset = this.isInteger(_leftOffset);
      const _validTopOffset = this.isInteger(_topOffset);
      const _validRightOffset = this.isInteger(_rightOffset);
      const _validBottomOffset = this.isInteger(_bottomOffset);
      let _validWidth = this.isInteger(_width);
      let _validHeight = this.isInteger(_height);
      let _minWidth = 0;
      let _minHeight = 0;
      const [_parentWidth, _parentHeight] = (_arrLen === 6) ? this.parentSize() : [null, null];
      if (_validLeftOffset && _validRightOffset && !_validWidth) {
        _width = 0;
        _validWidth = true;
      }
      if (_validTopOffset && _validBottomOffset && !_validHeight) {
        _height = 0;
        _validHeight = true;
      }
      // Validate the invalid complex rules isolated:
      (() => {
        const _invalidLeftAndRight = !_validLeftOffset && !_validRightOffset;
        const _invalidTopAndBottom = !_validTopOffset && !_validBottomOffset;
        const _invalidLeftOrRight = !(_validLeftOffset && _validRightOffset);
        const _invalidTopOrBottom = !(_validTopOffset && _validBottomOffset);
        const _invalidWidthAndLeftOrRight = !_validWidth && _invalidLeftOrRight;
        const _invalidHeightAndTopOrBottom = !_validHeight && _invalidTopOrBottom;
        if (_invalidLeftAndRight || _invalidTopAndBottom) {
          throw new Error(_throwPrefix + '(left or top) and (top or bottom) must be specified.');
        }
        else if (_invalidWidthAndLeftOrRight || _invalidHeightAndTopOrBottom) {
          throw new Error(_throwPrefix +
            'the (height or width) must be specified unless both (left and top) ' +
            'or (top and bottom) are specified.');
        }
      })();
      if (_validLeftOffset && _validWidth && !_validRightOffset) {
        _right = _leftOffset + _width;
      }
      else if (!_validLeftOffset && _validWidth && _validRightOffset) {
        _right = _parentWidth - _validRightOffset;
        _leftOffset = _right - _width;
        _minWidth = _width;
      }
      else if (_validLeftOffset && _validRightOffset) {
        _right = _parentWidth - _rightOffset;
        if (_validWidth) {
          _minWidth = _width;
          if ((_parentWidth - _leftOffset) < _width) {
            console.warn(
              `HView#_setArrayRect warning; The minWidth(${_width
              }) is less than available width(${_parentWidth - _leftOffset - _rightOffset
              }); right(${_right}) yields to ${_leftOffset + _width}!`);
            _right = _leftOffset + _width;
          }
        }
        else if (_right < _leftOffset) {
          console.warn(
            `HView#_setArrayRect warning; There is not enough width (${_parentWidth
            }) to fit _rightOffset (${_rightOffset}) and left (${_leftOffset
            }); right(${_right}) yields to (${_leftOffset
            }) and _rightOffset(${_rightOffset}) yields to ${_parentWidth - _leftOffset}!`);
          _rightOffset = _parentWidth - _leftOffset;
          _right = _leftOffset;
        }
      }
      if (_validTopOffset && _validHeight && !_validBottomOffset) {
        _bottom = _topOffset + _height;
      }
      else if (!_validTopOffset && _validHeight && _validBottomOffset) {
        _bottom = _parentHeight - _validBottomOffset;
        _topOffset = _bottom - _height;
        _minHeight = _height;
      }
      else if (_validTopOffset && _validBottomOffset) {
        _bottom = _parentHeight - _bottomOffset;
        if (_validHeight) {
          _minHeight = _height;
          if (_parentHeight - _topOffset < _height) {
            console.warn(
              `HView#_setArrayRect warning; The minHeight(${_height
              }) is less than available height(${_parentHeight - _topOffset - _bottom
              }); bottom(${_bottom}) yields to ${_topOffset + _height}!`);
            _bottom = _topOffset + _height;
          }
        }
        else if (_bottom < _topOffset) {
          console.warn(
            `HView#_setArrayRect warning; There is not enough height (${_parentHeight
            }) to fit _bottomOffset (${_bottom}) and bottom (${_bottomOffset
            }); bottom yields to ${_topOffset
            } and _bottomOffset yields to ${_parentHeight - _topOffset}!`);
          _bottomOffset = _parentHeight - _topOffset;
          _bottom = _topOffset;
        }
      }
      if (_leftOffset > _right) {
        _right = _leftOffset;
      }
      if (_topOffset > _bottom) {
        _bottom = _topOffset;
      }
      this.setMinWidth(_minWidth);
      this.setMinHeight(_minHeight);
      this.setFlexLeft(_validLeftOffset, _leftOffset);
      this.setFlexTop(_validTopOffset, _topOffset);
      this.setFlexRight(_validRightOffset, _rightOffset);
      this.setFlexBottom(_validBottomOffset, _bottomOffset);
      this.rect = new HRect(_leftOffset, _topOffset, _right, _bottom);
      if (!this.rect.isValid) {
        console.log('---------------------------------------------');
        console.log(`invalid rect; left: ${this.rect.left
          }, top: ${this.rect.top}, width: ${this.rect.width}, height: ${this.rect.height
          }, right: ${this.rect.right}, bottom: ${this.rect.bottom}`);
        console.log(' parent size:', this.parentSize());
        console.log('  rect array:', _arr);
        console.log('---------------------------------------------');
      }
    }
    else {
      throw new Error(_throwPrefix + 'the length has to be either 4 or 6.');
    }
  }

  /* = Description
  * Replaces the rect of the component with a new HRect instance and
  * then refreshes the display.
  *
  * = Parameters
  * +_rect+:: The new HRect instance to replace the old rect instance with.
  * +_rect+:: Array format, see HView#constructor for further details.
  *
  * = Returns
  * +self+
  *
  **/
  setRect(_rect) {
    if (this.rect) {
      this.rect.releaseView(this);
    }
    if (this.isString(_rect) && this.isFunction(this[_rect])) {
      _rect = this[_rect]();
    }
    if (this.isArray(_rect)) {
      this._setArrayRect(_rect);
    }
    else if (this.isObject(_rect) && _rect.hasAncestor(HRect)) {
      this.rect = _rect;
    }
    if (this.rect) {
      this.rect.bindView(this);
    }
    // this.refresh();
    return this;
  }

  /* = Description
  * Sets any arbitrary style of the main DOM element of the component.
  * Utilizes Element Manager's drawing queue / cache to perform the action.
  *
  * = Parameters
  * +_name+::          The style name (css syntax, eg. 'background-color')
  * +_value+::         The style value (css syntax, eg. 'rgb(255,0,0)')
  * +_cacheOverride+:: Cache override flag.
  *
  * = Returns
  * +self+
  *
  **/
  setStyle(_name, _value, _cacheOverride) {
    if (this.elemId) {
      ELEM.setStyle(this.elemId, _name, _value, _cacheOverride);
    }
    return this;
  }

  setStyles(_styles) {
    if (this.isArray(_styles)) {
      this.setStylesArray(_styles);
    }
    else if (this.isObject(_styles)) {
      this.setStylesHash(_styles);
    }
    else {
      throw new TypeError(
        `HView#setStyles: Invalid style type ${this.typeChr(_styles)
        }, expected array or object; got: ${_styles}`);
    }
    return this;
  }

  setStylesArray(_styles) {
    _styles.forEach(([_styleKey, _styleValue]) => {
      this.setStyle(_styleKey, _styleValue);
    });
    return this;
  }

  setStylesHash(_styles) {
    return this.setStylesArray(Object.entries(_styles));
  }

  /* = Description
  * Returns a style of the main DOM element of the component.
  * Utilizes +ELEM+ cache to perform the action.
  *
  * = Parameters
  * +_name+:: The style name (css syntax, eg. 'background-color')
  *
  * = Returns
  * The style property value (css syntax, eg. 'rgb(255,0,0)')
  *
  **/
  style(_name) {
    if (this.elemId) {
      return ELEM.getStyle(this.elemId, _name);
    }
    else {
      console.warn('HView#style warning; no elemId!');
      return '';
    }
  }

  _getMarkupElemIdPart(_partName, _warnPrefix) {
    if (!this.componentName && !this.markupElemIds) {
      return null;
    }
    if (!_warnPrefix) {
      _warnPrefix = 'HView#_getMarkupElemIdPart';
    }
    if (this.isNullOrUndefined(this.markupElemIds)) {
      console.warn(_warnPrefix +
        ` warning; componentName: ${this.componentName} with viewId: ${this.viewId} does not have any markupElemIds!`);
      return null;
    }
    else if (this.isNullOrUndefined(this.markupElemIds[_partName])) {
      // console.warn(_warnPrefix +
      //   ` warning; partName: ${_partName} does not exist for viewId: ${this.viewId}`);
      return null;
    }
    else {
      return this.markupElemIds[_partName];
    }
  }

  /* = Description
  * Sets a style for a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+:: The identifier of the markup element.
  * +_name+::     The style name
  * +_value+::    The style value
  *
  * = Returns
  * +self+
  *
  **/
  setStyleOfPart(_partName, _name, _value, _force) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#setStyleOfPart');
    if (this.isntNull(_elemId) && this.isObjectOrArray(_name)) {
      ELEM.setStyles(this.markupElemIds[_partName], _name);
    }
    else if (_elemId) {
      ELEM.setStyle(this.markupElemIds[_partName], _name, _value, _force);
    }
    return this;
  }

  /* = Description
  * Returns a style of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  * +_name+::      The style name
  *
  * = Returns
  * The style of a specified markup element.
  *
  **/
  styleOfPart(_partName, _name, _force) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#styleOfPart');
    if (this.isntNull(_elemId)) {
      return ELEM.getStyle(_elemId, _name, _force);
    }
    else {
      return '';
    }
  }

  /* = Description
  * Sets a style of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  * +_value+::     Value for markup element.
  *
  * = Returns
  * +self+
  *
  **/
  setMarkupOfPart(_partName, _value) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#setMarkupOfPart');
    if (this.isntNull(_elemId)) {
      ELEM.setHTML(_elemId, _value);
    }
    return this;
  }

  /* = Description
  * Returns a style of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  *
  * = Returns
  * The markup of a specified markup element.
  *
  **/
  markupOfPart(_partName) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#markupOfPart');
    if (this.isntNull(_elemId)) {
      return ELEM.getHTML(_elemId);
    }
    else {
      return '';
    }
  }

  /* = Description
  * Sets a element attribute of the view's cell.
  *
  * = Parameters
  * +_key+::       The attribute key to set.
  * +_value+::     Value for markup element.
  * +_force+::     Optional force switch, defaults to false
  *
  * = Returns
  * +self+
  *
  **/
  setAttr(_key, _value, _force) {
    ELEM.setAttr(this.elemId, _key, _value, _force);
    return this;
  }

  /* = Description
  * Removes a element attribute of the view's cell.
  *
  * = Parameters
  * +_key+::       The attribute key to set.
  *
  * = Returns
  * +self+
  *
  **/
  unsetAttr(_key) {
    ELEM.delAttr(this.elemId, _key);
    return this;
  }

  delAttr(_key) {
    return this.unsetAttr(_key);
  }

  /* = Description
  * Gets a element attribute of the view's cell.
  *
  * = Parameters
  * +_key+::       The attribute key to get.
  * +_force+::     Optional force switch, defaults to false
  *
  * = Returns
  * The attribute value.
  *
  **/
  attr(_key, _force) {
    return ELEM.getAttr(this.elemId, _key, _force);
  }

  /* = Description
  * Sets a element attribute of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  * +_key+::       The attribute key to set
  * +_value+::     Value for markup element.
  * +_force+::     Optional force switch, defaults to false
  *
  * = Returns
  * +self+
  *
  **/
  setAttrOfPart(_partName, _key, _value, _force) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#setAttrOfPart');
    if (this.isntNull(_elemId)) {
      ELEM.setAttr(_elemId, _key, _value, _force);
    }
    return this;
  }

  /* = Description
  * Removed an element attribute of a specified markup element that has been bound
  * to this view.
  *
  * = Parameters
  * +_partName+::   The identifier of the markup element.
  * +_key+::        The attribute to remove.
  *
  * = Returns
  * +self+
  */
  unsetAttrOfPart(_partName, _key) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#setAttrOfPart');
    if (this.isntNull(_elemId)) {
      ELEM.delAttr(_elemId, _key);
    }
    return this;
  }

  // Same as unsetAttrOfPart
  delAttrOfPart(_partName, _key) {
    return this.unsetAttrOfPart(_partName, _key);
  }

  /* = Description
  * Returns a element attribute of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  * +_key+::       The attribute key to get.
  * +_force+::     Optional force switch, defaults to false
  *
  * = Returns
  * The attribute of a specified markup element.
  *
  **/
  attrOfPart(_partName, _key, _force) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#attrOfPart');
    if (this.isntNull(_elemId)) {
      return ELEM.getAttr(_elemId, _key, _force);
    }
    else {
      return '';
    }
  }

  /* = Description
  * Returns a element itself of a specified markup element that has been bound to this
  * view.
  *
  * = Parameters
  * +_partName+::  The identifier of the markup element.
  *
  * = Returns
  * The element of a specified markup element.
  *
  **/
  elemOfPart(_partName) {
    const _elemId = this._getMarkupElemIdPart(_partName, 'HView#elemOfPart');
    if (this.isntNull(_elemId)) {
      return ELEM.get(_elemId);
    }
    else {
      return '';
    }
  }

  /* = Description
  * Hides the component's main DOM element (and its children).
  *
  * = Returns
  * +self+
  *
  **/
  hide() {
    ELEM.setStyle(this.elemId, 'visibility', 'hidden', true);
    this.isHidden = true;
    return this;
  }

  /* = Description
  * Restores the visibility of the component's main DOM element (and its children).
  *
  * = Return
  * +self+
  *
  **/
  show() {
    ELEM.setStyle(this.elemId, 'display', this.displayMode, true);
    ELEM.setStyle(this.elemId, 'visibility', 'inherit', true);
    this.isHidden = false;
    return this;
  }

  /* = Description
  * Toggles between hide and show.
  *
  * = Returns
  * +self+
  *
  **/
  toggleVisibility(_visible) {
    if (_visible === true || _visible === 1) {
      this.show();
    }
    else if (_visible === false || _visible === 0) {
      this.hide();
    }
    else if (this.isHidden) {
      this.show();
    }
    else {
      this.hide();
    }
    return this;
  }

  toggle(_visible) {
    console.warn('HView#toggle is deprecated; use #toggleVisibility instead');
    return this.toggleVisibility(_visible);
  }

  /* = Description
  * Call this if you need to remove a component from its parent's views array without
  * destroying the DOM element itself, making it in effect a view without parent.
  * Useful, for example, for moving a view from one parent component to another.
  *
  * = Returns
  * +self+
  *
  **/
  remove() {
    if (this.parent) {
      const _viewZIndex = this.parent.viewsZOrder.indexOf(this.viewId);
      const _viewParentIndex = this.parent.views.indexOf(this.viewId);
      this.parent.views.splice(_viewParentIndex, 1);
      HSystem.delView(this.viewId);
      this.parent.viewsZOrder.splice(_viewZIndex, 1);
      const _sysUpdateZIndexOfChildrenBufferIndex = HSystem._updateZIndexOfChildrenBuffer.indexOf(this.viewId);
      if (_sysUpdateZIndexOfChildrenBufferIndex !== -1) {
        HSystem._updateZIndexOfChildrenBuffer.splice(_sysUpdateZIndexOfChildrenBufferIndex, 1);
      }
      this._updateZIndexAllSiblings();
      delete this.parent;
      this.parents = [];
    }
    return this;
  }

  /* = Description
  * Deletes the component and all its children.
  * Should normally be called from the parent.
  *
  **/
  die(_delay) {
    super.die();
    if (this.isNumber(_delay)) {
      this.timeouts.push(setTimeout(() => {
        this.dieMethods();
      }, _delay));
    }
    else {
      this.dieMethods();
    }
    return true;
  }

  dieMethods() {
    if (!this.isDead) {
      this.isDead = true;
      // hide self, makes destruction seem faster
      this.hide();
      this.drawn = false;
      if (this.timeouts) {
        while (this.timeouts.length) {
          clearTimeout(this.timeouts.pop());
        }
        delete this.timeouts;
      }
      // Delete the children first.
      while (this.views && this.views.length) {
        const _childViewId = this.views[0];
        this.destroyView(_childViewId);
      }
      // Remove this object's bindings, except the DOM element.
      this.remove();
      // Remove the DOM element bindings.
      while (this._domElementBindings.length) {
        this.cloneObject(this._domElementBindings).forEach(_elemId => {
          this._domElementBindings.pop();
          if (!ELEM.get(_elemId)) {
            debugger;
          }
          ELEM.del(_elemId);
        });
      }
      delete this._domElementBindings;
      // Remove the DOM object itself
      ELEM.del(this.elemId);
      delete this.rect;
      Object.entries(this).forEach(([_item, _value]) => {
        if (_item !== 'isDead') {
          delete this[_item];
        }
      });
    }
  }

  /* = Description
  * A convenience method to call #die after 10ms using a setTimeout.
  * Use this method, if destroying self or destroying from a sub-view.
  *
  **/
  dieSoon() {
    this.die(10);
  }

  /* Used by addView to build a parents array of parent classes.
  **/
  buildParents(_viewId) {
    const _view = HSystem.views[_viewId];
    _view.parent = this;
    _view.parents = [];
    this.parents.forEach(_parent => {
      _view.parents.push(_parent);
    });
    _view.parents.push(this);
  }

  /* = Description
  * Adds a sub-view / component to the view. Called from inside the
  * HView#constructor and should be automatic for all components that accept
  * the 'parent' parameter, usually the second argument, after the HRect. May
  * also be used to attach a freely floating component (removed with remove)
  * to another component.
  *
  * = Parameter
  * +_view+:: Usually this inside HView derivate components.
  *
  * = Returns
  * The view id.
  *
  **/
  addView(_view) {
    const _viewId = HSystem.addView(_view);
    this.views.push(_viewId);
    this.buildParents(_viewId);
    if (_view.zOrderDisabled === false) {
      this.viewsZOrder.push(_viewId);
    }
    return _viewId;
  }

  /* = Description
  * Call this if you need to remove a child view from this view without
  * destroying its element, making it in effect a view without parent.
  * Useful, for example, for moving a view from one parent component to another.
  *
  * = Parameters
  * +_viewId+:: The parent-specific view id. Actually an array index.
  *
  * = Returns
  * +self+
  *
  **/
  removeView(_viewId) {
    this.app.removeView(_viewId);
    return this;
  }

  /* = Description
  * Call this if you need to remove a child view from this view, destroying its
  * child elements recursively and removing all DOM elements too.
  *
  * = Parameters
  * +_viewId+::  The parent-specific view id. Actually an array index.
  *
  * = Returns
  * +self+
  **/
  destroyView(_viewId) {
    HSystem.views[_viewId].die();
    return this;
  }

  /* = Description
  * Returns bounds rectangle that defines the size and coordinate system
  * of the component. This should be identical to the rectangle used in
  * constructing the object, unless it has been changed after construction.
  *
  * = Returns
  * A new <HRect> instance with identical values to this component's rect.
  *
  **/
  bounds() {
    const _bounds = new HRect(this.rect);
    _bounds.offsetTo(0, 0);
    return _bounds;
  }

  /* = Description
  * This method resizes the view, without moving its left and top sides.
  * It adds horizontal coordinate units to the width and vertical units to
  * the height of the view.
  * Since a View's frame rectangle must be aligned on screen pixels, only
  * integral values should be passed to this method. Values with
  * fractional components will be rounded to the nearest whole integer.
  * If the View is attached to a window, this method causes its parent view
  * to be updated, so the View is immediately displayed in its new size. If it
  * doesn't have a parent or isn't attached to a window, this method
  * merely alter its frame and bounds rectangle.
  *
  * = Parameters
  * +_horizonal+:: Horizontal units to add to the width (negative units subtract)
  * +_vertical+::  Vertical units to add to the height (negative units subtract)
  *
  * = Returns
  * +self+
  *
  **/
  resizeBy(_horizontal, _vertical) {
    this.rect.right += _horizontal;
    this.rect.bottom += _vertical;
    this.rect.updateSecondaryValues();
    this.drawRect();
    return this;
  }

  /* = Description
  * This method makes the view width units wide
  * and height units high. This method adjust the right and bottom
  * components of the frame rectangle accordingly.
  * Since a View's frame rectangle must be aligned on screen pixels, only
  * integral values should be passed to this method. Values with
  * fractional components will be rounded to the nearest whole integer.
  * If the View is attached to a window, this method causes its parent view
  * to be updated, so the View is immediately displayed in its new size. If it
  * doesn't have a parent or isn't attached to a window, this method
  * merely alter its frame and bounds rectangle.
  *
  * = Parameters
  * +_width+::  The new width of the view.
  * +_height+:: The new height of the view.
  *
  * = Returns
  * +self+
  *
  **/
  resizeTo(_width, _height) {
    if (this.rect) {
      if (this.isNumber(_width)) {
        this.rect.right = this.rect.left + _width;
      }
      if (this.isNumber(_height)) {
        this.rect.bottom = this.rect.top + _height;
      }
      this.rect.updateSecondaryValues();
      this.drawRect();
    }
    else {
      if (this.isNumber(_width)) {
        ELEM.setStyle(this.elemId, 'width', `${_width}px`);
      }
      if (this.isNumber(_height)) {
        ELEM.setStyle(this.elemId, 'height', `${_height}px`);
      }
    }
    return this;
  }

  /* = Description
  * This method moves the view to a new coordinate. It adjusts the
  * left and top components of the frame rectangle accordingly.
  * Since a View's frame rectangle must be aligned on screen pixels, only
  * integral values should be passed to this method. Values with
  * fractional components will be rounded to the nearest whole integer.
  * If the View is attached to a window, this method causes its parent view
  * to be updated, so the View is immediately displayed in its new size. If it
  * doesn't have a parent or isn't attached to a window, this method
  * merely alter its frame and bounds rectangle.
  *
  * = Parameters
  * +_x+:: The new x-coordinate of the view.
  * +_y+:: The new y-coordinate of the view.
  *
  * +_point+:: The new coordinate point of the view.
  *
  * = Returns
  * +self+
  *
  **/
  offsetTo(..._args) {
    const _setLeftTopStyles = (_left, _top) => {
      if (this.isNumber(_left)) {
        ELEM.setStyle(this.elemId, 'left', `${_left}px`);
      }
      if (this.isNumber(_top)) {
        ELEM.setStyle(this.elemId, 'top', `${_top}px`);
      }
    };
    if (this.rect) {
      this.rect.offsetTo.apply(this.rect, _args);
      this.drawRect();
    }
    else if (_args.length === 1 && this.isArray(_args[0]) && _args[0].length === 2) {
      const [_left, _top] = _args[0];
      _setLeftTopStyles(_left, _top);
    }
    else if (_args.length === 1 && this.isObject(_args[0]) && _args[0].x && _args[0].y) {
      const {x, y} = _args[0];
      _setLeftTopStyles(x, y);
    }
    else if (_args.length === 2) {
      const [_left, _top] = _args;
      _setLeftTopStyles(_left, _top);
    }
    else {
      console.error('HView#offsetTo; invalid arguments error:', _args);
    }
    return this;
  }

  /* = Description
  * Alias method for offsetTo.
  *
  * = Returns
  * +self+
  *
  **/
  moveTo() {
    return this.offsetTo.apply(this, arguments);
  }

  /* = Description
  * This method re-positions the view without changing its size.
  * It adds horizontal coordinate units to the x coordinate and vertical
  * units to the y coordinate of the view.
  * Since a View's frame rectangle must be aligned on screen pixels, only
  * integral values should be passed to this method. Values with
  * fractional components will be rounded to the nearest whole integer.
  * If the View is attached to a window, this method causes its parent view
  * to be updated, so the View is immediately displayed in its new size. If it
  * doesn't have a parent or isn't attached to a window, this method
  * merely alter its frame and bounds rectangle.
  *
  * = Parameters
  * +_horizonal+::  Horizontal units to change the x coordinate (negative units subtract)
  * +_vertical+::   Vertical units to add to change the y coordinate (negative units subtract)
  *
  * = Returns
  * +self+
  *
  **/
  offsetBy(_horizontal, _vertical) {
    this.rect.offsetBy(_horizontal, _vertical);
    this.drawRect();
    return this;
  }

  /* = Description
  * Alias method for offsetBy.
  *
  * = Returns
  * +self+
  *
  **/
  moveBy() {
    this.offsetBy.apply(this, arguments);
    return this;
  }

  /* = Description
  * Brings the view to the front by changing its Z-Index.
  *
  * = Returns
  * +self+
  *
  **/
  bringToFront() {
    if (this.parent && this.zOrderDisabled === false) {
      const _index = this.zIndex();
      if (_index !== -1) {
        this.parent.viewsZOrder.splice(_index, 1);
      }
      this.parent.viewsZOrder.push(this.viewId);
      this._updateZIndexAllSiblings();
    }
    return this;
  }

  /* = Description
  * Brings itself to the front of the given view by changing its Z-Index.
  * Only works on sibling views.
  *
  * = Parameters
  * +_view+::  The view to bring to the front of.
  *
  * = Returns
  * +self+
  *
  **/
  bringToFrontOf(_view) {
    // Ensure the views are siblings:
    if (this.parent.viewId === _view.parent.viewId && this.zOrderDisabled === false) {
      const _selfIndex = this.zIndex();
      if (_selfIndex !== -1) {
        // removes own index:
        this.parent.viewsZOrder.splice(_selfIndex, 1);
        const _otherIndex = _view.zIndex();
        if (_otherIndex !== -1) {
          // adds own index before the other _view
          this.parent.viewsZOrder.splice(_otherIndex + 1, 0, this.viewId);
        }
      }
      this._updateZIndexAllSiblings();
    }
    return this;
  }

  /* = Description
  * Sends itself to the back of the given view by changing its Z-Index.
  * Only works on sibling views.
  *
  * = Parameters
  * +_view+::  The view to send to the back of.
  *
  * = Returns
  * +self+
  *
  **/
  sendToBackOf(_view) {
    // Ensure the views are siblings
    if (this.parent.viewId === _view.parent.viewId && this.zOrderDisabled === false) {
      const _selfIndex = this.zIndex();
      if (_selfIndex !== -1) {
        // removes own index:
        this.parent.viewsZOrder.splice(_selfIndex, 1);
        const _otherIndex = _view.zIndex();
        if (_otherIndex !== -1) {
          // adds own index after the other _view
          this.parent.viewsZOrder.splice(_otherIndex, 0, this.viewId);
        }
      }
      this._updateZIndexAllSiblings();
    }
    return this;
  }

  /* = Description
  * Sends itself one step backward by changing its Z-Index.
  *
  * = Returns
  * +self+
  *
  **/
  sendBackward() {
    const _index = this.zIndex();
    // 0 is already at the back
    if (_index !== 0 && this.zOrderDisabled === false) {
      this.parent.viewsZOrder.splice(_index, 1);
      this.parent.viewsZOrder.splice(_index - 1, 0, this.viewId);
      this._updateZIndexAllSiblings();
    }
    return this;
  }

  /* = Description
  * Brings itself one step forward by changing its Z-Index.
  *
  * = Returns
  * +self+
  *
  **/
  bringForward() {
    const _index = this.zIndex();
    // don't do anything if already in front:
    if (_index !== this.parent.viewsZOrder.length - 1 && this.zOrderDisabled === false) {
      this.parent.viewsZOrder.splice(_index, 1);
      this.parent.viewsZOrder.splice(_index + 1, 0, this.viewId);
      this._updateZIndexAllSiblings();
    }
    return this;
  }

  /* = Description
  * Sends the view to the back by changing its Z-Index.
  *
  * = Returns
  * +self+
  *
  **/
  sendToBack() {
    if (this.parent) {
      const _index = this.zIndex();
      if (_index !== 0 && this.zOrderDisabled === false) {
        if (_index !== -1) {
          this.parent.viewsZOrder.splice(_index, 1); // removes this index from the arr
        }
        this.parent.viewsZOrder.splice(0, 0, this.viewId); // un-shifts viewId
        this._updateZIndexAllSiblings();
      }
    }
    return this;
  }

  /* = Description
  * Use this method to get the Z-Index of itself.
  *
  * = Returns
  * The current Z-Index value.
  *
  **/
  zIndex() {
    if (!this.parent) {
      return -1;
    }
    // Returns the z-order of this item as seen by the parent.
    return this.parent.viewsZOrder.indexOf(this.viewId);
  }

  /* = Description
  * Measures the characters encoded in length bytes of the string - or,
  * if no length is specified, the entire string up to the null character,
  * '0', which terminates it. The return value totals the width of all the
  * characters in coordinate units; it's the length of the baseline required
  * to draw the string.
  *
  * = Parameters
  * +_string+::   The string to measure.
  * +_length+::   Optional, How many characters to count.
  * +_elemId+::   Optional, The element ID where the temporary string is created
  *               in.
  * +_wrap+::     Optional boolean value, wrap white-space?
  * +_customStyle+:: Optional, extra css to add.
  *
  * = Returns
  * The width in pixels required to draw a string in the font.
  *
  **/
  stringSize(_string, _length, _elemId, _wrap, _customStyle) {
    if (!_customStyle) {
      _customStyle = {};
    }
    if (this.isString(_customStyle)) {
      console.warn('HView#stringSize: use style objects instead of css text!');
      _customStyle = {};
    }
    if (this.isNumber(_length)) {
      _string = _string.substring(0, _length);
    }
    if (this.isntNumber(_elemId)) {
      _elemId = this.elemId || 0;
    }
    _customStyle.visibility = 'hidden';
    if (_wrap) {
      _customStyle.whiteSpace = 'normal';
    }
    else {
      _customStyle.whiteSpace = 'nowrap';
    }
    this._stringSizeImportantAttrs.forEach(_attr => {
      if (!_customStyle[_attr]) {
        _customStyle[_attr] = ELEM.getStyle(_elemId, _attr);
      }
    });
    _customStyle.display = 'inline-block';
    const _stringParent = ELEM.make(_elemId, 'div');
    const _stringElem = ELEM.make(_stringParent, 'span');
    ELEM.setStyles(_stringElem, _customStyle);
    ELEM.flushElem([_stringParent, _stringElem]);
    ELEM.flush();
    ELEM.setHTML(_stringElem, _string);
    const [_width, _height] = ELEM.getSize(_stringElem);
    ELEM.del(_stringElem); ELEM.del(_stringParent);
    const _paddedWidth = _width - _width % 2 + 2;
    const _paddedHeight = _height - _height % 2 + 2;
    return [_paddedWidth, _paddedHeight];
  }

  /* Returns the string width
  **/
  stringWidth(_string, _length, _elemId, _customStyle) {
    return this.stringSize(_string, _length, _elemId, false, _customStyle)[0];
  }

  /* Returns the string height.
  **/
  stringHeight(_string, _length, _elemId, _customStyle) {
    return this.stringSize(_string, _length, _elemId, true, _customStyle)[1];
  }

  /* Returns the X coordinate that has the scrolled position calculated.
  **/
  pageX() {
    return ELEM._getVisibleLeftPosition(this.elemId);
  }

  /* Returns the Y coordinate that has the scrolled position calculated.
  **/
  pageY() {
    return ELEM._getVisibleTopPosition(this.elemId);
  }

  inElem(_elemId, x, y) {
    if (this.isNumber(x) && this.isNumber(y)) {
      const p = ELEM.getVisiblePosition(_elemId, true);
      const s = ELEM.getSize(_elemId);
      return !(x < p[0] || x > p[0] + s[0] || y < p[1] || y > p[1] + s[1]);
    }
    else {
      console.error(`HView#inElem error; not a number x: ${x} or y: ${y}`);
      return false;
    }
  }

  contains(x, y) {
    return this.inElem(this.elemId, x, y);
  }

  intersect(x, y, w, h) {
    const p = ELEM.getVisiblePosition(this.elemId, true);
    const s = ELEM.getSize(this.elemId);
    return !(p[0] > x + w || p[0] + s[0] < x ||
             p[1] > y + h || p[1] + s[1] < y);
  }

  /* Set tabindex attribute for element
  **/
  setTabIndex(_tabIndex) {
    this.setAttr('tabIndex', _tabIndex);
    if (_tabIndex === 1 && !BROWSER_TYPE.mobile) {
      this.setFocus();
    }
  }

  setFocus() {
    const _elem = ELEM.get(this.elemId);
    if (this.isntNullOrUndefined(_elem)) {
      _elem.focus();
      require('foundation/eventmanager').changeActiveControl(this);
    }
  }

  /* = Description
  * Sets the label on a control component: the text that's displayed in
  * HControl extensions. Visual functionality is implemented in component
  * theme templates and refreshLabel method extensions.
  *
  * Avoid extending directly, extend +refreshLabel+ instead.
  *
  * = Parameters
  * +_label+:: The text the component should display.
  *
  * = Returns
  * +self+
  *
  **/
  setLabel(_label) {
    if (this.escapeLabelHTML) {
      _label = this.escapeHTML(_label);
    }
    if (_label !== this.label) {
      this.label = _label;
      this.refresh();
    }
    return this;
  }

  /* = Description
  * Called when the +self.label+ has been changed. By default
  * tries to update the label element defined in the theme of
  * the component. Of course, the HControl itself doesn't
  * define a theme, so without a theme doesn't do anything.
  *
  * = Returns
  * +self+
  *
  **/
  refreshLabel() {
    const _elemId = this._getMarkupElemIdPart('label', 'HView#refreshLabel');
    if (this.isNumber(_elemId)) {
      ELEM.setHTML(_elemId, this.label);
    }
    return this;
  }

  /* Returns the HPoint that has the scrolled position calculated.
  **/
  pageLocation() {
    return new HPoint(this.pageX(), this.pageY());
  }

  /* = Description
  * An abstract method that derived classes may implement, if they are able to
  * resize themselves so that their content fits nicely inside.
  * Similar to pack, might be renamed when components are written to
  * be savvy of this feature.
  **/
  // optimizeWidth() {}

  /* = Description
  * Binds a DOM element to the +ELEM+ cache. This is a wrapper for
  * the ELEM#elem_bind that keeps track of the bound elements and
  * frees them from the element manager when the view is destroyed.
  *
  * = Parameters
  * +_domElementId+:: The value of the DOM element's id attribute that is
  *                   to be bound to the element cache.
  *
  * = Returns
  * The element index id of the bound element.
  *
  **/
  bindDomElement(_domElementId) {
    const _cacheId = ELEM.bindId(_domElementId);
    if (_cacheId) {
      this._domElementBindings.push(_cacheId);
    }
    return _cacheId;
  }

  /* = Description
  * Removes a DOM element from the +ELEM+ cache. This is a wrapper
  * for the ELEM#elem_del. This is used for safely removing DOM
  * nodes from the cache.
  *
  * = Parameters
  * +_elemId+:: The id of the element in the element manager's cache
  *                that is to be removed from the cache.
  *
  **/
  unbindDomElement(_elemId) {
    const _indexOfElementId = this._domElementBindings.indexOf(_elemId);
    if (_indexOfElementId !== -1) {
      ELEM.del(_elemId);
      this._domElementBindings.splice(_indexOfElementId, 1);
    }
  }

  destroyMarkupElem(_name) {
    const _elemId = this._getMarkupElemIdPart(_name, 'HView#destroyMarkupElem');
    if (_elemId) {
      this.unbindDomElement(this.markupElemIds[_name]);
      delete this.markupElemIds[_name];
    }
  }

  /* = Description
  * Finds a string from the locale of the component.
  * The attrPath is a string or array to find an object.
  * For instance, if a component has a structure like this defined:
  *   HLocale.components.FooComponent = {
  *     strings: {
  *       defaultLabel: 'Default Label',
  *       otherLabel: 'Other Label',
  *     }
  *   };
  *
  * To get the defaultLabel, call getLocaleString like this:
  *   this.getLocaleString( 'FooComponent', 'strings.defaultLabel' );
  * ..or:
  *   this.getLocaleString( 'FooComponent', ['strings','defaultLabel'] );
  * ..or:
  *   this.getLocaleString( 'FooComponent.strings.defaultLabel' );
  *
  * = Parameters
  * +_componentClassName+:: The name of the item in HLocale.components
  * +_attrPath+::     The object path to the string. String or Array.
  * +_default+::      The default object to return if nothing matched.
  *
  **/
  getLocaleString(_componentClassName, _attrPath, _default) {
    if (this.isNullOrUndefined(_default)) {
      _default = '';
    }
    let _searchTarget = HLocale.components[_componentClassName];
    if (this.isNullOrUndefined(_searchTarget) && this.isString(_componentClassName)) {
      _searchTarget = HLocale.components;
      _attrPath = _componentClassName;
      _default = _attrPath;
    }
    if (this.isString(_attrPath)) {
      if (_attrPath.indexOf('.') > 0) {
        _attrPath = _attrPath.split('.');
      }
      else {
        _attrPath = [_attrPath];
      }
    }
    if (this.isNullOrUndefined(_searchTarget[_attrPath[0]])) {
      _searchTarget = HLocale;
    }
    if (this.isNullOrUndefined(_searchTarget[_attrPath[0]])) {
      return _default;
    }
    for (const _key = 0; _key < _attrPath.length; _key++) {
      const _targetValue = _searchTarget[_key];
      if (this.isObjectOrArray(_targetValue)) {
        _searchTarget = _targetValue;
      }
      else if (this.isString(_targetValue)) {
        return _targetValue;
      }
    }
    return _default;
  }

  isParentOf(_obj) {
    if (!_obj) {
      return false;
    }
    else if (this.isFunction(_obj.hasAncestor) && this.isArray(_obj.parent) && _obj.parents.includes(this)) {
      return true;
    }
    else {
      return false;
    }
  }

  isChildOf(_obj) {
    if (!_obj) {
      return false;
    }
    else if (this.isFunction(_obj.isParentOf)) {
      return _obj.isParentOf(this);
    }
    else {
      return false;
    }
  }

  isSiblingOf(_obj) {
    if (!_obj) {
      return false;
    }
    else if (this.isArray(_obj.parents)) {
      if (_obj.parents.length !== this.parents.length) {
        return false;
      }
      else {
        return _obj.parents.every((_item, i) => {
          return _item === this.parents[i];
        });
      }
    }
    else {
      return false;
    }
  }

  getZOrder() {
    return this.views
      .map(_viewId => {
        return HSystem.views[_viewId];
      })
      .filter(_view => {
        return !!_view;
      })
      .map((_view, index) => {
        let zIndex = ELEM.getStyle(_view.elemId, 'z-index', true);
        if (zIndex !== 'auto') {
          zIndex = parseInt(zIndex, 10);
          if (!isFinite(zIndex)) {
            zIndex = 'auto';
          }
        }
        return {
          index,
          viewId: _view.viewId,
          zIndex
        };
      })
      .sort((a, b) => {
        if (a.zIndex === b.zIndex) {
          return a.index - b.index;
        }
        else if (a.zIndex === 'auto') {
          return -1;
        }
        else if (b.zIndex === 'auto') {
          return 1;
        }
        else {
          return a.zIndex - b.zIndex;
        }
      })
      .map(({viewId}) => {
        return viewId;
      });
  }

  getSiblings() {
    return this.parent.views
      .map(_viewId => {
        return HSystem.views[_viewId];
      })
      .filter(_item => {
        return _item !== null;
      })
      .filter(_view => {
        return _view.viewId !== this.viewId;
      });
  }
}

module.exports = HView;
