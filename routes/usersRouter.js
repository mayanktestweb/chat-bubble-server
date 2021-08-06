const express = require('express')
const auth = require('../middlewares/auth')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const User = require('../models/User')
const storage = multer.diskStorage({
    destination: path.join(__dirname + '/../public/'),
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

router.use(auth)

router.patch('/:userId', upload.single('image'), async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userId, { image: req.file.filename, bio: req.body.bio })
        res.status(200).send(req.file.filename)
    } catch (error) {
        console.log(error)
        res.status(500).send('something went wrong')
    }
})


module.exports = router