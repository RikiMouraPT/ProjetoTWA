const { executeSQL } = require('../migrations/00-connection');

function index(req, res) {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/login');
    }

    // --- LÓGICA DE ESTATÍSTICAS ---
    // Vamos assumir que cada 'leave_type' tem um 'max_days' anual.
    // Precisamos de saber:
    // 1. Quantos dias de cada tipo o user tem direito (max_days)
    // 2. Quantos dias o user já gozou ou tem aprovados (COUNT/SUM das vacations)

    // Query para obter o resumo por tipo de férias para ESTE user
    // Fazemos um LEFT JOIN para garantir que mostramos todos os tipos, mesmo os que o user nunca usou.
    const sql = `
        SELECT 
            lt.id, 
            lt.name, 
            lt.max_days, 
            COALESCE(SUM(DATEDIFF(v.end_date, v.start_date) + 1), 0) AS days_used
        FROM 
            leave_types lt
        LEFT JOIN 
            vacations v ON lt.id = v.leave_type_id 
            AND v.user_id = ${user.id} 
            AND v.status = 'approved'
        GROUP BY 
            lt.id
    `;

    // Contar pedidos pendentes (para mostrar o aviso amarelo)
    const sqlPending = `SELECT COUNT(*) as total FROM vacations WHERE user_id = ${user.id} AND status = 'pending'`;

    executeSQL(sql, (err, statsResults) => {
        if (err) {
            return res.render('dashboard', { error: 'Erro ao carregar estatísticas' });
        }

        executeSQL(sqlPending, (err2, pendingResults) => {
            
            // Calcular totais gerais
            let totalDaysAllowed = 0;
            let totalDaysUsed = 0;

            statsResults.forEach(type => {
                totalDaysAllowed += type.max_days;
                totalDaysUsed += parseFloat(type.days_used); // O SUM do SQL pode vir como string
            });

            const stats = {
                total: totalDaysAllowed,
                used: totalDaysUsed,
                pending: pendingResults ? pendingResults[0].total : 0,
                byType: statsResults
            };

            res.render('dashboard', { stats: stats });
        });
    });
}

module.exports = { index };