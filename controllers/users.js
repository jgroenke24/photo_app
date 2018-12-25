import passport from 'passport';
import jwt from 'jsonwebtoken';

const Users = {
  
  // Register a user
  async register(req, res, next) {
    return res.json({
      message: 'Signup successful!',
      user: req.user,
    });
  },
  
  // Login a user
  login(req, res, next) {
    passport.authenticate('login', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return next(info);
      }
      
      req.logIn(user, { session: false }, (err) => {
        if (err) {
          return next(err);
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
          message: 'Login successful',
          success: true,
        });
      });
    })(req, res, next);
  }
};

export default Users;