import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from './AppContext';
import ModalSwitch from './ModalSwitch';

class App extends Component {
  static contextType = AppContext;

  async componentDidMount() {
    if (!this.context.isLoggedIn) {
      const response = await axios
        .get(
          '/api/',
          {
            withCredentials: true,
          }
        );

      const { user } = response.data;

      if (user) {
        this.context.changeToLoggedIn();
        this.context.addUser(user);
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