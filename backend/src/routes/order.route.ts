import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getPDFOrderById,
  updateOrder,
} from "#controllers";
import { validateBodyZod } from "#middlewares";
import { orderInputSchema } from "#schemas";
import { Router } from "express";

const orderRouter = Router();

orderRouter.get("/", getOrders);
orderRouter.post("/", validateBodyZod(orderInputSchema), createOrder);
orderRouter.get("/:id", getOrderById);
orderRouter.get("/:id/pdf", getPDFOrderById);
orderRouter.put("/:id", validateBodyZod(orderInputSchema), updateOrder);
orderRouter.delete("/:id", deleteOrder);

export default orderRouter;
