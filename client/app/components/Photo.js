import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { AppContext } from './AppContext.js';
import Loading from './Loading';

const PhotoEdit = ({ location, description, handleChange, handleSubmit }) => (
  <div className='photo__edit'>
    <form className='photo__form' onSubmit={handleSubmit}>
      <div className='photo__fields'>
        <div className='photo__field'>
          <input
            type='text'
            id='location'
            name='location'
            value={location ? location : ''}
            placeholder='Location'
            onChange={handleChange}
          />
          <label htmlFor='location'>Location</label>
        </div>
        <div className='photo__field'>
          <input
            type='text'
            id='description'
            name='description'
            value={description ? description : ''}
            placeholder='Description'
            onChange={handleChange}
          />
          <label htmlFor='description'>Description</label>
        </div>
      </div>
      <input className='btn photo__btn photo__btn--primary' type='submit' value='Submit edits' />
    </form>
    <button className='btn photo__btn photo__btn--danger'>Delete</button>
  </div>
);

PhotoEdit.propTypes = {
  location: PropTypes.string,
  description: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

class Photo extends Component {
  static contextType = AppContext;
  
  state = {
    loading: true,
    photo: null,
    user: null,
    responseError: null,
    showSubmissionError: false,
    likedByUser: null,
    likes: null,
    editOpen: false,
    location: null,
    description: null,
  };
  
  async componentDidMount() {
    
    if (this.props.location.state) {
      const { id, url, tags, username, avatar, likes, likedByUser, user, location, description } = this.props.location.state;
      this.setState(() => {
        return {
          user,
          likedByUser,
          likes,
          photo: {
            id,
            url,
            tags,
            username,
            avatar,
          },
          loading: false,
          location: location || null,
          description: description || null,
        };
      });
    } else {
    
      try {
        const response = await axios
          .get(
            `https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos/${this.props.match.params.photoId}`,
            {
              withCredentials: true,
            }
          );
        const { photo, user } = response.data;
        this.setState(() => {
          return {
            photo,
            likedByUser: photo.likedByUser,
            likes: photo.likes,
            user: user || null,
            loading: false,
            location: photo.location || null,
            description: photo.description || null,
          };
        });
      } catch (error) {
        const responseError = error.response.data;
        this.setState(() => {
          return {
            responseError,
            loading: false,
          };
        });
      }
    }
  }
  
  componentWillUnmount() {
    document.body.removeAttribute('style');
  }
  
  handleLike = async () => {
    const { id } = this.state.photo;
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
    const { id } = this.state.photo;
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
  
  handleDelete = async () => {
    try {
      await axios.delete(`https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos/${this.props.match.params.photoId}`);
      this.props.history.push('/');
    } catch (error) {
      this.setState(() => {
        return {
          showSubmissionError: true,
        };
      });
    }
  }
  
  handleEditClick = () => {
    this.setState((prevState) => {
      return {
        editOpen: !prevState.editOpen,
      };
    });
  }
  
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState(() => {
      return {
        [name]: value,
      };
    });
  }
  
  handleSubmit = async (event) => {
    event.preventDefault();
    console.log('form to be submitted');
  }
  
  render() {
    const { loading, photo, user, responseError, showSubmissionError, likedByUser, likes, editOpen, location, description } = this.state;
    
    if (loading) {
      return <Loading />;
    } else {
      return (
        <section className='photo'>
          {showSubmissionError &&
            <div className='form__alert form__alert--danger' role='alert'>
              Something went wrong with your request. Please try again.
            </div>
          }
          
          {responseError &&
            <div>{responseError}</div>
          }
          
          {photo &&
            <Fragment>
              <div className='photo__top'>
                <Link
                  to={`/users/${photo.username}`}
                  className='photo__user'
                >
                  <img className='photo__avatar' src={photo.avatar} alt={`${photo.username} avatar`} />
                  <h2>{photo.username}</h2>
                </Link>
                
                
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
              <img className='photo__img' src={photo.url} alt={photo.tags.replace(/,/g, ' ')} />
              <div className='photo__bottom'>
                {editOpen &&
                  <PhotoEdit
                    location={location}
                    description={description}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                  />
                }
                
                {this.context.user && this.context.user.username === photo.username
                  ? (
                    <button
                      className='btn photo__btn'
                      onClick={this.handleEditClick}
                    >
                      <span className='btn__icon'>
                        {editOpen ? (
                          <svg className='btn__icon--edit' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24'>
                            <rect width='18' height='18' x='3' y='3' rx='2' ry='2'/>
                            <path d='M9 9l6 6M15 9l-6 6'/>
                          </svg>
                        ) : (
                          <svg className='btn__icon--edit' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24'>
                            <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'/>
                            <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'/>
                          </svg>
                        )}
                      </span>
                      Edit
                    </button>
                  ) : null
                }
              </div>
            </Fragment>
          }
        </section>
      );
    }
  }
}

export default withRouter(Photo);