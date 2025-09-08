const express = require("express");
const { APIError, asyncHandler } = require("../middleware/errorHandler");

const router = express.Router();

const items = [
  { id: 1, name: "product 1", price: 10 },
  { id: 2, name: "product 2", price: 20 },
  { id: 3, name: "product 3", price: 30 },
  { id: 4, name: "product 4", price: 40 },
  { id: 5, name: "product 5", price: 50 },
];

router.get(
  "/items",
  asyncHandler(async (req, res) => {
    res.json(items);
  })
);

router.post(
  "/items/add",
  asyncHandler(
    async (req, res, next) => {
      if (!req.body.name) {
        throw new APIError("name required", 400);
      }

      const newItem = {
        id: items.length + 1,
        name: req.body.name,
        price: req.body.price,
      };
      items.push(newItem);
      res.status(201).json(newItem);
    }
  )
);

module.exports = router
