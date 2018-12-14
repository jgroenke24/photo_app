import React, { Component } from 'react';
import Navbar from './Navbar'

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <h1>This is PicShareApp</h1>
      </React.Fragment>
    );
  }
}

export default App;