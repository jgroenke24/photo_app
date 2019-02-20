import React, { Component, Fragment } from 'react';

class EditProfile extends Component {
  render() {
    return (
      <section className='edit'>
        <h1>Edit Profile</h1>
        <form>
          <label>
            <img
              src='https://smallbusinessbc.ca/wp-content/themes/sbbcmain/images/circle-icons/icon-education.svg'
              alt='avatar'
            />
            <input type='file' name='image' accept='image/*' style={{display: 'none'}}/>
            <p>Change profile image</p>
          </label>
        </form>
        
        <form>
          <label htmlFor='firstName'>First name</label>
          <input id='firstName' type='text' name='firstName' />
          
          <label htmlFor='lastName'>Last name</label>
          <input id='lastName' type='text' name='lastName' />
          
          <label htmlFor='email'>Email</label>
          <input id='email' type='email' name='email' />
          
          <label htmlFor='username'>Username</label>
          <input id='username' type='text' name='username' />
          
          <label htmlFor='location'>Location</label>
          <input id='location' type='text' name='location' />
          
          <label htmlFor='bio'>Bio</label>
          <div style={{position: 'relative'}}>
            <textarea
              id='bio'
              name='bio'
              rows='4'
              style={{
                display: 'block',
                width: '100%',
              }}
            ></textarea>
            <span
              style={{
                position: 'absolute',
                right: '16px',
                bottom: '16px',
              }}
            >150</span>
          </div>
          
          <input type='submit' value='Edit profile' />
        </form>
      </section>
    );
  }
}

export default EditProfile;