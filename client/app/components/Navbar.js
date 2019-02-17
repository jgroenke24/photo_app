import React, { Component, Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppContext } from './AppContext';

class Navbar extends Component {
  static contextType = AppContext;
  
  handleUploadBoxOpen = () => {
    this.context.changeToBoxOpen();
  }
  
  handleUploadBoxClose = () => {
    this.context.changeToBoxClosed();
  }
  
  render() {
    return (
      <Fragment>
        <nav className='navbar' >
          <ul className='navbar__links'>
            <li className='navbar__item'>
              <NavLink to='/dashboard' className='navbar__link' activeClassName='activelinks'>
                Dashboard
              </NavLink>
            </li>
            
            {this.context.isLoggedIn ? (
              <Fragment>
                <li className='navbar__item'>
                  <button
                    className='navbar__upload'
                    onClick={this.context.uploadBoxIsOpen ? this.handleUploadBoxClose : this.handleUploadBoxOpen}
                  >
                    Upload
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24'>
                      <rect width='18' height='18' x='3' y='3' rx='2' ry='2'/>
                      <path d='M12 8v8M8 12h8'/>
                    </svg>
                  </button>
                </li>
                {this.context.user &&
                  <li className='navbar__item'>
                    <NavLink to={`/users/${this.context.user.username}`} className='navbar__link' activeClassName='activelinks'>
                      Profile
                    </NavLink>
                  </li>
                }
              </Fragment>
            ) : (
              <Fragment>
                <li className='navbar__item'>
                  <NavLink
                    to={{
                      pathname: '/login',
                      state: { modal: true },
                    }}
                    className='navbar__upload'
                    activeClassName='activelinks'
                  >
                    Upload
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24'>
                      <rect width='18' height='18' x='3' y='3' rx='2' ry='2'/>
                      <path d='M12 8v8M8 12h8'/>
                    </svg>
                  </NavLink>
                </li>
                <li className='navbar__item'>
                  <NavLink
                    to={{
                      pathname: '/login',
                      state: { modal: true },
                    }}
                    className='navbar__link'
                    activeClassName='activelinks'
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
      </Fragment>
    );
  }
}

export default Navbar;