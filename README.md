# About

This package fits a very specific use case.  It's purpose is to keep help keep track of new tokens everytime a request is made.  It works by capturing the dispatch and updating the axios config with the new headers recieved from devise.  There is also a validate token option as well as a logout option.

 * You are using devise token authentiation
 * You are using axios
 * You are using redux
 
# Installation
```npm install redux-devise-axios```

store.js

```
import { createStore, compose, applyMiddleware } from 'redux';

//This could be saga or promise or any other async middleware
import thunk from 'redux-thunk';

import apiMiddleware from 'redux-devise-axios';

import rootReducer from './reducers/index';
import axios from 'axios';


/* OPTIONS
  axios: Your axios instance *required
  customHeaders: An array of headers you want to add.  Defaults: ['access-token', 'token-type', 'client', 'expiry', 'uid']
  validateAction: default 'VALIDATE_TOKEN'
  logoutAction: default 'LOGOUT'
*/
const options = { axios }


//redux-devise-axios middleware must come after your async middleware
const enhancers = compose(
  applyMiddleware(thunk, apiMiddleware(options)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(rootReducer, {}, enhancers);
```


# Options
* axios: This is your instance of axios and is required
* customHeaders: Array of additional Headers you want to use 
  * default: ['access-token', 'token-type', 'client', 'expiry', 'uid'] This is what devise sends by default
* validateAction: This is the action you dispatch in an HOC (Usually because the user refreshed the browser)
  * default: 'VALIDATE_TOKEN'
* logoutAction: This is the action you dispatch to logout your user.
  * default: 'LOGOUT'

NOTE: You are resposible for the implementation of LOGOUT and VALIDATE token.  These actions simply add to and clear localStorage.

# Example Usage

actions/auth.js
```
import axios from 'axios';
import { setFlash } from '../actions/flash';

export const registerUser = (email, password, passwordConfirmation, history) => {
  return(dispatch) => {
    axios.post('/api/auth', { email, password, password_confirmation: passwordConfirmation })
      .then( res => {
        let { data: { data: user }, headers } = res;
        dispatch({ type: 'LOGIN', user, headers });
        history.push('/');
      })
      .catch( res => {
        const message = res.response.data.errors.full_messages.join(',');
        dispatch(setFlash(message, 'error'));
    });
  }
}

export const handleLogout = (history) => {
  return(dispatch) => {
    axios.delete('/api/auth/sign_out')
      .then( res => {
        dispatch({ type: 'LOGOUT' });
        dispatch(setFlash('Logged out successfully!', 'success'));
        history.push('/login');
      })
      .catch( res => {
        // TODO: handle errors for the client
        console.log(res);
      });
    }
}

export const handleLogin = (email, password, history) => {
  return(dispatch) => {
    axios.post('/api/auth/sign_in', { email, password })
      .then( res => {
        let { data: { data: user }, headers } = res
        dispatch({ type: 'LOGIN', user, headers });
        history.push('/');
      })
      .catch( res => {
        // TODO: handle errors for the client
        console.log(res);
      })
  }
}

export const validateToken = (cb = f => f) => {
  return (dispatch) => {
    dispatch({ type: 'VALIDATE_TOKEN' })
    let headers = axios.defaults.headers.common
    axios.get('/api/auth/validate_token', headers)
      .then( res => dispatch({ type: 'LOGIN', user: res.data.data }) )
      .catch(() => cb())
  }
}
```
Notice that we are sending the headers when we dispatch.  This is key to how this package works.  Anytime any action is dispatched with a key of headers axios headers will be updated.

This will work for React State as well as long as you dispatch some action with the res.headers from axios.

```
  componentDidMount() {
    axios.get('/api/bio')
      .then( res => {
        this.setState({ bio: res.data.body });
        this.props.dispatch(setHeaders(res.headers))
      })
      .catch( res => {
        console.log(`Bio GET Fail: ${res}`);
      });
  }
  ```
  
