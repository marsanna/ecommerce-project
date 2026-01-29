import { Types, isValidObjectId } from "mongoose";
import { z } from "zod/v4";

export const orderItemInputSchema = z.strictObject({
  productId: z.number({ error: "Product id must be a number." }).int(),
  quantity: z
    .number({ error: "Quantity must be a number." })
    .int()
    .min(1, { message: "Quantity must be >= 1." }),
  title: z.string({ error: "Product title must be a string." }).min(2, {
    message:
      "Product title is required and must be at least 2 characters long.",
  }),
  price: z
    .number({ error: "Price must be a number." })
    .min(0.01, { message: "Price must be > 0." }),
});

export const orderInputSchema = z.strictObject({
  userId: z
    .string()
    .refine((val) => isValidObjectId(val), { error: "Not a valid ObjectId" })
    .transform((val) => new Types.ObjectId(val)),
  items: z
    .array(orderItemInputSchema)
    .min(1, { message: "Items must contain at least 1 item." })
    .superRefine((items, ctx) => {
      const seen = new Set<number>();

      for (const [i, item] of items.entries()) {
        const key = item.productId;

        if (seen.has(key)) {
          ctx.addIssue({
            code: "custom",
            message: `Duplicate item id: ${key}`,
            path: [i, "productId"],
          });
          return;
        }

        seen.add(key);
      }
    }),
  status: z.enum(["pending", "paid", "shipped", "cancelled"]).optional(),
  note: z.string().max(500).optional(),
});

export const orderOutputSchema = orderInputSchema.extend({
  user: z.string().min(1, { message: "User name can not be empty." }),
  orderId: z
    .string()
    .refine((val) => isValidObjectId(val), { message: "Not a valid orderId" }),
});
