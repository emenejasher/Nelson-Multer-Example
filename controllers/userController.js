const User = require("../models/userModel")
const util = require("../helpers/utilities");

const responseInfo = {
    status: "",
    message: ""
}

// Fetch User By ID
exports.getUser = async (req, res) => {
    const id = req.params.id;
    let foundUser;
    try {
        foundUser = await User.findById(id);
        foundUser.password = null
        if (foundUser) {
            res.status(200).json({
                status: 'Success!',
                user: foundUser
            })
        } else {
            res.status(404).json({
                status: 'failed!',
                message: 'User not found!'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'Failed!',
            message: 'An error occured! Please try again later!'
        })

    }
}


// Fetch Users
exports.fetchAllUsers = async (req, res) => {

    const newUserArray = []
    try {
        // Removing password from the array of users
        const userData = await User.find({userStatus: "active"});
        userData.map((user) => {
            user.password = "****"
            newUserArray.push(user)
        })


        responseInfo.status = "success"
        responseInfo.message = "Users data fetched successfully"
        responseInfo.data = newUserArray

        res.status(200).json(responseInfo)
    } catch (e) {

        responseInfo.status = "error"
        responseInfo.message = "Sorry! An error occurred. Please try again."

        res.status(200).json(responseInfo)
    }
}

// Update user
exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const currentUserId = req.user._id
    if (id != currentUserId) {
        res.status(401).json({
            status: 'failed',
            message: 'You are currently unauthorized to access this resource'
        })
    } else {
        const update = req.body
        if (!update) {
            res.status(400).json({
                status: 'failed',
                message: 'Nothing to update'
            })
        } else {
            try {
                const response = await User.findByIdAndUpdate(id, {...update}, {new: true})
                if (!response) {
                    res.status(400).json({
                        status: 'Failed!',
                        message: 'This user is not found'
                    })
                } else {
                    const {password, ...userDetails} = response.toObject()
                    res.status(200).json({
                        status: 'Successful',
                        user: userDetails
                    })
                }
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    status: 'failed',
                    message: ' Oops! Something went wrong!'
                })
            }
        }
    }
}

// Modify password
exports.modifyPassword = async (req, res) => {

    const currentUser = req.user;
    const id = currentUser._id;

    //Get the current, new and confirmPassword  from the user
    let {oldPassword, password, confirmPassword} = req.body
    if (!oldPassword || !password || !confirmPassword) {
        res.status(400).json({
            status: "failed",
            message: 'Incomplete entry'
        })
    } else {
        // Check if the new password and the confirm password are the same
        if (password !== confirmPassword) {
            res.status(400).json({
                status: 'failed',
                message: 'New password and confirm password does not match'
            })
        } else {
            console.log(currentUser.password)
            // Check if the old password is correct
            if (await util.isCorrectPassword(oldPassword, currentUser.password)) {
                try {
                    //Encrypt the new password
                    const hashedPassword = await util.hashPassword(password)

                    if (hashedPassword) {
                        password = hashedPassword;
                        // Find and update the user
                        const response = await User.findByIdAndUpdate(id, {password})
                        res.status(200).json({
                            status: 'Successful!'
                        })
                    }
                } catch (error) {
                    console.log(error)
                    res.status(500).json({
                        status: 'Failed!',
                        message: 'Update failed!'
                    })
                }
            } else {
                res.status(400).json({
                    status: 'failed!',
                    message: 'Old password is incorrect!'
                })
            }
        }
    }
}

// Delete user by ID
exports.deleteUserById = async (req, res) => {
    const userid = req.params.id

    try {
        const user = await User.findById(userid)
        if (user) {

            // updating user status to deleted
            user.userStatus = "deleted"
            const deleteUser = user.save()

            if (deleteUser) {
                responseInfo.status = "success"
                responseInfo.message = "User deleted successfully!"
                res.status(200).json(responseInfo)

            } else {

                responseInfo.status = "error"
                responseInfo.message = "Sorry! Could not delete users. Please try again."
                res.status(200).json(responseInfo)
            }

        } else {
            responseInfo.status = "error"
            responseInfo.message = "Sorry! User with this ID does not exist in our database."
            res.status(200).json(responseInfo)
        }
    } catch (err) {
        responseInfo.status = "error"
        responseInfo.message = "Sorry! User with this ID not found. Please try again"
        res.status(200).json(responseInfo)
    }
}

// Forgot password
exports.forgotPassword = (req, res) => {
    res.send("Forgot password work-in-progress...")
}
