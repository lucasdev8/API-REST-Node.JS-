const express = require('express')
const auth = require('../src/middlewares/auth')
const authMiddleware = require('../src/middlewares/auth')

const router = express.Router()

router.use(authMiddleware)

router.get('/', (req, res) => {
    res.send({ ok: true})
})

module.exports = app => app.use('/projects', router)