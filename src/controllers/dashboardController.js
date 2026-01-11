const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    if (!req.session.user) {
        return res.render('welcome');
    }

    const userId = req.session.user.id;

    const sqlStats = `
        SELECT
            COALESCE(SUM(
                CASE 
                    WHEN v.status = 'approved'
                    THEN DATEDIFF(v.end_date, v.start_date) + 1
                    ELSE 0
                END
            ), 0) AS daysUsed,

            COALESCE(SUM(
                CASE
                    WHEN v.status = 'approved'
                    AND v.end_date < CURDATE()
                    THEN DATEDIFF(v.end_date, v.start_date) + 1
                    ELSE 0
                END
            ), 0) AS daysPast,

            COUNT(CASE WHEN v.status = 'approved' THEN 1 END) AS countApproved,
            COUNT(CASE WHEN v.status = 'pending' THEN 1 END) AS countPending
        FROM vacations v
        WHERE v.user_id = ${userId}
    `;


    const sqlTotalDays = `
        SELECT COALESCE(SUM(max_days), 0) AS daysTotal
        FROM leave_types
    `;

    const sqlByType = `
        SELECT
            lt.id,
            lt.name,
            lt.max_days,
            COALESCE(SUM(
                CASE
                    WHEN v.status = 'approved'
                    THEN DATEDIFF(v.end_date, v.start_date) + 1
                    ELSE 0
                END
            ), 0) AS days_used
        FROM leave_types lt
        LEFT JOIN vacations v
            ON v.leave_type_id = lt.id
        AND v.user_id = ${userId}
        GROUP BY lt.id, lt.name, lt.max_days
    `;


    executeSQL(sqlTotalDays, (err, totalResult) => {
        if (err) return res.render('dashboard', { error: 'Erro BD' });

        executeSQL(sqlStats, (err2, statsResult) => {
            if (err2) return res.render('dashboard', { error: 'Erro BD' });

            executeSQL(sqlByType, (err3, byTypeResult) => {
                if (err3) return res.render('dashboard', { error: 'Erro BD' });

                const stats = {
                    daysUsed: statsResult[0].daysUsed,
                    daysPast: statsResult[0].daysPast,
                    countApproved: statsResult[0].countApproved,
                    countPending: statsResult[0].countPending,
                    daysTotal: totalResult[0].daysTotal,
                    byType: byTypeResult
                };

                res.render('dashboard', { stats });
            });
        });
    });
}

module.exports = { index };
