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

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    emailIsValid: false,
    passwordIsValid: false,
    loginError: null,
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
        errors: errors.filter(error => error.element !== element),
      };
    });
  }
  
  inputIsValid(element) {
    const { email } = this.state;
    
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
    
    const { email, password } = this.state;
    try {
      const response = await axios.post(
        'https://webdevbootcamp-jorge-groenke.c9users.io:8081/login',
        {
          email: email,
          password: password,
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
            loginError: error.response.data.error,
          };
        });
      }
    }
  }
  
  componentWillUnmount() {
    document.body.removeAttribute('style');
  }
  
  render() {
    
    const { errors, email, password, emailIsValid, passwordIsValid, loginError } = this.state;
    let emailError = '';
    let passwordError = '';
    
    errors.forEach(error => {
      if (error.element === 'email') {
        emailError = error.message;
      }
      if (error.element === 'password') {
        passwordError = error.message;
      }
    });
    
    return (
      <section className='form'>
      
        <Link to='/' className='logo form__logo'>
          PicShareApp
        </Link>
        
        <h1 className='form__header'>Login</h1>
        
        {loginError &&
          <div className='form__alert form__alert--danger' role='alert'>
            {loginError}
          </div>
        }
        
        <form
          className='form__form'
          onSubmit={this.handleSubmit}
        >
          <div className='form__group'>
            <label className='form__label' htmlFor='email'>Email</label>
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
            <label className='form__label' htmlFor='password'>Password</label>
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
          <input 
            type='submit' 
            className='btn form__btn'
            value='Login'
          />
        </form>
        <Link to='/forgotpassword' className='form__link'>
          Forgot Password?
        </Link>
        <Link to='/signup' className='form__link'>
          Don't have an account? Sign up!
        </Link>
      </section>
    );
  }
}

export default withRouter(Login);