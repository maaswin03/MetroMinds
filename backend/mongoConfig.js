// mongoConfig.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

let db = null;

export async function connectDb() {
  if (db) return db;

  try {
    const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    await client.connect();
    console.log("MongoDB connected successfully.");
    db = client.db();
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
