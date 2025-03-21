//https://www.makeuseof.com/passport-authenticate-node-postgres/
const db = require('../dbConfig'),
      User = require("../models/userModel"),
      Project = require("../models/projectModel");

module.exports = {
    renderUsers: async (req, res) => {
        try {
            const jwtPayload = req.user;
            const username = jwtPayload.username;
            const role = jwtPayload.role;
            if(role === "admin") {
                const all_users = await User.getAllUsers();
                res.render('admin/users', { users: all_users, username: username});
            }
            else res.render('404'); //res.status(401).json({ message: 'Unauthorized'});

        } catch (error) {
            throw error;
        }
    },

    renderProjects: async (req, res) => {
        try {
            const all_projects = await Project.getAllProjects();
            res.render('admin/projects', { projects: all_projects });
        } catch (error) {
            //throw error;
            res.render('404');
        }
    },

};