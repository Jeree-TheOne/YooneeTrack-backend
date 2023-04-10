const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')
const AuthMiddleware = require('../Middleware/AuthMiddleware')
const UserController = require('../Controllers/UserController')

router.put('/change-data', AuthMiddleware, UserController.changeData)
router.put('/change-password', AuthMiddleware, UserController.changePassword)
router.delete('/remove-avatar', AuthMiddleware, UserController.removeAvatar)

module.exports = router