function createResult(code, msg, data){
	let result = {
		code : code,
		message : msg,
		data : data
	}
	return result;
}


function createResponse(res,result){
	res.setHeader('Content-Type', 'application/json;charset=utf-8');
	res.send(result);
}

exports.createResponse = createResponse;
exports.createResult = createResult;