import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

class Photo extends Component {
  state = {
    photo: null,
    showError: false,
    showSubmissionError: false,
  };
  
  async componentDidMount() {
    
    if (this.props.location.state) {
      const { id, url, tags, username, likes } = this.props.location.state;
      this.setState(() => {
        return {
          photo: {
            id,
            url,
            tags,
            username,
            likes,
          }
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
        const { photo } = response.data;
        this.setState(() => {
          return {
            photo,
          };
        });
      } catch (error) {
        console.log(error.response);
        this.setState(() => {
          return {
            showError: true,
          };
        });
      }
    }
  }
  
  handleDelete = async () => {
    try {
      await axios.delete(`https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos/${this.props.match.params.photoId}`);
      this.props.history.push('/');
    } catch (error) {
      console.log(error);
      this.setState(() => {
        return {
          showSubmissionError: true,
        };
      });
    }
  }
  
  render() {
    const { photo, showError, showSubmissionError } = this.state;

    if (showError) {
      return (
        <section className='container'>
          <p>An error occurred. Please try again</p>
          <Link to='/'>
            Home
          </Link>
        </section>
      );
    }
    
    return (
      <section className='photo'>
        {showSubmissionError &&
          <div className='alert alert-danger' role='alert'>
            Something went wrong with your request. Please try again.
          </div>
        }
        
        {!photo && <p>Loading photo...</p>}
        
        {photo &&
          <Fragment>
            <div className='photo__top'>
              <h2 className='photo__user'>{photo.username}</h2>
              <button className='btn photo__btn'>
                <span className='btn__icon'>
                  <svg className='btn__icon--heart' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
                  </svg>
                </span>
                {photo.likes}
              </button>
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

export default withRouter(Photo);