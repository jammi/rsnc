const {readFileSync} = require('fs');
const pathSetup = require('path_setup');

const themeTemplate = readFileSync(
  pathSetup.relativeToRoot(
    'support/lib/build/templates/theme_template.js'
)).toString('utf8');

const TMPL_RE_CMD = /(\$)\{([^\}]*?)\}/m;
const TMPL_RE_EVL = /(#)\{([^\}]*?)\}/m;
const TMPL_RE_EID = /\]I\[/m;
const tmplToJs = (tmpl, useLambda) => {
  const jsCmds = [];
  while (TMPL_RE_CMD.test(tmpl)) {
    tmpl = tmpl.replace(TMPL_RE_CMD, (
      outer, type, inner, i, str
    ) => {
      jsCmds.push(inner);
      return '';
    });
  }
  while (TMPL_RE_EVL.test(tmpl)) {
    tmpl = tmpl.replace(TMPL_RE_EVL, (
      outer, type, inner, i, str
    ) => {
      return `\${${inner}}`;
    });
  }
  while (TMPL_RE_EID.test(tmpl)) {
    tmpl = tmpl.replace(TMPL_RE_EID, (
      outer, type, inner, i, str
    ) => {
      return '\${this.elemId}';
    });
  }
  tmpl = tmpl
    .replace(/`/g, '\\`')
    .replace(/\n/g, '\\n')
    .replace(/\\0/, '\\\0');
  const cmds = (jsCmds.length !== 0) ?
    `${jsCmds.join(';')};` : '';
  if (useLambda) {
    return `()=>{${cmds}return \`${tmpl}\`;}`;
  }
  else {
    return `function(){${cmds}return \`${tmpl}\`;}`;
  }
};

const parseRequires = themeRequires => {
  let jsTmpl = '';
  themeRequires.__order.forEach(constName => {
    const requirePath = themeRequires[constName];
    jsTmpl += `const ${constName} = require('${requirePath}');\n`;
  });
  return jsTmpl;
};

const processEntries = ({config, bundles, themeBundleNames}) => {
  config.themeNames.forEach(themeName => {
    const themeRequires = config.themesRequire[themeName] ?
      parseRequires(config.themesRequire[themeName]) :
      '';
    const themeArray = [];
    themeBundleNames.forEach(bundleName => {
      const bundle = bundles[bundleName];
      const themeData = bundle.themes[themeName];
      const {html, css} = themeData;
      themeData.html.js = tmplToJs(html.src, false);
      themeData.css.js = tmplToJs(css.src, true);
      themeArray.push(themeData);
    });
    const cssData = themeArray.map(themeData => {
      return `  '${themeData.componentName}': ${themeData.css.js},\n`;
    }).join('');
    const htmlData = themeArray.map(themeData => {
      return `    '${themeData.componentName}': ${themeData.html.js},\n`;
    }).join('');
    const themeJs = themeTemplate
      .replace('$$THEME_NAME$$', themeName)
      .replace('$$THEME_REQUIRES$$', themeRequires)
      .replace('$$CSS_DATA$$', cssData)
      .replace('$$HTML_DATA$$', htmlData);
    bundles[`${themeName}_theme`] = {
      bundleName: `${themeName}_theme`,
      src: themeJs
    };
  });
  return {config, bundles};
};

module.exports = processEntries;
