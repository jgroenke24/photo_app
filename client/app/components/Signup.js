import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { AppContext } from './AppContext';
import axios from 'axios';

// Add a response interceptor
// axios.interceptors.response.use(

//   // Do something with response data
//   response => response,
//   error => {

//     // Do something with response error
//     const { status } = error.response;
//     if (status === 401) {
//       console.log('inside interceptor', error.response);
//     }
//     return Promise.reject(error);
//   });

class Signup extends Component {
  state = {
    email: '',
    username: '',
    password: '',
    passwordCheck: '',
    errors: [],
    emailIsValid: false,
    usernameIsValid: false,
    passwordIsValid: false,
    passwordCheckIsValid: false,
    signupError: null,
  };
  
  static contextType = AppContext;
  
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
    const { email, username, password, passwordCheck } = this.state;
    
    if (this.state[element] === '') {
      this.showValidationError(element, `${element} can't be empty`);
      return;
    } else if (element === 'email') {
      
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
    } else if (element === 'password') {
      
      /*
        Check if password meets criteria: 8 or more characters, at least 1 uppercase, lowercase, number and symbol.
        from https://stackoverflow.com/a/21456918
      */
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
      if(!re.test(password)) {
        this.showValidationError('password', 'Min 8 char & 1 of each: uppercase, lowercase, number, symbol');
        return;
      }
    } else if (element === 'passwordCheck') {
      
      // Check if both passwords match
      if (passwordCheck !== password) {
        this.showValidationError('passwordCheck', 'Passwords must match.');
        return;
      }
    }
    
    this.setState(() => {
      return {
        [element + 'IsValid']: true,
      };
    });
  }
  
  handleBlur = (event) => this.inputIsValid(event.target.id);
  
  handleFocus = (event) => this.clearValidationError(event.target.id);
  
  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState(() => {
      return {
        [id]: value,
      };
    });
  }
  
  handleSubmit = async (event) => {
    event.preventDefault();
    const { email, username, password, passwordCheck } = this.state;
    try {
      const response = await axios.post(
        'https://webdevbootcamp-jorge-groenke.c9users.io:8081/signup',
        {
          email,
          username,
          password,
          passwordCheck,
        },
        {
          withCredentials: true,
        }
      );
      const { user } = response.data;
      this.context.changeToLoggedIn();
      this.context.addUser(user);
      this.props.history.push('/');
    } catch (error) {
      
      // If the err response comes from the form validator on the server
      if (error.response.status === 400) {
        const { errors } = error.response.data;
        this.setState(() => {
          return {
            errors,
          };
        });
      } else {
        
        // The error comes from failed authentication
        this.setState(() => {
          return {
            signupError: error.response.data.error,
          };
        });
      }
    }
  }
  
  componentWillUnmount() {
    document.body.removeAttribute('style');
  }
  
  render() {
    
    const { errors, email, username, password, passwordCheck, emailIsValid, usernameIsValid, passwordIsValid, passwordCheckIsValid, signupError } = this.state;
    let emailError = '';
    let usernameError = '';
    let passwordError = '';
    let passwordCheckError = '';
    
    errors.forEach(error => {
      if (error.element === 'email') {
        emailError = error.message;
      }
      if (error.element === 'username') {
        usernameError = error.message;
      }
      if (error.element === 'password') {
        passwordError = error.message;
      }
      if (error.element === 'passwordCheck') {
        passwordCheckError = error.message;
      }
    });
    
    return (
      <section className='form'>
      
        <Link to='/' className='logo form__logo'>
          PicShareApp
        </Link>
      
        <h1 className='form__header'>Signup</h1>
        <Link to='/login' className='form__link form__link--center'>
          Already have an account? Login
        </Link>
        
        {signupError &&
          <div className='form__alert form__alert--danger' role='alert'>
            {signupError}
          </div>
        }
        
        <form
          className='form__form'
          onSubmit={this.handleSubmit}
        >
          <div className='form__group'>
            <label htmlFor='email' className='form__label'>Email</label>
            <input 
              id='email' 
              name='email' 
              type='email' 
              className='form__input'
              value={email}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              aria-describedby='emailHelpBlock'
            />
            <small
              id='emailHelpBlock'
              className='form__text form__text--danger'
            >
              {emailError}
            </small>
          </div>
          <div className='form__group'>
            <label htmlFor='username' className='form__label'>Username</label>
            <input 
              id='username' 
              name='username' 
              type='text' 
              className='form__input'
              value={username}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              aria-describedby='usernameHelpBlock'
            />
            <small
              id='usernameHelpBlock'
              className='form__text form__text--danger'
            >
              {usernameError}
            </small>
          </div>
          <div className='form__group'>
            <label htmlFor='password' className='form__label'>Password</label>
            <input 
              id='password' 
              name='password' 
              type='password' 
              className='form__input'
              value={password}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              aria-describedby='passwordHelpBlock'
            />
            <small
              id='passwordHelpBlock'
              className='form__text form__text--danger'
            >
              {passwordError}
            </small>
          </div>
          <div className='form__group'>
            <label htmlFor='passwordCheck' className='form__label'>Verify Password</label>
            <input 
              id='passwordCheck' 
              name='passwordCheck' 
              type='password' 
              className='form__input'
              value={passwordCheck}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              aria-describedby='passwordCheckHelpBlock'
            />
            <small
              id='passwordCheckHelpBlock'
              className='form__text form__text--danger'
            >
              {passwordCheckError}
            </small>
          </div>
          <input 
            type='submit' 
            className='btn form__btn'
            value='Signup'
          />
        </form>
      </section>
    );
  }
}

export default withRouter(Signup);