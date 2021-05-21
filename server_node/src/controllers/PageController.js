const fs = require('fs')
const config = require('../config/config')
const sizeOf = require('image-size')
var path = require('path')
const multer = require("multer")
const disk = require('diskusage');
const os = require('os');
const express = require('express')

const drivelist = require('drivelist');


// returns object with information of all files in a directory
// ex:
// walk(config.dir.files, function(err, results) {
//   if (err) throw err;
//   console.log(results);
// });
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(filename) {
      var file = path.resolve(dir, filename);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) return done(null, results);
          });
        } else {
          results.push({path: file, filename: filename});
          if (!--pending) return done(null, results);
        }
      });
    });
  });
};

async function getDrives() {
  const drives = await drivelist.list();
  drives.forEach((drive) => {
    console.log(drive);
  });
  return drives
}

async function mediaPath() {
  var path = process.cwd() + '/public/'
  var drives = await getDrives()
  console.log(drives)
  if (drives.length > 1) {
    path =  drives[1].mountpoints[0].path
  }
  console.log("Setting path to:", path)
  return path
}



var walkSync = function (dir, filelist, basedir=dir) {
  var fs = fs || require('fs')
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist, basedir);
    }
    else {
      filelist.push({ fullpath: (dir.endsWith('/') ? dir.slice(0, -1) : dir) + "/" + file, filename: file, path: "/" + (dir + file).replace(basedir, ""), dir: "/" + dir.replace(basedir, "") });
    }
  });
  return filelist;
};

// Supported Collages
// let hasSupportedCollage = (files) => filterSupportedCollageFiles(files).length > 0
let isSupportedCollage = (file) => config.dir.supportedPhotoFormats.map((format) => file.toLowerCase().endsWith(format)).includes(true)
let filterSupportedCollageFiles = (files) => files.filter((file) => isSupportedCollage(file.filename))

// Supported Files
// let isSupportedFile = (file) =>
//   config.dir.supportedPageFormats.map((format) => file.endsWith(format)).includes(true)
// let supportedFiles = (files) => files.filter((file) => isSupportedFile(file))
// let hasSupportedFile = (files) => supportedFiles(files).length > 0

// let fileListFormatter = (files) => files.map((file) => { return { filename: file } } )
// let addRelativePath = (frompath, files) => files.map((file) => { return { ...file, path: file.fullpath.replace(frompath, "") } } )

module.exports = {

  async getPhotoList(req, res) {
    await module.exports.updateStorage()
    let addDimensions = (files) => {
      return files.map((file) => {
        let dimensions = sizeOf(file.fullpath)
        return { ...file, width: dimensions.width, height: dimensions.height }
      })
    }

    let files = []

    try {
      // files = fs.readdirSync(config.dir.files)
      walkSync(config.dir.files + "/", files)
      // console.log('List of Files in', config.dir.files, files)
      console.log('List of photos in', config.dir.files, addDimensions(filterSupportedCollageFiles(files)))
      res.status(200).json(addDimensions(filterSupportedCollageFiles(files)))
    } catch (err) {
      console.log('Error Reading Dir: ', config.dir.files)
      res.status(404).send('Uh oh...')
    }
  },

  async getPhotoListDumb(req, res) {
    await module.exports.updateStorage()
    let files = []

    try {
      // files = fs.readdirSync(config.dir.files)
      walkSync(config.dir.files + "/", files)
      console.log('List of Files in', config.dir.files, filterSupportedCollageFiles(files))
      res.status(200).json(filterSupportedCollageFiles(files))
    } catch (err) {
      console.log('Error Reading Dir: ', config.dir.files)
      res.status(404).send('Uh oh...')
    }
  },

  async getFileListDumb(req, res) {
    await module.exports.updateStorage()
    let files = []

    try {
      // files = fs.readdirSync(config.dir.files)
      walkSync(config.dir.files + "/", files)
      console.log('List of Files in', config.dir.files, files)
      res.status(200).json(files)
    } catch (err) {
      console.log('Error Reading Dir: ', config.dir.files)
      res.status(400).send('Error')
    }

  },


  async getFileList(req, res) {
    await module.exports.updateStorage()
    // Get misc info about Page
    let getFileUpdatedDate = (path) => {
      console.log("Reading..", path)
      const stats = fs.statSync(path)
      return stats.mtime
    }

    let addUploadDate = (files) => {
      return files.map((file) => {
        return { ...file, modifiedDate: getFileUpdatedDate(file.fullpath), modifiedDateString: new Date(getFileUpdatedDate(file.fullpath)).toDateString() }
      })
    }

    let files = []

    try {
      // files = fs.readdirSync(config.dir.files)
      walkSync(config.dir.files + "/", files)
      console.log('List of Files in', config.dir.files, addUploadDate(files))
      res.status(200).json(addUploadDate(files))
    } catch (err) {
      console.log('Error Reading Dir: ', config.dir.files)
      res.status(400).send('Error')
    }
  },

  async getConfig(req, res) {
    await module.exports.updateStorage()
    var newConfig = config
    console.log("Looking at path...", config.dir.files)
    // let path = os.platform() === 'win32' ? 'c:' : '/';
    let path = config.dir.files
    let diskinfo = disk.checkSync(path);
    newConfig.freespace = diskinfo.free
    newConfig.disksize =  diskinfo.total
    newConfig.battery = null

    res.status(200).send(newConfig)
  },

  async uploadFile(req, res) {
    await module.exports.updateStorage()
    // if (req.params.dir === 'root') {
    //   req.params.dir = ''
    // }
    req.params.dir = ''
    console.log('uploading dir:', config.dir.files + '/' + req.params.dir)

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, config.dir.files + '/' + req.params.dir)
      },
  
      // By default, multer removes file name and extensions so let's add them back
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
    })

    const fileFilter = function(req, file, cb) {
      cb(null, true);
    };

    let upload = multer({ storage: storage, fileFilter: fileFilter }).array("files")
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status('406').send(req.fileValidationError);
      }
      console.log("body: ", req.body);
      console.log("files:", req.files);
      return res.sendStatus(200);
    })
  },


  async deleteFile(req, res) {
    await module.exports.updateStorage()
    console.log("deleting", req.body.file)
    let dir = req.body.file
    console.log('deleting file:', dir)
    
    try {
      fs.unlinkSync(dir)
      res.status('200').send('success')
      //file removed
    } catch(err) {
      console.error(err)
      res.status('406').send(err);
    }
  },

  async updateStorage() {
    config.dir.files = await mediaPath()
    // config.dir.files = await mediaPath()
  },
  
  async staticPhoto(req, res) {
    var path = await mediaPath() + req.originalUrl.replace("/photos", "").replace(/%20/g, " ")
    console.log(path)
    res.sendFile(path)
  },
  async staticFile(req, res) {
    var path = await mediaPath() + req.originalUrl.replace("/files", "").replace(/%20/g, " ")
    console.log(path)
    res.sendFile(path)
  },

}
