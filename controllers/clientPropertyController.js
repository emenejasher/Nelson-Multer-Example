const Property = require("../models/propertyModel")
const utilities = require("../helpers/utilities")

const responseInfo = {
    status: "",
    message: ""
}

exports.getAllProperty = async (req, res) => {
    const body = req.body
    const limit = Number(body.noPerPage) || 10;
    const offset = Number(body.page - 1) * limit || 0;

    // If filters is passed
    const filterData = req.body.filterData;
    const newfilterData = {
        propertyStatus: "active"
    }

    if (!utilities.isEmptyObject(filterData)) {

        if (filterData.city) {
            newfilterData.city = utilities.mongoDBRegex(filterData.city)
        }
        if (filterData.propertyType) {
            newfilterData.propertyType = utilities.mongoDBRegex(filterData.propertyType)
        }
        if (filterData.numberOfRooms) {
            newfilterData.numberOfRooms = filterData.numberOfRooms
        }
        if (filterData.minPrice) {
            // Greater than or equal to the min price
            if (!(isNaN(filterData.minPrice))) {
                newfilterData.propertyPrice = {$gte: filterData.minPrice}
            }
        }
        if (filterData.maxPrice) {
            // Less than or equal to the max price
            if (!(isNaN(filterData.maxPrice))) {
                newfilterData.propertyPrice = {$lte: filterData.maxPrice}
            }
        }
    }

        try {

            const response = await Property.find(newfilterData)
            const responseCount = await Property.find(newfilterData).count()


            responseInfo.status = "success"
            responseInfo.message = "Query successful"
            responseInfo.count = responseCount
            responseInfo.data = response

            res.status(200).json(responseInfo)
        } catch (e) {
            console.log(e)
            responseInfo.status = "error"
            responseInfo.message = "Sorry! An error occurred while attempting to fetch properties. Please try again."
        }

}

//Fetch single property by ID
exports.getProperty = async (req, res) => {
    const id = req.params.id
    try {
        const property = await Property.findById(id)
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
            status: 'failed!',
            message: 'Please try again later!'
        })
    }
}