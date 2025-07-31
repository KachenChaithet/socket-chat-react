import mogoose from 'mongoose'

export const connectDB = async () => {
    try {
        const conn = await mogoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected:${conn.connection.host}`);
        
    } catch (error) {
        console.log('connectDB error:',error);
        
    }
}