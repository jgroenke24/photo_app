import React, { Component, Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppConsumer } from './AppContext';

class Navbar extends Component {
  render() {
    return (
      <Fragment>
        <AppConsumer>
        
          {({ isLoggedIn }) => (
            <nav className='navbar' >
              <ul className='navbar__links'>
                <li className='navbar__item'>
                  <NavLink
                    to={{
                      pathname: '/upload',
                      state: { modal: true },
                    }}
                    className='navbar__link'
                  >
                    Upload
                  </NavLink>
                </li>
                <li className='navbar__item'>
                  <NavLink to='/dashboard' className='navbar__link'>
                    Dashboard
                  </NavLink>
                </li>
                
                {isLoggedIn ? (
                  <Fragment>
                    <li className='navbar__item'>
                      <NavLink to='/user' className='navbar__link'>
                        User Profile
                      </NavLink>
                    </li>
                  </Fragment>
                ) : (
                  <Fragment>
                    <li className='navbar__item'>
                      <NavLink
                        to={{
                          pathname: '/login',
                          state: { modal: true },
                        }}
                        className='navbar__link'
                      >
                        Login
                      </NavLink>
                    </li>
                    <li className='navbar__item'>
                      <NavLink
                        to={{
                          pathname: '/signup',
                          state: { modal: true },
                        }}
                        className='btn navbar__btn--primary'
                      >
                        Signup
                      </NavLink>
                    </li>
                  </Fragment>
                )}
              </ul>
            </nav>
          )}
        </AppConsumer>
      </Fragment>
    );
  }
}

export default Navbar;