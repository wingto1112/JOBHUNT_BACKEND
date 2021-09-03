const http = require('http')
const fs = require('fs')
const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')
/*const options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
}*/
const server = http.createServer(app)

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})