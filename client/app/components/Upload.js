import React, { Component } from 'react';
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
  
  handleUpload = async (event) => {
    
    try {
      event.preventDefault();
      
      if (!this.state.file) {
        throw 'You must choose a pic to upload!';
      }
    
      // Create a form data object with the photo to be uploaded
      const data = new FormData();
      data.append('image', this.state.file, this.state.file.name);
      
      document.querySelector('.form__progress').style.visibility = 'visible';
      
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
    const { loaded, uploadError } = this.state;
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
            <label className='form__uplabel'>
              <img className='form__img' src='https://png.pngtree.com/svg/20160809/camera_add_149556.png' alt='add image' />
              <div className='btn'>
                Browse
              </div>
              <input type='file' name='image' accept='image/*' className='form-control-file' onChange={this.handleFile} />
            </label>
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