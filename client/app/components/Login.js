import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
    };
    
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }
  
  render() {
    return (
      <div className='container'>
        <form>
          <div className='form-group'>
            <label htmlFor='email'>Email:</label>
            <input 
              id='email' 
              name='email' 
              type='email' 
              className='form-control' 
              value={this.state.email}
              onChange={this.handleChange}
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