const inquirer = require("inquirer");

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
            console.log(data);
        });
}

options();