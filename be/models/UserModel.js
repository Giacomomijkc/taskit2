const mongoose = require('mongoose');

/*const UserModelSchema = new mongoose.Schema({
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

module.exports = mongoose.model("USER", UserModelSchema, "users");*/


const UserModelSchema = new mongoose.Schema({
   method: {
       type: String,
       enum: ['local', 'google'],
       required: true
   },
   verified: {
    type: Boolean,
    default: false,
    },
   nickname:{
       type: String,
       required: true
   },
   email:{
       type: String,
       required: true
   },
   password: {
       type: String,
       required: function() { return this.method === 'local'; } // Solo obbligatorio se il metodo è 'local'
   },
   avatar:{
       type: String,
       required: true
   }
}, { timestamps: true, strict: true });

module.exports = mongoose.model("USER", UserModelSchema, "users");
