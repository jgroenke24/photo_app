import React, { Component } from 'react';
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
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
      passwordCheck: '',
      errors: [],
      emailIsValid: false,
      passwordIsValid: false,
      passwordCheckIsValid: false,
      signupError: null,
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
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
    const { email, password, passwordCheck } = this.state;
    
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
    } else if (element === 'password') {
      
      /*
        Check if password meets criteria: 8 or more characters, at least 1 uppercase, lowercase, number and symbol.
        from https://stackoverflow.com/a/21456918
      */
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
      if(!re.test(password)) {
        this.showValidationError('password', 'Password must be at least 8 characters long and include at least one uppercase, lowercase, number and symbol.');
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
  
  handleBlur(event) {
    this.inputIsValid(event.target.id);
  }
  
  handleFocus(event) {
    this.clearValidationError(event.target.id);
  }
  
  handleChange(event) {
    const { id, value } = event.target;
    this.setState(() => {
      return {
        [id]: value,
      };
    });
  }
  
  async handleSubmit(event) {
    const { email, password, passwordCheck } = this.state;
    try {
      const response = await axios.post(
        'https://webdevbootcamp-jorge-groenke.c9users.io:8081/signup',
        {
          email: email,
          password: password,
          passwordCheck: passwordCheck,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      alert('you are signed up!');
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
    
    const { errors, email, password, passwordCheck, emailIsValid, passwordIsValid, passwordCheckIsValid, signupError } = this.state;
    let emailError = '';
    let passwordError = '';
    let passwordCheckError = '';
    
    errors.forEach(error => {
      if (error.element === 'email') {
        emailError = error.message;
      }
      if (error.element === 'password') {
        passwordError = error.message;
      }
      
      if (error.element === 'passwordCheck') {
        passwordCheckError = error.message;
      }
    });
    
    return (
      <section className='container'>
        <h1 className='text-center'>Sign Up!</h1>
        
        {signupError &&
          <div className='alert alert-danger' role='alert'>
            {signupError}
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
        <div className='form-group'>
          <label htmlFor='passwordCheck'>Verify Password:</label>
          <input 
            id='passwordCheck' 
            name='passwordCheck' 
            type='password' 
            className='form-control' 
            value={passwordCheck}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            aria-describedby='passwordCheckHelpBlock'
          />
          <small
            id='passwordCheckHelpBlock'
            className='form-text text-danger'
          >
            {passwordCheckError}
          </small>
        </div>
        <button 
          type='submit' 
          className='btn btn-primary'
          disabled={!emailIsValid || !passwordIsValid || !passwordCheckIsValid}
          onClick={this.handleSubmit}
        >
          Signup
        </button>
      </section>
    );
  }
}

export default Signup;