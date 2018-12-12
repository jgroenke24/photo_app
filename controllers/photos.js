import uuidv4 from 'uuid/v4';
import db from '../db';

const Photos = {
  
  // Create a photo
  async create(req, res) {
    const text = `INSERT INTO
      photos(id, url, likes)
      VALUES($1, $2, $3)
      returning *`;
    const values = [
      uuidv4(),
      req.body.url,
      1
    ];
    
    try {
      const { rows } = await db.query(text, values);
      // return res.status(200).send(rows[0]);
      console.log(rows, 'created!');
      return res.redirect('/photos');
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  
  // Get all photos
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM photos';
    
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      // return res.status(200).send({ rows, rowCount });
      console.log(rows);
      res.render('photos/index', { photos: rows });
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
      
      // return res.status(200).send(rows[0]);
      console.log(rows[0]);
      return res.render('photos/show', { photo: rows[0] });
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
      const { rows } = await db.query(deleteQuery, [ req.params.id ]);
      
      // If nothing comes back from the database, send 404 not found
      if (!rows[0]) {
        return res.status(404).send({ message: 'Photo not found' });
      }
      
      // return res.status(204).send({ message: 'Photo deleted' });
      console.log('deleted');
      return res.redirect('/photos');
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};

export default Photos;