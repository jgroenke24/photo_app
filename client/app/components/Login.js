import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
      console.log(response);
      alert('you are logged in');
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
      <section className='container'>
        <h1 className='text-center'>Login</h1>
        
        {loginError &&
          <div className='alert alert-danger' role='alert'>
            {loginError}
          </div>
        }
        
        <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input 
            id='email' 
            name='email' 
            type='email' 
            className='form-control' 
            value={email}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            aria-describedby='emailHelpBlock'
          />
          <small
            id='emailHelpBlock'
            className='form-text text-danger'
          >
            {emailError}
          </small>
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input 
            id='password' 
            name='password' 
            type='password' 
            className='form-control' 
            value={password}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            aria-describedby='passwordHelpBlock'
          />
          <small
            id='passwordHelpBlock'
            className='form-text text-danger'
          >
            {passwordError}
          </small>
        </div>
        <Link to='/forgotpassword'>
          <p>Forgot Password?</p>
        </Link>
        <button 
          type='submit' 
          className='btn btn-primary'
          disabled={!emailIsValid || !passwordIsValid}
          onClick={this.handleSubmit}
        >
          Login
        </button>
      </section>
    );
  }
}

export default Login;