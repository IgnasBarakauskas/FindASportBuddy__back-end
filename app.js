const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const bodyParser = require("body-parser")
const usersRoute = require("./routes/users");
const groupsRoute = require("./routes/groups");
const cors =require(cors)
const PORT = process.env.PORT || 3000
const app = express();
app.disable("x-powered-by");
app.use(bodyParser.json())
app.use('/users', usersRoute)
app.use(cors());
app.use('/groups', groupsRoute)

app.get('/', (req,res) =>{
    res.send("Hello world!!!")
})
mongoose.connect(
 `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@findasportbuddy.ad0wh.mongodb.net/findASportBuddy?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected to DB")
  );

app.listen(PORT)