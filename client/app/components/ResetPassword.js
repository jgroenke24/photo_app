import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: true,
      email: '',
      password: '',
      passwordCheck: '',
      errors: [],
      passwordIsValid: false,
      passwordCheckIsValid: false,
      resetError: false,
      success: true,
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
    const { password, passwordCheck } = this.state;
    
    if (this.state[element] === '') {
      this.showValidationError(element, `${element} can't be empty`);
      return;
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
        this.setState(() => {
          return {
            [element + 'IsValid']: false,
          };
        });
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
  
  async componentDidMount() {
    try {
      const response = await axios
        .get(`https://webdevbootcamp-jorge-groenke.c9users.io:8081/resetpassword/${this.props.match.params.token}`);
        
      this.setState(() => {
        return {
          email: response.data.user,
          loading: false,
        };
      });
    } catch (error) {
      this.setState(() => {
        return {
          loading: false,
          resetError: true,
        };
      });
    }
  }
  
  async handleSubmit(event) {
    const { password, passwordCheck } = this.state;
    try {
      const response = await axios.post(
        `https://webdevbootcamp-jorge-groenke.c9users.io:8081/resetpassword/${this.props.match.params.token}`,
        {
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
    
    const { loading, success, errors, email, password, passwordCheck, passwordIsValid, passwordCheckIsValid, resetError } = this.state;
    let passwordError = '';
    let passwordCheckError = '';
    
    errors.forEach(error => {
      if (error.element === 'password') {
        passwordError = error.message;
      }
      
      if (error.element === 'passwordCheck') {
        passwordCheckError = error.message;
      }
    });
    
    if (loading) {
      return (
        <section className='container'>
          <div>
            <p>Loading...</p>
          </div>
        </section>
      );
    }
    
    if (resetError) {
      return (
        <section className='container'>
          <div>
            <p>There was a problem resetting your password. Please send another reset link</p>
            <Link to='/'>
              Home
            </Link>
            <Link to='/forgotpassword'>
              Forgot Password
            </Link>
          </div>
        </section>
      );
    }
    
    if (success) {
      return (
        <section className='container'>
          <div>
            <p>Your password was successfully reset. Try logging in again.</p>
            <Link to='/login'>
              Login
            </Link>
          </div>
        </section>
      );
    }
    
    return (
      <section className='container'>
      
        <h1 className='text-center'>Reset Password for {email}</h1>
        
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
          disabled={!passwordIsValid || !passwordCheckIsValid}
          onClick={this.handleSubmit}
        >
          Reset Password
        </button>
        <Link to='/'>
          Home
        </Link>
      </section>
    );
  }
}

export default ResetPassword;