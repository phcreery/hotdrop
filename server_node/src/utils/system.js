const fs = require('fs')
const path = require('path')
const drivelist = require('drivelist')

async function getDrives() {
  return await drivelist.list()
}

async function getFirstMountedDrivePath(defaultTo = null) {
  let path = defaultTo
  let drives = await drivelist.list()
  if (drives.length > 1) {
    for (var i = 0; i < drives.length; i++) {
      if (drives[i].isUSB & ('path' in drives[i].mountpoints[0])) {
        path = drives[i].mountpoints[0].path
        console.log('found external...', path)
        return path
      }
    }
  }
  return path
}

// returns object with information of all files in a directory
// ex:
// walk(config.dir.files, function(err, results) {
//   if (err) throw err;
//   console.log(results);
// });
var walk = function (dir, done) {
  var results = []
  fs.readdir(dir, function (err, list) {
    if (err) return done(err)
    var pending = list.length
    if (!pending) return done(null, results)
    list.forEach(function (filename) {
      var file = path.resolve(dir, filename)
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res)
            if (!--pending) return done(null, results)
          })
        } else {
          results.push({ path: file, filename: filename })
          if (!--pending) return done(null, results)
        }
      })
    })
  })
}

var walkSync = function (dir, filelist, basedir = dir) {
  var fs = fs || require('fs')
  var files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach(function (file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist, basedir)
    } else {
      filelist.push({
        fullpath: (dir.endsWith('/') ? dir.slice(0, -1) : dir) + '/' + file,
        filename: file,
        path: '/' + (dir + file).replace(basedir, ''),
        dir: '/' + dir.replace(basedir, ''),
      })
    }
  })
  return filelist
}

module.exports = { getDrives, getFirstMountedDrivePath, walk, walkSync }
