const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')
const TaskTypeController = require('../Controllers/TaskTypeController')
const AuthMiddleware = require('../Middleware/AuthMiddleware')


router.post('/add/:workspaceId', AuthMiddleware, TaskTypeController.create) // +
router.put('/update/:taskTypeId', AuthMiddleware, TaskTypeController.update) // +
router.delete('/delete/:taskTypeId', AuthMiddleware, TaskTypeController.delete) // +

module.exports = router