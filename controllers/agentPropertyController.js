const Property = require('../models/propertyModel');
const utilities = require("../helpers/utilities")

const responseInfo = {
    status: "",
    message: ""
}

exports.addProperty = async (req, res) => {
    const propertyData = req.body;

    if (!(req.files.length > 0)) {
        res.status(400).json({
            status: 'error',
            message: 'Sorry! You must upload at least one property image. Please try again.'
        })
    }


    const imageDirectory = '/uploads-directory/property-images/'  // Specified static directory; not absolute
    let imageArray = [];
    req.files.forEach((propertyImageObject) => {
        imageArray.push(imageDirectory+propertyImageObject.filename)
    })

    // const property = req.body;
    const currentUserId = req.user._id;

    propertyData.propertyImages = imageArray
    propertyData.userId = currentUserId;
    propertyData.propertyStatus = "active";

    try {
        const response = await Property.create({...propertyData})
        if (response) {
            res.status(201).json({
                status: 'success',
                message: 'Property created successfully!'
            })
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Operation failed!, include appropriate parameters and try again!'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "error!",
            message: "Please try again later!"
        })
        console.log(error)
    }
}

// Fetch all properties - pagination
exports.fetchAllProperties = async (req, res) => {

    let paginationRequested

    if (utilities.isEmptyObject(req.body)) {
        paginationRequested = false
    } else {
        paginationRequested = true
    }

    try {
        let propertyData

        if (!paginationRequested) {
            propertyData = await Property.find({propertyStatus: "active", userId: req.user._id});
        } else {
            const currentPageNumber = req.body.currentPageNumber
            const noPerPage = req.body.noPerPage

            propertyData = await Property.find({
                propertyStatus: "active",
                userId: req.user._id
            }).skip(utilities.paginationSkipValue(currentPageNumber, noPerPage)).limit(noPerPage);
        }
        if (propertyData) {

            responseInfo.status = "success"
            responseInfo.message = "Properties fetched successfully"
            responseInfo.data = propertyData
        } else {
            console.log(e)
            responseInfo.status = "error"
            responseInfo.message = "Sorry! Couldn't fetch properties. Please try again."

            res.status(200).json(responseInfo)
        }

        res.status(200).json(responseInfo)
    } catch (e) {

        console.log(e)
        responseInfo.status = "error"
        responseInfo.message = "Sorry! An error occurred while attempting to fetch properties. Please try again."

        res.status(200).json(responseInfo)
    }
}


// Fetch Agent's Property By ID
exports.fetchPropertyByID = async (req, res) => {

    const propertyID = req.params.propertyId

    try {
        const foundProperty = await Property.find({_id: propertyID, userId: req.user._id})

        if (foundProperty) {

            responseInfo.status = "success"
            responseInfo.message = "Property found."
            responseInfo.data = foundProperty

            res.status(200).json(responseInfo)
        } else {
            responseInfo.status = "error"
            responseInfo.message = "Sorry! No property found with this ID."

            res.status(200).json(responseInfo)
        }
    } catch (err) {

        responseInfo.status = "error"
        responseInfo.message = "Sorry! User with this ID not found. Please try again"

        res.status(200).json(responseInfo)
    }
}

// Update Agent's property by ID
exports.updatePropertyByID = async (req, res) => {
    const propertyId = req.params.id;
    const passedPropertyData = req.body

    try {
        const updateData = await Property.findOneAndUpdate({
            _id: propertyId,
            userId: req.user._id
        }, {...passedPropertyData}, {new: true})
        if (updateData) {

            responseInfo.status = "success"
            responseInfo.message = "Property info updated successfully!"
            responseInfo.data = updateData

            res.status(200).json(responseInfo)
        } else {
            responseInfo.status = "error"
            responseInfo.message = "Sorry, Property with this ID could not be found on our database"

            res.status(200).json(responseInfo)
        }
    } catch (error) {
        responseInfo.status = "error"
        responseInfo.message = "Sorry, An error occurred while attempting to update property"

        res.status(200).json(responseInfo)
    }
}

// Fetch Agent's property by ID
exports.getProperty = async (req, res) => {
    const id = req.params.id

    const userId = req.user._id

    try {
        const property = await Property.find({_id: id, userId})
        if (property) {
            res.status(200).json({
                status: 'Success',
                property
            })
        } else {
            res.status(404).json({
                status: 'failed!',
                message: `property ${id} not found`
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error!',
            message: 'Please try again later!'
        })
    }
}

// Delete Agent's Property by ID
exports.removeProperty = async (req, res) => {
    const userId = req.user._id;
    const id = req.params.id;
    try {
        let property = await Property.findByIdAndUpdate(id, {propertyStatus: "deleted"}, {new: true})
        if (property) {
            if (property) {
                res.status(200).json({
                    status: "Success!",
                    mesage: "Property deleted successfully!"
                })
            }
        } else {
            res.status(404).json({
                status: "failed!",
                message: `Property ${id} not found!`
            })
        }
    } catch (error) {
        console.log(error)
        res.status.json({
            status: 'error',
            message: 'Please try again later'
        })
    }
}