const express = require("express")
const Router = express.Router()

const Property = require("../models/propertyModel")
const clientPropertyController = require('../controllers/clientPropertyController')

// clients property route
// Base: /properties/
Router.get('/', clientPropertyController.getAllProperty)

// Fetch property by ID
Router.get('/:id', clientPropertyController.getProperty)

module.exports = Router