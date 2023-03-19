const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')
const WorkspaceController = require('../Controllers/WorkspaceController')
const AuthMiddleware = require('../Middleware/AuthMiddleware')


router.post('/add', AuthMiddleware, WorkspaceController.create)
router.get('/', AuthMiddleware, WorkspaceController.selectAvailable)

module.exports = router