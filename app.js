const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express();

const usersRoute = require("./routes/users");
const groupsRoute = require("./routes/groups");

app.use('/users', usersRoute)

app.use('/groups', groupsRoute)

app.get('/', (req,res) =>{
    res.send("Hello world!!!")
})

mongoose.connect(
 `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@findasportbuddy.ad0wh.mongodb.net/findASportBuddy?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected to DB")
  );

app.listen(3000)