import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AppConsumer } from './AppContext';

const UnderBar = (props) => (
  <AppConsumer>
    {({ isLoggedIn }) => (
      <Fragment>
        {isLoggedIn ? null : (
          <div className='authbar'>
            <Link className='authbar__btn' to='/login'>
              Login
            </Link>
            <Link className='authbar__btn authbar__btn--primary' to='/signup'>
              Signup
            </Link>
          </div>
        )}
      </Fragment>
    )}
  </AppConsumer>
);

export default UnderBar;