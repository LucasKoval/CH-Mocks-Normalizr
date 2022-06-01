const knex = require('knex')
const mariaDBConfig = require('./src/Config/mariaDB')
const mariaDBClient = knex(mariaDBConfig)
const sqlite3Config = require('./src/Config/SQLite3')
const sqlite3Client = knex(sqlite3Config)
const initialProducts = require('./src/DB/initialProducts')

mariaDBClient.schema
  .hasTable('products')
  .then((exists) => {
    if (!exists) {
      mariaDBClient.schema
        .createTable('products', (table) => {
          table.increments('id').primary()
          table.string('title', 100).notNullable()
          table.float('price').notNullable()
          table.string('thumbnail', 500)
        })
        .then(() => {
          console.log('Products Table created!')
        })
      mariaDBClient('products')
        .insert(initialProducts)
        .then(() => console.log('Initial data inserted!'))
        .catch((error) => {
          console.log(error)
        })
    } else {
      console.log('Products Table already exists. No change were made.')
    }
  })
  .finally(() => {
    mariaDBClient.destroy()
  })

sqlite3Client.schema
  .hasTable('messages')
  .then((exists) => {
    if (!exists) {
      sqlite3Client.schema
        .createTable('messages', (table) => {
          table.increments('id').primary()
          table.string('email', 80).notNullable()
          table.string('date', 50).notNullable()
          table.string('messageText', 1000).notNullable()
        })
        .then(() => {
          console.log('Messages Table created!')
        })
    } else {
      console.log('Messages Table already exists. No change were made.')
    }
  })
  .finally(() => {
    sqlite3Client.destroy()
  })
