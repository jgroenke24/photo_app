import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import db from '../db';

const ROUNDS = 12;
const findOneQueryText = 'SELECT * FROM users WHERE email = $1';
const createUserQueryText = 'INSERT INTO users(email, password) VALUES($1, $2) returning *';

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (username, password, done) => {
      try {
        
        // Search database for a user with the username (email) provided
        const { rows: dbUserRows } = await db.query(findOneQueryText, [ username ]);
        const user = dbUserRows[0];
        if (user) {
          return done(null, false, { message: 'That email has been used to register an account already!' });
        }
        
        // Use bcrypt to hash the password for the new user
        const hashedPassword = await bcrypt.hash(password, ROUNDS);
        
        // Add the user to the database
        const { rows: dbNewUserRows } = await db.query(createUserQueryText, [ username, hashedPassword ]);
        const newUser = dbNewUserRows[0];
        return done(null, newUser, { message: 'User registered!'});
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (username, password, done) => {
      try {

        // Search database for a user with the username (email) provided
        const { rows } = await db.query(findOneQueryText, [ username ]);
        const user = rows[0];
        
        // If a user is not found, return the message that no user was found
        if (!user) {
          return done(null, false, { message: 'Could not find user' });
        }
        
        // Use bcrypt to check if password matches hashed password
        const passwordsMatch = await bcrypt.compare(password, user.password);
        
        if (passwordsMatch) {
          return done(null, user, { message: 'Log in successful!' });
        } else {
          return done(null, false, { message: 'Passwords do not match' });
        }
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  'jwt',
  new JWTstrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        
        // Search database for a user with the username (email) in the jwt
        const user = await db.query(findOneQueryText, [ jwt_payload.id ]);
        
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);