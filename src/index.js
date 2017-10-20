let HEADERS = ['access-token', 'token-type', 'client', 'expiry', 'uid']

const tokenMiddleware = args => store => next => action => {
  if (!action)
    action = { type: '' }
  let { customHeaders = [], validateAction = 'VALIDATE_TOKEN',  logoutAction = 'LOGOUT', axios, native } = args;
  HEADERS = [...new Set([...HEADERS, ...customHeaders])]
  if (action.type === validateAction) {
    if (native)
      HEADERS.forEach( async (token) => axios.defaults.headers.common[token] = await AsyncStorage.getItem(token));
    else 
      HEADERS.forEach( token => axios.defaults.headers.common[token] = localStorage.getItem(token));
  } else if (action.type === logoutAction) {
    if (native)
      HEADERS.forEach( async (token) => await AsyncStorage.removeItem(token));
    else
      HEADERS.forEach( token => localStorage.removeItem(token));
  } else {
    let { headers } = action;
    if (headers) {
      if(headers['access-token']) {
        if (native){
          HEADERS.forEach( async (token) => {
            axios.defaults.headers.common[token] = headers[token];
              await AsyncStorage.setItem(token, headers[token])
          })
        }
        else {
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
