function isAuthenticated(req, res, next) {
    if (req.session.user) {
        // Se 'req.session.user' existe, o utilizador está logado.
        // Deixa-o passar para o próximo passo, o controller.
        next(); 
    } else {
        res.redirect('/auth/login');
    }
}

function isManager(req, res, next) {
    if (req.session.user && req.session.user.role === 'manager') {
        next();
    } else {
        res.status(403).send('Acesso Negado. Esta área é apenas para Gerentes.');
    }
}

module.exports = {
    isAuthenticated,
    isManager
};