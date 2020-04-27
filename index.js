const mysql = require("mysql");
const inquirer = require("inquirer");
const process = require("process");

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
        .prompt(
            {
                type: "list",
                message: "What would you like to do?",
                name: "choices",
                choices: [
                    "View All Employees",
                    "View All Employees By Department",
                    "Add Employee",
                    "Add Role",
                    "Add Department",
                    "Update Employee Role",
                    "Exit"]
            }).then(function (data) {
                switch (data.choices) {
                    case "View All Employees":
                        viewAll();
                        break;
                    case "View All Employees By Department":
                        viewAllByDepartment();
                        break;
                    case "Add Employee":
                        addEmployee();
                        break;
                    case "Add Role":
                        addRole();
                        break;
                    case "Add Department":
                        addDepartment();
                        break;
                    case "Update Employee Role":
                        updateRole();
                        break;
                    default:
                        process.exit();

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
    ON employees.manager_id = manager.id`,
        function (err, results) {
            if (err) throw err;
            console.table(results);
            options();
        });
}

function viewAllByDepartment() {
    inquirer.prompt({
        type: "list",
        message: "Which department would you like to see employees for?",
        name: "department",
        choices: ["Sales", "Engineering", "Finance", "Legal"]
    }).then(function (data) {
        connection.query(`
        SELECT employees.id as id, employees.first_name, employees.last_name, title
        FROM employees
        LEFT JOIN roles
        ON employees.role_id = roles.id
        LEFT JOIN departments
        ON roles.department_id = departments.id
        LEFT JOIN employees as manager
        ON employees.manager_id = manager.id
        WHERE departments.name = "${data.department}"`,
            function (err, results) {
                if (err) throw err;
                console.table(results);
                options();
            });
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            name: "lastName",
            message: "What is the employee's last name?"
        },
        {
            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer"]
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: ["John", "Mike", "Ashley", "Kevin", "Kunal", "Malia", "Sarah", "Tom", "None"]
        }
    ]).then(function (data) {
        connection.query(`SELECT id FROM employees WHERE first_name = "${data.manager}"`,
            function (err, results) {
                if (err) throw err;
                let manager = results[0].id;
                connection.query(`SELECT id FROM roles WHERE title = "${data.role}"`,
                    function (err, results) {
                        if (err) throw err;
                        let role = results[0].id;

                        connection.query("INSERT INTO employees SET ?",
                            {
                                first_name: data.firstName,
                                last_name: data.lastName,
                                role_id: role,
                                manager_id: manager
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("Your new employee was created successfully!");
                                options();
                            }
                        );
                    });
            });
    });
}


function addRole() {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the name of the role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?"
        },
        {
            name: "department",
            type: "list",
            message: "Which department will this role be in?",
            choices: [
                "Engineering",
                "Sales",
                "Finance",
                "Legal"
            ]
        }
    ]).then(function (data) {
        connection.query(`SELECT id FROM departments WHERE name = "${data.department}"`,
            function (err, results) {
                if (err) throw err;
                let department = results[0].id;

                connection.query("INSERT INTO roles SET ?",
                    {
                        title: data.title,
                        salary: data.salary,
                        department_id: department
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your new role was created successfully!");
                        options();
                    }
                );
            }
        );
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the department?"
        }
    ]).then(function (data) {
        connection.query("INSERT INTO departments SET ?",
            {
                name: data.name,
            },
            function (err) {
                if (err) throw err;
                console.log("Your new department was created successfully!");
                options();
            }
        );
    });
}

function updateRole() {
    inquirer.prompt([
        {
            name: "role",
            type: "list",
            message: "What is the name of the role you would like to update?",
            choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer"]
        },
        {
            name: "salary",
            type: "input",
            message: "What is the new salary for this role?"
        },
        {
            name: "department",
            type: "list",
            message: "What is the new department for this role?",
            choices: [
                "Engineering",
                "Sales",
                "Finance",
                "Legal"
            ]
        }
    ]).then(function (data) {
        connection.query(`SELECT id FROM roles WHERE title = "${data.role}"`,
            function (err, results) {
                if (err) throw err;
                let role = results[0].id;
                connection.query(`SELECT id FROM departments WHERE name = "${data.department}"`,
                    function (err, results) {
                        if (err) throw err;
                        let department = results[0].id;
                        connection.query(`UPDATE roles SET ? WHERE id = "${role}"`,
                            {
                                salary: data.salary,
                                department_id: department
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("Your role was updated successfully!");
                                options();
                            }
                        );
                    });
            });
    });
}