import React, { Component } from 'react';
import axios from 'axios';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      message: 'Loading...',
    };
  }
  
  async componentDidMount() {
    try {
      
      // Get message from server
      const response = await axios(
        'https://webdevbootcamp-jorge-groenke.c9users.io:8081/dashboard',
        {
          withCredentials: true,
        }
      );
      const { message } = response.data;
      this.setState(() => { 
        return {
          message 
        };
      });
    } catch (err) {
      console.log(err.response);
      this.setState(() => {
        return {
          message: 'Unauthorized',
        };
      });
    }
  }
    
  render() {
    return (
      <div className='container'>
        <h1>Dashboard</h1>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Dashboard;