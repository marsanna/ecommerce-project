import { CLIENT_BASE_URL } from "#config";
import "#db";
import { errorHandler } from "#middlewares";
import { authRouter, contactRouter, docsRouter, orderRouter } from "#routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT || "3000";

app.use(
  cors({
    origin: CLIENT_BASE_URL, // for use with credentials, origin(s) need to be specified
    credentials: true, // sends and receives secure cookies
    exposedHeaders: ["WWW-Authenticate"], // needed to send the refresh trigger
  }),
);

app.use(express.json(), cookieParser());

app.get("/error", (req, res) => {
  throw new Error("Something went wrong", { cause: { status: 418 } });
});

app.use("/auth", authRouter);
app.use("/orders", orderRouter);
app.use("/contact", contactRouter);
app.use("/docs", docsRouter);
app.use("*splat", (req, res) => {
  res.status(404).json({ message: "Not found" });
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Ecommerce listening at http://localhost:${port}`);
  console.log(`Swagger UI served at http://localhost:${port}/docs`);
  console.log(
    `OpenAPI JSON served at  http://localhost:${port}/docs/openapi.json`,
  );
});
