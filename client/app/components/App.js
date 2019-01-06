import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import Navbar from './Navbar';
import Photos from './Photos';
import Photo from './Photo';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Upload from './Upload';
import ForgotPassword from './ForgotPassword';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Photos} />
        <Route path='/photos/:photoId' component={Photo} />
        <Route path='/signup' component={Signup} />
        <Route path='/login' component={Login} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/upload' component={Upload} />
        <Route path='/forgotpassword' component={ForgotPassword} />
      </Fragment>
    );
  }
}

export default App;