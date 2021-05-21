const PageController = require('./controllers/PageController')

const express = require('express')
const config = require('./config/config.js')
var path = require('path')

module.exports = (app) => {

  PageController.updateStorage()

  app.get('/test', (req, res) => {
    res.send('Hello World')
  })

  // ############  PAGES  ############

  app.get('/photolist/', PageController.getPhotoList) // () => return images: names, types, ...

  app.get('/photolistsimple/', PageController.getPhotoListDumb) // () => return image filenames

  app.use('/photos/', PageController.staticPhoto)


  app.get('/filelistsimple/', PageController.getFileListDumb) // () => return pages: names, types, ...

  app.get('/filelist/', PageController.getFileList) // () => return pages: names, types, ...

  app.use('/files/', PageController.staticFile)


  app.post('/upload/', PageController.uploadFile)

  app.delete('/delete/', PageController.deleteFile)



  app.get('/config/', PageController.getConfig)


  // ############  MISC  ############

  app.get('/', (req, res) => {
    res.send(
      'You have landed on the application server-side instance.'
    )
  })

}
