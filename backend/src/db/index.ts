import { DB_NAME, MONGO_URI } from "#config";
import mongoose from "mongoose";

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables.");
}

try {
  const clinet = await mongoose.connect(MONGO_URI, {
    dbName: DB_NAME,
  });
  console.log(`Connected to MongoDB: ${clinet.connection.name}`);
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
}
