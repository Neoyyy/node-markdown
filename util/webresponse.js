function createResult(code, msg, data){
	let result = {
		code : code,
		msg : msg,
		data : data
	}
	return result;
}


exports.createResult = createResult;