const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const vacationRoutes = require('./routes/vacationRoutes');
const leaveTypeRoutes = require('./routes/leaveTypeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

const path = require('path');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

// Usado para suportar métodos PUT e DELETE em formulários HTML
const methodOverride = require('method-override');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('welcome', { title: 'Home' });
});
app.use('/users', userRoutes);
app.use('/vacations', vacationRoutes);
app.use('/leave-types', leaveTypeRoutes);
app.use('/departments', departmentRoutes);

module.exports = app;