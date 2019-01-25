import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import axios from 'axios';

const MultipleColumnPhotos = ({ photos }) => (
  <Fragment>
    {photos.map(({ id, url, tags, username, likes }) => {
      return (
        <div key={id} className='photoitem'>
          <Link
            to={{
              pathname: `/photos/${id}`,
              state: {
                id,
                url,
                tags,
                username,
                likes,
                modal: true,
              },
            }}
            className='photoitem__link'
          >
            <img src={url} alt={tags.replace(/,/g, ' ')} className='photoitem__img' />
            <div className='photoitem__overlay'>
              <button className='btn photoitem__btn'>Likes: {likes}</button>
              <h2 className='photoitem__creator'>{username}</h2>
            </div>
          </Link>
        </div>
      );
    })}
  </Fragment>
);

MultipleColumnPhotos.propTypes = {
  photos: PropTypes.array.isRequired,
};

const OneColumnPhotos = ({ photos }) => (
  <Fragment>
    {photos.map(({ id, username, url, tags, likes }) => {
      return (
        <div key={id} className='photocard'>
          <div className='photocard__creator'>
            <h2>{username}</h2>
          </div>
          <Link
            to={{
              pathname: `/photos/${id}`,
              state: {
                id,
                url,
                tags,
                username,
                likes,
              },
            }}
            className='photocard__link'
          >
            <img src={url} alt={tags.replace(/,/g, ' ')} className='photocard__img' />
          </Link>
          <div className='photocard__likes'>
            <p>Likes: {likes}</p>
          </div>
        </div>
      );
    })}
  </Fragment>
);

OneColumnPhotos.propTypes = {
  photos: PropTypes.array.isRequired,
};

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
        
        {photos &&
          <MediaQuery minWidth={768}>
            {matches => {
              return matches
              ?  (
                <MultipleColumnPhotos photos={photos} />
              ) : (
                <OneColumnPhotos photos={photos} />
              );
            }}
          </MediaQuery>
        }
        
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