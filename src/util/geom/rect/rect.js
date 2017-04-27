
const HValueResponder = require('foundation/valueresponder');
const ELEM = require('core/elem');
const HSystem = require('foundation/system');
const HPoint = require('util/geom/point');

/** = Description
  * A Rect object represents a rectangle. Rects are used throughout the
  * Components to define the frames of windows, views, bitmaps even the
  * screen itself. A HRect is defined by its four sides, expressed as the public
  * data members left, top, right, and bottom.
  *
  * If you change a component's rect, you should call its HView.drawRect method.
  *
  * = Instance Variables
  * +type+::         '[HRect]'
  * +top+::          The position of the rect's top side (from parent top)
  * +left+::         The position of the rect's left side (from parent left)
  * +bottom+::       The position of the rect's bottom side (from parent top)
  * +right+::        The position of the rect's right side (from parent left)
  * +leftTop+::      A HPoint representing the coordinate of the rect's left top corner
  * +leftBottom+::   A HPoint representing the coordinate of the rect's left bottom corner
  * +rightTop+::     A HPoint representing the coordinate of the rect's right top corner
  * +rightBottom+::  A HPoint representing the coordinate of the rect's right bottom corner
  * +width+::        The width of the rect.
  * +height+::       The height of the rect.
  **/
class HRect extends HValueResponder {
  /* = Description
  * Initializes a Rect as four sides, as two diametrically opposed corners,
  * or as a copy of some other Rect object. A rectangle that's not assigned
  * any initial values is invalid, until a specific assignment is made, either
  * through a set() function or by setting the object's data members directly.
  *
  * = Parameters
  * using a HRect instance:
  * +rect+::  Another HRect.
  *
  * using two HPoint instances:
  * +leftTop+::       Coordinates of the left top corner.
  * +rightBottom+::   Coordinates of the right bottom corner.
  *
  * using separate numeric coordinates:
  * +left+::    The coordinate of left side.
  * +top+::     The coordinate of top side.
  * +right+::   The coordinate of right side.
  * +bottom+::  The coordinate of bottom side.
  *
  * = Usage
  *  var myLeftTopPoint = new HPoint(100,200);
  *  var myBottomRightPoint = new HPoint(300,400);
  *  var myRectFromOppositeCornerPoints = new HRect( myLeftTopPoint, myBottomRightPoint );
  *  var myRectFromSideCoordinates = new HRect(100,200,300,400);
  *  var myRectFromAnotherRect = new HRect( myRectFromEdgeCoordinates );
  *
  **/
  constructor(_left, _top, _right, _bottom) {
    super();
    // HValue and HView binding support:
    this.valueObj = null;
    this.viewIds = [];
    const _argLen = arguments.length;
    if (_argLen === 0) {
      this._constructorDefault();
    }
    else if (_argLen === 4) {
      this._constructorSides(_left, _top, _right, _bottom);
    }
    else if (_argLen === 2) {
      this._constructorPoint(_left, _top);
    }
    else if (_argLen === 1) {
      if (_left instanceof Array && _left.length === 4) {
        const _arr = _left;
        this._constructorSides(_arr[0], _arr[1], _arr[2], _arr[3]);
      }
      else if (_left instanceof Array && _left.length === 6) {
        const _arr = _left;
        throw new Error('HRect#constructor error: six-argument rect-array not properly implemented yet!');
      }
      else if (_left.hasAncestor && _left.hasAncestor(HRect)) {
        const _rect = _left;
        this._constructorRect(_rect);
      }
    }
    else {
      throw new Error('HRect#constructor error: Invalid number of arguments.');
    }
    this.updateSecondaryValues();
  }

  _constructorDefault() {
    this.top = 0;
    this.left = 0;
    this.bottom = -1;
    this.right = -1;
  }

  _constructorSides(_left, _top, _right, _bottom) {
    this.top = _top;
    this.left = _left;
    this.bottom = _bottom;
    this.right = _right;
  }

  _constructorPoint(_leftTop, _rightBottom) {
    this.top = _leftTop.y;
    this.left = _leftTop.x;
    this.bottom = _rightBottom.y;
    this.right = _rightBottom.x;
  }

  _constructorRect(_rect) {
    this.top = _rect.top;
    this.left = _rect.left;
    this.bottom = _rect.bottom;
    this.right = _rect.right;
  }

  clone() {
    return new HRect(this);
  }

  toArray() {
    const _arr = [null, null, null, null, null, null];
    const _view = HSystem.views[this.viewIds[0]];
    const _parentSize = _view.parentSize();
    if (_view && (_view.flexRight || _view.flexBottom)) {
      if (this.viewIds.length !== 1) {
        throw new Error(`HRect#toArray; unsupported amount of bound views: ${this.viewIds.length}.`);
      }
      _arr[0] = _view.flexLeft ? this.left : null;
      _arr[1] = _view.flexTop ? this.top : null;
      _arr[2] = _view.minWidth !== 0 ? _view.minWidth : this.width;
      _arr[3] = _view.minHeight !== 0 ? _view.minHeight : this.height;
      _arr[4] = _view.flexRight ? _view.flexRightOffset : null;
      _arr[5] = _view.flexBottom ? _view.flexBottomOffset : null;
      return _arr;
    }
    else {
      return [this.left, this.top, this.width, this.height];
    }
  }

  _updateFlexibleDimensions() {
    if (this.viewIds.length !== 1) {
      throw new Error(`HRect#_updateFlexibleDimensions; unsupported amount of bound views: ${this.viewIds.length}.`);
    }
    const _view = HSystem.views[this.viewIds[0]];
    if (_view.flexRight || _view.flexBottom) {
      ELEM.flush();

      // TODO: This will increase performance somewhat, but needs to be broader than it is:
      // var i=0,_parentElemIds=[_view.elemId],_parentView;
      // for(;i<_view.parents.length;i++){
      //   _parentView = _view.parents[i];
      //   if(_parentView && _parentView.elemId !== null && _parentView.elemId !== undefined){
      //     _parentElemIds.push(_parentView.elemId);
      //   }
      // }
      // ELEM.flushElem(_parentElemIds);

      const [_parentWidth, _parentHeight] = _view.parentSize();
      if (_view.flexRight && _view.flexLeft) {
        // calculate width and right
        const _virtualWidth = _parentWidth - this.left - _view.flexRightOffset;
        if (_view.minWidth !== null && _virtualWidth < _view.minWidth) {
          this.width = _view.minWidth;
        }
        else {
          this.width = _virtualWidth;
        }
        this.right = this.left + this.width;
      }
      else if (_view.flexRight) {
        // calculate left and right
        this.width = _view.minWidth;
        this.left = _parentWidth - this.width - _view.flexRightOffset;
        this.right = this.width + this.left;
      }
      else {
        // calculate width
        this.width = this.right - this.left;
      }
      if (_view.flexTop && _view.flexBottom) {
        // calculate height and bottom
        const _virtualHeight = _parentHeight - this.top - _view.flexBottomOffset;
        if (_view.minHeight !== null && _virtualHeight < _view.minHeight) {
          this.height = _view.minHeight;
        }
        else {
          this.height = _virtualHeight;
        }
        this.bottom = this.top + this.height;
      }
      else if (_view.flexBottom) {
        // calculate top and bottom
        this.height = _view.minHeight;
        this.top = _parentHeight - this.height - _view.flexBottomOffset;
        this.bottom = this.height + this.top;
      }
      else {
        // calculate height
        this.height = this.bottom - this.top;
      }
      this.updateSecondaryValues(true);
    }
  }

  /* = Description
  * You should call this on the instance to update secondary values, like
  * width and height, if you change a primary (left/top/right/bottom) value
  * straight through the property.
  *
  * Do not change properties other than the primaries through properties.
  *
  * Use the accompanied methods instead.
  *
  **/
  updateSecondaryValues(_noSize) {

    // this._updateFlexibleDimensions();

    /**
      * isValid is true if the Rect's right side is greater than or equal to its left
      * and its bottom is greater than or equal to its top, and false otherwise.
      * An invalid rectangle can't be used to define an interface area (such as
      * the frame of a view or window).
      **/
    this.isValid = this.right >= this.left && this.bottom >= this.top;

    /**
      *
      * The Point-returning functions return the coordinates of one of the
      * rectangle's four corners.
      **/
    this.leftTop = new HPoint(this.left, this.top);
    this.leftBottom = new HPoint(this.left, this.bottom);
    this.rightTop = new HPoint(this.right, this.top);
    this.rightBottom = new HPoint(this.right, this.bottom);

    /**
      * The width and height of a Rect's rectangle, as returned through these
      * properties.
      **/
    if (!_noSize) {
      this.width = (this.right - this.left);
      this.height = (this.bottom - this.top);
    }
    this.position = [this.left, this.top];
    this.size = [this.width, this.height];
    return this;
  }

  /* = Description
  * Sets the object's rectangle by defining the coordinates of all four
  * sides.
  *
  * The other set...() functions move one of the rectangle's corners to the
  * Point argument; the other corners and sides are modified concomittantly.
  *
  * None of these methods prevents you from creating an invalid rectangle.
  *
  * = Parameters
  * +_left+::     The coordinate of the left side.
  * +_top+::      The coordinate of the top side.
  * +_right+::    The coordinate of the right side.
  * +_bottom+::   The coordinate of the bottom side.
  *
  **/
  set(_left, _top, _right, _bottom) {
    const _argLen = arguments.length;
    if (_argLen === 0) {
      this._constructorDefault();
    }
    else if (_argLen === 4) {
      this._constructorSides(_left, _top, _right, _bottom);
    }
    else if (_argLen === 2) {
      this._constructorPoint(_left, _top);
    }
    else if (_argLen === 1) {
      if (_left instanceof Array && _left.length === 4) {
        const _arr = _left;
        this._constructorSides(_arr[0], _arr[1], _arr[2], _arr[3]);
      }
      else if (_left instanceof Array && _left.length === 6) {
        const _arr = _left;
        throw new Error('HRect#set error: six-argument rect-array not properly implemented yet!');
      }
      else if (_left.hasAncestor && _left.hasAncestor(HRect)) {
        const _rect = _left;
        this._constructorRect(_rect);
      }
    }
    else {
      throw new Error('HRect#set error: Invalid number of arguments.');
    }
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rect's left side to a new coordinate.
  *
  * = Parameters
  * +_left+::  The new left side coordinate (in px)
  *
  **/
  setLeft(_left) {
    this.left = _left;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rect's right side to a new coordinate.
  *
  * = Parameters
  * +_right+::  The new right side coordinate (in px)
  *
  **/
  setRight(_right) {
    this.right = _right;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rect's top side to a new coordinate.
  *
  * = Parameters
  * +_top+::  The new top side coordinate (in px)
  *
  **/
  setTop(_top) {
    this.top = _top;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rect's bottom side to a new coordinate.
  *
  * = Parameters
  * +_bottom+::  The new bottom side coordinate (in px)
  *
  **/
  setBottom(_bottom) {
    this.bottom = _bottom;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects left and top sides to a new point. Affects the position,
  * width and height.
  *
  * = Parameters
  * +_point+::  A HPoint instance to mode the sides to.
  *
  **/
  setLeftTop(_point) {
    this.left = _point.x;
    this.top = _point.y;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects left and bottom sides to a new point. Affects the left
  * position, width and height.
  *
  * = Parameters
  * +_point+::  A HPoint instance to mode the sides to.
  *
  **/
  setLeftBottom(_point) {
    this.left = _point.x;
    this.bottom = _point.y;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects right and top sides to a new point. Affects the top
  * position, width and height.
  *
  * = Parameters
  * +_point+::  A HPoint instance to mode the sides to.
  *
  **/
  setRightTop(_point) {
    this.right = _point.x;
    this.top = _point.y;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects right and bottom sides to a new point. Affects the width
  * and height. Does not affect the position.
  *
  * = Parameters
  * +_point+::  A HPoint instance to mode the sides to.
  *
  **/
  setRightBottom(_point) {
    this.right = _point.x;
    this.bottom = _point.y;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects right side to a new coordinate. Does not affect the position.
  *
  * = Parameters
  * +_width+::  A numeric value representing the new target width of the rect.
  *
  **/
  setWidth(_width) {
    this.right = this.left + _width;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects bottom side to a new coordinate. Does not affect the position.
  *
  * = Parameters
  * +_height+::   A numeric value representing the new target height of the rect.
  *
  **/
  setHeight(_height) {
    this.bottom = this.top + _height;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Moves the rects right and bottom sides to new coordinates. Does not affect the position.
  *
  * = Parameters
  * by separate numeric values:
  * +_width+::   A numeric value representing the new target width of the rect.
  * +_height+::  A numeric value representing the new target height of the rect.
  *
  * by HPoint used as "HSize":
  * +_point.x+::   A numeric value representing the new target width of the rect.
  * +_point.y+::   A numeric value representing the new target height of the rect.
  *
  **/
  setSize(_width, _height) {
    const _argLen = arguments.length;
    // Using width and height:
    if (_argLen === 2) {
    }
    // Using a point:
    else if (_argLen === 1 && _width.hasAncestor && _width.hasAncestor(HPoint)) {
      const _point = _width;
      _width = _point.x;
      _height = _point.y;
    }
    // From a rect:
    else if (_argLen === 1 && _width.hasAncestor && _width.hasAncestor(HRect)) {
      const _rect = _width;
      _width = _rect.width;
      _height = _rect.height;
    }
    this.right = this.left + _width;
    this.bottom = this.top + _height;
    this.updateSecondaryValues();
    return this;
  }

  /* = Description
  * Returns true if the Rect has any area even a corner or part
  * of a side in common with rect, and false if it doesn't.
  *
  * = Parameters
  * +_rect+::      A HRect instance to intersect this rect with
  * +_insetByX+::  Insets +_rect+ by +_insetBy+ pixels, optional
  * +_insetByY+::  Insets +_rect+ by +_insetBy+ pixels, optional.
  *   If omitted, but +_insetByX+ is defined, then +_insetByY+ equals +_insetByX+.
  *
  * = Returns
  * A Boolean (true/false) depending on the result.
  *
  **/
  intersects(_rect, _insetByX, _insetByY) {
    if (typeof _insetByX === 'number') {
      _rect = new HRect(_rect);
      if (typeof _insetByY === 'undefined') {
        _insetByY = _insetByX;
      }
      _rect.insetBy(_insetByX, _insetByY);
    }
    return !(this.left > _rect.right || this.right < _rect.left ||
             this.top > _rect.bottom || this.bottom < _rect.top);
  }

  // overlaps an alias of intersects
  overlaps(_rect, _insetbyX, _insetByY) {
    return this.intersects(_rect, _insetbyX, _insetByY);
  }

  /* = Description
  * Returns true if point or rect lies entirely within the Rect's
  * rectangle (and false if not). A rectangle contains the points that lie
  * along its edges; for example, two identical rectangles contain each other.
  *
  * Also works with HPoint instances.
  *
  * = Parameters
  * +_obj+::  A HRect or HPoint to check the containment with.
  *
  * = Returns
  * A Boolean (true/false) depending on the result.
  *
  **/
  contains(_obj) {
    if (_obj instanceof HPoint) {
      return this._containsPoint(_obj);
    }
    else if (_obj instanceof HRect) {
      return this._containsRect(_obj);
    }
    else {
      throw new TypeError(`HRect#contains; Wrong argument type: ${typeof _obj}`);
    }
  }

  _containsPoint(_point) {
    return (_point.x >= this.left && _point.x <= this.right &&
            _point.y >= this.top && _point.y <= this.bottom);
  }

  _containsRect(_rect) {
    return (_rect.left >= this.left && _rect.right <= this.right &&
            _rect.top >= this.top && _rect.bottom <= this.bottom);
  }

  /* = Description
  * Insets the sides of the Rect's rectangle by x units (left and
  * right sides) and y units (top and bottom). Positive inset values shrink
  * the rectangle; negative values expand it. Note that both sides of each
  * pair moves the full amount. For example, if you inset a Rect by (4,4), the
  * left side moves (to the right) four units and the right side moves (to the
  * left) four units (and similarly with the top and bottom).
  *
  * = Parameters
  * using a HPoint:
  * +point+::  A HPoint to inset by.
  *
  * using separate x and y coordinates:
  * +x+::  x Coordinate
  * +y+::  y Coordinate
  *
  **/
  insetBy(x, y) {
    const _argLen = arguments.length;
    if (_argLen === 1 && x instanceof HPoint) {
      const _point = x;
      this._insetByPoint(_point);
    }
    else if (_argLen === 2) {
      this._insetByXY(x, y);
    }
    else {
      throw new Error(`HRect#insetBy; Invalid number of arguments: ${_argLen}`);
    }
    this.updateSecondaryValues();
    return this;
  }

  _insetByPoint(_point) {
    this._insetByXY(_point.x, _point.y);
  }

  _insetByXY(x, y) {
    this.left += x;
    this.top += y;
    this.right -= x;
    this.bottom -= y;
  }

  /* = Description
  * Moves the Rect horizontally by x units and vertically by y
  * units. The rectangle's size doesn't change.
  *
  * = Parameters
  * using a HPoint:
  * +point+::  A HPoint to offset by.
  *
  * using separate x and y coordinates
  * +x+::  X coordinate
  * +y+::  Y coordinate
  *
  **/
  offsetBy(x, y) {
    const _argLen = arguments.length;
    if (_argLen === 1 && x instanceof HPoint) {
      const _point = x;
      this._offsetByPoint(_point);
    }
    if (_argLen === 1 && x instanceof Array && x.length === 2) {
      [x, y] = x;
      this._offsetByXY(x, y);
    }
    else if (_argLen === 2) {
      this._offsetByXY(x, y);
    }
    else {
      throw new Error(`HRect#offsetBy; Invalid number of arguments: ${_argLen}`);
    }
    this.updateSecondaryValues();
    return this;
  }

  _offsetByPoint(_point) {
    this._offsetByXY(_point.x, _point.y);
  }

  _offsetByXY(x, y) {
    this.left += x;
    this.top += y;
    this.right += x;
    this.bottom += y;
  }

  /* = Description
  * Moves the Rect to the location (x,y).
  *
  * = Parameters
  * using a HPoint:
  * +point+::  A HPoint to offset to.
  *
  * using separate x and y coordinates):
  * +x+::  X coordinate
  * +y+::  Y coordinate
  *
  **/
  offsetTo(x, y) {
    const _argLen = arguments.length;
    if (_argLen === 1 && x instanceof HPoint) {
      const _point = x;
      this._offsetToPoint(_point);
    }
    else if (_argLen === 1 && x instanceof Array && x.length === 2) {
      [x, y] = x;
      this._offsetToXY(x, y);
    }
    else if (_argLen === 2) {
      this._offsetToXY(x, y);
    }
    else {
      throw new Error(`HRect#offsetTo; Invalid number of arguments: ${_argLen}`);
    }
    this.updateSecondaryValues();
    return this;
  }

  _offsetToPoint(_point) {
    this._offsetToXY(_point.x, _point.y);
  }

  _offsetToXY(x, y) {
    this.right += x - this.left;
    this.left = x;
    this.bottom += y - this.top;
    this.top = y;
  }

  /* = Description
  * Returns true if the two objects' rectangles exactly coincide.
  *
  * = Parameters
  * +_rect+::  A HRect instance to compare to.
  *
  * = Returns
  * A Boolean (true/false) depending on the result.
  *
  **/
  equals(_rect) {
    return (this.left === _rect.left && this.top === _rect.top &&
            this.right === _rect.right && this.bottom === _rect.bottom);
  }

  /* = Description
  * Creates and returns a new Rect that's the intersection of this Rect and
  * the specified Rect. The new Rect encloses the area that the two Rects have
  * in common. If the two Rects don't intersect, the new Rect will be invalid.
  *
  * = Parameters
  * +_rect+::   A HRect instance to compare to.
  *
  * = Returns
  * A new HRect instance.
  *
  **/
  intersection(_rect) {
    return new HRect(
       Math.max(this.left, _rect.left), Math.max(this.top, _rect.top),
       Math.min(this.right, _rect.right), Math.min(this.bottom, _rect.bottom)
    );
  }

  /* = Description
  * Creates and returns a new Rect that minimally but completely encloses the
  * area defined by this Rect and the specified Rect.
  *
  * = Parameters
  * +_rect+::   A HRect instance to compare to.
  *
  * = Returns
  * A new HRect instance.
  *
  **/
  union(_rect) {
    return new HRect(
      Math.min(this.left, _rect.left), Math.min(this.top, _rect.top),
      Math.max(this.right, _rect.right), Math.max(this.bottom, _rect.bottom)
    );
  }

  bind(_view) {
    console.warn('HRect#bind is deprecated; use #bindView instead');
    return this.bindView(_view);
  }

  /* = Description
  * Binds an HView instance to the rect
  * This is the "opposite" function of #releaseView
  *
  * = Parameters
  * +_view+:: HView instance
  *
  **/
  bindView(_view) {
    if (!this.viewIds.includes(_view.viewId)) {
      this.viewIds.push(_view.viewId);
    }
    this._updateFlexibleDimensions();
    return this;
  }

  release(_view) {
    console.warn('HRect#release is deprecated; use #releaseView instead');
    return this.releaseView(_view);
  }

  /* = Description
  * Releases an HView instance from the rect
  * This is the "opposite" function of #bindView
  *
  * = Parameters
  * +_view+:: HView instance
  *
  **/
  releaseView(_view) {
    if (this.viewIds.includes(_view.viewId)) {
      this.viewIds.splice(this.viewIds.indexOf(_view.viewId), 1);
    }
    return this;
  }

  refreshValue() {
    this.set(this.__value);
    this.viewIds
      .map(_viewId => {
        return HSystem.views[_viewId];
      })
      .filter(_view => {
        return !!_view;
      })
      .forEach(_view => {
        _view.drawRect();
      });
    return this;
  }

}

module.exports = HRect;
