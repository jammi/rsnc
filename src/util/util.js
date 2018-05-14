const HPoint = require('util/geom/point');
const HRect = require('util/geom/rect');
const SHA1 = require('util/sha1');
const SHA256 = require('util/sha256');
const UtilMethods = require('util/util_methods');
const marked = require('util/marked');

module.exports = {
  HPoint, HRect, SHA1, SHA256, marked,
  point: HPoint,
  Point: HPoint,
  rect: HRect,
  Rect: HRect,
  sha1: SHA1,
  sha256: SHA256,
};
