const express = require("express");
router = express.Router();
const isAuth = require("../middleware/auth")
const {addMessage , markMessagesRead} = require("../controllers/messages")

router.post("/addMessage",isAuth, addMessage);
router.put("/markRead",isAuth , markMessagesRead)

module.exports = router;