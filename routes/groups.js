const express = require("express");
const Group = require("../models/Group");
const Court = require("../models/Court");
const User = require("../models/User");
const Message = require("../models/Message");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      res.status(200);
      const groups = await Group.find();
      if (!groups.length) { 
        res.status(404);
		res.json({Message:"No groups to show"})
      } else {
        res.json(groups);
      }
    } catch (err) {
      res.status(400);
      res.json({ message: err });
    }
  });
  router.get("/:groupId", async (req, res) => {
	try {
	  res.status(200);
	  const group = await Group.findById(req.params.groupId);
	  if (group === null) {
		res.status(404);
		res.json({Message:"There is no group with given ID"});
	  } else {
		res.json(group);
	  }
	} catch (err) {
	  res.status(404);
	  res.json({ message: err });
	}})
router.post('/:userId/:courtId', async (req,res) =>{
	let {userId, courtId} = req.params;
	try {
		const group = new Group({
			sport: req.body.sport,
			equipment: req.body.equipment,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			appointmentTime: new Date(req.body.appointmentTime),
			maxParticipants: req.body.maxParticipants,
			ownerId: [userId],
			participants: [userId],
			courtId: courtId,
		});
	  
		const savedGroup = await group.save();
		await Court.findByIdAndUpdate(
			courtId,
	
			{ $push: { groups: savedGroup._id } },{useFindAndModify:false},
		  );
		  await User.findByIdAndUpdate(
			userId,
			{ $push: { groups: savedGroup._id } },{useFindAndModify:false},
		  );
	
		  res.status(201).json(savedGroup);
	  }
	  catch (err) {
		res.status(404);
		res.json({ message: err });
	  }
})
router.delete("/:groupId", async (req, res) =>{
	let {groupId} = req.params;
	try {
	  const group = await Group.findById(groupId);
	  const courtId = group.courtId
	  const usersIds = group.participants;
	  const messagesId = group.messages;
	  await Court.findByIdAndUpdate(
		courtId,
		{ $pull: { groups: { $in: [ groupId ] }} },{useFindAndModify:false},
	  );
	  for(const userId of usersIds){
		await User.findByIdAndUpdate(
			userId,
			{ $pull: { groups: { $in: [ groupId ] }} },{useFindAndModify:false},
		  );
	  }
	  for(const messageId of messagesId){
		await Message.deleteOne({ _id: messageId });
	  }
	  const removedGroup = await Group.deleteOne({ _id: groupId });
	  if (removedGroup.deletedCount === 0) {
		res.status(404);
		res.json({Message:"Group was not found"});
	  } else {
		res.status(204).json(removedGroup);
	  }
	} catch (error) {
	  res.status(404);
	  res.json({ Message: error });
	}
  });
  router.patch("/join/:groupId/:userId", async (req,res) =>{
	  const {groupId,userId} = req.params;
	  try{
		res.status(202);
		const group = await Group.findById(groupId);
		if(group.participants.length === group.maxParticipants){
			res.status(400);
			res.json({Message: "Max participants reached"})
		}
		else if(group.participants.includes(userId)){
			res.status(400);
			res.json({Message: "You are already subscribed to this event"})
		}
		else{
		await User.findByIdAndUpdate(
		userId,
		{ $push: { groups: groupId } },{useFindAndModify:false},
		)
	  const updatedGroup = await Group.updateOne(
		  {_id: groupId},
		  	{$set:{equipment:req.body.equipment},
			$push:{participants: userId}},{useFindAndModify:false},
	  )
	  if (updatedGroup.n === 0) {
		res.status(404);
		res.json({Message:"Group was not found"});
	  } else if (updatedGroup.nModified === 0) {
		res.json({Message:"No modifications was done"});
	  } else {
		res.json(updatedGroup);
	  }
	}
	} catch (error) {
	  res.status(404);
	  res.json({ Message: error });
	}
  })
  router.patch("/leave/:groupId/:userId", async (req, res)=>{
	const {groupId, userId} = req.params;
	try{
	  res.status(202);
	  await User.findByIdAndUpdate(
	  userId,
	  { $pull: { groups: groupId } },{useFindAndModify:false},
	  )
	const updatedGroup = await Group.updateOne(
		{_id: groupId},
		  {$pull:{participants: userId}},{useFindAndModify:false},
	)
	if (updatedGroup.n === 0) {
	  res.status(404);
	  res.json({Message:"Group was not found"});
	} else if (updatedGroup.nModified === 0) {
	  res.json({Message:"No modifications was done"});
	} else {
	  res.json(updatedGroup);
	}
  } catch (error) {
	res.status(404);
	res.json({ Message: error });
  }
})
router.get("/:groupId/getParticipants", async (req,res) =>{
	try{
	  res.status(200);
	const group = await Group.findById(req.params.groupId)
	  const participantsId = group.participants;
	  let participants =[];
	  for(const index in participantsId){
		  const user = await User.findById(_id=participantsId[index])
		  participants.push(user)
	  }
	  if(!participants.length){
		  res.status(404)
		  res.json({Message:"No participants to show"})
	  }
	  res.json(participants)
	}
	catch(err){
	  res.status(404);
	  res.json({ message: err });
	}
})
router.post("/:groupId/messages/:userId", async (req, res) =>{
	let {groupId, userId} = req.params;
	let {name, content} =  req.body;
	try {
		const message = new Message({
			groupId: groupId,
			writerId: userId,
			writer: name,
			content: content
		});
		const savedMessages = await message.save();
		await Group.findByIdAndUpdate(
			groupId,
			{ $push: { messages: savedMessages._id } },{useFindAndModify:false},
		  );
	
		  res.status(201).json(savedMessages);
	  }
	  catch (err) {
		res.status(404);
		res.json({ message: err });
	  }
})
router.get("/:groupId/messages", async (req,res) =>{
	try{
	  res.status(200);
	const group = await Group.findById(req.params.groupId)
	  const messagesId = group.messages;
	  let messages =[];
	  for(const index in messagesId){
		  const message = await Message.findById(_id=messagesId[index])
		  messages.push(message)
	  }
	  if(!messages.length){
		  res.status(404)
		  res.json({Message:"No participants to show"})
	  }
	  res.json(messages)
	}
	catch(err){
	  res.status(404);
	  res.json({ message: err });
	}
})
router.delete("/:groupId/messages/:messageId", async (req, res) =>{
	let {groupId, messageId} = req.params;
	try {
	  const message = await Message.findById(messageId);
	  await Group.findByIdAndUpdate(
		groupId,
		{ $pull: { messages: { $in: [ messageId ] }} },{useFindAndModify:false},
	  );
	  const removedGroup = await Message.deleteOne({ _id: messageId });
	  if (removedGroup.deletedCount === 0) {
		res.status(404);
		res.json({Message:"Group was not found"});
	  } else {
		res.status(204).json(removedGroup);
	  }
	} catch (error) {
	  res.status(404);
	  res.json({ Message: error });
	}
  });
module.exports = router;