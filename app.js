const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const config = require('./utils/config')
const morgan = require('morgan')
const middleware = require('./utils/middleware')

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body)
})

logger.info('connecting to ', config.PORT)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('connected'))
    .catch((error) => console.log('error', error.message))

app.use(cors())
app.use(express.json())
app.use(morgan((':method :url :status :res[content-length] - :response-time ms :data')))

app.use('/api/blogs', blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app
