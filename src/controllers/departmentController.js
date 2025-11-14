const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    const sql = 'SELECT * FROM departments';

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.render('department/index', { 
                departments: results 
            });
        }
    });
}

function create(req, res) {
    res.render('department/create');
}

function store(req, res) {
    const { name, manager_id } = req.body;

    if (!name) {
        res.status(400).send({ error: 'Nome é obrigatório' });
        return;
    }

    const managerIdValue = manager_id ? manager_id : 'NULL';
    
    const sql = `INSERT INTO departments (name, manager_id, created_at) VALUES ('${name}', ${managerIdValue}, NOW())`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.redirect('/departments');
        }
    });
}   

function show(req, res) {
    const id = req.params.id;

    const sql = `SELECT * FROM departments WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send({ error: 'Departamento não encontrado' });
        } else {
            res.render('department/show', { 
                department: results[0] 
            });
        }
    });
}

function edit(req, res) {
    const id = req.params.id;

    const sql = `SELECT * FROM departments WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send({ error: 'Departamento não encontrado' });
        } else {
            res.render('department/edit', { 
                department: results[0] 
            });
        }
    });
}

function update(req, res) {
    const id = req.params.id;
    const { name, manager_id } = req.body;
    if (!name) {
        res.status(400).send('Erro: O nome é obrigatório');
        return;
    }
    
    const managerIdValue = manager_id ? manager_id : 'NULL';

    const sql = `UPDATE departments SET name='${name}', manager_id=${managerIdValue} WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.redirect('/departments');
        }
    });
}

function destroy(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM departments WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.redirect('/departments');
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