let HEADERS = ['access-token', 'token-type', 'client', 'expiry', 'uid']

const async setTokens = (headers, axios) => {
  for (token of headers) {
    axios.defaults.headers.common[token] = headers[token];
    await AsyncStorage.setItem(token, headers[token])
  }
}

const async getTokens = (headers, axios) => {
  for (token of headers) {
    axios.defaults.headers.common[token] = headers[token];
    await AsyncStorage.getItem(token, headers[token])
  }
}

const async clearTokens = (headers) => {
  for (token of headers) {
    await AsyncStorage.getItem(token, headers[token])
  }
}

const tokenMiddleware = args => store => next => action => {
  if (!action)
    action = { type: '' }
  let { customHeaders = [], validateAction = 'VALIDATE_TOKEN',  logoutAction = 'LOGOUT', axios, native } = args;
  HEADERS = [...new Set([...HEADERS, ...customHeaders])]
  if (action.type === validateAction) {
    if (native)
      getTokens(headers, axios);
    else 
      HEADERS.forEach( token => axios.defaults.headers.common[token] = localStorage.getItem(token));
  } else if (action.type === logoutAction) {
    if (native)
      clearTokens(headers);
    else
      HEADERS.forEach( token => localStorage.removeItem(token));
  } else {
    let { headers } = action;
    if (headers) {
      if(headers['access-token']) {
        if (native){
          setTokens(headers)
        } else {
          HEADERS.forEach( token => {
            axios.defaults.headers.common[token] = headers[token];
            localStorage.setItem(token, headers[token])
          })
        }
      }
    }
  }
  return next(action)
}

export default tokenMiddleware
