import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import MobileNavbar from './MobileNavbar';

const Header = (props) => (
  <header className='header'>
    <MediaQuery minWidth={768}>
      {matches => {
        return matches
        ? (
            <Fragment>
              <Link to='/'>
                PicShareApp
              </Link>
                {props.children}
            </Fragment>
          )
        : <MobileNavbar />;
      }}
    </MediaQuery>
  </header>
);

export default Header;