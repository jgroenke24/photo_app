import React, { Component } from 'react';
import axios from 'axios';

class Dashboard extends Component {
  state = {
    message: 'Loading...',
  };

  async componentDidMount() {
    try {

      // Get message from server
      const response = await axios(
        '/dashboard',
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
      this.setState(() => {
        return {
          message: 'Unauthorized',
        };
      });
    }
  }

  render() {
    return (
      <section className='container'>
        <h1 className='text-center'>Dashboard</h1>
        <p>{this.state.message}</p>
      </section>
    );
  }
}

export default Dashboard;