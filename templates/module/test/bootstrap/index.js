/*!
 * Attach chai to global should
 */

global.chai = require('chai');
global.should = global.chai.should();

/*!
 * Chai Plugins
 */

//global.chai.use(require('chai-spies'));
//global.chai.use(require('chai-http'));

/*!
 * Import project
 */

global.{{project.shortname}} = require('../..');

/*!
 * Helper to load internals for cov unit tests
 */

function req (name) {
  return process.env.{{project.shortname}}_COV
    ? require('../../lib-cov/{{project.shortname}}/' + name)
    : require('../../lib/{{project.shortname}}/' + name);
}

/*!
 * Load unexposed modules for unit tests
 */

global.__{{project.shortname}} = {};
