const passport = require('passport'),
      passportJWT = require('passport-jwt'),
      JWTStrategy = passportJWT.Strategy,
      LocalStrategy = require("passport-local"),
      authController = require("../controllers/authController");

const secret = process.env.JWT_SECRET;

const cookieExtractor = req => {
    let jwt = null;

    if (req && req.cookies) {
        jwt = req.cookies['jwt'];
    }

    return jwt;
};

passport.use(
    'jwt',
    new JWTStrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: secret
        },
    (jwtPayload, done) => {
    const { expiration } = jwtPayload;

    if (Date.now() > expiration) {
        done('TokenExpiredError', false); // 'Unauthorized'
    }
    //console.log(jwtPayload);
    done(null, jwtPayload);
}));

passport.use(
    'local-signup',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
        },
    async (req, email, password, done) => {
        //console.log("TU");
        try {
            const userExists = await authController.emailExistency(email);
            if (userExists) return done(null, false);

            const { username, first_name, last_name, job_title } = req.body;
            const newUser = await authController.createUser(email, password, username, first_name, last_name, job_title);

            return done(null, newUser);
        } catch (error) {
            done(error);
        }
    }));

