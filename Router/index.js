const Router = require('express').Router
const UserController = require('../Controllers/UserController')
const router = new Router()
const { body } = require('express-validator')
const AuthMiddleware = require('../Middleware/AuthMiddleware')


router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 5, max: 32}),
  UserController.registration)
router.post('/login', 
  body('login').isEmail(),
  body('password').isLength({min: 5, max: 32}),
  UserController.login)
router.post('/logout', UserController.logout)
router.get('/activate/:link', UserController.activate)
router.get('/refresh', UserController.refresh)
router.get('/users', AuthMiddleware, UserController.getUsers)

module.exports = router