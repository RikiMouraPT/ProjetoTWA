const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    if (!req.session.user) {
        return res.render('welcome');
    }

    const user = req.session.user;

    const sqlTypes = `SELECT * FROM leave_types`;
    
    const sqlVacations = `
        SELECT v.*, lt.max_days, lt.name as type_name
        FROM vacations v
        JOIN leave_types lt ON v.leave_type_id = lt.id
        WHERE v.user_id = ${user.id}
    `;

    executeSQL(sqlTypes, (err, allTypes) => {
        if (err) return res.render('dashboard', { error: 'Erro BD' });

        executeSQL(sqlVacations, (err2, userVacations) => {
            if (err2) return res.render('dashboard', { error: 'Erro BD' });
            
            //Total de Dias a que tenho direito (Soma dos max_days de todos os tipos)
            let totalDaysAllowed = 0;
            allTypes.forEach(t => totalDaysAllowed += (t.max_days || 0));

            //Dias Gozados (Soma dos dias dos pedidos 'approved')
            let daysUsed = 0;
            
            //Contagens de Pedidos
            let countApproved = 0;
            let countPending = 0;
            let countPast = 0; // Gozadas

            const now = new Date();

            userVacations.forEach(v => {
                const start = new Date(v.start_date);
                const end = new Date(v.end_date);
                // +1 porque se for dia 1 a 1 conta como 1 dia
                const duration = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;

                if (v.status === 'approved') {
                    daysUsed += duration;
                    countApproved++;
                    
                    // Se a data de fim já passou, consideramos "Gozada" (passado)
                    if (end < now) {
                        countPast++;
                    }
                } else if (v.status === 'pending') {
                    countPending++;
                }
            });

            // Preparar dados para a view
            const stats = {
                daysUsed: daysUsed,
                daysTotal: totalDaysAllowed,
                countApproved: countApproved,
                countPending: countPending,
                countPast: countPast,
                
                byType: allTypes.map(t => {
                    const vacsOfType = userVacations.filter(v => v.leave_type_id === t.id && v.status === 'approved');
                    const usedOfType = vacsOfType.reduce((acc, v) => {
                        const s = new Date(v.start_date);
                        const e = new Date(v.end_date);
                        return acc + (Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1);
                    }, 0);
                    
                    return {
                        name: t.name,
                        max_days: t.max_days,
                        days_used: usedOfType
                    };
                })
            };

            res.render('dashboard', { stats: stats });
        });
    });
}

module.exports = { index };