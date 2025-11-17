function isAuthenticated(req, res, next) {
    if (req.session.user) {
        // Se 'req.session.user' existe, o utilizador está logado.
        // Deixa-o passar para o próximo passo, o controller.
        next(); 
    } else {
        res.redirect('/login');
    }
}

function isManager(req, res, next) {
    if (req.session.user && req.session.user.role === 'manager') {
        next();
    } else {
        res.redirect('/login');
    }
}

function isGuest(req, res, next) {
    if (!req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = {
    isAuthenticated,
    isManager,
    isGuest
};