import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Header from './Header';
import Navbar from './Navbar';
import Photos from './Photos';
import Photo from './Photo';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Upload from './Upload';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router>
          <AppProvider>
            <Header />
            <Switch>
              <Route exact path='/' component={Photos} />
              <Route path='/photos/:photoId' component={Photo} />
              <Route path='/signup' component={Signup} />
              <Route path='/login' component={Login} />
              <Route path='/dashboard' component={Dashboard} />
              <Route path='/upload' component={Upload} />
              <Route path='/forgotpassword' component={ForgotPassword} />
              <Route path='/resetpassword/:token' component={ResetPassword} />
            </Switch>
          </AppProvider>
        </Router>
      </Fragment>
    );
  }
}

export default App;