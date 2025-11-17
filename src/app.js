const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const vacationRoutes = require('./routes/vacationRoutes');
const leaveTypeRoutes = require('./routes/leaveTypeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const authRoutes = require('./routes/authRoutes');

// Configuração do Pug como motor de visualização
const path = require('path');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

// Usado para suportar métodos PUT e DELETE em formulários HTML
const methodOverride = require('method-override');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Usado para sessões de utilizador
const session = require('express-session');
app.use(session({
    secret: 'chave-tola', // Deve ser uma string secreta para assinar o ID da sessão
    resave: false,
    saveUninitialized: false, // Só guarda sessões quando se faz login
    cookie: { maxAge: 60*60*1000 } // 1hora --> Tempo de expiração da sessão (em milissegundos)
}));


app.get('/', (req, res) => {
    res.render('welcome', { title: 'Home' });
});
app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/vacations', vacationRoutes);
app.use('/leave-types', leaveTypeRoutes);
app.use('/departments', departmentRoutes);

module.exports = app;