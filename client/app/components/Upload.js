import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

class Upload extends Component {
  state = {
    file: null,
    loaded: 0,
    uploadError: null,
  };
  
  handleFile = (event) => {
    this.setState({
      file: event.target.files[0],
    });
  }
  
  handleRemoveFile = (event) => {
    event.preventDefault();
    this.setState(() => {
      return {
        file: null,
      };
    });
  }
  
  handleUpload = async (event) => {
    
    try {
      event.preventDefault();
      
      if (!this.state.file) {
        throw 'You must choose a pic to upload!';
      }
    
      // Create a form data object with the photo to be uploaded
      const data = new FormData();
      data.append('image', this.state.file, this.state.file.name);
      
      document.querySelector('.form__progress').style.cssText = 'visibility: visible; opacity: 1;';
      
      // Upload photo to cloudinary and save to database
      await axios
        .post('https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos', data, {
          onUploadProgress: ProgressEvent => {
            this.setState(() => {
              return {
                loaded: Math.floor((ProgressEvent.loaded / ProgressEvent.total * 100))
              };
            });
          }
        });
        
      this.props.history.push('/');
      
    } catch (error) {

      // If the error comes from the server, update the error in state
      if (error.response) {
        this.setState(() => {
          return {
            uploadError: error.response.data.error,
          };
        });
      } else {
        
        // The error happened in submitting the form, so update the state with that error
        this.setState(() => {
          return {
            uploadError: error,
          };
        });
      }
    }
  }
  
  componentWillUnmount() {
    document.body.removeAttribute('style');
  }
  
  render() {
    const { file, loaded, uploadError } = this.state;
    return (
      <section className='form'>
      
        <Link to='/' className='logo form__logo'>
          PicShareApp
        </Link>
      
        <h1 className='form__header'>Upload a picture!</h1>
        
        {uploadError &&
          <div className='form__alert form__alert--danger' role='alert'>
            {uploadError}
          </div>
        }
        
        <form className='form__upload' onSubmit={this.handleUpload}>
          <div className='form__cutout'>
          
            {file ? (
              <Fragment>
                <img
                  className='form__img'
                  src={URL.createObjectURL(file)}
                  alt='image preview'
                />
                <button
                  className='form__remove'
                  onClick={this.handleRemoveFile}
                >
                </button>
              </Fragment>
            ) : (
              <label className='form__uplabel'>
                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
                  <path d="M376.6 215.6V31.4c0-11.3-9.1-20.4-20.4-20.4H31.4C20.1 11 11 20.1 11 31.4v325.7c0 11.3 9.1 20.4 20.4 20.4h185.2C226.3 447.2 286 501 358.1 501c78.8 0 142.9-64.3 142.9-143.3 0-72.7-54.3-133-124.4-142.1zM51.8 51.8h283.9v107.4L267.4 98c-5.5-5.5-21.6-10.1-31.2 4.9l-67.5 115.4-19.8-34.3c-4.7-9.7-24.4-16.7-34.8-.9l-62.2 96.3V51.8zm11.5 284.9l66.8-103.3 59.7 103.3H63.3zM192.1 259l66.6-113.9 76.9 71.1c-52.9 8.4-96.2 45.9-113 95.6L192.1 259zM358 460.2c-56.3 0-102.1-46-102.1-102.5v-.5-.1c.3-56.2 46-101.9 102.1-101.9 56.3 0 102.1 46 102.1 102.4 0 56.6-45.8 102.6-102.1 102.6z"/>
                  <path d="M411.1 337.3h-32.6v-32.6c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v32.6h-32.6c-11.3 0-20.4 9.1-20.4 20.4 0 11.3 9.1 20.4 20.4 20.4h32.6v32.6c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4v-32.6h32.6c11.3 0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4z"/>
                  <circle cx="131.2" cy="109.2" r="21.4"/>
                </svg>
                <div className='btn'>
                  Browse
                </div>
                <input type='file' name='image' accept='image/*' className='form-control-file' onChange={this.handleFile} />
              </label>
            )}
          </div>
          <div className='form__foot'>
            <div className='form__progress'>
              <div className='form__progressbar' style={{ flexBasis: `${loaded}%` }}>
              </div>
            </div>
            <input type='submit' className='btn form__btn form__btn--upload' value='Upload Photo' />
          </div>
        </form>
      </section>
    );
  }
}

export default withRouter(Upload);