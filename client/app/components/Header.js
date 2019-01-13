import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import MobileNavbar from './MobileNavbar';
import UnderBar from './UnderBar';

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
        : (
          <Fragment>
            <MobileNavbar />
            <UnderBar />
          </Fragment>
        );
      }}
    </MediaQuery>
  </header>
);

export default Header;