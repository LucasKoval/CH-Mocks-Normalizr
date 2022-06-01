//----------* REQUIRE'S *----------//
const knex = require('knex')
const initialProducts = require('../DB/initialProducts')

//----------* SQL-CLIENT CLASS *----------//
class SqlClient {
  constructor(config, items) {
    this.knex = knex(config)
    this.items = items
  }

  async initialLoad() {
    this.knex('products')
      .insert(initialProducts)
      .then(() => console.log('Initial data inserted!'))
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.knex.destroy()
      })
  }

  async getAll() {
    try {
      return this.knex(this.items).select('*')
    } catch (error) {
      console.log(error)
    }
  }

  async getById(id) {
    try {
      return this.knex(this.items).select('*').where({ id: id })
    } catch (error) {
      console.log(error)
    }
  }

  async addItem(object) {
    try {
      return this.knex(this.items).insert(object)
    } catch (error) {
      console.log(error)
    }
  }

  async editById(id, field, data) {
    try {
      return this.knex.from(this.items).where('id', id).update(field, data)
    } catch (error) {
      console.log(error)
    }
  }

  async deleteById(id) {
    try {
      return this.knex.from(this.items).where('id', id).del()
    } catch (error) {
      console.log(error)
    }
  }

  async deleteAll() {
    try {
      return this.knex.from(this.items).del()
    } catch (error) {
      console.log(error)
    }
  }

  async close() {
    await this.knex.destroy()
  }
}

//----------* EXPORTS CLASS *----------//
module.exports = SqlClient
