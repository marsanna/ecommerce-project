import { type InferSchemaType, Schema, model } from "mongoose";

import { cleanResponse } from "../db/mongoose.plugins.ts";

const orderItemSchema = new Schema({
  productId: {
    type: Number,
    required: [true, "Product id is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "quantity must be >= 1"],
  },
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0.01, "Price must be > 0"],
  },
});

orderItemSchema.plugin(cleanResponse);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },

    items: {
      type: [orderItemSchema],
      required: [true, "items are required"],
      validate: [
        (arr: unknown[]) => Array.isArray(arr) && arr.length > 0,
        "At least one item is required",
      ],
    },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },

    note: { type: String, required: false, trim: true },

    total: { type: Number, required: true, min: [0, "total must be >= 0"] },
  },
  { timestamps: true },
);

orderSchema.plugin(cleanResponse);

export type OrderDoc = InferSchemaType<typeof orderSchema>;
const Order = model<OrderDoc>("Order", orderSchema);

export default Order;
