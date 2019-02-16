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
    // const findOneUser = `
    //   SELECT users.username, users.joined, users.avatar, photos.*
    //   FROM users
    //   RIGHT OUTER JOIN photos ON users.id = photos.userid
    //   WHERE users.username = $1
    // `;
    
    try {
      const { rows } = await db.query(findOneUser, [ req.params.username ]);
      const profileUser = rows[0];
      
      // If profile user was not found in database
      if (!profileUser) {
        return res.status(404).send('User not found');
      }
      
      // A user is signed in (from jwt authentication)
      if (req.user) {
        return res.status(200).json({
          profileUser,
          user: req.user,
        });
      }
      
      // No user is signed in so just return the profile user
      return res.status(200).json({ profileUser });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  
};

export default Users;