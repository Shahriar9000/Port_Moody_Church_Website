const mysql = require("mysql");
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path: path.join(__dirname + '/../../.env')});

/*
const db = mysql.createConnection({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: 'cmpt470',
  host: 'localhost',
})
*/

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  socketPath: '/cloudsql/ngawangkyirong301312227:us-central1:cmpt470'
});
console.log(process.env.DB_HOST);



/*
const createUnixSocketPool = async config => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';

  // Establish a connection to the database
  return await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_DATABSE, // e.g. 'my-database'
    // If connecting via unix domain socket, specify the path
    socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    // Specify additional properties here.
    port: 3306;
  });
};
*/


db.connect(function(error) {
  if (!!error) {
    console.log(error);
  }else {
    console.log('Database Connected');
  }
})

module.exports = db;
