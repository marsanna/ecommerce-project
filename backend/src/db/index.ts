import { DB_NAME, MONGO_URI } from "#config";
import mongoose from "mongoose";

try {
  const client = await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log("✅ Connected to MongoDB: " + client.connection.name);
} catch (error) {
  console.error("❌ MongoDB connection error:", error);
  process.exit(1);
}
