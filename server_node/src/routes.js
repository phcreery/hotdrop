const FileController = require('./controllers/FileController')

module.exports = (app) => {
  app.get('/test', (req, res) => {
    res.send('Hello World')
  })

  // ############  PAGES  ############

  app.get('/photolist/', FileController.getPhotoList) // () => return images: names, types, ...

  app.use('/photos/', FileController.staticPhoto)

  app.get('/filelist/', FileController.getFileList) // () => return pages: names, types, ...

  app.use('/files/', FileController.staticFile)

  app.post('/upload/', FileController.uploadFile)

  app.delete('/delete/', FileController.deleteFile)

  app.get('/config/', FileController.getConfig)

  // ############  MISC  ############

  app.get('/', (req, res) => {
    res.send('You have landed on the application server-side instance.')
  })
}
