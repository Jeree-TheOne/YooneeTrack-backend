const Router = require('express').Router
const UserController = require('../Controllers/UserController')
const router = new Router()


router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/logout', UserController.login)
router.get('/activate/:link', UserController.activate)
router.get('/refresh', UserController.refresh)
router.get('/users', UserController.getUsers)

module.exports = router