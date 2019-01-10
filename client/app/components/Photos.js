import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Photos extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      photos: null,
      refreshError: null,
    };
  }
  
  async componentDidMount() {
    await this.refreshPhotos();
  }
  
  async refreshPhotos() {
    try {
      
      // Get all photos from server
      const response = await axios('https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos');
      const result = response.data;
      
      // Update state with returned array of photos
      this.setState(() => {
        return {
          photos: result.rows,
        };
      });
    } catch (error) {
      this.setState(() => {
        return {
          refreshError: 'Could not refresh photos.  Please try again.'
        };
      });
    }
  }
  
  render() {
    const { photos, refreshError } = this.state;
    return (
      <React.Fragment>
        <section className='container'>
          <h1 className='text-center'>Photos</h1>
          
          {refreshError &&
            <div className='alert alert-danger' role='alert'>
              {refreshError}
            </div>
          }
          
          <div className='row'>
            {!photos && <p className='text-center'>Loading photos...</p>}
        
            {photos &&
              photos.map(photo => {
              return (
                <div key={photo.id} className='col-sm-12 col-md-3 col-lg-4'>
                  <Link to={`/photos/${photo.id}`}>
                    <div className='card'>
                      <img className='card-img-top' src={photo.url} alt={photo.filename}/>
                      <div className='card-body'>
                        <h5 className='card-title'>
                          {photo.filename}
                        </h5>
                      </div>
                    </div>
                  </Link>
                </div>
              )})
            }
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Photos;