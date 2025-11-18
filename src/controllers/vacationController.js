const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    const user = req.session.user;

    const sql = `
        SELECT 
            v.id,
            v.start_date,
            v.end_date,
            v.status,
            u.name as user_name,
            lt.name as leave_type_name
        FROM vacations v
        JOIN users u ON v.user_id = u.id
        JOIN leave_types lt ON v.leave_type_id = lt.id
        WHERE u.department_id = ${user.department_id}`;

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.render('vacation/index', { 
                vacations: results 
            });
        }
    });
}

function indexByUser(req, res) {
    const userId = req.params.userId;

    const sql = `
        SELECT 
            v.id,
            v.start_date,
            v.end_date,
            v.status,
            v.user_id,
            u.name as user_name,
            lt.name as leave_type_name
        FROM vacations v
        JOIN users u ON v.user_id = u.id
        JOIN leave_types lt ON v.leave_type_id = lt.id
        WHERE u.id = ${userId}`;

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.render('vacation/index', { 
                vacations: results
            });
        }
    });
}

function create(req, res) {
    const user = req.session.user;
    const sql = `SELECT id, name FROM leave_types`;

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.render('vacation/create', { leaveTypes: results });
        }
    });
}

function store(req, res) {
    const {start_date, end_date, leave_type_id } = req.body;
    if (!start_date || !end_date || !leave_type_id) {
        res.status(400).send({ error: 'Dia de início, dia de término, tipo de férias são obrigatórios' });
        return;
    }
    const user = req.session.user;
    const sql = `
        INSERT INTO vacations 
            (user_id, 
            start_date, 
            end_date, 
            leave_type_id, 
            created_at) 
        VALUES 
            (${user.id}, 
            '${start_date}', 
            '${end_date}', 
            ${leave_type_id}, 
            NOW())`;

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.redirect('/');
        }
    });
}

function show(req, res) {
    const id = req.params.id;

    const sql = `
        SELECT 
            v.id,
            v.start_date,
            v.end_date,
            v.status,
            u.name as user_name,
            lt.name as leave_type_name
        FROM vacations v
        JOIN users u ON v.user_id = u.id
        JOIN leave_types lt ON v.leave_type_id = lt.id
        WHERE v.id = ${id}`;

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send({ error: 'Férias não encontrada' });
        } else {
            res.render('vacation/show', { 
                vacation: results[0] 
            });
        }
    });
}

function edit(req, res) {
    const id = req.params.id;

    const sqlVacation = `
        SELECT 
            v.id,
            v.start_date,
            v.end_date,
            v.status,
            v.leave_type_id,
            u.name as user_name,
            lt.name as leave_type_name
        FROM vacations v
        JOIN users u ON v.user_id = u.id
        JOIN leave_types lt ON v.leave_type_id = lt.id
        WHERE v.id = ${id}`;
    
    const sqlLeaveTypes = `SELECT id, name FROM leave_types`;

    executeSQL(sqlVacation, (error, vacationResults) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (vacationResults.length === 0) {
            res.status(404).send({ error: 'Férias não encontrada' });
        } else {
            const vacation = vacationResults[0];
            executeSQL(sqlLeaveTypes, (error, leaveTypeResults) => {
                if (error) {
                    res.status(500).send(error.message);
                } else {
                    res.render('vacation/edit', { 
                        vacation: vacation,
                        leaveTypes: leaveTypeResults 
                    });
                }
            });
        }
    });
}

function update(req, res) {
    const id = req.params.id;
    const {start_date, end_date, leave_type_id } = req.body;
    const user = req.session.user;

    const sql = `
        UPDATE vacations SET 
            user_id=${user.id}, 
            start_date='${start_date}', 
            end_date='${end_date}', 
            leave_type_id=${leave_type_id} 
        WHERE id = ${id}`;
    const checkSql = `SELECT status FROM vacations WHERE id = ${id}`;
    executeSQL(checkSql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send({ error: 'Férias não encontrada' });
        } else if (results[0].status !== 'pending') {
            res.status(400).send({ error: 'Apenas férias pendentes podem ser editadas' });
        } else {
            executeSQL(sql, (error, results) => {
                if (error) {
                    res.status(500).send(error.message);
                } else {
                    res.redirect('/');
                }
            });
        }
    });
}

function destroy(req, res) {
    const id = req.params.id;

    const sql = `DELETE FROM vacations WHERE id = ${id}`;

    const checkSql = `SELECT status FROM vacations WHERE id = ${id}`;
    executeSQL(checkSql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send({ error: 'Férias não encontrada' });
        } else if (results[0].status !== 'pending') {
            res.status(400).send({ error: 'Apenas férias pendentes podem ser apagadas' });
        } else {
            executeSQL(sql, (error, results) => {
                if (error) {
                    res.status(500).send(error.message);
                } else {
                    res.redirect('/');
                }
            });
        }
    });
}

function accept(req, res) {
    const id = req.params.id;

    const sql = `UPDATE vacations SET status='approved' WHERE id = ${id}`;
    const checkSql = `SELECT status FROM vacations WHERE id = ${id}`;

    executeSQL(checkSql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send({ error: 'Férias não encontrada' });
        } else if (results[0].status !== 'pending') {
            res.status(400).send({ error: 'Apenas férias pendentes podem ser aceites' });
        } else {
            executeSQL(sql, (error, results) => {
                if (error) {
                    res.status(500).send(error.message);
                } else {
                    res.redirect('/');
                }
            });
        }
    });
}
function reject(req, res) {
    const id = req.params.id;

    const sql = `UPDATE vacations SET status='rejected' WHERE id = ${id}`;
    const checkSql = `SELECT status FROM vacations WHERE id = ${id}`;
    executeSQL(checkSql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send({ error: 'Férias não encontrada' });
        } else if (results[0].status !== 'pending') {
            res.status(400).send({ error: 'Apenas férias pendentes podem ser rejeitadas' });
        } else {
            executeSQL(sql, (error, results) => {
                if (error) {
                    res.status(500).send(error.message);
                } else {
                    res.redirect('/');
                }
            });
        }
    });
}

module.exports = {
    index,
    indexByUser,
    create,
    store,
    show,
    edit,
    update,
    destroy,
    accept,
    reject,
};