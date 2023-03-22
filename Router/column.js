const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')
const ColumnController = require('../Controllers/ColumnController')
const AuthMiddleware = require('../Middleware/AuthMiddleware')


router.post('/add/', AuthMiddleware, ColumnController.create) // +
router.put('/update/:columnId', AuthMiddleware, ColumnController.update) // +
router.delete('/delete/:columnId', AuthMiddleware, ColumnController.delete) // +

module.exports = router