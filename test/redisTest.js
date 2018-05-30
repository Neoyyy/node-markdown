var redis = require("../redis/redis")

redis.setAsync("foo_rand000000000000", "???").then(data =>{
    console.log(data)
}).catch(err =>{
    console.log(err)
});

// This will return a JavaScript String
// redis.get("foo_rand000000000000", function (err, reply) {
//     console.log(reply.toString()); // Will print `OK`
// });