import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from './AppContext';
import axios from 'axios';
import Photos from './Photos';

class Profile extends Component {
  static contextType = AppContext;
  
  state = {
    loading: true,
    profileUser: null,
    user: null,
    photos: null,
    responseError: null,
  }
  
  async componentDidMount() {
    try {
      
      // Get user and user photos from server
      const response = await axios
        .get(
          `https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/users/${this.props.match.params.username}`,
          {
            withCredentials: true,
          }
        );
      
      const { profileUser, user, photos } = response.data;
      
      // Update state with profile user and photos
      this.setState(() => {
        return {
          profileUser,
          photos,
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
  
  render() {
    
    const { loading, profileUser, photos, user, responseError } = this.state;
    
    return (
      <Fragment>
        <section className='profile'>
          {loading && <div>Loading user...</div>}
          
          {responseError && <div>{responseError}</div>}
          
          {profileUser &&
            <Fragment>
              <div className='profile__body'>
                <img
                  src={profileUser.avatar}
                  alt={`${profileUser.username} avatar`}
                  className='profile__image'
                />
                <div className='profile__info'>
                  <div className='profile__name'>
                    <h1>
                      {profileUser.firstName && profileUser.lastName
                        ? `${profileUser.firstName} ${profileUser.lastName}`
                        : profileUser.username
                      }
                    </h1>
                    {this.context.user && this.context.user.username === profileUser.username 
                      ? (
                        <Link
                          to={`/users/${profileUser.username}/edit`}
                          className='btn photo__btn'
                        >
                          Edit Profile
                        </Link>
                      ) : null
                    }
                  </div>
                
                  {profileUser.bio ? (
                    <p className='profile__bio'>{profileUser.bio}</p>
                  ) : (
                    <p className='profile__bio'>
                      Check out photos posted by
                      {profileUser.firstName && profileUser.lastName
                        ? ` ${profileUser.firstName}`
                        : ` ${profileUser.username}`
                      }
                    </p>
                  )}
                  
                  {profileUser.location &&
                    <div className='profile__location'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24'>
                        <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/>
                        <circle cx='12' cy='10' r='3'/>
                      </svg>
                      {profileUser.location}
                    </div>
                  }
                </div>
              </div>
              <div className='profile__footer'>
                {photos ? `${photos.length} Photos` : `0 Photos`}
              </div>
            </Fragment>
          }
        </section>
        {photos && <Photos photos={photos} user={user} />}
      </Fragment>
    );
  }
}

export default Profile;