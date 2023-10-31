const mongoose = require('mongoose');

const UserModelSchema = new mongoose.Schema({
    nickname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        required: true
    }
}, { timestamps: true, strict: true })

module.exports = mongoose.model("USER", UserModelSchema, "users");