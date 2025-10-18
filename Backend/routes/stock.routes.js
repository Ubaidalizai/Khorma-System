const express = require("express");
const {
  createStock,
  getAllStocks,
  getStock,
  updateStock,
  deleteStock,
  getBatchesByProduct,
} = require("../controllers/stock.controller");

const router = express.Router();

router.get("/:productId/batches", getBatchesByProduct);

router.route("/").post(createStock).get(getAllStocks);

router.route("/:id").get(getStock).patch(updateStock).delete(deleteStock);

module.exports = router;
