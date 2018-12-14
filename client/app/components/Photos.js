import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Photos extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      photos: null,
    };
  }
  
  async componentDidMount() {
    try {
      const response = await fetch('https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos');
      console.log(response);
      const result = await response.json();
      console.log(result);
      this.setState({
        photos: result.rows
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  render() {
    const { photos } = this.state;
    return (
      <React.Fragment>
        <h1>Photos will go here</h1>
        <div className='container'>
          <div className='row'>
            {!photos && <p>Loading photos...</p>}
        
            {photos &&
              photos.map(photo => {
              return (
                <div key={photo.id} className='col-sm-12 col-md-3 col-lg-4'>
                  <Link to={`/photos/${photo.id}`}>
                    <div className='card'>
                      <img className='card-img-top' src={photo.url} alt={photo.name}/>
                      <div className='card-body'>
                        <h5 className='card-title'>
                          {photo.name}
                        </h5>
                      </div>
                    </div>
                  </Link>
                </div>
              )})
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Photos;