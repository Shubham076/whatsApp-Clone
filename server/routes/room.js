const express = require("express");
router = express.Router();
const isAuth = require("../middleware/auth")
const {addRoom , getRooms} = require("../controllers/room")

router.post("/addRoom", isAuth, addRoom);
router.post("/getRooms" ,isAuth, getRooms)

module.exports = router;