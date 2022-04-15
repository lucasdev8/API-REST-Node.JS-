const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authConfig = require('../src/config/auth')

const User = require('../src/models/use')

const router = express.Router()

function genereteToken(params = {}) {
    return jwt.sign( params,  authConfig.secret, {
        expiresIn: 86400,
    })
}

router.post('/register', async (req, res) => {
    const { email } = req.body
    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'User already exists'})
        }
        const user = await User.create(req.body)

        User.password = undefined

        return res.send({ 
            user,
            token: genereteToken({ id: user.id })
         })
    } catch (err) {
        return res.status(400).send({
            error: "Register failed"
        })
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password} = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(400).send({error: 'User not found'})
    }
    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({error: 'Invalid password'})
    }

    user.password = undefined

    res.send({ 
        user, 
        token: genereteToken({ id: user.id })
    })
})

module.exports = app => app.use('/auth', router)