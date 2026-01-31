import { Types, isValidObjectId } from "mongoose";
import { z } from "zod/v4";

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderItemInput:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           example: 123
 *           description: The unique identifier of the product
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *           description: Quantity of the product ordered
 *         title:
 *           type: string
 *           example: "Wireless Mouse"
 *           description: Product title
 *         price:
 *           type: number
 *           minimum: 0.01
 *           example: 29.99
 *           description: Price of a single product
 *       required:
 *         - productId
 *         - quantity
 *         - title
 *         - price
 */

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

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderInput:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: ObjectId
 *           example: "60c72b2f9b1d8c001c8e4f3a"
 *           description: MongoDB ObjectId of the user
 *         items:
 *           type: array
 *           minItems: 1
 *           description: List of ordered items (must be unique by productId)
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *         status:
 *           type: string
 *           enum: [pending, paid, shipped, cancelled]
 *           example: pending
 *           description: Current order status
 *         note:
 *           type: string
 *           maxLength: 500
 *           example: "Please deliver after 5 PM"
 *           description: Optional note for the order
 *       required:
 *         - userId
 *         - items
 */

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

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderOutput:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *           format: ObjectId
 *           example: "64b7f9c12f3a9e0012d4a999"
 *           description: Unique identifier of the order
 *         userId:
 *           type: string
 *           format: ObjectId
 *           example: "60c72b2f9b1d8c001c8e4f3a"
 *         user:
 *           type: string
 *           example: "Max Mustermann"
 *           description: User name
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *         status:
 *           type: string
 *           enum: [pending, paid, shipped, cancelled]
 *         note:
 *           type: string
 *       required:
 *         - orderId
 *         - userId
 *         - user
 *         - items
 */

export const orderOutputSchema = orderInputSchema.extend({
  user: z.string().min(1, { message: "User name can not be empty." }),
  orderId: z
    .string()
    .refine((val) => isValidObjectId(val), { message: "Not a valid orderId" }),
});
