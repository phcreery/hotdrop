const fs = require('fs')
const config = require('../config/config')
// const path = require('path')
const multer = require('multer')
const disk = require('diskusage')
const sizeOf = require('image-size')

const sysutils = require('../utils/system')

async function getMediaPath() {
  let defaultPath = process.cwd() + '/public/'
  let mediaPath = await sysutils.getFirstMountedDrivePath()
  let path = mediaPath ? mediaPath : defaultPath
  console.log('Set working media path to:', path)
  return path
}
async function updateMediaPath() {
  config.dir.files = await getMediaPath()
}

// Supported Collages
let isSupportedCollage = (file) =>
  config.dir.supportedPhotoFormats
    .map((format) => file.toLowerCase().endsWith(format))
    .includes(true)
let filterSupportedImages = (files) =>
  files.filter((file) => isSupportedCollage(file.filename))

module.exports = {
  async getPhotoList(req, res) {
    await updateMediaPath()
    let addDimensions = (files) => {
      return files.map((file) => {
        let dimensions = sizeOf(file.fullpath)
        return { ...file, width: dimensions.width, height: dimensions.height }
      })
    }

    let files = []

    try {
      files = sysutils.walkSync(config.dir.files + '/', files)
      console.log(
        'List of photos in',
        config.dir.files,
        addDimensions(filterSupportedImages(files))
      )
      res.status(200).json(addDimensions(filterSupportedImages(files)))
    } catch (err) {
      console.log('Error Reading Dir: ', config.dir.files)
      res.status(404).send('Uh oh...')
    }
  },

  async getFileList(req, res) {
    await updateMediaPath()
    // Get misc info about Page
    let getFileUpdatedDate = (path) => {
      const stats = fs.statSync(path)
      return stats.mtime
    }

    let addUploadDate = (files) => {
      return files.map((file) => {
        return {
          ...file,
          modifiedDate: getFileUpdatedDate(file.fullpath),
          modifiedDateString: new Date(
            getFileUpdatedDate(file.fullpath)
          ).toDateString(),
        }
      })
    }

    let files = []

    try {
      // files = fs.readdirSync(config.dir.files)
      files = sysutils.walkSync(config.dir.files + '/', files)
      console.log('List of Files in', config.dir.files, addUploadDate(files))
      res.status(200).json(addUploadDate(files))
    } catch (err) {
      console.log('Error Reading Dir: ', config.dir.files)
      res.status(400).send('Error')
    }
  },

  async getConfig(req, res) {
    await updateMediaPath()
    let newConfig = config
    // let path = os.platform() === 'win32' ? 'c:' : '/';
    let diskinfo = disk.checkSync(config.dir.files)
    newConfig.freespace = diskinfo.free
    newConfig.disksize = diskinfo.total
    newConfig.battery = null

    res.status(200).send(newConfig)
  },

  async uploadFile(req, res) {
    await updateMediaPath()
    req.params.dir = ''
    console.log('uploading to dir:', config.dir.files + '/' + req.params.dir)

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, config.dir.files + '/' + req.params.dir)
      },

      // By default, multer removes file name and extensions so let's add them back
      filename: function (req, file, cb) {
        cb(null, file.originalname)
      },
    })

    const fileFilter = function (req, file, cb) {
      cb(null, true)
    }

    let upload = multer({ storage: storage, fileFilter: fileFilter }).array(
      'files'
    )
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status('406').send(req.fileValidationError)
      }
      console.log('body: ', req.body)
      console.log('files:', req.files)
      return res.sendStatus(200)
    })
  },

  async deleteFile(req, res) {
    await updateMediaPath()
    let dir = req.body.file
    console.log('deleting file:', dir)

    try {
      fs.unlinkSync(dir)
      res.status('200').send('success')
      //file removed
    } catch (err) {
      console.error(err)
      res.status('406').send(err)
    }
  },

  async staticPhoto(req, res) {
    let path =
      (await getMediaPath()) +
      req.originalUrl.replace('/photos', '').replace(/%20/g, ' ')
    console.log(path)
    res.sendFile(path)
  },
  async staticFile(req, res) {
    let path =
      (await getMediaPath()) +
      req.originalUrl.replace('/files', '').replace(/%20/g, ' ')
    console.log(path)
    res.sendFile(path)
  },
}
