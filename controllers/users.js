import passport from 'passport';
import jwt from 'jsonwebtoken';

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
          req.user = user.username;
        }
        
        next();
      })(req, res, next);
    };
  }
};

export default Users;