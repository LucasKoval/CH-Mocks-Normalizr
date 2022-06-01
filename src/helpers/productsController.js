//----------* REQUIRE'S *----------//
const KnexContainer = require('../Classes/knexContainer')
const mariaDBConfig = require('../Config/mariaDB')
const SqlClient = new KnexContainer(mariaDBConfig, 'products')

//----------* PRODUCTS CONTROLLER *----------//
const productsController = {
  loadInitialData: async () => {
    try {
      await SqlClient.initialLoad()
    } catch (error) {
      console.log(error)
    }
  },

  getAllProduct: async () => {
    try {
      const allProducts = await SqlClient.getAll()
      return allProducts
    } catch (error) {
      console.log(error)
    }
  },

  addNewProduct: async (product) => {
    try {
      const prevProducts = await SqlClient.getAll()
      const noImage =
        'https://cdn4.iconfinder.com/data/icons/basic-ui-element-flat-style/512/Basic_UI_Elements_-_2.3_-_Flat_Style_-_36-02-64.png'

      const isValidURL = (imageURL) => {
        let url
        try {
          url = new URL(imageURL)
        } catch (_) {
          return false
        }
        return url.protocol === 'http:' || url.protocol === 'https:'
      }

      const getNewId = () => {
        let lastID = 0
        if (prevProducts.length) {
          lastID = prevProducts[prevProducts.length - 1].id
        }
        return lastID + 1
      }

      const newProduct = {
        id: getNewId(),
        title: product.title ? product.title : 'No Title',
        price: product.price ? product.price : 0,
        thumbnail: isValidURL(product.thumbnail) ? product.thumbnail : noImage,
      }

      await SqlClient.addItem(newProduct)
    } catch (error) {
      console.log(error)
    }
  },
}

//----------* EXPORTS CONTROLLER *----------//
module.exports = productsController
