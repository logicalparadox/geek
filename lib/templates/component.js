
var breeze = require('breeze')
  , Filtr = require('filtr')
  , fs = require('fsagent')
  , path = require('path')
  , spawn = require('child_process').spawn;

module.exports = function (opts, done) {
  var base = path.join(__dirname, '../../templates/component')
    , dest = path.join(opts.cwd, opts.project.name)
    , outfiles = [];

  breeze.series({

      // check if destination exists
      // cancel if it does
      // create if it doesn't
      base: function (cb) {
        fs.exists(dest, function (ex) {
          if (ex) return cb(new Error('Project destination exists.'));
          fs.mkdirp(dest, function (err) {
            if (err) return cb(err);
            cb(null, dest);
          })
        });
      }

      // get list of all template files
    , files: function (cb) {
        fs.tree(base, function (err, res) {
          if (err) return cb(err);
          breeze.forEachSeries(res, function (filename, next) {
            var out = convertDest(base, dest, filename, opts);
            fs.stat(filename, function (err, stat) {
              if (err) return next(err);
              if (stat.isDirectory()) {
                fs.mkdirp(out, next);
              } else if (stat.isFile()) {
                outfiles.push(out);
                writeFile(filename, out, opts, next);
              } else {
                next();
              }
            });
          }, cb);
        });
      }

    , gitInit: function (cb) {
        var git = spawn('git', [ 'init' ], { cwd: dest });
        git.on('exit', function (code) {
          if (code > 0) return cb(new Error('Git init exit with non-zero'));
          cb(null, true);
        });
      }

    , gitAddRemote: function (cb) {
        var remote = 'git@github.com:' + opts.github.user + '/' + opts.project.name + '.git'
          , git = spawn('git', [ 'remote', 'add', 'origin', remote ], { cwd: dest });
        git.on('exit', function (code) {
          if (code > 0) return cb(new Error('Git remote add exit with non-zero'));
          cb(null, true);
        });
      }

    , gitAddFiles: function (cb) {
        breeze.forEachSeries(outfiles, function (file, next) {
          var git = spawn('git', [ 'add', file ], { cwd: dest });
          git.on('exit', function (code) {
            if (code > 0) return next(new Error('Git add exit with non-zero'));
            next();
          });
        }, cb);
      }

    , gitCommit: function (cb) {
        var git = spawn('git', [ 'commit', '-m', '"Initial commit"' ], { cwd: dest });
        git.on('exit', function (code) {
          if (code > 0) return cb(new Error('Git commit exit with non-zero'));
          cb(null, true);
        });
      }

  }, function (err, res) {
    done(err, res);
  });
};

function writeFile (filename, out, opts, done) {
  var base = path.dirname(out)
    , txt;

  breeze.series({

      readfile: function (next) {
        fs.readFile(filename, 'utf8', function (err, src) {
          if (err) return next(err);
          txt = modifyText(src, opts);
          next(null, txt);
        });
      }

    , makedest: function (next) {
        fs.mkdirp(base, next);
      }

    , writefile: function (next) {
        fs.writeFile(out, txt, next);
      }

  }, done);
}

function convertDest (base, dest, file, opts) {
  var name = file.replace(base, '');
  name = modifyFilename(name, opts);
  return path.join(dest, name);
}

function modifyFilename (filename, opts) {
  return filename
    .replace(/__(.*?)__/g, function (match, path) {
      path = path.replace('-', '.');
      return Filtr.getPathValue(path, opts).toString();
    });
}

function modifyText (txt, opts) {
  return txt
    .replace(/\{\{(.*?)\}\}/g, function (match, path) {
      var res = Filtr.getPathValue(path, opts);
      return res
        ? res.toString()
        : '';
    })
}
