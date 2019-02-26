import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

class Photo extends Component {
  state = {
    loading: true,
    photo: null,
    user: null,
    responseError: null,
    showSubmissionError: false,
    likedByUser: null,
    likes: null,
  };
  
  async componentDidMount() {
    
    if (this.props.location.state) {
      const { id, url, tags, username, avatar, likes, likedByUser, user } = this.props.location.state;
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
  
  render() {
    const { loading, photo, user, responseError, showSubmissionError, likedByUser, likes } = this.state;
    
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
                <button className='btn photo__btn--danger' onClick={this.handleDelete}>Delete</button>
              </div>
            </Fragment>
          }
        </section>
      );
    }
  }
}

export default withRouter(Photo);