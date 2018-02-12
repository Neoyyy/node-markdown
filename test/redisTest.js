var redis = require("../redis/redis")

redis.set("foo_rand000000000000", "???",function (error, res) {
    console.log(res)
});

// This will return a JavaScript String
redis.get("foo_rand000000000000", function (err, reply) {
    console.log(reply.toString()); // Will print `OK`
});