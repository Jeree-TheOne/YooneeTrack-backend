const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')
const WorkspaceController = require('../Controllers/WorkspaceController')
const AuthMiddleware = require('../Middleware/AuthMiddleware')


router.post('/add', AuthMiddleware, WorkspaceController.create)
router.get('/', AuthMiddleware, WorkspaceController.selectAvailable)
router.get('/:workspace', AuthMiddleware, WorkspaceController.selectOne)
router.put('/:workspace', AuthMiddleware, WorkspaceController.changeWorkspaceName)

module.exports = router