import { sendContactEmail } from "#controllers";
import { validateBodyZod } from "#middlewares";
import { contactSchema } from "#schemas";
import { Router } from "express";

const contactRouter = Router();

contactRouter.post("/", validateBodyZod(contactSchema), sendContactEmail);

export default contactRouter;
