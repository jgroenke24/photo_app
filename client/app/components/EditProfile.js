import React, { Component, Fragment } from 'react';

class EditProfile extends Component {
  render() {
    return (
      <section className='edit'>
        <h1 className='edit__header'>Edit Profile</h1>
        <form className='edit__picform'>
          <label className='edit__piclabel'>
            <img
              src='https://smallbusinessbc.ca/wp-content/themes/sbbcmain/images/circle-icons/icon-education.svg'
              alt='avatar'
              className='edit__avatar'
            />
            <input type='file' name='image' accept='image/*' />
            <p>Change profile image</p>
          </label>
        </form>
        
        <form className='edit__infoform'>
          <label className='edit__infolabel' htmlFor='firstName'>First name</label>
          <input className='edit__infoinput' id='firstName' type='text' name='firstName' />
          
          <label className='edit__infolabel' htmlFor='lastName'>Last name</label>
          <input className='edit__infoinput' id='lastName' type='text' name='lastName' />
          
          <label className='edit__infolabel' htmlFor='email'>Email</label>
          <input className='edit__infoinput' id='email' type='email' name='email' />
          
          <label className='edit__infolabel' htmlFor='username'>Username</label>
          <input className='edit__infoinput' id='username' type='text' name='username' />
          
          <label className='edit__infolabel' htmlFor='location'>Location</label>
          <input className='edit__infoinput' id='location' type='text' name='location' />
          
          <label className='edit__infolabel' htmlFor='bio'>Bio</label>
          <div className='edit__infotext'>
            <textarea id='bio' name='bio' rows='4'></textarea>
            <span>150</span>
          </div>
          
          <input className='btn form__btn' type='submit' value='Update profile' />
        </form>
      </section>
    );
  }
}

export default EditProfile;