const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    const user = req.session.user;
    const filter = req.query.filter; 

    if (user.role !== 'manager') {
        return res.redirect(`/vacations/byUser/${user.id}`);
    }

    let conditions = [];

    const deptId = user.department_id || 0;
    conditions.push(`u.department_id = ${deptId}`);

    // Filtro Opcional: Apenas Pendentes
    if (filter === 'pending') {
        conditions.push("v.status = 'pending'");
    }
    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const sql = `
        SELECT 
            v.id, v.start_date, v.end_date, v.status, v.user_id,
            u.name as user_name,
            lt.name as leave_type_name
        FROM vacations v
        JOIN users u ON v.user_id = u.id
        JOIN leave_types lt ON v.leave_type_id = lt.id
        ${whereClause}
        ORDER BY v.created_at DESC
    `;

    executeSQL(sql, (error, results) => {
        if (error) return res.status(500).send(error.message);
        
        res.render('vacation/index', { 
            vacations: results,
            currentFilter: filter 
        });
    });
}

function indexByUser(req, res) {
    const userId = req.params.userId;
    const loggedInUser = req.session.user;
    const filter = req.query.filter;

    // Só mostra se for o próprio
    if (loggedInUser.id != userId) {
        return res.status(403).render('errors/403');
    }

    let whereClause = "";
    // Filtro
    if (filter === 'pending') {
        whereClause += " AND v.status = 'pending'";
    }

    const sql = `
        SELECT 
            v.id, v.start_date, v.end_date, v.status, v.user_id,
            lt.name as leave_type_name
        FROM vacations v
        JOIN leave_types lt ON v.leave_type_id = lt.id
        WHERE v.user_id = ${userId}
        ${whereClause}
        ORDER BY v.start_date DESC`;

    executeSQL(sql, (error, results) => {
        if (error) return res.status(500).send(error.message);
        
        res.render('vacation/my-vacations', { 
            vacations: results,
            targetUserId: userId,
            currentFilter: filter
        });
    });
}

function create(req, res) {
    const user = req.session.user;
    
    // Esta query vai buscar os tipos E calcula quanto o user já gastou de cada um
    const sql = `
        SELECT 
            lt.id, 
            lt.name, 
            lt.max_days,
            COALESCE(SUM(DATEDIFF(v.end_date, v.start_date) + 1), 0) as days_used
        FROM leave_types lt
        LEFT JOIN vacations v ON v.leave_type_id = lt.id 
            AND v.user_id = ${user.id} 
            AND v.status != 'rejected' -- Contamos os pendentes também!
        GROUP BY lt.id
    `;

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.render('vacation/create', { leaveTypes: results });
        }
    });
}

function store(req, res) {
    const { start_date, end_date, leave_type_id } = req.body;
    const user = req.session.user;

    if (!start_date || !end_date || !leave_type_id) {
        return res.status(400).send('Erro: Todos os campos são obrigatórios.');
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    
    // Diferença em milissegundos convertida para dias
    const diffTime = Math.abs(end - start);
    const daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

    // Validar que as datas fazem sentido
    if (daysRequested <= 0 || end < start) {
        return res.status(400).send('Erro: A data de fim tem de ser depois da data de início.');
    }

    // Verificar 'saldo' na Base de Dados
    // Confirmar quanto já foi gasto deste tipo específico
    const sqlCheck = `
        SELECT 
            lt.max_days,
            COALESCE(SUM(DATEDIFF(v.end_date, v.start_date) + 1), 0) as days_used
        FROM leave_types lt
        LEFT JOIN vacations v ON v.leave_type_id = lt.id 
            AND v.user_id = ${user.id} 
            AND v.status != 'rejected'
        WHERE lt.id = ${leave_type_id}
        GROUP BY lt.id
    `;

    executeSQL(sqlCheck, (err, results) => {
        if (err) return res.status(500).send(err.message);
        
        if (results.length === 0) return res.status(404).send('Tipo de férias inválido.');

        const limit = results[0].max_days;
        const used = parseFloat(results[0].days_used);

        // Se 'limit' for NULL, significa que é ilimitado (ex: baixa médica sem limite configurado)
        if (limit !== null) {
            const remaining = limit - used;
            
            if (daysRequested > remaining) {
                return res.status(400).render('errors/declineVacation', { 
                    message: `Erro: Não tem dias suficientes deste tipo de férias. Restam ${remaining} dias.`,
                    daysRequested: daysRequested,
                    daysRemaining: remaining,
                    limit: limit
                });
            }
        }

        const sqlInsert = `
            INSERT INTO vacations (user_id, start_date, end_date, leave_type_id, created_at) 
            VALUES (${user.id}, '${start_date}', '${end_date}', ${leave_type_id}, NOW())
        `;

        executeSQL(sqlInsert, (err2, result) => {
            if (err2) return res.status(500).send(err2.message);
            res.redirect(`/vacations/byUser/${user.id}`);
        });
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