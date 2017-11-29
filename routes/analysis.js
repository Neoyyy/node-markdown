var express = require("express");
var router = express.Router();

router.route("/anal")
    .get(function (req,res) {
        res.send("analysis  /anal")
    });


module.exports = router;