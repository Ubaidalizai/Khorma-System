const express = require("express");
const {
  createStock,
  getAllStocks,
  getStock,
  updateStock,
  deleteStock,
  getBatchesByProduct,
  getInventoryStats,
} = require("../controllers/stock.controller");

const router = express.Router();

router.get("/stats", getInventoryStats);
router.get("/:productId/batches", getBatchesByProduct);

router.route("/").post(createStock).get(getAllStocks);

router.route("/:id").get(getStock).patch(updateStock).delete(deleteStock);

module.exports = router;
