const express = require("express")
const { signup, signin, signout, getprofile, checkRole} = require("../controllers/user")
const {verifyToken} = require("../middlewares/authentication");
const {check} = require('express-validator')
const router = express.Router()

// router.post('/signup', [
//     check("name", "Name should be atleast 3 characters").isLength({min: 3}),
//     check("email", "Email Address should be valid").isEmail(),
//     check("password", "Password should be atleast 8 characters").isLength({min: 8}),
// ], signup)

//router.post('/signin', signin)

//  Admin Login Route
router.post("/admin/signin", (req, res) => {
    signin(req, "admin", res);
  });

//  Student Login Route
router.post("/signin/student", (req, res) => {
    signin(req, "student", res);
  });


//  Teacher Login Route
router.post("/signin/teacher", (req, res) => {
    signin(req, "teacher", res);
  });


//  Register students and teachers
router.post("/admin", (req, res, next) => {verifyToken(req, "admin", res, next)},  [
    check("name", "Name should be atleast 3 characters").isLength({min: 3}),
    check("email", "Email Address should be valid").isEmail(),
    check("password", "Password should be atleast 8 characters").isLength({min: 8}),
], signup)

router.get('/admin/profile', (req, res, next) => {verifyToken(req, "admin", res, next)}, getprofile)

router.get('/student/profile', (req, res, next) => {verifyToken(req, "student", res, next)}, getprofile)

router.get('/teacher/profile', (req, res, next) => {verifyToken(req, "teacher", res, next)}, getprofile)

router.get('/signout', signout)

module.exports = router
