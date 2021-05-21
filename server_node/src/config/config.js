module.exports = {
  port: 8081,
  dir: {
    // photos: process.env.DIR_PUBLIC || process.cwd() + '/public/',
    files: process.env.DIR_PUBLIC || process.cwd() + '/public/',
    supportedPhotoFormats: ['.png', '.jpg', '.jpeg', '.gif', '.svg']  //, '.gif', '.mp4', '.mp3'  // capitols unnecessary
  }
}