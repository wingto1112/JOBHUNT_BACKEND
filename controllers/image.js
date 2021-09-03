const imageRouter = require("express").Router()
const multer = require('multer');
const Image = require("../model/image")
const config = require('../utils/config')
const {GridFsStorage} = require('multer-gridfs-storage');
const Employer = require("../model/employer")


const url = config.MONGODB_URI
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './images')
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
let upload = multer({ storage })

imageRouter.post('/',upload.single('photo'),  async (req, res) => {
    const employer = req.body.id
    const photo = req.file.filename;
    console.log(photo)
    const newUserData = {
        photo,
        employer
    }
    const newUser = new Image(newUserData);
    const saved = await newUser.save()
    const findEmployer = await Employer.findById(employer)
    console.log(findEmployer)
    findEmployer.photo = saved._id
    await findEmployer.save()
    res.json(newUser)    
}
)
imageRouter.get('/:id', async (req, res) => {
    const userImages = await Image.find({employer:req.params.id})
    res.json(userImages)
})
imageRouter.get('/', async (req, res) => {
    const images = await Image.find({})
    res.json(images)
})

module.exports = imageRouter;