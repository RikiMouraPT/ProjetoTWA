const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    const sql = 'SELECT * FROM leave_types';

    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.render('leaveType/index', { 
                leaveTypes: results 
            });
        }
    });
}

function create(req, res) {
    res.render('leaveType/create');
}

function store(req, res) {
    const { name, description, max_days } = req.body;
    
    // Apenas o Nome é obrigatório
    if (!name) {
        return res.status(400).send('Erro: O nome é obrigatório');
    }
    
    // Lógica para campos opcionais (NULL)
    // Se a descrição existir, colocamos entre plicas. Se não, é a palavra NULL (sem plicas).
    const descValue = description ? `'${description}'` : 'NULL';
    const maxDaysValue = max_days ? max_days : 'NULL';

    const sql = `INSERT INTO leave_types (name, description, max_days, created_at) VALUES ('${name}', ${descValue}, ${maxDaysValue}, NOW())`;
    
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
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
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send('Tipo de Férias não encontrado');
        } else {
            res.render('leaveType/show', { 
                leaveType: results[0] 
            });
        }
    });
}

function edit(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM leave_types WHERE id = ${id}`;
    
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (results.length === 0) {
            res.status(404).send('Tipo de Férias não encontrado');
        } else {
            res.render('leaveType/edit', { 
                leaveType: results[0] 
            });
        }
    });
}

function update(req, res) {
    const id = req.params.id;
    const { name, description, max_days } = req.body;
    
    if (!name) {
        return res.status(400).send('Erro: O nome é obrigatório');
    }

    const descValue = description ? `'${description}'` : 'NULL';
    const maxDaysValue = max_days ? max_days : 'NULL';

    const sql = `UPDATE leave_types SET name='${name}', description=${descValue}, max_days=${maxDaysValue} WHERE id = ${id}`;
    
    executeSQL(sql, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
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
            res.status(500).send(error.message);
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
    destroy 
};