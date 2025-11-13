const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    const sql = 'SELECT * FROM departments';

    res.render('department/index', { 
        departments: [
            {
                "id": 1,
                "name": "Recursos Humanos",
                "manager_id": 2
            }
        ]
    });
}

function create(req, res) {
    res.render('department/create');
}

function store(req, res) {
    const { name, manager_id } = req.body;
    if (!name || !manager_id) {
        res.status(400).json({ error: 'Name and manager_id are required' });
        return;
    }

    const sql = `INSERT INTO departments (name, manager_id, created_at) VALUES ('${name}', ${manager_id}, NOW())`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
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
            res.status(500).json({ error: 'Database query error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Department not found' });
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
            res.status(500).json({ error: 'Database query error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Department not found' });
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
    if (!name || !manager_id) {
        res.status(400).json({ error: 'Name and manager_id are required' });
        return;
    }

    const sql = `UPDATE departments SET name='${name}', manager_id=${manager_id} WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.redirect('/department');
        }
    });
}

function destroy(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM departments WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.redirect('/department');
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