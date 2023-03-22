const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')
const DeskController = require('../Controllers/DeskController')
const AuthMiddleware = require('../Middleware/AuthMiddleware')


router.post('/add', AuthMiddleware, DeskController.create) // +
router.get('/current/:workspaceId', AuthMiddleware, DeskController.getCurrent) // +
router.get('/:deskId', AuthMiddleware, DeskController.getOne) // +
router.put('/update/:deskId', AuthMiddleware, DeskController.update) // +
router.put('/set-current/:deskId', AuthMiddleware, DeskController.setCurrent) // +
router.delete('/delete/:deskId', AuthMiddleware, DeskController.delete) // +

module.exports = router