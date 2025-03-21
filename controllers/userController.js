const User = require("../models/userModel"),
      authController = require("./authController");

module.exports = {
    giveUserProfile: async (req, res) => {
        try {
            const username = req.params.username;
            res.locals.username = username;
            const user = await User.findByUsername(username);
            res.render('users/profile', { user: user });

        } catch (error) {
            console.error('Error fetching users:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    deleteUser: async (req, res) => {
        const jwtPayload = req.user;
        const role = jwtPayload.role;
        if(role === "admin") {
            const username = req.params.username;
            //console.log(username);
            User.findByUsernameAndRemove(username)
                .then(() => {
                    res.redirect("/admin/users");
                })
                .catch(error => {
                    console.log(`Error deleting user by USERNAME: ${error.message}`);
                    //res.redirect("/users");
                    res.render('404');
                })
        }
    },

    getUser: async (req, res) => {
        try {
            const username = req.params.username;
            const user = await User.findByUsername(username);
            return res.json({ user: user });
            //res.json({ user: user });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getJobTitles: async (req, res) => {
        try {
            var jobTitles = await User.jobTitles();
            //console.log(jobTitles);
            return res.json({ jobTitles: jobTitles });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const jwtPayload = req.user;
            const user_username = jwtPayload.username;
            const role = jwtPayload.role;
            const username = req.params.username;
            if(role === "admin" || user_username === username) {
                const user = req.body;
                await User.findByUsernameAndUpdate(res, username, user);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }

    },

    UserupdateUser: async (req, res) => {
        try {
            const jwtPayload = req.user;
            const user_username = jwtPayload.username;
            const role = jwtPayload.role;
            const username = req.params.username;
            if(role === "admin" || user_username === username) {
                const user = req.body;
                await User.findByUsernameAndUpdateUser(res, username, user);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }

    },

    allUsers: async (req, res) => {
        try {
            let users = await User.getAllUsers();
            return res.json({ users: users });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    },

    insertUser: async (req, res) => {
        try {
            const { email, password, username, first_name, last_name, job_title } = req.body;
            let users = await authController.createUser(email, password, username, first_name, last_name, job_title);
            return res.json({ users: users })
        } catch (error) {
            console.error('Error fetching users:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    renderChat: async (req, res) => {
        try {
            const jwtPayload = req.user;
            res.locals.username = jwtPayload.username;
            res.locals.userRole = jwtPayload.role;
            let users = await User.getAllUsers();
            res.render('chat/chat_home', { users: users });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },
}