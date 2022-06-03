//----------* IMPORTS *----------//
const FileSystemContainer = require('../Classes/FileSystemContainer')
const productDB = new FileSystemContainer('products')

//----------* PRODUCT CONTROLLER *----------//
const productController = {
  getAllProducts: async () => {
    try {
      const allProducts = await productDB.getAll()
      return allProducts
    } catch (error) {
      console.log(`GetAllProducts method: ${error}`)
    }
  },

  getProductById: async () => {
    try {
      const prodId = req.params.id
      const productFound = await productDB.getById(prodId)

      if (!productFound) {
        res.send({ error: 'Product not found.' })
      } else {
        res.json(productFound)
      }
    } catch (error) {
      console.log(`GetProductById method: ${error}`)
    }
  },

  addNewProduct: async (product) => {
    try {
      const allProducts = await productDB.getAll()
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
        if (allProducts && allProducts.length) {
          lastID = allProducts[allProducts.length - 1].id
        }
        return Number(lastID) + 1
      }

      const newProduct = {
        id: getNewId(),
        name: product.name ? product.name : 'No name',
        price: product.price ? product.price : 0,
        image: isValidURL(product.image) ? product.image : noImage,
      }

      await productDB.addItem(newProduct)
    } catch (error) {
      console.log(`AddNewProduct method: ${error}`)
    }
  },

  editProduct: async () => {
    try {
      const prodId = req.params.id
      const productFound = await productDB.getById(prodId)

      if (!productFound) {
        res.send({ error: 'Product not found.' })
      } else {
        const editedProduct = {
          id: productFound.id,
          name: req.body.name ? req.body.name : productFound.name,
          price: req.body.price ? req.body.price : productFound.price,
          image: req.body.image ? req.body.image : productFound.image,
        }

        await productDB.editById(editedProduct, prodId)

        res.json(editedProduct)
      }
    } catch (error) {
      console.log(`EditProduct method: ${error}`)
    }
  },

  deleteProduct: async () => {
    try {
      const prodId = req.params.id
      const response = await productDB.deleteById(prodId)

      if (!response) {
        res.send(`The product with ID ${prodId} does not exist.`)
      } else {
        res.send(`The product with ID ${prodId} has been removed.`)
      }
    } catch (error) {
      console.log(`DeleteProduct method: ${error}`)
    }
  },

  deleteProductList: async () => {
    try {
      await productDB.deleteAll()
      res.send(`All products have been removed.`)
    } catch (error) {
      console.log(`DeleteProductList method: ${error}`)
    }
  },
}

//----------* EXPORTS CONTROLLER *----------//
module.exports = productController
