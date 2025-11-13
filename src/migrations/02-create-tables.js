const { con } = require('./00-connection');

con.connect(function (err) {
    if (err) throw err;
    console.log('✅ Connected to database.');

    const departments = `
        CREATE TABLE IF NOT EXISTS departments (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            manager_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`;

    const users = `
        CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('manager', 'employee') NOT NULL,
            department_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (department_id) REFERENCES departments(id)
                ON DELETE SET NULL ON UPDATE CASCADE
        )`;

    const alterDepartments = `
        ALTER TABLE departments
        ADD CONSTRAINT fk_manager
        FOREIGN KEY (manager_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE`;

    const leave_types = `
        CREATE TABLE IF NOT EXISTS leave_types (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            max_days INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`;

    const vacations = `
        CREATE TABLE IF NOT EXISTS vacations (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            leave_type_id INT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id)
                ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (leave_type_id) REFERENCES leave_types(id)
                ON DELETE CASCADE ON UPDATE CASCADE
        )`;

    con.query(departments, function (err) {
        if (err) throw err;
        console.log('✅ Table departments created.');

        con.query(users, function (err) {
            if (err) throw err;
            console.log('✅ Table users created.');

            con.query(alterDepartments, function (err) {
                if (err && err.code !== 'ER_DUP_KEYNAME') 
                    console.log('⚠️ FK manager_id já existe ou falhou.');
                else 
                    console.log('✅ FK manager_id added.');

                con.query(leave_types, function (err) {
                    if (err) throw err;
                    console.log('✅ Table leave_types created.');

                    con.query(vacations, function (err) {
                        if (err) throw err;
                        console.log('✅ Table vacations created.');
                        console.log('✅ All tables created successfully!');
                    });
                });
            });
        });
    });
});
