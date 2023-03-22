const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')
const TaskController = require('../Controllers/TaskController')
const AuthMiddleware = require('../Middleware/AuthMiddleware')


router.post('/add', AuthMiddleware, TaskController.create)
router.get('/', AuthMiddleware, TaskController.selectAll)
router.get('/:taskId', AuthMiddleware, TaskController.selectOne)
router.put('/update/:taskId', AuthMiddleware, TaskController.update)

module.exports = router