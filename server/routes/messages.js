const express = require("express");
router = express.Router();
const isAuth = require("../middleware/auth")
const {addMessage} = require("../controllers/messages")

router.post("/addMessage",isAuth, addMessage);

module.exports = router;