const express = require("express"),
      bodyParser = require("body-parser"),
      cors = require('cors'),
      compression = require("compression"),
      morgan = require("morgan"),
      helmet = require("helmet"),
      mongoose = require("mongoose")
      port = process.env.PORT || 4000;
      app = express();
const authRoutes = require("./routes/auth")
const roomRoutes = require("./routes/room")
const messageRoutes = require("./routes/messages")
require("dotenv").config();


app.use(cors());
// app.use(morgan("tiny"));
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());

// routes
app.use(authRoutes);
app.use(roomRoutes);
app.use(messageRoutes)

app.use((req,res,next) => {
    let error  = new Error("Not found");
    error.status  = 404;
    next(error);
})

// global error handler
app.use((err,req,res,next) => {
    return res.status(err.status || 500).json({message:err.message || "Something went wrong"})
})

// db triggers
const db = require("./triggers/room").init();

mongoose.connect(process.env.DB , {useNewUrlParser:true , useUnifiedTopology:true})
.then(() => {
    const server = app.listen(port  , () => {
        console.log("Connect to the database");
        console.log(`Server has started to port:${port}`);
    })
    
    const io = require("./socket").init(server)
})
.catch(err =>{
    console.log(err);
})


