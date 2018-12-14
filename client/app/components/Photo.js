import React, { Component } from 'react';

class Photo extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      photo: null,
    };
  }
  
  async componentDidMount() {
    try {
      const response = await fetch(`https://webdevbootcamp-jorge-groenke.c9users.io:8081/api/photos/${this.props.match.params.photoId}`);
      const photo = await response.json();
    
      this.setState({
        photo,
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  render() {
    const { photo } = this.state;
    
    return (
      <React.Fragment>
        <div className='container'>
          <div className='row'>
            {!photo && <p>Loading photo...</p>}
        
            {photo &&
              <div className='col-6'>
                <div className='card'>
                  <img className='card-img-top' src={photo.url} alt={photo.name}/>
                  <div className='card-body'>
                    <h5 className='card-title'>
                      {photo.name}
                    </h5>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Photo;