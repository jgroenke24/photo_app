import React from 'react';
import { Link } from 'react-router-dom';

const MobileNavbar = (props) => (
  <nav className='mobilenav'>
    <ul className='mobilenav__links'>
      <li>
        <Link to='/'>
          Home
        </Link>
      </li>
      <li>
        <Link to='/dashboard'>
          Dash
        </Link>
      </li>
      <li>
        <Link to='/upload'>
          Upload
        </Link>
      </li>
      <li>
        <Link to='/search'>
          Search
        </Link>
      </li>
      <li>
        <Link to='/profile'>
          Profile
        </Link>
      </li>
    </ul>
  </nav>
);

export default MobileNavbar;