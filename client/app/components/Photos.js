import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import axios from 'axios';

class PhotoItem extends Component {
  state = {
    likedByUser: this.props.photo.likedByUser,
    likes: this.props.photo.likes,
  }

  handleLike = async () => {
    const { id } = this.props.photo;
    try {
      
      // Send like to server
      const { data: { photo } } = await axios
        .post(
          `https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos/${id}/like`,
          {},
          {
            withCredentials: true,
          }
        );
      this.setState(() => {
        return {
          likedByUser: true,
          likes: photo.likes,
        };
      });
    } catch (error) {
      return;
    }
  }

  handleUnlike = async () => {
    const { id } = this.props.photo;
    try {
      
      // Send delete like to server
      const { data: { photo } } = await axios
        .delete(
          `https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos/${id}/like`,
          {
            withCredentials: true,
          }
        );
      this.setState(() => {
        return {
          likedByUser: false,
          likes: photo.likes,
        };
      });
    } catch (error) {
      return;
    }
  }

  render() {
    const { photo: { id, url, tags, username }, user } = this.props;
    const { likedByUser, likes } = this.state;

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
              likedByUser,
              user: user || null,
              modal: true,
            },
          }}
          className='photoitem__link'
        >
          <img src={url} alt={tags.replace(/,/g, ' ')} className='photoitem__img' />
        </Link>
        <div className='photoitem__overlay'>
          {user
            ?  (
              <button
                className={'btn photoitem__btn ' + (likedByUser ? 'photoitem__btn--liked' : '')}
                onClick={likedByUser ? this.handleUnlike : this.handleLike}
              >
                <span className='btn__icon'>
                  <svg className='btn__icon--heart' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
                  </svg>
                </span>
                {likes}
              </button>
            ) : (
              <Link
                to='/login'
                className='btn photoitem__btn'
              >
                <span className='btn__icon'>
                  <svg className='btn__icon--heart' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
                  </svg>
                </span>
                {likes}
              </Link>
            )
          }
          <h2 className='photoitem__creator'>{username}</h2>
        </div>
      </div>
    );
  }
}

PhotoItem.propTypes = {
  photo: PropTypes.object.isRequired,
  user: PropTypes.object,
};

class PhotoCard extends Component {
  state= {
    likedByUser: this.props.photo.likedByUser,
    likes: this.props.photo.likes,
  }

  handleLike = async () => {
    const { id } = this.props.photo;
    try {
      
      // Send like to server
      const { data: { photo } } = await axios
        .post(
          `https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos/${id}/like`,
          {},
          {
            withCredentials: true,
          }
        );
      this.setState(() => {
        return {
          likedByUser: true,
          likes: photo.likes,
        };
      });
    } catch (error) {
      return;
    }
  }

  handleUnlike = async () => {
    const { id } = this.props.photo;
    try {
      
      // Send delete like to server
      const { data: { photo } } = await axios
        .delete(
          `https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos/${id}/like`,
          {
            withCredentials: true,
          }
        );
      this.setState(() => {
        return {
          likedByUser: false,
          likes: photo.likes,
        };
      });
    } catch (error) {
      return;
    }
  }

  render() {
    const { photo: { id, url, tags, username }, user } = this.props;
    const { likedByUser, likes } = this.state;

    return (
      <div key={id} className='photocard'>
        <div className='photocard__top'>
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
              likedByUser,
              user: user || null,
            },
          }}
          className='photocard__link'
        >
          <img src={url} alt={tags.replace(/,/g, ' ')} className='photocard__img' />
        </Link>
        <div className='photocard__bottom'>
          {user
            ? (
              <button
                className={'btn photo__btn ' + (likedByUser ? 'photo__btn--liked' : '')}
                onClick={likedByUser ? this.handleUnlike : this.handleLike}
              >
                <span className='btn__icon'>
                  <svg className='btn__icon--heart' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
                  </svg>
                </span>
                {likes}
              </button>
            ) : (
              <Link
                to='/login'
                className='btn photo__btn'
              >
                <span className='btn__icon'>
                  <svg className='btn__icon--heart' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
                  </svg>
                </span>
                {likes}
              </Link>
            )
          }
        </div>
      </div>
    );
  }
}

PhotoCard.propTypes = {
  photo: PropTypes.object.isRequired,
  user: PropTypes.object,
};

class Photos extends Component {
  state = {
    photos: null,
    user: null,
    refreshError: null,
  };

  async componentDidMount() {
    try {
      
      // If photos were passed in as a prop
      if (this.props.photos) {
        
        // If a user was also passed in as a prop
        if (this.props.user) {
          this.setState(() => {
            return {
              photos: this.props.photos,
              user: this.props.user,
            };
          });
        } else {
          
          // No user was passed in, so just update photos in state
          this.setState(() => {
            return {
              photos: this.props.photos,
            };
          });
        }
      } else {
        
        // Get all photos from server
        const response = await axios
          .get(
            'https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos',
            {
              withCredentials: true,
            }
          );
          
        const { photos, user } = response.data;

        // Update state with returned array of photos
        this.setState(() => {
          return {
            photos,
            user: user || null,
          };
        });
      }
    } catch (error) {
      this.setState(() => {
        return {
          refreshError: 'Could not refresh photos.  Please try again.'
        };
      });
    }
  }
  
  render() {
    const { photos, user, refreshError } = this.state;
    return (
      <section className='photos'>
        {!photos && <p className='text-center'>Loading photos...</p>}
        
        {photos &&
          <MediaQuery minWidth={768}>
            {matches => {
              return matches
              ?  (
                photos.map(photo => <PhotoItem key={photo.id} photo={photo} user={user} />)
              ) : (
                photos.map(photo => <PhotoCard key={photo.id} photo={photo} user={user} />)
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

Photos.propTypes = {
  photos: PropTypes.array,
  user: PropTypes.object,
};

export default Photos;