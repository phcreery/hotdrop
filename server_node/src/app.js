const express = require('express')  //  backend route manager/site server
const bodyParser = require('body-parser')
const cors = require('cors')      //  some security thing?
const morgan = require('morgan')  //  for debugging 
const config = require('./config/config') // server config properties
const app = express()
// const drivelist = require('drivelist');
app.use(morgan('combined')) // log formatting for debugging site hits
app.use(bodyParser.json())  
app.use(cors())


// import routes.js for URL routing. Passes 'app' object
require('./routes')(app)

app.listen(config.port)
console.log(`Server Started on port ${config.port}`)
