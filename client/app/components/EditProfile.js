import React, { Component, Fragment } from 'react';
import axios from 'axios';

class EditProfile extends Component {
  state = {
    loading: true,
    avatar: null,
    avatarFile: null,
    firstname: null,
    lastname: null,
    email: null,
    username: null,
    location: null,
    bio: null,
    errors: [],
    responseError: null,
    success: null,
  }
  
  showValidationError(element, message) {
    this.setState((prevState) => ({
      errors: [...prevState.errors, { element, message }]
    }));
  }
  
  clearValidationError(element) {
    const { errors } = this.state;
    this.setState(() => {
      return {
        errors: errors.filter(error => error.element !== element)
      };
    });
  }
  
  inputIsValid(element) {
    const { email, username } = this.state;
    
    if (element === 'email') {
      
      /*
        Check if the email is an accepted form of email.
        from https://emailregex.com/
      */
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email)) {
        this.showValidationError('email', 'You must enter a proper email');
        return;
      }
    } else if (element === 'username') {
      
      // Check if username is only letters, numbers or underscores
      const re = /^\w+$/;
      if (!re.test(username)) {
        this.showValidationError('username', 'Username can only contain letters, numbers and underscores');
        return;
      }
    }
  }
  
  handleFile = (event) => {
    const avatarFile = event.target.files[0];
    this.setState(() => {
      return {
        avatarFile,
      };
    });
  }
  
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState(() => {
      return {
        [name]: value,
      };
    });
  }
  
  handleBlur = (event) => this.inputIsValid(event.target.name);
  
  handleFocus = (event) => this.clearValidationError(event.target.name);
  
  handleSubmit = async (event) => {
    event.preventDefault();
    const { firstname, lastname, email, username, location, bio } = this.state;
    
    try {
      const response = await axios
        .put(
          `https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/users/${this.props.match.params.username}`,
          {
            firstname,
            lastname,
            email,
            username,
            location,
            bio,
          },
          {
            withCredentials: true,
          }
        );
      const { success } = response.data;
      this.setState(() => {
        return {
          success,
        };
      });
    } catch (error) {
      console.log(error.response);
      const responseError = error.response.data;
      this.setState(() => {
        return {
          responseError,
        };
      });
    }
  }
  
  async componentDidMount() {
    try {
      
      // Get user info from server
      const response = await axios
        .get(
          `https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/users/${this.props.match.params.username}/edit`,
          {
            withCredentials: true,
          }
        );
      
      const { avatar, firstname, lastname, email, username, location, bio } = response.data.profileUser;
      
      this.setState(() => {
        return {
          avatar,
          firstname,
          lastname,
          email,
          username,
          location,
          bio,
          loading: false,
        };
      });
    } catch (error) {
      console.log(error.response);
      const responseError = error.response.data;
      this.setState(() => {
        return {
          responseError,
        };
      });
    }
  }
  render() {
    const {
      avatarFile,
      avatar,
      firstname,
      lastname,
      email,
      username,
      location,
      bio,
      loading,
      errors,
      success,
    } = this.state;
    
    let firstnameError = '';
    let lastnameError = '';
    let emailError = '';
    let usernameError = '';
    let locationError = '';
    let bioError = '';
    
    errors.forEach(error => {
      if (error.element === 'email') {
        emailError = error.message;
      }
      if (error.element === 'username') {
        usernameError = error.message;
      }
    });
    return (
      <section className='edit'>
        
        {loading &&
          <div>Loading...</div>
        }
        
        {success &&
          <div>{success}</div>
        }
      
        {!loading &&
          <Fragment>
            <h1 className='edit__header'>Edit Profile</h1>
            <form className='edit__picform'>
              <label className='edit__piclabel'>
                <img
                  src={avatarFile ? URL.createObjectURL(avatarFile) : avatar}
                  alt={`${username} avatar`}
                  className='edit__avatar'
                />
                <input type='file' name='image' accept='image/*' onChange={this.handleFile} />
                <p>Change profile image</p>
              </label>
            </form>
            
            <form className='edit__infoform' onSubmit={this.handleSubmit}>
              <label className='edit__infolabel' htmlFor='firstname'>First name</label>
              <input
                className='edit__infoinput'
                id='firstname'
                type='text'
                name='firstname'
                value={firstname ? firstname : ''}
                onChange={this.handleChange}
                aria-describedby='firstnameHelpBlock'
              />
              <small
                id='firstnameHelpBlock'
                className='form__text form__text--danger'
              >
                {firstnameError}
              </small>
              
              <label className='edit__infolabel' htmlFor='lastname'>Last name</label>
              <input
                className='edit__infoinput'
                id='lastname'
                type='text'
                name='lastname'
                value={lastname ? lastname : ''}
                onChange={this.handleChange}
                aria-describedby='lastnameHelpBlock'
              />
              <small
                id='lastnameHelpBlock'
                className='form__text form__text--danger'
              >
                {lastnameError}
              </small>
              
              <label className='edit__infolabel' htmlFor='email'>Email</label>
              <input
                className='edit__infoinput'
                id='email'
                type='email'
                name='email'
                value={email ? email : ''}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                aria-describedby='emailHelpBlock'
              />
              <small
                id='emailHelpBlock'
                className='form__text form__text--danger'
              >
                {emailError}
              </small>
              
              <label className='edit__infolabel' htmlFor='username'>Username</label>
              <input
                className='edit__infoinput'
                id='username'
                type='text'
                name='username'
                value={username ? username : ''}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                aria-describedby='usernameHelpBlock'
              />
              <small
                id='usernameHelpBlock'
                className='form__text form__text--danger'
              >
                {usernameError}
              </small>
              
              <label className='edit__infolabel' htmlFor='location'>Location</label>
              <input
                className='edit__infoinput'
                id='location'
                type='text'
                name='location'
                value={location ? location : ''}
                onChange={this.handleChange}
                aria-describedby='locationHelpBlock'
              />
              <small
                id='locationHelpBlock'
                className='form__text form__text--danger'
              >
                {locationError}
              </small>
              
              <label className='edit__infolabel' htmlFor='bio'>Bio</label>
              <div className='edit__infotext'>
                <textarea
                  id='bio'
                  name='bio'
                  rows='4'
                  value={bio ? bio : ''}
                  onChange={this.handleChange}
                  aria-describedby='bioHelpBlock'
                ></textarea>
                <span>150</span>
              </div>
              <small
                id='bioHelpBlock'
                className='form__text form__text--danger'
              >
                {bioError}
              </small>
              
              <input className='btn form__btn' type='submit' value='Update profile' />
            </form>
          </Fragment>
        }
      </section>
    );
  }
}

export default EditProfile;