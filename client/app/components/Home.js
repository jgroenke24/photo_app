import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Navbar from './Navbar';
import Photos from './Photos';
import Photo from './Photo';
import Dashboard from './Dashboard';
import Hero from './Hero';
import { AppContext } from './AppContext';

class Home extends Component {
  render() {
    return (
      <Fragment>
        <Header>
          <Navbar />
        </Header>
        
        <main>
          <Hero />
          <Switch>
            <Route
              exact
              path={this.props.match.path}
              render={() => <Photos/>}
            />
            <Route path='/photos/:photoId' component={Photo} />
            <Route path='/dashboard' component={Dashboard} />
          </Switch>
        </main>
      </Fragment>
    );
  }
}

export default Home;