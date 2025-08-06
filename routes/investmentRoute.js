const express = require("express");
const Auth = require("../services/authService");
const {
  createInvestment,
  deleteInvestment,
  getAllInvestments,
  getInvestmentById,
  updateInvestment,
} = require("../controllers/investmentController");

const InvestmentRouter = express.Router();

InvestmentRouter.route("/")
  .get(getAllInvestments)
  .post(Auth.protect, createInvestment);
InvestmentRouter.route("/:id")
  .get(getInvestmentById)
  .put(Auth.protect, updateInvestment)
  .delete(Auth.protect, deleteInvestment);
module.exports = InvestmentRouter;
