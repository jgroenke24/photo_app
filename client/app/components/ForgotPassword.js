import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ForgotPassword extends Component {
  state = {
    email: '',
    emailIsValid: false,
    formError: null,
    showEmailError: false,
    responseError: null,
    showSuccess: false,
  };
  
  inputIsValid() {
    const { email } = this.state;
    
    /*
      Check if the email is an accepted form of email.
      from https://emailregex.com/
    */
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
      this.setState(() => {
        return {
          formError: 'You must enter a proper email',
        };
      });
      return;
    } else {
      this.setState(() => {
        return {
          formError: null,
          emailIsValid: true,
        };
      });
    }
  }
  
  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState(() => {
      return {
        [id]: value,
      };
    });
    this.inputIsValid();
  }
  
  handleFocus = (event) => {
    this.setState(() => {
      return {
        formError: null,
      };
    });
  }
  
  handleBlur = (event) => this.inputIsValid();
  
  handleSubmit = async (event) => {
    event.preventDefault();
    
    // Send reset password email
    const { email } = this.state;
    try {
      await axios.post(
        'https://webdevbootcamp-jorge-groenke.c9users.io:8081/forgotpassword',
        {
          email: email,
        }
      );
      this.setState(() => {
        return {
          showEmailError: false,
          showSuccess: true,
        };
      });
    } catch (error) {

      // If the err response comes from the form validator on the server
      if (error.response.data.errors) {
        const { errors: validatorErrors } = error.response.data;
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
            responseError: 'Something went wrong. Please try again.',
          };
        });
      }
    }
  }
  
  render() {
    const { email, formError, emailIsValid, showEmailError, showSuccess, responseError } = this.state;
    
    return (
      <section className='form'>
        
        <Link to='/' className='logo form__logo'>
          PicShareApp
        </Link>
          
        <h1 className='form__header'>Forgot Password?</h1>
        
        {responseError && (
          <div className='form__alert form__alert--danger' role='alert'>
            {responseError}
          </div>
        )}
        
        <form
          className='form__form'
          onSubmit={this.handleSubmit}
        >
          <div className='form__group'>
            <label htmlFor='email' className='form__label'>Email:</label>
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
              autoFocus={true}
            />
            <small
              id='emailHelpBlock'
              className='form__text form__text--danger'
            >
              {formError}
            </small>
          </div>
          <input
            type='submit' 
            className='btn form__btn'
            disabled={!emailIsValid}
            value='Reset Password'
          />
        </form>
        
        {showEmailError && (
          <p className='form__message'>
            Email address not found.  Please try again or <Link to='/signup'>signup</Link> a new account.
          </p>
        )}
        
        {showSuccess && (
          <Fragment>
            <p className='form__message'>
              Password reset email sent.  Check your inbox!
            </p>
            <Link to='/'>
              Go to Homepage
            </Link>
          </Fragment>
        )}
      </section>
    );
  }
}

export default ForgotPassword;