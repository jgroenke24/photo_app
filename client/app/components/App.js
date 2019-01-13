import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router>
          <AppProvider>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/signup' component={Signup} />
              <Route path='/login' component={Login} />
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