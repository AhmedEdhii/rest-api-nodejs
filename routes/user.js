const express = require("express")
const { signup, signin, signout, viewProfile } = require("../controllers/user")
const auth = require("../middlewares/authentication");
const {check} = require('express-validator')
const router = express.Router()

router.post('/signup', [
    check("name", "Name should be atleast 3 characters").isLength({min: 3}),
    check("email", "Email Address should be valid").isEmail(),
    check("password", "Password should be atleast 8 characters").isLength({min: 8}),
], signup)

router.post('/signin', signin)

router.get('/profile', auth, viewProfile)

router.get('/signout', signout)

module.exports = router
