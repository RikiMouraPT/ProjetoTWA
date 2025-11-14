const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    const sql = 'SELECT * FROM leave_types';

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.render('leaveType/index', { 
                leaveTypes: results 
            });
        }
    });
}

function create (req, res) {
    res.render('leaveType/create');
}

function store(req, res) {
    const { name, description, max_days } = req.body;
    if (!name || !description || !max_days) {
        res.status(400).json({ error: 'Name, description, and max_days are required' });
        return;
    }

    const sql = `INSERT INTO leave_types (name, description, max_days, created_at) VALUES ('${name}', '${description}', ${max_days}, NOW())`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.redirect('/leave-types');
        }
    });
}   

function show(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM leave_types WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Leave type not found' });
        } else {
            res.render('leaveType/show', { 
                leaveType: results[0] 
            });
        }
    });
}

function edit (req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM leave_types WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Leave type not found' });
        }
        else {
            res.render('leaveType/edit', { 
                leaveType: results[0] 
            });
        }
    });
}

function update(req, res) {
    const id = req.params.id;
    const { name, description, max_days } = req.body;
    if (!name || !description || !max_days) {
        res.status(400).json({ error: 'Name, description, and max_days are required' });
        return;
    }

    const sql = `UPDATE leave_types SET name='${name}', description='${description}', max_days=${max_days} WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.redirect('/leave-types');
        }
    });
}

function destroy(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM leave_types WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.redirect('/leave-types');
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