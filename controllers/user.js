const User = require("../models/user")
const { validationResult } = require('express-validator')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')


exports.signup = (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }
    const user = new User(req.body)
    user.save((err, newuser) => {
        if (err) {
            return res.status(400).json({
                error: "Unable to add user"
            })
        }
        return res.json({
            message: "Sign up successful",
            newuser
        })
    })
}


exports.signin = (req, role, res) => {
    const { email, password } = req.body

    User.findOne({ email }, (err, current_user) => {
        if (err || !current_user) {
            return res.status(400).json({
                error: "Email Address not found"
            })
        }
        // We will check the role
        if (current_user.role !== role) {
            return res.status(403).json({
                message: "Please make sure you are logging in from the right portal.",
                success: false
            });
        }
        // check if user's email and password are correct       
        if (!current_user.authenticate(password)) {
            return res.status(400).json({
                error: "Email Address or Password is incorrect"
            })
        }

        // generate a token 
        const token = jwt.sign({ _id: current_user._id, role: current_user.role }, process.env.TOKEN_KEY)

        //save token into a cookie, the token expires after a day
        res.cookie('token', token, { expire: new Date() + 1 })

        //send response
        const { _id, name, email } = current_user
        return res.json({
            message: "Signed in successfully",
            token,
            user: {
                _id,
                name,
                email
            }
        })
    })
}

exports.getprofile = (req, res) => {
    const { _id } = req.user
    User.findOne({ _id }, (err, current_user) => {
        const { _id, name, phonenumber, email } = current_user
        return res.status(200).json({
            message: "Route to User Profile Successful",
            user: {
                _id,
                name,
                phonenumber,
                email
            }
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie("token")
    return res.json({
        message: "User signed out successfully."
    })
}

exports.checkRole = roles => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();