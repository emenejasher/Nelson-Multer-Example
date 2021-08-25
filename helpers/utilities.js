const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const multer = require('multer')
const User = require('../models/userModel')

const bcryptSalt = 10

exports.isCorrectPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

exports.generateToken = async (userId) => {
    return await jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
}

// Hash password
exports.hashPassword = async (plainPassword) => {
    const hashedPassword = await bcrypt.hash(plainPassword, bcryptSalt)

    if (hashedPassword) {
        return hashedPassword
    } else {
        return false
    }
}

// Compare hashed password
exports.compareHashedPassword = async (passwordToCompare, hashedPassword) => {
    return await bcrypt.compare(passwordToCompare, hashedPassword)
}

exports.paginationSkipValue = (currentPageNumber, noPerPage) => {
    return ((parseInt(currentPageNumber) - 1) * noPerPage);
}

//This is a global variable that holds the login state of the user
exports.isLoggedIn = false;


exports.isEmptyObject = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

//Mongodb regular expression for case insensitive query
exports.mongoDBRegex = (value) =>{
    return new RegExp("^" + value + "$", "i")
}

// Multer storage function for property images
exports.propertyFileStorageEngine = multer.diskStorage({
    destination: "./uploads/property-images/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

// Multer storage function for user profile image
exports.userFileStorageEngine = multer.diskStorage({
    destination: "./uploads/users-images/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

// check for unique email
 exports.emailExist = async (email) => {
    let found
    try {
        found = await User.findOne({email: email})
    } catch (error) {
        console.error(error);
    }
    if(found){
        return true
    } else {
        return false
    }
}