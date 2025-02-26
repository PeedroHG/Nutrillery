const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      port : 3306,
      user : 'root',
      password : 'pedro1313',
      database : 'pedro_bd'
    }
});

module.exports = knex;

