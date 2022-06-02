const { faker } = require('@faker-js/faker')
faker.locale = 'es'

let id = 1
function generateNewId() {
  return id++
}

function generateNewProduct(id) {
  return {
    id,
    title: faker.vehicle.vehicle(),
    price: faker.commerce.price(2500, 50000),
    thumbnail: faker.image.transport(),
  }
}

module.exports = { generateNewId, generateNewProduct }
