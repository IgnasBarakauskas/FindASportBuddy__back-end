const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    fullName: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    birthdayDate:{
        type: Date,
        required:true
    },
    role:{
        type: String,
        required: true
    },
    height:{
        type:Number,
        required:false
    },
    weight:{
        type:Number,
        required:false
    },
    latitude:{
        type:Number,
        required:false
    },
    longitude:{
        type:Number,
        required:false
    },
    coordinatesUpdateDate:{
        type:Date,
        required:false
    },
    groups:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }]
})

module.exports = mongoose.model("Users", UserSchema);