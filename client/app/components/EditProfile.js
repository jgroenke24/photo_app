import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

const BIO_CHAR_LIMIT = 150;

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
    bioCharLeft: BIO_CHAR_LIMIT,
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
    const { email, username, bioCharLeft } = this.state;

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
    } else if (element === 'bio') {
      if (bioCharLeft < 0) {
        this.showValidationError('bio', `Bio cannot exceed ${BIO_CHAR_LIMIT} characters`);
        return;
      }
    }
  }

  calcBioCharsLeft(text) {
    const charCount = text.length;
    return BIO_CHAR_LIMIT - charCount;
  }

  handleFile = (event) => {
    const avatarFile = event.target.files[0];
    this.setState(() => {
      return {
        avatarFile,
      };
    });
  }

  handleUpload = async (event) => {
    event.preventDefault();
    const { avatarFile } = this.state;
    try {

      if (!avatarFile) {
        throw 'You must choose a pic to upload!';
      }

      // Create a form data object with the photo to be uploaded
      const data = new FormData();
      data.append('image', avatarFile, avatarFile.name);

      // Upload photo to cloudinary and save to database
      await axios
        .post(`/api/users/${this.props.match.params.username}/avatar`,
          data,
          {
            withCredentials: true,
          }
        );

      this.setState(() => {
        return {
          success: 'Profile image uploaded!',
        };
      });
    } catch (error) {

      // If error is from server
      if (error.response) {
        const responseError = error.response.data;
        this.setState(() => {
          return {
            responseError,
          };
        });
      } else {

        // Error is thrown
        this.setState(() => {
          return {
            responseError: error,
          };
        });
      }
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'bio') {
      const bioCharLeft = this.calcBioCharsLeft(value);
      this.setState(() => {
        return {
          bioCharLeft,
          [name]: value,
        };
      });
    } else {
      this.setState(() => {
        return {
          [name]: value,
        };
      });
    }
  }

  handleBlur = (event) => this.inputIsValid(event.target.name);

  handleFocus = (event) => this.clearValidationError(event.target.name);

  handleSubmit = async (event) => {
    event.preventDefault();
    const { firstname, lastname, email, username, location, bio } = this.state;

    try {
      const response = await axios
        .put(
          `/api/users/${this.props.match.params.username}`,
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
      this.props.history.push(`/users/${this.props.match.params.username}`);
    } catch (error) {

      // If error response comes from the form validator
      if (error.response.data.errors) {
        const { errors } = error.response.data;
        this.setState(() => {
          return {
            errors,
          };
        });
      }

      // Error comes from server
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
          `/api/users/${this.props.match.params.username}/edit`,
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
          bioCharLeft: BIO_CHAR_LIMIT - bio.length,
          loading: false,
        };
      });
    } catch (error) {
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
      bioCharLeft,
      loading,
      errors,
      success,
      responseError,
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
      if (error.element === 'bio') {
        bioError = error.message;
      }
    });
    return (
      <Fragment>
        {loading && <Loading />}

        <section className='edit'>

          {success &&
            <div className='form__alert form__alert--success' role='alert'>
              {success}
            </div>
          }

          {responseError &&
            <div className='form__alert form__alert--danger' role='alert'>
              {responseError}
            </div>
          }

          {!loading &&
            <Fragment>
              <h1 className='edit__header'>Edit Profile</h1>
              <form className='edit__picform' onSubmit={this.handleUpload}>
                <label className='edit__piclabel'>
                  <img
                    src={avatarFile ? URL.createObjectURL(avatarFile) : avatar}
                    alt={`${username} avatar`}
                    className='edit__avatar'
                  />
                  <input type='file' name='image' accept='image/*' onChange={this.handleFile} />
                </label>
                <input type='submit' value='Change profile image' />
              </form>

              <form className='edit__infoform' onSubmit={this.handleSubmit}>
                <div className='edit__infofield'>
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
                </div>

                <div className='edit__infofield'>
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
                </div>

                <div className='edit__infofield'>
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
                </div>

                <div className='edit__infofield'>
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
                </div>

                <div className='edit__infofield'>
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
                </div>

                <div className='edit__infofield'>
                  <label className='edit__infolabel' htmlFor='bio'>Bio</label>
                  <div className='edit__infotext'>
                    <textarea
                      id='bio'
                      name='bio'
                      rows='4'
                      value={bio ? bio : ''}
                      onChange={this.handleChange}
                      onBlur={this.handleBlur}
                      onFocus={this.handleFocus}
                      aria-describedby='bioHelpBlock'
                    ></textarea>
                    <span
                      className={bioCharLeft < 0 ? 'neg' : ''}
                    >
                      {bioCharLeft}
                    </span>
                  </div>
                  <small
                    id='bioHelpBlock'
                    className='form__text form__text--danger'
                  >
                    {bioError}
                  </small>
                </div>

                <input className='btn form__btn' type='submit' value='Update profile' />
              </form>
            </Fragment>
          }
        </section>
      </Fragment>
    );
  }
}

export default withRouter(EditProfile);