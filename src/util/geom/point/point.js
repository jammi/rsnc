
const HClass = require('core/class');

/** = Description
  * Point objects represent points on a two-dimensional coordinate grid. The
  * object's coordinates are stored as public x and y data members.
  *
  * = Instance Variables
  * +type+::  '[HPoint]'
  * +x+::     The X coordinate of the point
  * +y+::     The Y coordinate of the point
  *
  **/
class HPoint extends HClass {

  /* = Description
   * Creates a new Point object that corresponds to the point (x, y), or that's
   * copied from point. If no coordinate values are assigned, the Point's
   * location is indeterminate.
   *
   * = Parameters
   * by using a HPoint instance:
   * +point+::  Another +HPoint+ or other compatible structure.
   *
   * by using separate numeric coordinates:
   * +x+::  x coordinate
   * +y+::  y coordinate
   *
   * = Usage
   *  var myPoint = new HPoint(100,200);
   *  var mySameCoordPoint = new HPoint( myPoint );
   *
   **/
  constructor() {
    super();
    if (arguments.length === 0) {
      this._constructorDefault();
    }
    else if (arguments.length === 2) {
      this._constructorValues(arguments[0], arguments[1]);
    }
    else if (arguments.length === 1) {
      this._constructorPoint(arguments[0]);
    }
    else {
      throw new Error('HPoint#constructor error: Invalid number of arguments.');
    }
  }

  _constructorDefault() {
    this.x = null;
    this.y = null;
  }
  _constructorValues(x, y) {
    this.x = x;
    this.y = y;
  }

  _constructorPoint(_point) {
    this.x = _point.x;
    this.y = _point.y;
  }

  /* = Description
  * Sets the Point's x and y coordinates.
  *
  * = Parameters
  * +x+::  The new X coordinate of the point
  * +y+::  The new Y coordinate of the point
  *
  **/
  set() {
    if (arguments.length === 0) {
      this._constructorDefault();
    }
    else if (arguments.length === 2) {
      this._constructorValues(arguments[0], arguments[1]);
    }
    else if (arguments.length === 1) {
      this._constructorPoint(arguments[0]);
    }
    else {
      throw new Error('HPoint#set error: Invalid number of arguments.');
    }
    return this;
  }

  /* = Description
  * Ensures that the Point lies within rect. If it's already contained in the
  * rectangle, the Point is unchanged; otherwise, it's moved to the rect's
  * nearest edge.
  *
  * = Parameters
  * +_rect+::   A HRect instance to constrain to.
  *
  **/
  constrainTo(_rect) {
    if (this.x < _rect.left) {
      this.x = _rect.left;
    }
    if (this.y < _rect.top) {
      this.y = _rect.top;
    }
    if (this.x > _rect.right) {
      this.x = _rect.right;
    }
    if (this.y > _rect.bottom) {
      this.y = _rect.bottom;
    }
    return this;
  }

  /* = Description
  * Creates and returns a new Point that adds the given Point and this Point
  * together. The new object's x coordinate is the sum of the operands' x
  * values; its y value is the sum of the operands' y values.
  *
  * = Parameters
  * with HPoint:
  * +_point+::  An HPoint to add to.
  *
  * with coordinates:
  * +_x+::  An X-coordinate to add to.
  * +_y+::  An Y-coordinate to add to.
  *
  * = Returns
  * A new HPoint.
  *
  **/
  add(x, y) {
    if (arguments.length === 1 && x.hasAncestor && x.hasAncestor(HPoint)) {
      return new HPoint(this.x + x.x, this.y + x.y);
    }
    else if (arguments.length === 1 && x instanceof Array && x.length === 2) {
      return new HPoint(this.x + x[0], this.y + x[1]);
    }
    else if (arguments.length === 2) {
      return new HPoint(this.x + x, this.y + y);
    }
    else {
      throw new Error('HPoint#add: Invalid arguments.');
    }
  }

  /* = Description
  * Creates and returns a new Point that subtracts the given Point from this
  * Point. The new object's x coordinate is the difference between the
  * operands' x values; its y value is the difference between the operands'
  * y values.
  *
  * = Parameters
  *
  * with HPoint:
  * +_point+:: An HPoint to subtract from.
  *
  * with coordinates:
  * +_x+::  An X-coordinate to subtract from.
  * +_y+::  An Y-coordinate to subtract from.
  *
  * = Returns
  * A new HPoint.
  *
  **/
  subtract(x, y) {
    if (arguments.length === 1 && x.hasAncestor && x.hasAncestor(HPoint)) {
      return new HPoint(this.x - x.x, this.y - x.y);
    }
    else if (arguments.length === 1 && x instanceof Array && x.length === 2) {
      return new HPoint(this.x - x[0], this.y - x[1]);
    }
    else if (arguments.length === 2) {
      return new HPoint(this.x - x, this.y - y);
    }
    else {
      throw new Error('HPoint#subtract: Invalid arguments.');
    }
  }

  /* = Description
  * Returns true if the two objects' point exactly coincide.
  *
  * = Parameter
  * +_point+::  A HPoint to compare to.
  *
  * = Returns
  * The result; true or false.
  *
  **/
  equals(_point) {
    return this.x === _point.x && this.y === _point.y;
  }

  clone() {
    return new HPoint(this);
  }

}

module.exports = HPoint;
