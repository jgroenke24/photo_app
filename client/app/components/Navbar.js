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
                  <NavLink to='/'>
                    Home
                  </NavLink>
                </li>
                <li className='navbar__item'>
                  <NavLink to='/upload'>
                    Upload
                  </NavLink>
                </li>
                <li className='navbar__item'>
                  <NavLink to='/dashboard'>
                    Dashboard
                  </NavLink>
                </li>
                
                {isLoggedIn ? (
                  <Fragment>
                    <li className='navbar__item'>
                      <NavLink to='/user'>
                        User Profile
                      </NavLink>
                    </li>
                  </Fragment>
                ) : (
                  <Fragment>
                    <li className='navbar__item'>
                      <NavLink to='/login'>
                        Login
                      </NavLink>
                    </li>
                    <li className='navbar__item'>
                      <NavLink to='/signup'>
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