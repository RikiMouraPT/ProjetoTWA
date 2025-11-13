const { executeSQL } = require('../migrations/00-connection');

function login(req, res) {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
    executeSQL(sql, res);
}

function register(req, res) {
    const { email, password } = req.body;
    const sql = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;
    executeSQL(sql, res);
}

function logout(req, res) {
    res.status(200).json({ message: 'Logged out successfully' });
}