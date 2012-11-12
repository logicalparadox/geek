
program
  .command('docs')
  .description('Output the markdown docs for a given set of files.')
  .option('-f, --file [files]', 'Comma seperate list of files to include in documentation.')
  .option('-o, --out [filename]', 'Filename to output results to.')
  .action(makeDocs);

function makeDocs (args) {
  // modules
  var dox = require('dox')
    , fs = require('fsagent')
    , path = require('path');

  // arguments
  var files = args.param('f', 'files')
    , out = args.param('o', 'out');

  function l (s) {
    console.log('  ' + (s || ''));
  }

  program.header();
  l();

  if (!files) {
    l('File(s) required');
    l();
    program.footerNotOk();
  }

  if (!out) {
    out = 'API.md';
  }

  // resolve infiles
  files = files
    .split(',')
    .map(function (file) {
      return fs.isPathAbsolute(file)
        ? file
        : path.resolve(args.cwd, file);
    });

  // resolve outfile
  out = fs.isPathAbsolute(out)
    ? out
    : path.resolve(args.cwd, out);

  var outStream = fs.createWriteStream(out, { encoding: 'utf8' });

  outStream.on('error', function (err) {
    l('An error has occurred.');
    l(err.message);
    l();
    program.footerNotOk();
  });

  outStream.on('close', function () {
    l('Docs complete.');
    l();
    program.footerOk();
  });

  function line (str) {
    if (str) outStream.write(str);
    outStream.write('\n');
  }

  function parseDocs (docs) {
    docs
      .filter(function (chunk) {
        return !chunk.ignore && !chunk.isPrivate;
      })
      .forEach(function (chunk) {
        line(chunk.description.summary);

        if (chunk.tags.length) line();
        chunk.tags
          .forEach(function (tag) {
            switch (tag.type) {
              case 'param':
              case 'return':
              case 'returns':
                line('* **@' + tag.type + '** _{' + tag.types.join('|') + '}_ ' + (tag.name || '') + ' ' + tag.description);
                break;
              case 'cb':
                line('* **@' + tag.type + '** ' + tag.string);
                break;
            }
          });

        line();
        line(chunk.description.body);
        line();
      });
  }

  files.forEach(function (file) {
    var source = fs.readFileSync(file, 'utf8')
      , docs = dox.parseComments(source, { raw: true });
    parseDocs(docs);
  });

  outStream.end();
}
