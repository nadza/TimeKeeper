const passport = require('passport');
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");
const User = require("../models/userModel");

const expirationtimeInMs = process.env.JWT_EXPIRATION_TIME;
const secret = process.env.JWT_SECRET;

module.exports = {
    renderLogin: (req, res) => {
        res.render('authViews/login');
    },

    login: async (req, res, next) => {
        try {
            const {username, password} = req.body;
            const user = await authController.userExistency(username);
            if (user) {
                const isMatch = await authController.matchPassword(password, user.password);
                if (isMatch) {
                    res.locals.user = user;
                    const currentTime = new Date();
                    await authController.logLogin(username, currentTime);
                    next();
                } else {
                    res.status(400).json({error: 'Incorrect password'}); // ajax da ne valja
                }
            } else {
                res.status(400).json({error: 'Incorrect username'}); // ajax da ne valja
            }
        } catch (error) {
            res.status(500).json({error}); // ona stranica za erore LOL
        }
    },

    setCookie: async (req, res, next) => {
        let user;

        if (res.locals.user) {
            user = res.locals.user;
        } else res.status(400).json({error: 'user not found'});

        const payload = {
            username: user.username,
            role: user.role,
            expiration: Date.now() + parseInt(expirationtimeInMs)
        };
//JSON.stringify(
        const token = jwt.sign(payload, secret);

        res.cookie('jwt',
            token, {
                httpOnly: true,
                secure: false //--> SET TO TRUE ON PRODUCTION
            });
        //.status(200).json({ message: 'You have logged in :D' });
        //next(); //
        res.redirect('/home');
    },

    renderHome: async (req, res) => {
        try {
            const jwtPayload = req.user;
            const username = jwtPayload.username;
            const role = jwtPayload.role;
            const user = await authController.userExistency(username);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.render('home', { username: user.username, first_name: user.first_name, userRole: user.role });
        } catch (error) {
            console.error('Error rendering home:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    logout: async (req, res, next) => {
        console.log(req.user);
        if (req.cookies['jwt']) {
            const currentTime = new Date();
            await authController.logLogout(req.user.username, currentTime);
            res.clearCookie('jwt');
            //.status(200).json({message: 'You have logged out'});
            //next();
            res.redirect('/login');
        } else {
            res.status(401).json({error: 'Invalid jwt -> Nemate pristup ovoj ruti'}); // stranica za errore
        }
    },

    renderRegister: async (req, res) => {
        var jobTitles;
        try {
            jobTitles = await authController.getJobTitles();
        } catch (error) {
            res.status(400).json({error: "Error fetching job titles: ${error.message}" }); // ajax da ne valja?? lol
        }
        if(jobTitles)
            res.render('authViews/register', { jobTitles: jobTitles });
    },

    redirectLogin: (req, res) => {
        res.redirect('/login');
    },


}