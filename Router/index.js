const Router = require('express').Router
const AuthController = require('../Controllers/AuthController')
const router = new Router()
const { body } = require('express-validator')
const AuthMiddleware = require('../Middleware/AuthMiddleware')
const FileController = require('../Controllers/FileController')
const upload = require('../multerConfig')
const UserRouter = require('./user')
const WorkspaceRouter = require('./workspace')
const TaskRouter = require('./task')

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 5, max: 32}),
  AuthController.registration)
router.post('/login', 
  body('login').isEmail(),
  AuthController.login)
router.post('/logout', AuthMiddleware, AuthController.logout)
router.get('/activate/:link', AuthController.activate)
router.get('/refresh', AuthController.refresh)
router.get('/users', AuthMiddleware, AuthController.getUsers)
router.post('/upload-avatar', AuthMiddleware, FileController.uploadAvatar)

router.use('/user', UserRouter)
router.use('/workspace', WorkspaceRouter)
router.use('/task', TaskRouter)

module.exports = router