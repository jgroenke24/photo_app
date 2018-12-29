import Router from 'express-promise-router';
import passport from 'passport';
import Users from '../controllers/users';
const router = new Router();

// Register user route
router.post('/signup', Users.auth('register'));

// Register user route
router.post('/login', Users.auth('login'));

// test authorization route
router.get('/dashboard',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      message: 'This is authorized information',
    });
  }
);

export default router;