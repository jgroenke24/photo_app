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

class Login extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }
  
  async handleSubmit(event) {
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
      console.log(response);
      alert('submitted form');
    } catch (err) {
      console.log('inside catch', err.response.data);
    }
  }
  
  render() {
    return (
      <div className='container'>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>Email:</label>
            <input 
              id='email' 
              name='email' 
              type='email' 
              className='form-control' 
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password:</label>
            <input 
              id='password' 
              name='password' 
              type='password' 
              className='form-control' 
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
          </div>
          <button 
            type='submit' 
            className='btn btn-primary'
          >
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default Login;