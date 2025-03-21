var express = require('express');
var router = express.Router();
const passport = require('passport'),
      authService = require('../authentication/authService'),
      authController = require("../controllers/authController"),
      userController = require("../controllers/userController");

router.get('/', (req,res) => { res.redirect('/login'); });

router.get('/login', authService.renderLogin);
router.post('/login', authService.login, authService.setCookie); // authService.renderHome);

router.get('/register', authService.renderRegister);
router.post('/register', passport.authenticate('local-signup', { session: false }), authService.redirectLogin);

router.get('/logout', authController.authenticateJWT, authService.logout, authService.renderLogin);

router.get('/home', authController.authenticateJWT, authService.renderHome);

router.get('/protected',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      res.status(200).json({
        message: 'Welcome to the protected route!'
      });
    }
);

router.get('/404', (req,res) => { res.render('404'); })

router.get('/chat', authController.authenticateJWT, userController.renderChat)

module.exports = router;
