/*!
 * Carbon CLI
 * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var electron = require('electron')
  , geek = require('../geek');

/*!
 * Create an electron based cli
 */

program = electron('geek')
  .name('Geek')
  .desc('https://github.com/logicalparadox/geek')
  .version(geek.version);

/*!
 * Kinetik cli log header
 */

program.header = function () {
  program.colorize();
  console.log('');
  console.log('  Welcome to ' + 'Geek'.gray);
  console.log('  It worked if it ends with ' + 'Geek'.gray + ' ok'.green);
};

/*!
 * Kinetik cli log footer ok
 */

program.footerOk = function () {
  program.colorize();
  console.log('  ' + 'Geek '.gray + 'ok'.green);
  console.log('');
  process.exit();
};

/*!
 * Kinetik cli log footer not ok
 */

program.footerNotOk = function () {
  program.colorize();
  console.log('  ' + 'Geek '.gray + 'not ok'.red);
  console.log('');
  process.exit(1);
};

/*!
 * Load all the CLI submodules
 */

require('./project');

/*!
 * main export
 */

module.exports = program;
