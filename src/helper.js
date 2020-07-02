const MethodResponse = async (cb) => {
  let statusCode = 200;
  let body;
  const headers = {
    'Access-Control-Allow-Origin': '*'
  }

  try {
    const result = await cb();
    body = JSON.stringify(result);
  } catch(err) {
    console.log('error', err)
    statusCode = err.statusCode ? err.statusCode : 500;
    body = JSON.stringify({
      error: err.name || 'Exception',
      message: err.message || 'Unknown Error' 
    })
  }

  return {
    statusCode,
    headers,
    body
  }
}

const getUser = (headers) => {
  return {
    id: headers.app_user_id,
    name: headers.app_user_name
  }
}

exports.MethodResponse = MethodResponse;
exports.getUser = getUser;
