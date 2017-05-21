const HPoint = require('util/geom/point');
const HRect = require('util/geom/rect');
const SHA1 = require('util/geom/sha1');
const SHA256 = require('util/geom/sha256');
const UtilMethods = require('util/util_methods');

module.exports = {
  HPoint, HRect, SHA1, SHA256,
  point: HPoint,
  Point: HPoint,
  rect: HRect,
  Rect: HRect,
  sha1: SHA1,
  sha256: SHA256
};
