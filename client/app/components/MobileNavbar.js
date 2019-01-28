import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppConsumer } from './AppContext';

const MobileNavbar = (props) => (
  <AppConsumer>
    {({ isLoggedIn }) => (
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
          <li>
            <NavLink activeClassName='activelinks' to='/dashboard'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <rect x='3' y='3' width='18' height='18' rx='2' ry='2'/>
                <path d='M9 3v18'/>
              </svg>
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName='activelinks' to='/upload'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'/>
              </svg>
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName='activelinks' to='/search'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='11' cy='11' r='8'/>
                <path d='M21 21l-4.35-4.35'/>
              </svg>
            </NavLink>
          </li>
          
          {isLoggedIn &&
            <li>
              <NavLink activeClassName='activelinks' to='/profile'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/>
                  <circle cx='12' cy='7' r='4'/>
                </svg>
              </NavLink>
            </li>
          }
        </ul>
      </nav>
    )}
  </AppConsumer>
);

export default MobileNavbar;