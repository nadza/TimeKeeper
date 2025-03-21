const { Pool } = require('pg');

const pool = new Pool({
    user: 'xnhizlzx',
    password: 'ksuHHgjIdWDQgchQOKj2tYnhkdcbKxR6',
    host: 'drona.db.elephantsql.com',
    port: 5432,
    database: 'xnhizlzx'
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};