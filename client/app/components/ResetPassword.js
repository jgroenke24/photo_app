import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

class ResetPassword extends Component {
  state = {
    loading: true,
    username: '',
    password: '',
    passwordCheck: '',
    errors: [],
    passwordIsValid: false,
    passwordCheckIsValid: false,
    resetError: false,
    success: false,
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
        this.showValidationError('password', 'Min 8 char & 1 of each: uppercase, lowercase, number, symbol');
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

  async componentDidMount() {
    try {
      const response = await axios
        .get(`/api/resetpassword/${this.props.match.params.token}`);

      this.setState(() => {
        return {
          username: response.data.user,
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

  handleSubmit = async (event) => {
    event.preventDefault();
    const { password, passwordCheck } = this.state;
    try {
      await axios.post(
        `/api/resetpassword/${this.props.match.params.token}`,
        {
          password: password,
          passwordCheck: passwordCheck,
        }
      );
      this.setState(() => {
        return {
          success: true,
        };
      });
    } catch (error) {

      // If the err response comes from the form validator on the server
      if (error.response.data.errors) {
        const { errors } = error.response.data;
        this.setState(() => {
          return {
            errors,
          };
        });
      } else {

        // The error comes from server, db or other
        this.setState(() => {
          return {
            resetError: true,
          };
        });
      }
    }
  }

  render() {

    const { loading, success, errors, username, password, passwordCheck, passwordIsValid, passwordCheckIsValid, resetError } = this.state;
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
        <Loading />
      );
    }

    if (resetError) {
      return (
        <section className='form'>
          <Link to='/' className='logo form__logo'>
            PicShareApp
          </Link>
          <p className='form__message'>There was a problem resetting your password. Please send another reset link</p>
          <Link to='/' className='form_link'>
            Home
          </Link>
          <Link to='/forgotpassword' className='form_link'>
            Forgot Password
          </Link>
        </section>
      );
    }

    if (success) {
      return (
        <section className='form'>
          <Link to='/' className='logo form__logo'>
            PicShareApp
          </Link>
          <p className='form__message'>Your password was successfully reset. Try logging in again.</p>
          <Link to='/login' className='form_link'>
            Login
          </Link>
        </section>
      );
    }

    return (
      <section className='form'>

        <Link to='/' className='logo form__logo'>
            PicShareApp
        </Link>

        <h1 className='form__header'>Reset Password for {username}</h1>

        <form
          className='form__form'
          onSubmit={this.handleSubmit}
        >
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
            value='Reset Password'
          />
        </form>
        <Link to='/' className='form__link'>
          Go to Homepage
        </Link>
      </section>
    );
  }
}

export default ResetPassword;