import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI is not defined in environment variables');
        return null;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // In serverless, we don't want to exit the process, 
        // as it will cause a FUNCTION_INVOCATION_FAILED error.
        // Instead, we let the request fail gracefully later if needed.
    }
};

export default connectDB;
