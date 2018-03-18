const uuid = require('uuid/v4')

function createUUID() {
    return uuid();
}
exports.createUUID = createUUID;