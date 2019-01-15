import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { AppProvider, AppContext } from './AppContext';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

class App extends Component {
  static contextType = AppContext;

  async componentDidMount() {
    const response = await axios
      .get(
        'https://webdevbootcamp-jorge-groenke.c9users.io:8081',
        {
          withCredentials: true,
        }
      );
    
    const { user } = response.data;
    
    if (user) {
      this.context.changeToLoggedIn();
    }
  }
  render() {
    return (
      <Fragment>
        <Router>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/signup' component={Signup} />
            <Route path='/login' component={Login} />
            <Route path='/forgotpassword' component={ForgotPassword} />
            <Route path='/resetpassword/:token' component={ResetPassword} />
          </Switch>
        </Router>
      </Fragment>
    );
  }
}

export default App;