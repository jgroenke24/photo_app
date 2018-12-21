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
        const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET);
        
        // Send the token to the user
        return res.json({ token });
      });
    })(req, res, next);
  }
};

export default Users;