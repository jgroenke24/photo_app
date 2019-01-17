import React from 'react';

const Hero = (props) => (
  <section className='hero'>
    <picture className='hero__pic'>
      <source sizes='100vw' media='(min-width: 768px)' srcSet='https://res.cloudinary.com/dnsi1pnmo/image/upload/c_fill,h_600,w_1000/v1547666819/1923F555-A1C9-4CDE-8203-7FE4622A038C.jpg 4x'></source>
      <img className='hero__img' src='https://res.cloudinary.com/dnsi1pnmo/image/upload/v1547666819/1923F555-A1C9-4CDE-8203-7FE4622A038C.jpg' alt='Iceland plane wreck' />
    </picture>
    <div className='hero__header'>
      <h1>PicShareApp</h1>
      <p>Check out some cool photography.</p>
      <p>Share your own photos too!</p>
    </div>
  </section>
);

export default Hero;