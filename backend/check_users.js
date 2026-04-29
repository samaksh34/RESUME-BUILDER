import mongoose from 'mongoose';
import 'dotenv/config';

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const User = mongoose.model('User', new mongoose.Schema({
            name: String,
            email: String,
            isVerified: Boolean
        }));

        const users = await User.find({});
        console.log('Users in database:', JSON.stringify(users, null, 2));
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkDB();
