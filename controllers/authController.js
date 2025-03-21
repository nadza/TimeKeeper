//https://www.makeuseof.com/passport-authenticate-node-postgres/
const db = require('../dbConfig'),
      bcrypt = require("bcryptjs"),
      User = require("../models/userModel");
const passport = require("passport");

module.exports = {
    userExistency: async (username) => {
        try {
            return await User.doesUserExist(username);
        } catch (error) {
            throw error;
        }
    },

    matchPassword: async (password, hashPassword) => {
        try {
            return await bcrypt.compare(password, hashPassword);
        } catch (error) {
            throw error;
        }
    },

    emailExistency: async (email) => {
        try {
            const useremail = await User.doesEmailExists(email);
            return useremail[0];
        } catch (error) {
            throw error;
        }
    },

    createUser: async (email, password, username, first_name, last_name, job_title) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        try {
            return await User.saveUser(email, hash, username, first_name, last_name, job_title);
        } catch (error) {
            throw error;
        }
    },

    getJobTitles: async () => {
        try {
            return await User.jobTitles();
        } catch (error) {
            throw error;
        }
    },

    authenticateJWT: (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {

            if (err || !user) {
                return res.redirect('/login');
            }
            req.user = user;
            return next();
        })(req, res, next);
    },

    checkAdminRole: (req, res, next) => {
        res.locals.username = req.user.username;
        const jwtPayload = req.user;
        const role = jwtPayload.role;
        if(role === "admin") {
            next();
        } else {
            return res.render('404');
        }
    },

    logLogin: async (username, datetime) => {
        try {
            await User.saveLogin(username, datetime);
        } catch(error) {
            return res.render('404');
        }
    },

    logLogout: async (username, datetime) => {
        try {
            console.log("tu"+username);
            await User.saveLogout(username, datetime);
        } catch(error) {
            return res.render('404');
        }
    },

};