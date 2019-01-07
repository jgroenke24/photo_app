import db from '../db';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const ROUNDS = 12;

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
      
      res.status(200).send('recovery email sent');
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  
  // Reset password form
  async verifyToken(req, res) {
    const token = req.params.token;

    try {
      
      // Find user with token from url parameter and only if the token has not expired
      const findUserWithTokenQuery = 'SELECT * FROM users WHERE reset_token = $1 AND token_expiration > $2';
      const { rows: dbUserRows } = await db.query(findUserWithTokenQuery, [ token, Date.now() ]);
      const user = dbUserRows[0];
      
      // If the token was not found or the token has expired
      if (!user) {
        return res.status(404).json({ error: 'Password reset link in invalid or has expired' });
      }
      
      // The token was valid
      res.status(200).json({ user: user.email, message: 'Password reset link was valid!' });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  
  // Reset password
  async reset(req, res) {
    const token = req.params.token;
    const { password } = req.body;

    try {
      
      // Find user with token from url parameter and only if the token has not expired
      const findUserWithTokenQuery = 'SELECT * FROM users WHERE reset_token = $1 AND token_expiration > $2';
      const { rows: dbUserRows } = await db.query(findUserWithTokenQuery, [ token, Date.now() ]);
      const user = dbUserRows[0];
      
      // If the token was not found or the token has expired
      if (!user) {
        return res.status(404).json({ error: 'Password reset link in invalid or has expired' });
      }
      
      // The token was valid so hash the new password with bcrypt
      const hashedPassword = await bcrypt.hash(password, ROUNDS);
      
      // Update the user in the database with the new password
      const updateUserPasswordQuery = `UPDATE users
        SET password = $1, reset_token = $2, token_expiration = $3
        WHERE email = $4
        returning *`;
      const values = [
        hashedPassword,
        null,
        null,
        user.email
      ];
      const { rows: dbUpdatedUser } = await db.query(updateUserPasswordQuery, values);
      const updatedUser = dbUpdatedUser[0];
      console.log(updatedUser);
      
      // Send confirmation email with nodemailer
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
        subject: 'PicShare Password Change',
        text: `This is a confimation that the password for your account (${user.email}) has just been changed.\n\n`,
      };
      const mailerResponse = await transporter.sendMail(mailOptions);
      console.log('response from mailer', mailerResponse);
      
      res.status(200).json({ message: 'Password updated!' });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};

export default ResetPassword;