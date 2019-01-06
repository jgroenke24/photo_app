import db from '../db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const ResetPassword = {
  
  // Send password email
  async sendEmail(req, res) {
    const { email } = req.body;
    
    try {
      
      // Search for email in database
      const findUserQuery = 'SELECT * FROM users WHERE email = $1';
      const { rows: dbUserRows } = await db.query(findUserQuery, [ email ]);
      const user = dbUserRows[0];
      console.log('user that was found', user);
      
      // If nothing comes back from the database, send 404 not found
      if (!user) {
        return res.status(404).json({ error: 'Email not found' });
      }
      
      // Create a reset password token
      const token = crypto.randomBytes(20).toString('hex');
      console.log('token was created', token);
      
      // Update user info in database with reset token and reset token expiration (1hr from creation)
      const updateUserQuery = `UPDATE users
        SET reset_token = $1, token_expiration = $2
        WHERE email = $3
        returning *`;
      const values = [
        token,
        Date.now() + 3600000,
        email
      ];
      const { rows: dbUpdatedUserRows } = await db.query(updateUserQuery, values);
      console.log('updated user', dbUpdatedUserRows);
      
      // Set up email to send
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: 'PicShare Password Reset',
        text:
          `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `https://webdevbootcamp-jorge-groenke.c9users.io/resetpassword/${token}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
      
      const mailerResponse = await transporter.sendMail(mailOptions);
      console.log('response from mailer', mailerResponse);
      
      return res.status(200).send('recovery email sent');
    } catch (error) {
      return res.status(400).json({ error });
    }
  },
  
  // Get all photos
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM photos';
    
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).json({ rows, rowCount });
      // res.render('photos/index', { photos: rows });
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
      // return res.render('photos/show', { photo: rows[0] });
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
        return res.status(404).send({ message: 'Photo not found' });
      }
      
      // return res.status(204).send({ message: 'Photo deleted' });
      return res.redirect('/photos');
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};

export default ResetPassword;