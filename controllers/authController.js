const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require("../models/userModel")
const util = require("../helpers/utilities")

const responseInfo = {
    status: "",
    message: ""
}

// Add new user
exports.addUser = async (req, res) => {

    const userData = req.body
    const hashedPassword = await util.hashPassword(userData.password)

    // organizing data before saving to db
    const newUser = {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        city: userData.city,
        profileImg:userData.profileImage,
        userStatus: "active",
        userRole: "agent"

    }

    // Adding the profile image if it exists
    if(req.body.profileImage) {
        newUser.profileImg = req.body.profileImage
    }

    try {
        const user = await User.create({...newUser})

        newUser.registeredDate = user.registeredDate
        newUser._id = user._id
        delete newUser.password

        //TODO: Modify res.status and supply appropriate status code
        if (user) {
            responseInfo.status = "success"
            responseInfo.message = "User account created successfully"
            responseInfo.data = newUser

            res.status(200).json(responseInfo)
        } else {
            responseInfo.status = "error"
            responseInfo.message = "Sorry! User account could not be created. Please try again"

            res.status(200).json(responseInfo)
        }
    } catch (error) {
        responseInfo.status = "error"
        responseInfo.message = "Sorry! Error occurred while attempting to create user account. Please try again."

        res.status(200).json(responseInfo)
    }
}

exports.signin = async (req, res) => {

    const login = {email, password} = req.body;
    if (!email || !password) {
        res.status(400).json({
            status: 'failed!',
            message: 'Please enter email and password'
        })
    } else {
        try {

            const foundUser = await User.findOne({email})
            if (!foundUser) {
                res.status(404).json({
                    status: 'failed',
                    message: 'user not found!'
                })
            } else {

                if (await util.isCorrectPassword(password, foundUser.password)) {

                    const token = await util.generateToken(foundUser._id)
                    const {password, ...user} = foundUser.toObject()

                    res.status(200).json({
                        user,
                        token
                    })
                } else {
                    res.status(400).json({
                        status: 'failed',
                        message: 'Incorrect Password!'
                    })
                }

            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: 'failed',
                message: 'internal server error, please try again later'
            })
        }
    }
}
