
module.exports = Project;

function Project (opts) {
  this.opts = opts;
}

Project.prototype.handle = function (cb) {
  var tmp = this.opts.template
    , template;

  try {
    template = require('../templates/' + tmp);
  } catch (ex) {
    return cb(new Error('No template for: ' + tmp));
  }

  template(this.opts, cb);
};
