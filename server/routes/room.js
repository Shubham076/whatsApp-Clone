const express = require("express");
router = express.Router();
const isAuth = require("../middleware/auth")
const {addRoom , getRooms , updateRoom} = require("../controllers/room")

router.post("/addRoom", isAuth, addRoom);
router.post("/getRooms" ,isAuth, getRooms)
router.put("/updateRoom" ,isAuth, updateRoom)

module.exports = router;