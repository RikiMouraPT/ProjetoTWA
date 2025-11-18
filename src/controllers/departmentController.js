const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    const sql = `
        SELECT
            d.id,
            d.name,
            d.manager_id,
            u.name AS manager_name
        FROM
            departments d
        LEFT JOIN
            users u ON d.manager_id = u.id`;

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
    const sql = `
    SELECT 
        id, 
        name 
        FROM 
        users 
    WHERE 
        role = 'manager' 
    ORDER BY 
        name`;

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.render('department/create', { 
                managers: results 
            });
        }
    });
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

    const sql = `
        SELECT
            d.id,
            d.name,
            d.manager_id,
            u.name AS manager_name
        FROM
            departments d
        LEFT JOIN
            users u ON d.manager_id = u.id
        WHERE d.id = ${id}`;

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

    const sqlDept = `
        SELECT
            d.id,
            d.name,
            d.manager_id
        FROM
            departments d
        WHERE d.id = ${id}`;

    executeSQL(sqlDept, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send({ error: 'Departamento não encontrado' });
        } else {
            const department = results[0];
            const sqlUsers = `
            SELECT 
                id, name 
            FROM 
                users 
            WHERE 
                role = 'manager' 
            ORDER BY 
                name`;    

            executeSQL(sqlUsers, (error, resultsUsers) => {
                if (error) {
                    res.status(500).send(error.message);
                } else {
                    res.render('department/edit', { 
                        department: department,
                        managers: resultsUsers
                    });
                }
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