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
              src='https://res.cloudinary.com/dnsi1pnmo/image/upload/c_scale,w_150/v1550333327/default-avatar.png'
              alt='default avatar'
            />
            <div>
              {profileUser.username}
            </div>
          </Fragment>
        }
      </section>
    );
  }
}

export default Profile;