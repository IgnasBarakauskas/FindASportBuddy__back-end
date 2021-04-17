const mongoose = require("mongoose");
const MessageSchema = mongoose.Schema({
	groupId:{
		type: mongoose.Schema.Types.ObjectId,
		required:true
	},
	content:{
		type:String,
		required:true
	},
	writer:{
		type:String,
		required:true
	},
	writerId:{
		type:mongoose.Schema.Types.ObjectId,
		required:true
	}
})
module.exports = mongoose.model("Message", MessageSchema);