const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')
const TagController = require('../Controllers/TagController')
const AuthMiddleware = require('../Middleware/AuthMiddleware')


router.post('/add/', AuthMiddleware, TagController.create) // +
router.put('/update/:tagId', AuthMiddleware, TagController.update) // +
router.delete('/delete/:tagId', AuthMiddleware, TagController.delete) // +

module.exports = router