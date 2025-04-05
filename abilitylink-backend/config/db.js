import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // console.log("Mongo URI:", process.env.MONGO_URI); // Check if this prints correctly
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${process.env.MONGO_URI}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;