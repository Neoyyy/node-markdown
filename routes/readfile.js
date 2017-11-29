var express = require("express");
var router = express.Router();

router.route("/readfile")
    .get(function (req,res) {
        res.send("readfile  /readfile")
    });


module.exports = router;