import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { AppProvider, AppContext } from './AppContext';
import Home from './Home';
import Upload from './Upload';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ModalSwitch from './ModalSwitch';

class App extends Component {
  static contextType = AppContext;

  async componentDidMount() {
    if (!this.context.isLoggedIn) {
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
  }
  render() {
    return (
      <Fragment>
        <Router>
          <Route component={ModalSwitch} />
        </Router>
      </Fragment>
    );
  }
}

export default App;