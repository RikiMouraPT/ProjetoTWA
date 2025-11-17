const { executeSQL } = require('../migrations/00-connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function showRegisterForm(req, res) {
    res.render('auth/register');
}

function register(req, res) {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
        return res.status(400).send("É obrigatório preencher todos os campos");
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).send("Erro ao criar hash");
        }

        const deptIdValue = 'NULL';
        const sql = `INSERT INTO users (name, email, password, role, department_id, created_at) VALUES ('${name}', '${email}', '${hash}', '${role}', ${deptIdValue}, NOW())`;

        executeSQL(sql, (error, results) => {
            if (error) {
                return res.status(500).send(error.message);
            }
            res.redirect('/login');
        });
    });
}

function showLoginForm(req, res) {
    res.render('auth/login');
}

function login(req, res) {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = '${email}'`;

    executeSQL(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        if (results.length === 0) {
            return res.redirect('/login');
        }

        const user = results[0];
        
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send("Erro a comparar");
            }

            if (isMatch) {
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    role: user.role
                };
                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        });
    });
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Erro ao fazer logout");
        }
        res.redirect('/login');
    });
}

module.exports = {
    showLoginForm,
    showRegisterForm,
    register,
    login,
    logout
};