import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Photos from './Photos';

class Profile extends Component {
  state = {
    profileUser: null,
    user: null,
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
      
      const { profileUser, user } = response.data;
      
      // Update state with profile user and photos
      this.setState(() => {
        return {
          profileUser,
          user: user || null,
        };
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  render() {
    
    const { profileUser } = this.state;
    
    return (
      <section className='profile'>
        {!profileUser && <div>Loading user...</div>}
        
        {profileUser &&
          <Fragment>
            <img
              src={profileUser.avatar.replace('image/upload/', 'image/upload/c_scale,w_160/')}
              alt={`${profileUser.username} avatar`}
              className='profile__image'
            />
            <div className='profile__info'>
              <h1 className='profile__name'>
                {profileUser.firstName && profileUser.lastName
                  ? `${profileUser.firstName} ${profileUser.lastName}`
                  : profileUser.username
                }
              </h1>
            
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
              <div className='profile__location'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24'>
                  <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/>
                  <circle cx='12' cy='10' r='3'/>
                </svg>
                New York
              </div>
            </div>
          </Fragment>
        }
      </section>
    );
  }
}

export default Profile;