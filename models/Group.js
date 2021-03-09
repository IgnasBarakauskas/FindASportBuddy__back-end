const mongoose = require("mongoose");
const Group = mongoose.Schema({
    sport:{
        type:String,
        required:true
    },
    equipment:{
        type:Boolean,
        required:true
    },
    latitude:{
        type:Number,
        required: true
    },
    longitude:{
        type:Number,
        required: true
    },
    appointmentTime:{
        type:Date,
        requied: true
    },
    maxParticipants:{
        type:Number,
        requied: true
    },
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})