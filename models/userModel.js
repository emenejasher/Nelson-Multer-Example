const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phone: {type: String, required: false},
    location: {
        address: {type: String},
        city: {type: String, required: false},
        localGovernment: {type: String},
    },
    userStatus: {type: String, required: true},
    profileImg: {type: String },
    userRole: {type: String, required: true, default: 'agent'},
    registeredDate: {
        type: Date,
        default: Date.now()
    }
}, {versionKey: false});


const User = mongoose.model('users', userSchema)

module.exports = User