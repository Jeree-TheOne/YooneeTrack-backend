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
const DeskRouter = require('./desk')
const RowRouter = require('./row')
const ColumnRouter = require('./column')
const TaskTypeRouter = require('./taskType')
const TagRouter = require('./tag')

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 5, max: 32}),
  AuthController.registration)
router.post('/login', 
  body('login').isEmail(),
  AuthController.login)
router.post('/logout', AuthMiddleware, AuthController.logout)
router.get('/activate/:link', AuthController.activate)
router.get('/refresh', AuthMiddleware, AuthController.refresh)
router.post('/upload-avatar', AuthMiddleware, FileController.uploadAvatar)

router.use('/user', UserRouter)
router.use('/workspace', WorkspaceRouter)
router.use('/task', TaskRouter)
router.use('/desk', DeskRouter)
router.use('/row', RowRouter)
router.use('/column', ColumnRouter)
router.use('/task-type', TaskTypeRouter)
router.use('/tag', TagRouter)

module.exports = router