import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return;
        }

        const connectRes = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        
        console.log('MongoDB Connected Successfully');

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        // Don't exit process in serverless environment
        if (process.env.NODE_ENV === 'production') {
            console.error('Failed to connect to MongoDB in production');
        } else {
            process.exit(1);
        }
    }
}