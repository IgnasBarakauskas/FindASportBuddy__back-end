const mongoose = require("mongoose");
const GroupSchema = mongoose.Schema({
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
	ownerId:{
		type: mongoose.Schema.Types.ObjectId,
        ref: "User"
	},
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
	courtId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Court"
    }
})

module.exports = mongoose.model("Group", GroupSchema);