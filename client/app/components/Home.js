import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Navbar from './Navbar';
import Photos from './Photos';
import Photo from './Photo';
import Upload from './Upload';
import Dashboard from './Dashboard';
import { AppContext } from './AppContext';

class Home extends Component {
  render() {
    return (
      <Fragment>
        <Header>
          <Navbar />
        </Header>
        
        <main>
          <Switch>
            <Route
              exact
              path={this.props.match.path}
              render={() => <Photos/>}
            />
            <Route path='/photos/:photoId' component={Photo} />
            <Route path='/upload' component={Upload} />
            <Route path='/dashboard' component={Dashboard} />
          </Switch>
        </main>
      </Fragment>
    );
  }
}

export default Home;