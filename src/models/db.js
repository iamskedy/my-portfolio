import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable in your .env.local file",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // 1. If we have a cached connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // 2. If no promise exists, create a new connection promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Hand over control to the driver immediately
      dbName: "portfolioDB", // Ensure it connects to your specific database
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully");
      return mongoose;
    });
  }

  // 3. Wait for the promise to resolve and cache the result
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset if the connection fails
    throw e;
  }

  return cached.conn;
}

export { connectToDatabase };
