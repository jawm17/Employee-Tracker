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
                    options();
                    break;
                case "View All Employees By Department":
                    options();
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
