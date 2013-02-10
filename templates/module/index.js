module.exports = process.env.{{project.shortname}}_COV
  ? require('./lib-cov/{{project.shortname}}')
  : require('./lib/{{project.shortname}}');
