const mongoose = require ('mongoose')

const TaskModelSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },
    category:{
        type: String,
        required: true
    },
    deadLine:{
        type: Date,
        required: false
    },
    urgency:{
        type: String,
        enum: ["low", "mid", "high", "extreme"],
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    }
}, {timestamps: true, strict: true})

module.exports = mongoose.model("TASK", TaskModelSchema, "tasks")