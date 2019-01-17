import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import axios from 'axios';

const MultipleColumnPhotos = ({ photos }) => (
  <Fragment>
    {photos.map(photo => {
      return (
        <div key={photo.id} className='photo'>
          <Link to={`/photos/${photo.id}`} className='photo__link'>
            <img src={photo.url} alt={photo.tags.replace(/,/g, ' ')} className='photo__img' />
          </Link>
        </div>
      );
    })}
  </Fragment>
);

const OneColumnPhotos = ({ photos }) => (
  <Fragment>
    {photos.map(photo => {
      return (
        <div key={photo.id} className='photocard'>
          <div className='photocard__creator'>
            <h2>{photo.userid}</h2>
          </div>
          <Link to={`/photos/${photo.id}`} className='photocard__link'>
            <img src={photo.url} alt={photo.tags.replace(/,/g, ' ')} className='photocard__img' />
          </Link>
          <div className='photocard__likes'>
            <p>likes: 0</p>
          </div>
        </div>
      );
    })}
  </Fragment>
);

class Photos extends Component {
  state = {
    photos: null,
    refreshError: null,
  };

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
        
      const { photos } = response.data;
      
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
      <section className='photos'>
      
        {!photos && <p className='text-center'>Loading photos...</p>}
        
        {photos && <OneColumnPhotos photos={photos} />}
        
        {refreshError &&
          <div className='alert alert-danger' role='alert'>
            {refreshError}
          </div>
        }
      </section>
    );
  }
}

export default Photos;