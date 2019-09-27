import React, { Component, Fragment, ReactNode } from 'react';
import { Navbar, Nav, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from './redux/actions/authActions.actions';

interface Props {
  isLoggedIn: boolean;
  history?: any;
  // logout(history?: any): () => void;
  logout(history?: any): any;
}

class Layout extends Component<Props> {
  onLogoutUser = () => {
    this.props.logout(this.props.history);
  };

  render() {
    return (
      <div>
        <Navbar bg='primary' variant='dark'>
          <Link to='/' className='navbar-dark navbar-brand'>
            Analytics
          </Link>
          <Nav className='mr-auto'>
            {this.props.isLoggedIn ? (
              <Fragment>
                <Link to='/' className='nav-link'>
                  Links
                </Link>
                <Link to='/create' className='nav-link'>
                  Create
                </Link>
              </Fragment>
            ) : (
              <Link to='/sign-up' className='nav-link'>
                Sign Up
              </Link>
            )}
          </Nav>
          {this.props.isLoggedIn ? (
            <Link
              to='/'
              style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}
              onClick={this.onLogoutUser}
            >
              Logout
            </Link>
          ) : (
            <Link
              to='/login'
              style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}
            >
              Login
            </Link>
          )}
        </Navbar>
        <Card
          style={{
            // topHeight: '15px',
            top: '15px',
            width: '85%',
            minHeight: '300px',
            height: 'auto',
            padding: '15px',
            marginTop: '25px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <Card.Body>{this.props.children}</Card.Body>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: state.Auth.isLoggedIn
});

const mapDispatchToProps = {
  logout: logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);