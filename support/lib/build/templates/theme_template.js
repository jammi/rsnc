const HThemeManager = require('foundation/thememanager');
const themeName = '$$THEME_NAME$$';
$$THEME_REQUIRES$$
const themeCss = {
$$CSS_DATA$$
};
const themeHtml = {
$$HTML_DATA$$
};
const getThemeHtml = componentName => {
  return themeHtml[componentName];
};
HThemeManager.installThemeData(themeName, themeCss, getThemeHtml);
module.exports = {
  themeName,
  css: themeCss,
  html: themeHtml
};
