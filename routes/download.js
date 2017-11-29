var express = require("express");
var router = express.Router();

router.route("/down")
    .get(function (req,res) {
        res.send("download  /down")
    });

module.exports = router;