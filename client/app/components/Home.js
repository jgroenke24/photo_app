import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Photos from './Photos';
import Photo from './Photo';
import Hero from './Hero';
import UploadBox from './UploadBox';
import Profile from './Profile';
import EditProfile from './EditProfile';
import NotFound from './NotFound';
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
            <Route exact path={`${match.path}users/:username`} component={Profile} />
            <Route path={`${match.path}users/:username/edit`} component={EditProfile} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </Fragment>
    );
  }
}

export default Home;