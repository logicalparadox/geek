
program
  .command('project')
  .description('Create a project based on a template.')
  .option('-t, --template [module]', 'Specify the template to base the project on.')
  .option('-n, --name', 'Specify project name to be used for folder, npm, and git.')
  .option('-d, --description', 'Specify project description.')
  .option('-g, --github', 'Specify github user to file project under.')
  .option('-a, --author', 'Specify the author line for package and readme license.')
  .action(makeProject);

function makeProject (args) {
  var opts = {
      template: args.param('t', 'template') || 'module'
    , cwd: args.cwd
    , project: {
          name: args.param('n', 'name')
        , description: args.param('d', 'description') || ''
        , author: args.param('a', 'author') || ''
      }
    , github: {
          user: args.param('g', 'github')
      }
  };

  program.header();
  l();

  function l (s) {
    console.log('  ' + (s || ''));
  }

  if (!opts.project.name) {
    l('Project name required'.red);
    l();
    program.footerNotOk();
  }

  if (!opts.github.user) {
    l('Github user required'.red);
    l();
    program.footerNotOk();
  }

  var geek = require('../geek');

  var project = new geek.Project(opts);

  l('Starting project copy.');

  project.handle(function (err) {
    if (err) {
      l('Error: ' + err.message);
      l();
      program.footerNotOk();
    }

    l('Project copy successful.');
    l();
    program.footerOk();
  });
}
