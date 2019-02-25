import passport from 'passport';
import jwt from 'jsonwebtoken';
import db from '../db';
import cloudinary from 'cloudinary';

const Users = {
  
  // Login or register a user
  auth(action) {
    return (req, res) => {
      passport.authenticate(action, { session: false }, (err, user, info) => {
        
        if (err) {
          return res.status(500)
            .json({
              error: 'Internal error. Please try again.',
            });
        }
        
        if (info) {
          return res.status(401)
            .json({
              error: info.message,
            });
        }
        
        req.logIn(user, { session: false }, (err) => {
          if (err) {
            return res.status(500)
              .json({
                error: 'Internal error. Please try again.',
              });
          }
          
          // Sign the jwt
          const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET, {
            expiresIn: '24h',
          });
          
          // Send the token to the user
          return res.status(200)
            .cookie('jwt', token, {
              httpOnly: true,
              secure: true,
            })
            .json({ 
              ...action === 'login' ? {message: 'Login successful'} : {message: 'Registered successfully! You are now logged in!'},
              success: true,
              user: {
                id: user.id,
                username: user.username,
              }
            });
        });
      })(req, res);
    };
  },
  
  // Authenticate the json web token
  jwt() {
    return (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {

        if (err) {
          return next(err);
        }

        // If a user is authenticated, pass user data in req.user
        if (user) {
          const { id, username } = user;
          req.user =  {
            id,
            username,
          };
        }
        
        next();
      })(req, res, next);
    };
  },
  
  // Get one User's information
  async getUserAll(req, res) {
    const findOneUser = `
    SELECT id, username, joined, avatar, bio, firstname, lastname, location
    FROM users
    WHERE username = $1`;
    
    const findUsersPhotosWithLikesQuery = `
      SELECT photos.*, users.username, users.avatar, count(likes.photoid) AS likes
      FROM photos
      FULL OUTER JOIN users on photos.userid = users.id
      FULL OUTER JOIN likes on photos.id = likes.photoid
      WHERE photos.userid = $1
      GROUP BY photos.id, users.username, users.avatar
      ORDER BY photos.created DESC
    `;
    
    try {
      const { rows } = await db.query(findOneUser, [ req.params.username ]);
      const profileUser = rows[0];
      
      // If profile user was not found in database
      if (!profileUser) {
        return res.status(404).send('User not found');
      }
      
      const { rows: photos } = await db.query(findUsersPhotosWithLikesQuery, [ profileUser.id ]);

      // A user is signed in (from jwt authentication)
      if (req.user) {
        
        // Find all the photos the signed in user has liked
        const findPhotosUserLikedQuery = 'SELECT photoid FROM likes WHERE userid = $1';
        const { rows: likedPhotos } = await db.query(findPhotosUserLikedQuery, [ req.user.id ]);
        
        // Create array of just photoids of photos signed in user has liked
        const photosLikedByUser = likedPhotos.map(row => row.photoid);
        
        // Map over all of the photos and add a boolean property likedByUser if the photo id is found in the array above
        const newPhotos = photos.map(photo => {
          photo.likedByUser = photosLikedByUser.includes(photo.id);
          return photo;
        });
        
        return res.status(200).json({
          profileUser,
          photos: newPhotos,
          user: req.user,
        });
      }
      
      // No user is signed in so just return the profile user and the photos
      return res.status(200).json({ profileUser, photos });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  // Get one users profile info
  async getUser (req, res) {
    const findOneUserQuery = `
      SELECT avatar, firstname, lastname, email, username, location, bio
      FROM users
      WHERE username = $1
    `;
    
    try {
      
      // A user must be signed in to see edit information
      // Signed in user must also be requesting their own user data.
      if (!req.user || req.user.username !== req.params.username) {
        return res.status(403).send('You\'re not allowed to edit this profile');
      }
      
      const { rows } = await db.query(findOneUserQuery, [ req.params.username ]);
      const profileUser = rows[0];
      
      // If profile user was not found in database
      if (!profileUser) {
        return res.status(404).send('User not found');
      }
      
      return res.status(200).json({ profileUser });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  // Update a user
  async updateUser (req, res) {
    const findOneUserQuery = `
      SELECT id, firstname, lastname, email, username, location, bio
      FROM users
      WHERE username = $1
    `;
    const updateUserQuery = `
      UPDATE users
      SET firstname = $1, lastname = $2, email = $3, username = $4, location = $5, bio = $6
      WHERE id = $7
      returning *
    `;
    
    // A user must be signed in to edit information
    // Signed in user must also be requesting their own user data.
    if (!req.user || req.user.username !== req.params.username) {
      return res.status(403).send('You are not allowed to edit this profile');
    }
    
    try {
      
      // First, get the correct row to update from the database
      const { rows: userRows } = await db.query(findOneUserQuery, [ req.params.username ]);
      const user = userRows[0];
      
      // If nothing comes back from the database, send 404 not found
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      
      const values = [
        req.body.firstname || user.firstname,
        req.body.lastname || user.lastname,
        req.body.email,
        req.body.username,
        req.body.location || user.location,
        req.body.bio || user.bio,
        user.id
      ];
      
      // Update the row in the database with the new data in the values array
      const response = await db.query(updateUserQuery, values);
      
      return res.status(200).json({ success: 'Profile updated!' });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  // Upload avatar for a user
  async uploadAvatar(req, res) {
    
    try {
      
      // A user must be signed in to edit information
      // Signed in user must also be requesting their own user data.
      if (!req.user || req.user.username !== req.params.username) {
        return res.status(403).send('You are not allowed to edit this profile');
      }
      
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      const updateUserAvatarQuery = `UPDATE users
        SET avatar = $1
        WHERE id = $2
        returning *
      `;
      
      const values = [
        result.secure_url,
        req.user.id
      ];
      const { rows } = await db.query(updateUserAvatarQuery, values);
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

export default Users;