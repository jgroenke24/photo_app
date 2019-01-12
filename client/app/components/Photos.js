import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from './AppContext';

class Photos extends Component {
  state = {
    photos: null,
    refreshError: null,
  };
  
  static contextType = AppContext;
  
  async componentDidMount() {
    try {
      
      // Get all photos from server
      const response = await axios
        .get(
          'https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos',
          {
            withCredentials: true,
          }
        );
        
      const { photos, user } = response.data;
      
      if (user) {
        this.context.changeToLoggedIn();
      }
      
      // Update state with returned array of photos
      this.setState(() => {
        return {
          photos,
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
    );
  }
}

export default Photos;