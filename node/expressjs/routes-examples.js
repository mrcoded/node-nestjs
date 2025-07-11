const express = require('express');

const app = express();

//root route
app.get('/', (req, res) => {
  res.send("Welcome to my Homepage")
})

//GET all products route
app.get('/products', (req, res) => {
  const products = [{
    id: 1,
    label: "Product 1"
  },
  {
    id: 2,
    label: "Product 2"
  },
  {
    id: 3,
    label: "Product 3"
  }]

  res.json(products)
})

//GET a single product route
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id)

  const products = [{
    id: 1,
    label: "Product 1"
  },
  {
    id: 2,
    label: "Product 2"
  },
  {
    id: 3,
    label: "Product 3"
  }]

  const getSingleProducts = products.find(p => p.id === productId)

  if (getSingleProducts) {
    res.json(getSingleProducts)
  } else {
    res.status(404).send("Product Not Found")
  }
})

const port = 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

