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
        const user = await db.query(findOneQueryText, [ username ]);
        if (user) {
          return done(null, false, { message: 'That email has been used to register an account already!' });
        }
        
        // Use bcrypt to hash the password for the new user
        const hashedPassword = await bcrypt.hash(password, ROUNDS);
        
        // Add the user to the database
        const newUser = await db.query(createUserQueryText, [ username, hashedPassword ]);
        return done(null, newUser);
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
        const user = await db.query(findOneQueryText, [ username ]);
        
        // If a user is not found, return the message that no user was found
        if (!user) {
          return done(null, false, { message: 'Could not find user' });
        }
        
        // Use bcrypt to check if password matches hashed password
        const passwordsMatch = await bcrypt.compare(password, user.password);
        
        if (passwordsMatch) {
          return done(null, user);
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
        return done(err);
      }
    }
  )
);