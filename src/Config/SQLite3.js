module.exports = {
  client: 'sqlite3',
  connection: {
    filename: process.cwd() + '/src/DB/ecommerce.sqlite',
  },
  useNullAsDefault: true,
}
