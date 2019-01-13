import Router from 'express-promise-router';
import passport from 'passport';
import Users from '../controllers/users';
import ResetPassword from '../controllers/resetPasswords';
import { check, validationResult } from 'express-validator/check';
const router = new Router();

// Return an array of validation depending on which action is taking place
const validationChains = (action) => {
  
  switch (action) {
    
    case 'signup': {
      return [
        check('email')
          .isEmail().withMessage('You must enter a proper email')
          .normalizeEmail(),
        check('username')
          .matches(/^\w+$/)
          .withMessage('Username can only contain letters, numbers and underscores'),
        check('password')
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
          .withMessage('Password must be at least 8 characters and at least 1 of the following: uppercase, lowercase, number and symbol')
          .custom((value, {req, loc, path}) => {
            if (value !== req.body.passwordCheck) {
              return false;
            }
            return value;
          })
          .withMessage('Passwords must match')
      ];
    }
    
    case 'login': {
      return [
        check('email')
          .isEmail().withMessage('You must enter a proper email')
          .normalizeEmail(),
        check('password')
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
          .withMessage('Invalid password')
      ];
    }
    
    case 'forgotpassword': {
      return [
        check('email')
          .isEmail().withMessage('You must enter a proper email')
          .normalizeEmail()
      ];
    }
    
    case 'resetpassword': {
      return [
        check('password')
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
          .withMessage('Password must be at least 8 characters and at least 1 of the following: uppercase, lowercase, number and symbol')
          .custom((value, {req, loc, path}) => {
            if (value !== req.body.passwordCheck) {
              return false;
            }
            return value;
          })
          .withMessage('Passwords must match')
      ];
    }
  }
};

// Middleware to check validation results from validation chain before any authentication or db calls
const validateMiddleware = (req, res, next) => {
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    
    // Return just the message part of the error
    return {
      element: param,
      message: msg,
    };
  };
  
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register user route
router.post('/signup', validationChains('signup'), validateMiddleware, Users.auth('register'));

// Register user route
router.post('/login', validationChains('login'), validateMiddleware, Users.auth('login'));

// test authorization route
router.get('/dashboard', Users.jwt(), (req, res) => {
  if (req.user) {
    return res.json({ message: 'A user is signed in' });
  }
  
  return res.json({ message: 'Unauthorized' });
});

// forgot password route
router.post('/forgotpassword', validationChains('forgotpassword'), validateMiddleware, ResetPassword.sendEmail);

// reset password route
router.get('/resetpassword/:token', ResetPassword.verifyToken);

// reset password on server
router.post('/resetpassword/:token', validationChains('resetpassword'), validateMiddleware, ResetPassword.verifyToken, ResetPassword.reset);

router.get('/', Users.jwt(), (req, res) => {
  if (req.user) {
    return res.status(200).json({ user: req.user });
  }
  return res.status(200).send('welcome');
});

export default router;