const Product = require("../models/Product.model")

const getProductAnalysis = async (req, res) => {
  try {
    const result = await Product.aggregate([
      //GET all products that matches a category
      //match
      {
        $match: {
          category: "Bags",
        },
      },
      //grouping
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price"
          },
          averagePrice: {
            $avg: "$price"
          },
          maxProductPrice: {
            $max: "$price"
          },
          minProductPrice: {
            $min: "$price"
          }
        }
      },
      //project
      {
        $project: {
          _id: 0,//0 means exclude this field,
          totalRevenue: 1, //1 means include this field
          averagePrice: 1,
          maxProductPrice: 1,
          minProductPrice: 1,
          priceRange: {
            $subtract: ["$maxProductPrice", "$minProductPrice"]
          }
        }
      }
    ])

    res.status(200).json({
      success: true,
      message: "Product stats fetched successfully",
      data: result
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!"
    })
  }
}

const getProductStats = async (req, res) => {
  try {
    const result = await Product.aggregate([
      //check if product is in stock
      {
        $match: {
          inStock: true,
          price: {
            $gte: 100,
          }
        },
      },
      {
        //project fields
        $project: {
          category: 1,
          price: 1
        }
      },
      {
        //group documents
        $group: {
          _id: "$category",
          avgPrice: {
            $avg: "$price"
          },
          count: {
            $sum: 1
          }
        }
      }
    ])

    res.status(200).json({
      success: true,
      message: "Product stats fetched successfully",
      data: result
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!"
    })
  }
}

const insertSampleProducts = async (req, res) => {
  try {
    const sampleProducts = [{
      name: "Product 4",
      category: "Bags",
      price: 200,
      inStock: true,
      tag: ["Tag 1", "Tag 2"]
    },
    {
      name: "Product 5",
      category: "Bags",
      price: 200,
      inStock: false,
      tag: ["Tag 2", "Tag 3"]
    },
    {
      name: "Product 6",
      category: "shoe",
      price: 100,
      inStock: true,
      tag: ["Tag 3", "Tag 4"]
    }
    ]

    const result = await Product.insertMany(sampleProducts)
    res.status(201).json({
      success: true,
      message: `${result.length} Products inserted successfully`,
      data: result
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!"
    })
  }
}

module.exports = {
  insertSampleProducts,
  getProductStats,
  getProductAnalysis
}