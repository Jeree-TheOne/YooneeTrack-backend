const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')
const RowController = require('../Controllers/RowController')
const AuthMiddleware = require('../Middleware/AuthMiddleware')


router.post('/add/:workspaceId', AuthMiddleware, RowController.create) // +
router.put('/update/:rowId', AuthMiddleware, RowController.update) // +
router.delete('/delete/:rowId', AuthMiddleware, RowController.delete) // +

module.exports = router