const express = require("express")
const multer = require('multer')

const userController = require("../controllers/userController")
const middleware = require("../middlewares/middlewares")
const authController = require('../controllers/authController')
const utilities = require('../helpers/utilities')

const userUploads = multer({storage:utilities.userFileStorageEngine})

const Router = express.Router()
const responseInfo = {
    status: "",
    message: ""
}
 

// Fetch all users
Router.get("/", userController.fetchAllUsers);

// Fetch user by ID
Router.get("/:id", userController.getUser);

// Add new user
Router.post("/", userUploads.single('user-photo'), middleware.signUpValidation, authController.addUser)

// Update user
Router.put("/:id", middleware.auth, userController.updateUser)

// Delete user by ID param
Router.delete("/:id",  userController.deleteUserById)

// User sign in
Router.post("/signin", authController.signin);


// TODO: Work on forgot password route
// Forgot password
Router.post("/forgot-password", userController.forgotPassword)

// Modify password
Router.post("/modify-password", middleware.auth, userController.modifyPassword)


module.exports = Router