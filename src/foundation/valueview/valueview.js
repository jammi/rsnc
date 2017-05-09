const HView = require('foundation/view');
class HValueView extends HView {
  constructor(_rect, _parent, _options) {
    console.warn('HValueView is deprecated; HView includes the same functionality');
    super(_rect, _parent, _options);
  }
}

module.exports = HValueView;
