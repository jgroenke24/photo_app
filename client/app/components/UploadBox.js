import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { AppContext } from './AppContext';
import axios from 'axios';

class UploadBox extends Component {
  static contextType = AppContext;

  state = {
    file: null,
    loaded: 0,
    uploadError: null,
  };

  handleClick = (event) => {
    this.setState({
      uploadError: null,
    });
  }

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

  handleClose = () => {
    document.body.removeAttribute('style');
    this.context.changeToBoxClosed();
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

      document.querySelector('.upload__progress').style.cssText = 'visibility: visible; opacity: 1;';

      // Upload photo to cloudinary and save to database
      await axios
        .post('/api/photos',
          data,
          {
            withCredentials: true,
            onUploadProgress: ProgressEvent => {
              this.setState(() => {
                return {
                  loaded: Math.floor((ProgressEvent.loaded / ProgressEvent.total * 100))
                };
              });
            },
        });

      this.props.history.push('/');
      this.context.changeToBoxClosed();

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

  render() {
    const { file, loaded, uploadError } = this.state;
    return (
      <section className='upload'>

        <div className='upload__top'>
          <p>Upload a picture!</p>
          <button className='upload__close' onClick={this.handleClose}>
          </button>
        </div>

        {uploadError &&
          <div className='form__alert form__alert--danger' role='alert'>
            {uploadError}
          </div>
        }

        <form className='upload__form' onSubmit={this.handleUpload}>
          <div className='upload__well'>
            <div className='upload__cutout'>

              {file ? (
                <Fragment>
                  <img
                    className='upload__img'
                    src={URL.createObjectURL(file)}
                    alt='image preview'
                  />
                  <button
                    className='upload__remove'
                    onClick={this.handleRemoveFile}
                  >
                  </button>
                </Fragment>
              ) : (
                <label className='upload__label'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'>
                    <path d='M376.6 215.6V31.4c0-11.3-9.1-20.4-20.4-20.4H31.4C20.1 11 11 20.1 11 31.4v325.7c0 11.3 9.1 20.4 20.4 20.4h185.2C226.3 447.2 286 501 358.1 501c78.8 0 142.9-64.3 142.9-143.3 0-72.7-54.3-133-124.4-142.1zM51.8 51.8h283.9v107.4L267.4 98c-5.5-5.5-21.6-10.1-31.2 4.9l-67.5 115.4-19.8-34.3c-4.7-9.7-24.4-16.7-34.8-.9l-62.2 96.3V51.8zm11.5 284.9l66.8-103.3 59.7 103.3H63.3zM192.1 259l66.6-113.9 76.9 71.1c-52.9 8.4-96.2 45.9-113 95.6L192.1 259zM358 460.2c-56.3 0-102.1-46-102.1-102.5v-.5-.1c.3-56.2 46-101.9 102.1-101.9 56.3 0 102.1 46 102.1 102.4 0 56.6-45.8 102.6-102.1 102.6z'/>
                    <path d='M411.1 337.3h-32.6v-32.6c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v32.6h-32.6c-11.3 0-20.4 9.1-20.4 20.4 0 11.3 9.1 20.4 20.4 20.4h32.6v32.6c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4v-32.6h32.6c11.3 0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4z'/>
                    <circle cx='131.2' cy='109.2' r='21.4'/>
                  </svg>
                  <div className='btn'>
                    Browse
                  </div>
                  <input type='file' name='image' accept='image/*' onClick={this.handleClick} onChange={this.handleFile} />
                </label>
              )}
            </div>
          </div>
          <div className='upload__foot'>
            <div className='upload__progress'>
              <div className='upload__progressbar' style={{ flexBasis: `${loaded}%` }}>
              </div>
            </div>
            <input type='submit' className='btn form__btn form__btn--upload' value='Upload Photo' />
          </div>
        </form>
      </section>
    );
  }
}

export default withRouter(UploadBox);