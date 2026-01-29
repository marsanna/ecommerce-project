import { Order, User } from "#models";
import { orderInputSchema, orderItemInputSchema } from "#schemas";
import { generateOrderPDF } from "#utils";
import { type RequestHandler } from "express";
import { z } from "zod/v4";

type OrderInputDTO = z.infer<typeof orderInputSchema>;
type OrderItemDTO = z.infer<typeof orderItemInputSchema>;

function computeTotal(items: OrderItemDTO[]): number {
  return items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}

export const getOrders: RequestHandler = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

export const createOrder: RequestHandler<{}, any, OrderInputDTO> = async (
  req,
  res,
) => {
  const { userId, items, status, note } = req.body;

  const userExists = await User.findById(userId);
  if (!userExists) throw new Error("User not found", { cause: 404 });

  const total = computeTotal(items);

  const order = await Order.create({
    userId,
    items: items,
    status,
    note,
    total,
  });

  res.status(201).json(order);
};

export const getOrderById: RequestHandler<{ id: string }> = async (
  req,
  res,
) => {
  const {
    params: { id },
  } = req;

  const order = await Order.findById(id);
  if (!order) throw new Error("Order not found", { cause: 404 });

  res.json(order);
};

export const updateOrder: RequestHandler<
  { id: string },
  any,
  OrderInputDTO
> = async (req, res) => {
  const {
    params: { id },
    body,
  } = req;

  const order = await Order.findById(id);
  if (!order) throw new Error("Order not found", { cause: 404 });

  const userExists = await User.findById(body.userId);
  if (!userExists) throw new Error("User not found", { cause: 404 });

  const total = computeTotal(body.items);

  order.userId = body.userId as any;
  order.items = body.items as any;
  order.total = total as any;
  order.status = body.status ?? order.status;
  order.note = body.note ?? order.note;

  await order.save();
  res.json(order);
};

export const deleteOrder: RequestHandler<{ id: string }> = async (req, res) => {
  const {
    params: { id },
  } = req;

  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new Error("Order not found", { cause: 404 });

  res.json({ message: "Order deleted" });
};

export const getPDFOrderById: RequestHandler<{ id: string }> = async (
  req,
  res,
) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found", { cause: 404 });

    const user = await User.findById(order.userId);
    if (!user) throw new Error("User not found", { cause: 404 });

    const orderData = {
      orderId: order.id.toString(),
      userId: order.userId.toString(),
      user: user ? `${user.firstName} ${user.lastName}` : "guest",
      items: order.items,
      status: order.status,
      note: order.note,
    };

    generateOrderPDF(orderData as any, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
