const express = require('express')
const router = express.Router()
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcrypt = require('bcrypt')


router.get("/", (req, res) => res.send('Auth Router'))

router.post("/register", async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(5)
    })

    try {
        console.log(req.body)
        let { error } = await schema.validateAsync(req.body)
        if (error) return res.status(400).send('Invalid Data')

        let salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS))
        let hash = await bcrypt.hash(req.body.password, salt)
        let user = await User.create({ ...req.body, password: hash })
        let token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY)

        user = user.toObject()
        delete user.password
        res.status(200).send({ user, token })
    } catch (error) {
        console.log(error)
        res.status(500).send('something went wrong')
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
        let user = await User.findOne({ email })
        console.log(user)
        let isValid = await bcrypt.compare(password.toString(), user.password.toString())
        if (!isValid) return res.status(400).send('Invalid Cridentials')

        let token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY)

        user = user.toObject()
        delete user.password
        res.status(200).send({ user, token })
    } catch (error) {
        console.log(error)
        res.status(500).send('something went wrong')
    }
})


router.post("/verify_token", async (req, res) => {
    const { _id } = req.body

    try {
        let user = await User.findById(_id)
        if (user) {
            user = user.toObject()
            delete user.password
            res.status(200).send(user)
        } else res.status(404).send('User Not Found')
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong')
    }
})

module.exports = router