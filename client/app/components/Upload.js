import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
  
  render() {
    const { loaded, uploadError } = this.state;
    return (
      <section className='container'>
        <h1 className='text-center'>Upload a picture!</h1>
        
        {uploadError &&
          <div className='alert alert-danger' role='alert'>
            {uploadError}
          </div>
        }
        
        <form>
          <div className='form-group'>
            <label htmlFor='picFile'>
              Upload a pic!
            </label>
            <input type='file' name='image' accept='image/*' className='form-control-file' id='picFile' onChange={this.handleFile} />
            <input type='submit' onClick={this.handleUpload} />
            <small> {loaded} %</small>
          </div>
        </form>
      </section>
    );
  }
}

export default withRouter(Upload);