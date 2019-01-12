import uuidv4 from 'uuid/v4';
import db from '../db';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const Photos = {
  
  // Create a photo
  async create(req, res) {
    
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      const text = `INSERT INTO
      photos(id, filename, url, created, userid)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
      const values = [
        result.public_id,
        result.original_filename,
        result.secure_url,
        result.created_at,
        1
      ];
      const { rows } = await db.query(text, values);
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  // Get all photos
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM photos';
    
    try {
      const { rows } = await db.query(findAllQuery);
      
      // A user is signed in (from jwt authentication)
      if (req.user) {
        return res.status(200).json({
          user: req.user,
          photos: rows,
        });
      }
      
      // User is not signed is so just return the photos
      return res.status(200).json({ photos: rows });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  // Get a photo
  async getOne(req, res) {
    const text = 'SELECT * FROM photos WHERE id = $1';
    
    try {
      const { rows } = await db.query(text, [ req.params.id ]);
      
      // If nothing comes back from the database, send 404 not found
      if (!rows[0]) {
        return res.status(404).send({ message: 'Photo not found' });
      }
      
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  // Update a photo
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM photos WHERE id = $1';
    const updateOneQuery = `UPDATE photos
      SET url = $1, likes = $2
      WHERE id = $3
      returning *`;
      
    try {
      
      // First, get the correct row to update from the database
      const { rows } = await db.query(findOneQuery, [ req.params.id ]);
      
      // If nothing comes back from the database, send 404 not found
      if (!rows[0]) {
        return res.status(404).send({ message: 'Photo not found' });
      }
      
      const values = [
        req.body.url || rows[0].url,
        req.body.likes || rows[0].likes,
        req.params.id
      ];
      
      // Update the row in the database with the new data in the values array
      const response = await db.query(updateOneQuery, values);
      // return res.status(200).send(response.rows[0]);
      return res.redirect('/photos/' + req.params.id);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  // Delete a photo
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM photos WHERE id = $1 returning *';
    
    try {
      await cloudinary.v2.uploader.destroy(req.params.id);
      const { rows } = await db.query(deleteQuery, [ req.params.id ]);
      
      // If nothing comes back from the database, send 404 not found
      if (!rows[0]) {
        return res.status(404).send('Photo not found');
      }
      
      return res.status(204).send('Photo deleted');
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  // Like a photo
  async like(req, res) {
    const findLikeQuery = 'SELECT * FROM likes WHERE userid = $1';
    
    try {
      
      // See if the user has already liked the photo
      const { rows } = await db.query(findLikeQuery, [ 2 ]);
      console.log(req.params.id);
      console.log(rows[0]);
      
      // If a user was returned, remove the like
      if (rows[0]) {
        const removeLikeQuery = 'DELETE FROM likes WHERE userid = $1 returning *';
        const { rows: likeResponse } = await db.query(removeLikeQuery, [ 2 ]);
        console.log('like removed', likeResponse);
      } else {
        
        // No user was found so add a like
        console.log('in else');
        const addLikeQuery = 'INSERT INTO likes(photoid, userid) VALUES($1, $2) returning *';
        const { rows: likeResponse } = await db.query(addLikeQuery, [ req.params.id, 2 ]);
        console.log('like added', likeResponse);
      }
      return res.send('done');
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};

export default Photos;