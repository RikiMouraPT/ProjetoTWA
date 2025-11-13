
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
});

con.connect(function(err) {
    if (err) throw err;

    con.query("CREATE DATABASE projetoTWA_leavely", function (err, result) {
        if (err) {
            if (err.code === 'ER_DB_CREATE_EXISTS')
                console.log("Database already exists.");
            else
                throw err;
        } else { 
            console.log("Database created.");
        }
    });
});