import React, { Component } from 'react';

const AppContext = React.createContext();

class AppProvider extends Component {
  state = {
    isLoggedIn: false,
    uploadBoxIsOpen: false,
  }
  
  render() {
    return (
      <AppContext.Provider value={{
        isLoggedIn: this.state.isLoggedIn,
        changeToLoggedIn: () => this.setState(() => {
          return {
            isLoggedIn: true,
          };
        }),
        changeToLoggedOut: () => this.setState(() => {
          return {
            isLoggedIn: false,
          };
        }),
        uploadBoxIsOpen: this.state.uploadBoxIsOpen,
        changeToBoxOpen: () => this.setState(() => {
          return {
            uploadBoxIsOpen: true,
          };
        }),
        changeToBoxClosed: () => this.setState(() => {
          return {
            uploadBoxIsOpen: false,
          };
        })
      }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

const AppConsumer = AppContext.Consumer;

export { AppContext, AppProvider, AppConsumer };