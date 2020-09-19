const express = require("express");
app = express();
router = express.Router();
const isAuth = require("../middleware/auth")

router.get("/test" , isAuth , (req,res) => {
    return res.json({
        message:"Working"
    })
})

module.exports = router;