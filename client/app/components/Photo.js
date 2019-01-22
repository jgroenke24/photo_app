import React, { Component } from 'react';
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
      <section className='container'>
        {showSubmissionError &&
          <div className='alert alert-danger' role='alert'>
            Something went wrong with your request. Please try again.
          </div>
        }
        
        <div className='row'>
          {!photo && <p>Loading photo...</p>}
          
          {photo &&
            <div className='col-6'>
              <div className='card'>
                <img className='card-img-top' src={photo.url} alt={photo.filename}/>
                <div className='card-body'>
                  <h5 className='card-title'>
                    {photo.filename}
                  </h5>
                  <button className='btn btn-danger' onClick={this.handleDelete}>Delete</button>
                </div>
              </div>
            </div>
          }
        </div>
      </section>
    );
  }
}

export default withRouter(Photo);