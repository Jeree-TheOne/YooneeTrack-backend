const Router = require('express').Router
const AuthController = require('../Controllers/AuthController')
const router = new Router()
const { body } = require('express-validator')
const AuthMiddleware = require('../Middleware/AuthMiddleware')
const FileController = require('../Controllers/FileController')

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 5, max: 32}),
  AuthController.registration)
router.post('/login', 
  body('login').isEmail(),
  body('password').isLength({min: 5, max: 32}),
  AuthController.login)
router.post('/logout', AuthMiddleware, AuthController.logout)
router.get('/activate/:link', AuthController.activate)
router.get('/refresh', AuthController.refresh)
router.get('/users', AuthMiddleware, AuthController.getUsers)

router.post('/upload-avatar', AuthMiddleware, FileController.uploadAvatar)

module.exports = router