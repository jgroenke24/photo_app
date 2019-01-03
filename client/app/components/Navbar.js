import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

class Navbar extends Component {
  render() {
    return (
      <header>
        <nav className='navbar navbar-expand-lg navbar-dark bg-primary fixed-top'>
          <Link className='navbar-brand' to='/'>
            PicShareApp
          </Link>
          <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
        
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav mr-auto'>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/'>
                  Home 
                  <span className='sr-only'>
                    (current)
                  </span>
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/upload'>
                  Upload
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/dashboard'>
                  Dashboard
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/login'>
                  Login
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/signup'>
                  Signup
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

export default Navbar;