import passport from 'passport';
import jwt from 'jsonwebtoken';
import db from '../db';

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
  async getOne(req, res) {
    const findOneUser = `
    SELECT users.id, users.username, users.joined, users.avatar, users.bio, users.firstname, users.lastname, users.location
    FROM users
    WHERE users.username = $1`;
    
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
  
  
};

export default Users;