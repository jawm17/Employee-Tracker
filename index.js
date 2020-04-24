const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "koikoi42",
    database: "employees_db"
});

connection.connect(function (err) {
    if (err) throw err;
    options();
});

function options() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "choices",
                choices: [
                    "View All Employees",
                    "View All Employees By Department",
                    "View All Employees By Manager",
                    "Add Employee",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager"]
            }
        ])
        .then(function (data) {
            switch (data.choices) {
                case "View All Employees":
                    viewAll();
                    break;
                case "View All Employees By Department":
                    viewAllByManager();
                    break;
                case "View All Employees By Manager":
                    options();
                    break;
                case "Add Employee":
                    options();
                    break;
                case "Remove Employee":
                    options();
                    break;
                case "Update Employee Role":
                    options();
                    break;
                case "Update Employee Manager":
                    options();
                    break;
            }
        });
}

function viewAll() {
    connection.query(`
    SELECT employees.id as id, employees.first_name, employees.last_name,title, name as department, salary, CONCAT(manager.first_name, " ",manager.last_name) as manager 
    FROM employees
    LEFT JOIN roles
    ON employees.role_id = roles.id
    LEFT JOIN departments
    ON roles.department_id = departments.id
    LEFT JOIN employees as manager
    ON employees.manager_id = manager.id`, function (err, results) {
        if (err) throw err;
        console.table(results);
        options();
    })
}

function viewAllByManager() {

}
