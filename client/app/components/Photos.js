import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Photos extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      photos: null,
      file: null,
      loaded: 0,
    };
    
    this.handleFile = this.handleFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }
  
  async componentDidMount() {
    try {
      
      // Get all photos from server
      const response = await axios('https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos');
      const result = response.data;
      
      // Update state with returned array of photos
      this.setState({
        photos: result.rows
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  handleFile(event) {
    this.setState({
      file: event.target.files[0]
    });
  }
  
  async handleUpload(event) {
    
    try {
      event.preventDefault();
    
      // Create a form data object with the photo to be uploaded
      const data = new FormData();
      data.append('image', this.state.file, this.state.file.name);
      
      // Upload photo to cloudinary and save to database
      await axios
        .post('https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos', data, {
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)
            });
          }
        });
        
      // Get all photos from server to refresh list
      const response = await axios('https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos');
      const result = response.data;
      this.setState({
        photos: result.rows,
        file: null,
        loaded: 0
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  render() {
    const { photos } = this.state;
    return (
      <React.Fragment>
        <h1>Photos will go here</h1>
        <div className='container'>
          <form>
            <div className='form-group'>
              <label htmlFor='picFile'>
                Upload a pic!
              </label>
              <input type='file' name='image' accept='image/*' required className='form-control-file' id='picFile' onChange={this.handleFile} />
              <input type='submit' onClick={this.handleUpload} />
              <small> {this.state.loaded} %</small>
            </div>
          </form>
          <div className='row'>
            {!photos && <p>Loading photos...</p>}
        
            {photos &&
              photos.map(photo => {
              return (
                <div key={photo.id} className='col-sm-12 col-md-3 col-lg-4'>
                  <Link to={`/photos/${photo.id}`}>
                    <div className='card'>
                      <img className='card-img-top' src={photo.url} alt={photo.name}/>
                      <div className='card-body'>
                        <h5 className='card-title'>
                          {photo.name}
                        </h5>
                      </div>
                    </div>
                  </Link>
                </div>
              )})
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Photos;