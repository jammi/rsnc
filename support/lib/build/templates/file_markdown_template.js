const marked = require('util/marked');

const markdownString = $$STRING$$;

module.exports = options => {
  return marked(markdownString, options);
};
