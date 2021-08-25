const express = require("express")
const multer = require('multer')
const Router = express.Router()

const middleware = require("../middlewares/middlewares")
const agentPropertyController = require("../controllers/agentPropertyController")
const utilities = require('../helpers/utilities')

const propertyUploads = multer({storage:utilities.propertyFileStorageEngine})
const validateProperty = middleware.createPropertyValidation
const auth = middleware.auth


// Agent routes
// Base: /agents/properties/
Router.get("/", auth, agentPropertyController.fetchAllProperties)

// Add new property
Router.post('/', propertyUploads.array('property-images'),  validateProperty, auth, agentPropertyController.addProperty)

// Fetch single property
Router.get('/:id', auth, agentPropertyController.getProperty)

// Update property
Router.put('/:id', auth, agentPropertyController.updatePropertyByID)

// Delete property
Router.delete("/:id",auth,agentPropertyController.removeProperty)

module.exports = Router;