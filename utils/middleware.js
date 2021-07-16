const logger = require('./logger')
const jwt = require('jsonwebtoken')

const userExtractor = (req, res, next) => {
  const user = jwt.verify(req.token, process.env.SECRET)
  
  if(!user){
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  req.user = user
  next()
}

const tokenExtractor = (req, res, next) => {
  const author = req.get('authorization')
  if (author && author.toLowerCase().startsWith('bearer ')) {
    req.token = author.substring(7)
  }
  next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
}

module.exports = {
  unknownEndpoint, errorHandler, tokenExtractor, userExtractor
}