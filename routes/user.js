import Router from 'express-promise-router';
import passport from 'passport';
import Users from '../controllers/users';
const router = new Router();

// Register user route
router.post('/signup', passport.authenticate('register', { session: false }), Users.register);

// Register user route
router.post('/login', Users.login);

// test authorization route
router.get('/dashboard',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req);
    
    res.json({
      message: 'It worked!',
    });
  }
);

export default router;