import React, { Component } from 'react';
import { Header, Button, Divider } from 'semantic-ui-react';
import { setHeaders } from '../actions/headers';
import { connect } from 'react-redux';
import axios from 'axios'

class Home extends Component {
  handleClick = () => {
    const { history, dispatch } = this.props;
    axios.get('/api/auth_test') 
      .then( res => {
        dispatch(setHeaders(res.headers))
        history.push('/authenticated')
      });
  }

  render() {
    return (
      <div>
        <Header as='h1' textAlign='center'>Home Component</Header>
        <Divider />
        <Button primary fluid onClick={() => this.handleClick(true) }>Authenticated Request</Button>
      </div>
    );
  }
}

export default connect()(Home);
