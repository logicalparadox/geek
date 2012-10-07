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

global.{{project.name}} = require('../..');

/*!
 * Helper to load internals for cov unit tests
 */

function req (name) {
  return process.env.{{project.name}}_COV
    ? require('../../lib-cov/{{project.name}}/' + name)
    : require('../../lib/{{project.name}}/' + name);
}

/*!
 * Load unexposed modules for unit tests
 */

global.__{{project.name}} = {};
