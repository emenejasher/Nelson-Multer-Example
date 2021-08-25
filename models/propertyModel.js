const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const propertySchema = mongoose.Schema({
    title: {type: String, required: true},
    propertyType: {type: String, required: true},
    propertyPrice: {type: Number, default: 0},
    propertyDescription: {type: String, required: true, default:""},
    numberOfRooms: {type: Number, default: 1},
    carPark: {type: Boolean, default: false},
    landmark: {type: String},
    city: {type: String, required: true},
    propertyImages: [String, {required: true}],
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    propertyStatus: {type: String, required: true, default: "active"},
    addedDate: {
        type: Date,
        default: Date.now()
    }
}, {versionKey: false});
propertySchema.plugin(mongoosePaginate)

const Property = mongoose.model('properties', propertySchema)

module.exports = Property