import Router from 'express-promise-router';
import passport from 'passport';
import Users from '../controllers/users';
import ResetPassword from '../controllers/resetPasswords';
import { check, validationResult } from 'express-validator/check';
import multer from 'multer';
const router = new Router();

// Configure multer
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const imageFilter = (req, file, cb) => {
  
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter});

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
          .withMessage('Min 8 char & 1 of each: uppercase, lowercase, number, symbol'),
        check('passwordCheck')
          .custom((value, {req, loc, path}) => {
            if (value !== req.body.password) {
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
          .withMessage('Min 8 char & 1 of each: uppercase, lowercase, number, symbol'),
        check('passwordCheck')
          .custom((value, {req, loc, path}) => {
            if (value !== req.body.password) {
              return false;
            }
            return value;
          })
          .withMessage('Passwords must match')
      ];
    }
    
    case 'updateprofile': {
      return [
        check('firstname')
          .optional({ checkFalsy: true })
          .trim(),
        check('lastname')
          .optional({ checkFalsy: true })
          .trim(),
        check('email')
          .isEmail().withMessage('You must enter a proper email')
          .normalizeEmail(),
        check('username')
          .matches(/^\w+$/)
          .withMessage('Username can only contain letters, numbers and underscores'),
        check('location')
          .optional({ checkFalsy: true })
          .trim(),
        check('bio')
          .optional({ checkFalsy: true })
          .trim()
          .isLength({ min: 0, max: 150 })
          .withMessage('Bio cannot exceed 150 characters')
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

// Login user route
router.post('/login', validationChains('login'), validateMiddleware, Users.auth('login'));

// test authorization route
router.get('/dashboard', Users.jwt(), (req, res) => {
  if (req.user) {
    return res.json({ message: 'A user is signed in' });
  }
  
  return res.json({ message: 'Unauthorized' });
});

// Forgot password route
router.post('/forgotpassword', validationChains('forgotpassword'), validateMiddleware, ResetPassword.sendEmail);

// Reset password route
router.get('/resetpassword/:token', ResetPassword.verifyToken);

// Reset password on server
router.post('/resetpassword/:token', validationChains('resetpassword'), validateMiddleware, ResetPassword.verifyToken, ResetPassword.reset);

router.get('/', Users.jwt(), (req, res) => {
  if (req.user) {
    return res.status(200).json({ user: req.user });
  }
  return res.status(200).send('welcome');
});

// Show route - Get a users profile with all their photos
router.get('/api/users/:username', Users.jwt(), Users.getUserAll);

// Edit route - Get a users profile information
router.get('/api/users/:username/edit', Users.jwt(), Users.getUser);

// Update route - Update a user profile information
router.put('/api/users/:username', Users.jwt(), validationChains('updateprofile'), validateMiddleware, Users.updateUser);

// Upload user avatar to cloudinary
router.post('/api/users/:username/avatar', Users.jwt(), upload.single('image'), Users.uploadAvatar);

export default router;