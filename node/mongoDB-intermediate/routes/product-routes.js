const express = require('express');
const { insertSampleProducts, getProductStats, getProductAnalysis } = require('../controllers/product-controller');

const router = express.Router();

//create product routes
router.post("/add", insertSampleProducts)
//get product stats 
router.get("/stats", getProductStats)
//get product analysis
router.get("/analysis", getProductAnalysis)

module.exports = router