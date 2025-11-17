const { executeSQL } = require('../migrations/00-connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function index(req, res) {
    const sql = 'SELECT id, name, email, role, department_id FROM users';
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.render('user/index', { 
                users: results 
            });
        }
    });
}

function create (req, res) {
    res.render('user/create');
}

function store(req, res) {
    const { name, email, password, role, department_id } = req.body;

    if (!name || !email || !password || !role) {
        res.status(400).send('Erro: Nome, email, password e role são obrigatórios');
        return;
    }
    const deptIdValue = department_id ? department_id : 'NULL';

    const sql = `INSERT INTO users (name, email, password, role, department_id, created_at) VALUES ('${name}', '${email}', '${password}', '${role}', ${deptIdValue}, NOW())`;

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.redirect('/users');
        }
    });
}

function show(req, res) {
    const id = req.params.id;
    const sql = `SELECT id, name, email, role, department_id FROM users WHERE id = ${id}`;

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send({ error: 'User not found' });
        }
        else {
            res.render('user/show', { 
                user: results[0] 
            });
        }
    });
}

function edit(req, res) {
    const id = req.params.id;
    const sql = `SELECT id, name, email, role, department_id FROM users WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send({ error: 'Utilizador não encontrado' });
        }
        else {
            res.render('user/edit', { 
                user: results[0] 
            });
        }
    });
}

function update(req, res) {
    const id = req.params.id;
    const { name, email, password, role, department_id } = req.body;

    if (!name || !email || !role) {
        res.status(400).send({ error: 'Nome, email e role são obrigatórios' });
        return;
    }

    const deptIdValue = department_id ? department_id : 'NULL';


    
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).send("Erro ao criar hash");
        }

        var sql;
        if (password && password.trim() !== '') {
            sql = `UPDATE users 
                SET name='${name}',
                    email='${email}',
                    password='${hash}',
                    role='${role}',
                    department_id=${deptIdValue}
                WHERE id = ${id}`
        } else {
            sql = `UPDATE users 
                SET name='${name}',
                    email='${email}',
                    role='${role}',
                    department_id=${deptIdValue}
                WHERE id = ${id}`;
        }

        executeSQL(sql, (error, results) => {
            if (error) {
                res.status(500).send(error.message);
            } else {
                res.redirect('/users');
            }
        });
    });
}

function destroy(req, res) {
    const id = req.params.id;

    const sql = `DELETE FROM users WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.redirect('/users');
        }
    });
}

module.exports = {
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
};