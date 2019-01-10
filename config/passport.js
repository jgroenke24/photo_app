import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTstrategy } from 'passport-jwt';
import db from '../db';

const ROUNDS = 12;
const findOneQueryText = 'SELECT * FROM users WHERE email = $1';
const createUserQueryText = 'INSERT INTO users(email, username, password) VALUES($1, $2, $3) returning *';

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    async (req, username, password, done) => {
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
        const { rows: dbNewUserRows } = await db.query(createUserQueryText, [ username, req.body.username, hashedPassword ]);
        const newUser = dbNewUserRows[0];
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
        const { rows } = await db.query(findOneQueryText, [ username ]);
        const user = rows[0];
        
        // If a user is not found, return the message that no user was found
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        
        // Use bcrypt to check if password matches hashed password
        const passwordsMatch = await bcrypt.compare(password, user.password);
        
        if (passwordsMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (err) {
        done(err);
      }
    }
  )
);

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  return token;
};

passport.use(
  'jwt',
  new JWTstrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        
        // Search database for a user with the username (email) in the jwt
        const { rows: dbUser } = await db.query(findOneQueryText, [ jwt_payload.id ]);
        const user = dbUser[0];
        
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