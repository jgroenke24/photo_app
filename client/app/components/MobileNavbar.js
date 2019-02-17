import React, { Component, Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppContext } from './AppContext';

class MobileNavbar extends Component {
  static contextType = AppContext;
  
  handleUploadBoxOpen = () => {
    document.body.style.cssText = 'overflow: hidden; position: fixed;';
    this.context.changeToBoxOpen();
  }
  
  render() {
    return (
      <nav className='mobilenav'>
        <ul className='mobilenav__links'>
          <li>
            <NavLink activeClassName='activelinks' exact to='/'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/>
                <path d='M9 22V12h6v10'/>
              </svg>
            </NavLink>
          </li>
          
          {this.context.isLoggedIn ? (
            <Fragment>
              <li>
                <button
                  onClick={this.handleUploadBoxOpen}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <rect width='18' height='18' x='3' y='3' rx='2' ry='2'/>
                    <path d='M12 8v8M8 12h8'/>
                  </svg>
                </button>
              </li>
              {this.context.user &&
                <li>
                  <NavLink activeClassName='activelinks' to={`/users/${this.context.user.username}`}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/>
                      <circle cx='12' cy='7' r='4'/>
                    </svg>
                  </NavLink>
                </li>
              }
            </Fragment>
          ) : (
            <li>
              <NavLink activeClassName='activelinks' to='/login'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <rect width='18' height='18' x='3' y='3' rx='2' ry='2'/>
                  <path d='M12 8v8M8 12h8'/>
                </svg>
              </NavLink>
            </li>
          )}
          
          <li>
            <NavLink activeClassName='activelinks' to='/dashboard'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <rect x='3' y='3' width='18' height='18' rx='2' ry='2'/>
                <path d='M9 3v18'/>
              </svg>
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

export default MobileNavbar;