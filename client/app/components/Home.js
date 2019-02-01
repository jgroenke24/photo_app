import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Navbar from './Navbar';
import Photos from './Photos';
import Photo from './Photo';
import Dashboard from './Dashboard';
import Hero from './Hero';
import UploadBox from './UploadBox';
import { AppContext } from './AppContext';

class Home extends Component {
  static contextType = AppContext;
  
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Header>
          <Navbar />
        </Header>
        
        {this.context.uploadBoxIsOpen && <UploadBox />}
        
        <main>
          
          <Switch>
            <Route
              exact
              path={match.path}
              render={() => (
                <Fragment>
                  <Hero />
                  <Photos/>
                </Fragment>
              )}
            />
            <Route path={`${match.path}photos/:photoId`} component={Photo} />
            <Route path='/dashboard' component={Dashboard} />
            <Route render={() => <div>NOT FOUND</div>} />
          </Switch>
        </main>
      </Fragment>
    );
  }
}

export default Home;