# Student List Frontend with JavaScript

This application allows users to create and maintain a list of students. Please visit https://github.com/OC-ComputerScience/student-backend for the backend repository.

### Table of Contents
[Project Setup for your Local Machine](#project-setup-for-your-local-machine)</br>
[Project Setup for your AWS Instance](#project-setup-for-your-aws-instance)

## Project Setup for your Local Machine

1. Clone the project into your **XAMPP/xamppfiles/htdocs/studentapp** directory.
```
git clone https://github.com/OC-ComputerScience/student-frontend-JS.git
```

2. Make sure **Apache** and **MySQL** are running.
    - We recommend using XAMPP to serve this project.
    - In XAMPP, make sure that **Apache** and **MySQL** are running.

3. Make sure you have finished installing the [Student Backend](https://github.com/OC-ComputerScience/student-backend) on your local machine.

4. Test the project.
    - http://localhost/studentapp/student-frontend-JS/student-list.html
    - You should see the project running with data on your screen.

## Project Setup for your AWS Instance
1. Open **Filezilla** and navigate to **var/www/html/** on your AWS instance.

2. Copy **XAMPP/htdocs/studentapp/student-frontend-JS** to **var/www/html/**.

3. Make sure that you have finished installing the [Student Backend](https://github.com/OC-ComputerScience/student-backend) on your AWS instance.

4. Test the project.
    - http://**your instance**/studentapp/student-frontend-JS/student-list.html
    - You should see the project running with data on your screen.
