import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

const Authenticated = ({ user }) => (
  <div>
    <Header as="h1" textAlign="center">Welcome {user.email}</Header>
    <Link to="/">Go Back</Link>
  </div>
)

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Authenticated);
