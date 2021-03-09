const mongoose = require("mongoose");

const CourtSchema = mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    ammountOfCourts:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    latitude:{
        type:Number,
        required:true,
    },
    longitude:{
        type:Number,
        required:true,
    },
    photo:{
        type:String,
        required:false
    }
})

module.exports = mongoose.model("Courts", CourtSchema);