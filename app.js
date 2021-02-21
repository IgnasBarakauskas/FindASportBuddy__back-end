const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
require("dotenv").config()

// const cors = require("cors");
const usersRoute = require("./routes/users");
const groupsRoute = require("./routes/groups");

var PORT = process.env.PORT || 3000;

const app = express();
app.disable("x-powered-by");
// app.use(cors());
app.use(bodyParser.json())

app.use('/users', usersRoute)

app.use('/groups', groupsRoute)

app.get('/', (req,res) =>{
    res.send("Hello world!!!")
})

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected to DB")
  );

app.listen(PORT)