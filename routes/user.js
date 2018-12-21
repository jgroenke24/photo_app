import Router from 'express-promise-router';
import passport from 'passport';
import Users from '../controllers/users';
const router = new Router();

// Register user route
router.post('/signup', passport.authenticate('register', { session: false }), Users.register);

// Register user route
router.post('/login', Users.login);

export default router;