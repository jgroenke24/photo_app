import React, { Component } from 'react';

const AppContext = React.createContext();

class AppProvider extends Component {
  state = {
    isLoggedIn: false,
  }
  
  render() {
    return (
      <AppContext.Provider value={{
        state: this.state,
      }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;