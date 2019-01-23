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
    try {
      const response = await axios(`https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos/${this.props.match.params.photoId}`);
      const photo = response.data;

      this.setState(() => {
        return {
          photo,
        };
      });
    } catch (error) {
      this.setState(() => {
        return {
          showError: true,
        };
      });
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
              <h2 className='photo__user'>{photo.userid}</h2>
              <button className='btn photo__btn'>Like</button>
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