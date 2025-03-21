const db = require('../dbConfig'),
      bcrypt = require("bcryptjs");

module.exports = {
    giveWorkingHours: async () => {
        const query = {
            text: `
                SELECT username, login, logout
                FROM working_hours_employees
            `,
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    saveLogin: async (username, datetime) => {
        const query = {
            text: `
                INSERT INTO working_hours_employees(username, login, logout)
                VALUES($1, $2, $3);
                 `,
            values: [username, datetime, null]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    saveLogout: async (username, datetime) => {
        const query = {
            text: `
                INSERT INTO working_hours_employees(username, login, logout)
                VALUES($1, $2, $3);
                 `,
            values: [username, null, datetime]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },


    doesUserExist: async (username) => {
        const query = {
            text: `
                SELECT * FROM users WHERE username = $1;
                 `,
            values: [username]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    doesEmailExists: async (email) => {
        const query = {
            text: `
                SELECT * FROM users WHERE email = $1;
                 `,
            values: [email]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    async saveUser(email, password, username, first_name, last_name, job_title) {
        // koristi sa proslijedjenim hashiranim pw u loginu
        const query = {
            text: `
                INSERT INTO users(username, password, first_name, last_name, email, job_title, description)
                VALUES($1, $2, $3, $4, $5, $6, $7)
                RETURNING username;
                 `,
            values: [username, password, first_name, last_name, email, job_title, null],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async jobTitles() { // promjena iz async() =>
        const query = {
            text: `
                SELECT title FROM job_titles;
                 `,
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    async getAllUsers() {
        const query = {
            text: `
                SELECT user_id, username, first_name, last_name, email, job_title
                FROM users;
                 `,
            values: [],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    async findByUsernameAndRemove(username) {
        const query = {
            text: `
                DELETE FROM users
                WHERE username = $1
                 `,
            values: [username],
        };

        try {
            await db.query(query.text, query.values);
            console.log("User deleted successfully");
        } catch (error) {
            throw error;
        }
    },

    async findByUsername(username) {
        const query = {
            text: `
                SELECT *
                FROM users
                WHERE username = $1;
                 `,
            values: [username],
        };

        try {
            const result = await db.query(query.text, query.values);
            const user = result.rows[0];
            return user || null;
        } catch (error) {
            throw error;
        }
    },

    findByUsernameAndUpdateUser: async (res, username1, user) => {
        const { username, first_name, last_name, email, job_title, password, description } = user;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log(username, first_name, last_name, email, job_title, hash, username1);
        const query = {
            text: `
                UPDATE users
                SET username = $1, first_name = $2, last_name = $3, email = $4, job_title = $5, password = $6, description = $7
                WHERE username = $8
                `,
            values: [username, first_name, last_name, email, job_title, hash, description, username1],
        };

        try {
            await db.query(query.text, query.values); //const result =
            res.json({ message: 'User updated successfully' });
        } catch (error) {
            console.error('Error updating user by username:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    findByUsernameAndUpdate: async (res, username1, user) => {
        const { username, first_name, last_name, email, job_title, password } = user;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log(username, first_name, last_name, email, job_title, hash, username1);
        const query = {
            text: `
                UPDATE users
                SET username = $1, first_name = $2, last_name = $3, email = $4, job_title = $5, password = $6
                WHERE username = $7
                `,
            values: [username, first_name, last_name, email, job_title, hash, username1],
        };

        try {
            await db.query(query.text, query.values); //const result =
            res.json({ message: 'User updated successfully' });
        } catch (error) {
            console.error('Error updating user by username:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getId: async(username) => {
        const query = {
            text: `
                SELECT user_id FROM users WHERE username = $1;
                 `,
            values: [username],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

};
