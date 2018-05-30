function commonResponse(code, msg, data){
	let result = {
		code : code,
		msg : msg,
		data : data
	}
	return result;
}


exports.commonResponse = commonResponse;