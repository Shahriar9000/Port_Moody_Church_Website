# CMPT470-Project

## Setup Instructions

### Codebase

Clone the repository and navigate into the directory:
```shell
git clone https://csil-git1.cs.surrey.sfu.ca/cmpt470-project/cmpt470-project.git
cd cmpt470-project
```

The server will be available on port 8080.

### Node JS Web Application

Install [Node.js and npm](https://nodejs.org/en/).

Install the necessary packages:
```shell
npm install
```

Start the server locally:
```shell
npm start
```

### Database (MySQL)

Install [MySQL](https://www.mysql.com/).

Configure access to the root account on MySQL so that you can login with the following command:
```
mysql -u root -p YOUR_PASSWORD_HERE
```

Once in the prompt, create a new database named `cmpt470` (case-sensitive):
```
mysql> CREATE DATABASE cradle;
Query OK, 1 row affected (0.00 sec)

mysql> exit
Bye
```

In the root directory, create a file named `.env` containing your local MySQL root username and password in the following format:
```
DATABASE_USER=MY_MYSQL_DB_USERNAME
DATABASE_PASSWORD=MY_MYSQL_DB_PASSWORD
```

For example:
```
DB_USERNAME=root
DB_PASSWORD=123456
```

This file should be ignored by Git. Do not manually commit it to the repository.
