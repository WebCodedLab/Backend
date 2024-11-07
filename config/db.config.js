import mongoose from 'mongoose';

const connectToDatabase = () => {
    const uri = process.env.MONGODB_URI;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
       .then(() => console.log('Connected to MongoDB'))
       .catch((error) => console.error('Error connecting to MongoDB:', error));
}

export default connectToDatabase;