import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import Navbar from './Navbar';
import Photos from './Photos';
import Photo from './Photo';
import Login from './Login';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Photos} />
        <Route path='/photos/:photoId' component={Photo} />
        <Route path='/login' component={Login} />
      </Fragment>
    );
  }
}

export default App;