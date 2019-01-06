import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      emailIsValid: false,
      formError: null,
      showEmailError: false,
      responseError: null,
      showSuccess: false,
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  showValidationError(error) {
    this.setState(() => {
      return {
        formError: error,
      };
    });
  }
  
  inputIsValid(element) {
    const { email } = this.state;
    
    if (element === 'email') {
      
      /*
        Check if the email is an accepted form of email.
        from https://emailregex.com/
      */
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email)) {
        this.showValidationError('You must enter a proper email');
        return;
      }
    }
    
    this.setState(() => {
      return {
        error: null,
        [element + 'IsValid']: true,
      };
    });
  }
  
  handleChange(event) {
    const { id, value } = event.target;
    this.setState(() => {
      return {
        [id]: value,
      };
    });
    this.inputIsValid(id);
  }
  
  async handleSubmit(event) {
    
    // Send reset password email
    const { email } = this.state;
    try {
      const response = await axios.post(
        'https://webdevbootcamp-jorge-groenke.c9users.io:8081/forgotpassword',
        {
          email: email,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      this.setState(() => {
        return {
          showEmailError: false,
          showSuccess: true,
        };
      });
    } catch (error) {

      // If the err response comes from the form validator on the server
      if (error.response.status === 400) {
        const { validatorErrors } = error.response.data;
        this.setState(() => {
          return {
            formError: validatorErrors[0].message,
          };
        });
      } else if (error.response.data.error === 'Email not found') {
        
        // Email was not found in the database
        this.setState(() => {
          return {
            showEmailError: true,
          };
        });
      } else {
        
        // The error comes from nodemailer or other
        this.setState(() => {
          return {
            responseError: error.response.data.error,
          };
        });
      }
    }
  }
  
  render() {
    const { email, error, emailIsValid, showEmailError, showSuccess, responseError } = this.state;
    
    return (
      <section className='container'>
        <h1 className='text-center'>Forgot Password?</h1>
        
        {responseError && (
          <div className='alert alert-danger' role='alert'>
            {responseError}
          </div>
        )}
        
        <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input 
            id='email' 
            name='email' 
            type='email' 
            className='form-control' 
            value={email}
            onChange={this.handleChange}
            aria-describedby='emailHelpBlock'
          />
          <small
            id='emailHelpBlock'
            className='form-text text-danger'
          >
            {error}
          </small>
        </div>
        <button 
          type='submit' 
          className='btn btn-primary'
          onClick={this.handleSubmit}
          disabled={!emailIsValid}
        >
          Reset Password
        </button>
        
        {showEmailError && (
          <div>
            <p>
              Email address not found.  Please try again or signup a new account.
            </p>
            <Link to='/signup'>
              Signup
            </Link>
          </div>
        )}
        
        {showSuccess && (
          <div>
            <p>
              Password reset email sent.  Check your inbox!
            </p>
            <Link to='/'>
              Home
            </Link>
          </div>
        )}
      </section>
    );
  }
}

export default ForgotPassword;