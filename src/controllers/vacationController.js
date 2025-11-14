const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    const sql = 'SELECT * FROM vacations';
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.render('vacation/index', { 
                vacations: results 
            });
        }
    });
}

function indexByUser(req, res) {
    const userId = req.params.userId;
    const sql = `SELECT * FROM vacations WHERE user_id = ${userId}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.render('vacation/index', { 
                vacations: results 
            });
        }
    });
}

function create (req, res) {
    res.render('vacations/create');
}

function store(req, res) {
    const { user_id, start_date, end_date, leave_type_id } = req.body;
    if (!user_id || !start_date || !end_date || !leave_type_id) {
        res.status(400).json({ error: 'User ID, start date, end date, and leave type are required' });
        return;
    }

    const sql = `INSERT INTO vacations (user_id, start_date, end_date, leave_type_id, created_at) VALUES (${user_id}, '${start_date}', '${end_date}', ${leave_type_id}, NOW())`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.redirect('/vacations');
        }
    });
}

function show(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM vacations WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Vacation not found' });
        } else {
            res.render('vacation/show', { 
                vacation: results[0] 
            });
        }
    });
}

function destroy(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM vacations WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.redirect('/vacations');
        }
    });
}

function accept(req, res) {
    const id = req.params.id;
    const sql = `UPDATE vacations SET status='approved' WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.redirect('/vacations');
        }
    });
}
function reject(req, res) {
    const id = req.params.id;
    const sql = `UPDATE vacations SET status='rejected' WHERE id = ${id}`;
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.redirect('/vacations');
        }
    });
}

module.exports = {
    index,
    indexByUser,
    create,
    store,
    show,
    destroy,
    accept,
    reject,
};