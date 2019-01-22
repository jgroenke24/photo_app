import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './Home';
import Upload from './Upload';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Modal from './Modal';
import Photo from './Photo';

class ModalSwitch extends Component {
  // We can pass a location to <Switch/> that will tell it to
  // ignore the router's current location and use the location
  // prop instead.
  //
  // We can also use "location state" to tell the app the user
  // wants to go to `/img/2` in a modal, rather than as the
  // main page, keeping the gallery visible behind it.
  //
  // Normally, `/img/2` wouldn't match the gallery at `/`.
  // So, to get both screens to render, we can save the old
  // location and pass it to Switch, so it will think the location
  // is still `/` even though its `/img/2`.
  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    let { location } = this.props;

    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    let { location } = this.props;

    let isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render

    return (
      <Fragment>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route path='/upload' component={Upload} />
          <Route path='/signup' component={Signup} />
          <Route path='/login' component={Login} />
          <Route path='/forgotpassword' component={ForgotPassword} />
          <Route path='/resetpassword/:token' component={ResetPassword} />
          <Route path='/' component={Home} />
        </Switch>
        {isModal ? <Route path='/upload' render={(props) => <Modal {...props} modalIsOpen={true} children={<Upload />} />} /> : null}
        {isModal ? <Route path='/signup' render={(props) => <Modal {...props} modalIsOpen={true} children={<Signup />} />} /> : null}
        {isModal ? <Route path='/login' render={(props) => <Modal {...props} modalIsOpen={true} children={<Login />} />} /> : null}
        {isModal ? <Route path='/photos/:photoId' render={(props) => <Modal {...props} modalIsOpen={true} children={<Photo />} />} /> : null}
      </Fragment>
    );
  }
}

export default ModalSwitch;