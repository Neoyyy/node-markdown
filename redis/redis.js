var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
    console.log("redis error:"+err);
});

client.auth("9203434AD6B5D8D1FB8BDA21983EE641C7EECEEBDBA8F0B16CB64DD5E5A43579");

module.exports = client;