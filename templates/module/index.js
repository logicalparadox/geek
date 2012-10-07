module.exports = process.env.{{project.name}}_COV
  ? require('./lib-cov/{{project.name}}')
  : require('./lib/{{project.name}}');
