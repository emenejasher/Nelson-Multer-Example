const emailValidator = require("email-validator")
const jwt = require("jsonwebtoken")

const User = require('../models/userModel')
const utilities = require('../helpers/utilities')

const responseInfo = {
    status: "",
    message: ""
}

exports.signUpValidation = async (req, res, next) => {

    // req.body must not be empty
    if (!req.body) {
        responseInfo.status = "error"
        responseInfo.message = "User data not received. Please try again."

        res.json(responseInfo)
        return
    }

    // Email validation
    if (!emailValidator.validate(req.body.email)) {
        responseInfo.status = "error"
        responseInfo.message = "Email address is invalid. Please provide a valid email. Please try again."

        res.json(responseInfo)
        return
    }

    if(await utilities.emailExist(req.body.email)){
        responseInfo.status = "error"
        responseInfo.message = "Sorry! A user with this email address already exist. Please try another."

        res.json(responseInfo)
        return
     }


    // Name validation
    if (!req.body.firstName || !req.body.lastName) {
        responseInfo.status = "error"
        responseInfo.message = "Sorry! First name or last name cannot be empty. Please try again."

        res.json(responseInfo)
        return
    }

    // Phone validation
    if (!req.body.phone) {
        responseInfo.status = "error"
        responseInfo.message = "Sorry! First or last name cannot be empty. Please try again."

        res.json(responseInfo)
        return
    }

    // location validation
    if (!req.body.city) {
        responseInfo.status = "error"
        responseInfo.message = "Sorry! City cannot be empty. Please try again."

        res.json(responseInfo)
        return
    }

    try {
        if (req.file.filename) {
            const imageDirectory = '/uploads-directory/users-images/'  // Specified static directory; not absolute
            req.body.profileImage = imageDirectory+req.file.filename
        }
    }
    catch (e){
        console.log(e)
    }

    next()
}

// Authorization middleware
exports.auth = async (req, res, next) => {
    const token = req.headers.authorization;
    
    if (token) {
        try {
            const payload = await jwt.verify(token, process.env.JWT_SECRET)
            const userId = payload.userId
            if (payload) {
                req.user = await User.findById(userId);
                next()
                
            }
            else {
                res.status(400).json({
                    status: 'failed',
                    message:'Invalid Token'
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    else {
        res.status(401).json({
            status: 'failed!',
            message:'Unauthorized access!'
        })
    }
}

exports.createPropertyValidation = (req,res,next) => {
    const body = req.body;
    if (!body.title || !body.propertyType) {
        res.status(400).json({
            status: 'failed!',
            message:'A property must have a title and a type of property attribute'
        })
    }
    else {
        next();
    }
}



